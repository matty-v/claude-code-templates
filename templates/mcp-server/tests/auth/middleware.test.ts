import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

describe('authMiddleware', () => {
  let authMiddleware: any
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  beforeEach(async () => {
    vi.resetModules()

    mockReq = {
      headers: {}
    }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    mockNext = vi.fn()

    const module = await import('../../src/auth/middleware.js')
    authMiddleware = module.authMiddleware
  })

  it('calls next() with valid Bearer token', async () => {
    const token = jwt.sign(
      { sub: 'user@example.com', type: 'access' },
      'test-jwt-secret-that-is-long-enough'
    )
    mockReq.headers = { authorization: `Bearer ${token}` }

    await authMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect((mockReq as any).user).toEqual({
      sub: 'user@example.com',
      type: 'access',
      iat: expect.any(Number)
    })
  })

  it('returns 401 when no authorization header', async () => {
    await authMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing authorization header' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns 401 for invalid token', async () => {
    mockReq.headers = { authorization: 'Bearer invalid-token' }

    await authMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' })
  })
})
