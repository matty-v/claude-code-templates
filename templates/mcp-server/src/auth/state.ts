import { Firestore } from '@google-cloud/firestore'

interface PendingAuth {
  clientId: string
  redirectUri: string
  codeChallenge: string
  expiresAt: number
}

interface AuthCode {
  clientId: string
  userId: string
  codeChallenge: string
  expiresAt: number
}

interface GoogleCredentials {
  refreshToken: string
  accessToken: string
  expiresAt: number
}

const TEN_MINUTES = 10 * 60 * 1000
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export class AuthState {
  private db: Firestore

  constructor() {
    this.db = new Firestore()
  }

  // Pending Auth (10 min TTL)
  async setPendingAuth(state: string, data: Omit<PendingAuth, 'expiresAt'>): Promise<void> {
    await this.db.collection('pendingAuth').doc(state).set({
      ...data,
      expiresAt: Date.now() + TEN_MINUTES
    })
  }

  async getPendingAuth(state: string): Promise<PendingAuth | null> {
    const doc = await this.db.collection('pendingAuth').doc(state).get()
    if (!doc.exists) return null

    const data = doc.data() as PendingAuth
    if (data.expiresAt < Date.now()) {
      await this.deletePendingAuth(state)
      return null
    }
    return data
  }

  async deletePendingAuth(state: string): Promise<void> {
    await this.db.collection('pendingAuth').doc(state).delete()
  }

  // Auth Codes (10 min TTL)
  async setAuthCode(code: string, data: Omit<AuthCode, 'expiresAt'>): Promise<void> {
    await this.db.collection('authCodes').doc(code).set({
      ...data,
      expiresAt: Date.now() + TEN_MINUTES
    })
  }

  async getAuthCode(code: string): Promise<AuthCode | null> {
    const doc = await this.db.collection('authCodes').doc(code).get()
    if (!doc.exists) return null

    const data = doc.data() as AuthCode
    if (data.expiresAt < Date.now()) {
      await this.deleteAuthCode(code)
      return null
    }
    return data
  }

  async deleteAuthCode(code: string): Promise<void> {
    await this.db.collection('authCodes').doc(code).delete()
  }

  // Google Credentials (permanent, tokens have own expiry)
  async setGoogleCredentials(userId: string, credentials: GoogleCredentials): Promise<void> {
    await this.db.collection('googleCredentials').doc(userId).set(credentials)
  }

  async getGoogleCredentials(userId: string): Promise<GoogleCredentials | null> {
    const doc = await this.db.collection('googleCredentials').doc(userId).get()
    if (!doc.exists) return null
    return doc.data() as GoogleCredentials
  }

  // Registered Clients (permanent)
  async setClient(clientId: string, data: { clientSecret: string; redirectUris: string[] }): Promise<void> {
    await this.db.collection('registeredClients').doc(clientId).set(data)
  }

  async getClient(clientId: string): Promise<{ clientSecret: string; redirectUris: string[] } | null> {
    const doc = await this.db.collection('registeredClients').doc(clientId).get()
    if (!doc.exists) return null
    return doc.data() as { clientSecret: string; redirectUris: string[] }
  }
}

export const authState = new AuthState()
