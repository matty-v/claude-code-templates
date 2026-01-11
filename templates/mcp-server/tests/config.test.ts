import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('config', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('exports validated config when env vars are set', async () => {
    const { config } = await import('../src/config.js')

    expect(config.googleClientId).toBe('test-client-id')
    expect(config.googleClientSecret).toBe('test-client-secret')
    expect(config.jwtSecret).toBe('test-jwt-secret-that-is-long-enough')
    expect(config.allowedEmail).toBe('test@example.com')
    expect(config.baseUrl).toBe('http://localhost:8080')
  })

  it('throws when required env var is missing', async () => {
    const originalClientId = process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_ID

    await expect(import('../src/config.js')).rejects.toThrow('GOOGLE_CLIENT_ID')

    process.env.GOOGLE_CLIENT_ID = originalClientId
  })
})
