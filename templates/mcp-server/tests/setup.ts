import { vi } from 'vitest'

// Mock Firestore
vi.mock('@google-cloud/firestore', () => {
  const mockDoc = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    update: vi.fn()
  }
  const mockCollection = {
    doc: vi.fn(() => mockDoc),
    where: vi.fn(() => ({ get: vi.fn() })),
    get: vi.fn()
  }
  return {
    Firestore: vi.fn(() => ({
      collection: vi.fn(() => mockCollection)
    }))
  }
})

// Set test environment variables
process.env.GOOGLE_CLIENT_ID = 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
process.env.JWT_SECRET = 'test-jwt-secret-that-is-long-enough'
process.env.ALLOWED_EMAIL = 'test@example.com'
process.env.BASE_URL = 'http://localhost:8080'
