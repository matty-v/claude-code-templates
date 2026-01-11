import { Router, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config.js'
import { authState } from './state.js'

const router = Router()

const googleClient = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  `${config.baseUrl}/oauth/google/callback`
)

// OAuth 2.1 Authorization endpoint
router.get('/authorize', async (req: Request, res: Response) => {
  const { client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.query

  if (!client_id || !redirect_uri || !state || !code_challenge) {
    res.status(400).json({ error: 'Missing required parameters' })
    return
  }

  if (code_challenge_method !== 'S256') {
    res.status(400).json({ error: 'Only S256 code challenge method is supported' })
    return
  }

  // Store pending auth state
  await authState.setPendingAuth(state as string, {
    clientId: client_id as string,
    redirectUri: redirect_uri as string,
    codeChallenge: code_challenge as string
  })

  // Redirect to Google OAuth
  const googleAuthUrl = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile'],
    state: state as string,
    prompt: 'consent'
  })

  res.redirect(googleAuthUrl)
})

// Google OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query

  if (error) {
    res.status(400).json({ error: `Google OAuth error: ${error}` })
    return
  }

  if (!code || !state) {
    res.status(400).json({ error: 'Missing code or state' })
    return
  }

  const pending = await authState.getPendingAuth(state as string)
  if (!pending) {
    res.status(400).json({ error: 'Invalid or expired state' })
    return
  }

  try {
    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code as string)
    googleClient.setCredentials(tokens)

    // Get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: config.googleClientId
    })
    const payload = ticket.getPayload()!
    const email = payload.email!

    // Check if user is allowed
    if (email !== config.allowedEmail) {
      res.status(403).json({ error: 'User not authorized' })
      return
    }

    // Store Google credentials
    await authState.setGoogleCredentials(email, {
      refreshToken: tokens.refresh_token!,
      accessToken: tokens.access_token!,
      expiresAt: tokens.expiry_date || Date.now() + 3600000
    })

    // Generate auth code for client
    const authCode = uuidv4()
    await authState.setAuthCode(authCode, {
      clientId: pending.clientId,
      userId: email,
      codeChallenge: pending.codeChallenge
    })

    // Clean up pending state
    await authState.deletePendingAuth(state as string)

    // Redirect back to client
    const redirectUrl = new URL(pending.redirectUri)
    redirectUrl.searchParams.set('code', authCode)
    redirectUrl.searchParams.set('state', state as string)
    res.redirect(redirectUrl.toString())
  } catch (err) {
    console.error('OAuth callback error:', err)
    res.status(500).json({ error: 'OAuth flow failed' })
  }
})

// Token endpoint
router.post('/token', async (req: Request, res: Response) => {
  const { grant_type, code, code_verifier, client_id, client_secret, refresh_token } = req.body

  if (grant_type === 'authorization_code') {
    if (!code || !code_verifier || !client_id) {
      res.status(400).json({ error: 'Missing required parameters' })
      return
    }

    const authCode = await authState.getAuthCode(code)
    if (!authCode) {
      res.status(400).json({ error: 'Invalid or expired code' })
      return
    }

    // Verify PKCE
    const crypto = await import('crypto')
    const expectedChallenge = crypto
      .createHash('sha256')
      .update(code_verifier)
      .digest('base64url')

    if (expectedChallenge !== authCode.codeChallenge) {
      res.status(400).json({ error: 'Invalid code verifier' })
      return
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { sub: authCode.userId, type: 'access' },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    const newRefreshToken = jwt.sign(
      { sub: authCode.userId, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    )

    // Clean up auth code
    await authState.deleteAuthCode(code)

    res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60,
      refresh_token: newRefreshToken
    })
  } else if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      res.status(400).json({ error: 'Missing refresh token' })
      return
    }

    try {
      const payload = jwt.verify(refresh_token, config.jwtSecret) as { sub: string; type: string }
      if (payload.type !== 'refresh') {
        res.status(400).json({ error: 'Invalid token type' })
        return
      }

      const accessToken = jwt.sign(
        { sub: payload.sub, type: 'access' },
        config.jwtSecret,
        { expiresIn: '7d' }
      )
      const newRefreshToken = jwt.sign(
        { sub: payload.sub, type: 'refresh' },
        config.jwtSecret,
        { expiresIn: '30d' }
      )

      res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 7 * 24 * 60 * 60,
        refresh_token: newRefreshToken
      })
    } catch {
      res.status(400).json({ error: 'Invalid refresh token' })
    }
  } else {
    res.status(400).json({ error: 'Unsupported grant type' })
  }
})

// Client registration (for MCP dynamic client registration)
router.post('/register', async (req: Request, res: Response) => {
  const { redirect_uris } = req.body

  if (!redirect_uris || !Array.isArray(redirect_uris)) {
    res.status(400).json({ error: 'redirect_uris required' })
    return
  }

  const clientId = uuidv4()
  const clientSecret = uuidv4()

  await authState.setClient(clientId, {
    clientSecret,
    redirectUris: redirect_uris
  })

  res.json({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris
  })
})

export { router as oauthRouter }
