import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Firestore } from '@google-cloud/firestore'

describe('AuthState', () => {
  let authState: any
  let mockFirestore: any
  let mockCollection: any
  let mockDoc: any

  beforeEach(async () => {
    vi.resetModules()

    mockDoc = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }
    mockCollection = {
      doc: vi.fn(() => mockDoc)
    }
    mockFirestore = {
      collection: vi.fn(() => mockCollection)
    }

    vi.mocked(Firestore).mockImplementation(() => mockFirestore as any)

    const module = await import('../../src/auth/state.js')
    authState = new module.AuthState()
  })

  describe('setPendingAuth', () => {
    it('stores pending auth state in Firestore', async () => {
      await authState.setPendingAuth('state123', {
        clientId: 'client1',
        redirectUri: 'http://localhost/callback',
        codeChallenge: 'challenge'
      })

      expect(mockFirestore.collection).toHaveBeenCalledWith('pendingAuth')
      expect(mockCollection.doc).toHaveBeenCalledWith('state123')
      expect(mockDoc.set).toHaveBeenCalled()
    })
  })

  describe('getPendingAuth', () => {
    it('retrieves pending auth state from Firestore', async () => {
      mockDoc.get.mockResolvedValue({
        exists: true,
        data: () => ({
          clientId: 'client1',
          redirectUri: 'http://localhost/callback',
          codeChallenge: 'challenge',
          expiresAt: Date.now() + 600000
        })
      })

      const result = await authState.getPendingAuth('state123')

      expect(result).toEqual({
        clientId: 'client1',
        redirectUri: 'http://localhost/callback',
        codeChallenge: 'challenge',
        expiresAt: expect.any(Number)
      })
    })

    it('returns null for expired state', async () => {
      mockDoc.get.mockResolvedValue({
        exists: true,
        data: () => ({
          clientId: 'client1',
          expiresAt: Date.now() - 1000
        })
      })

      const result = await authState.getPendingAuth('state123')

      expect(result).toBeNull()
    })
  })
})
