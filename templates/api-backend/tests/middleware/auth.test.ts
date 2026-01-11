import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../src/index.js'

describe('API Key Authentication', () => {
  it('returns 401 without API key', async () => {
    const res = await request(app).get('/items')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Unauthorized')
  })

  it('returns 401 with invalid API key', async () => {
    const res = await request(app)
      .get('/items')
      .set('X-API-Key', 'wrong-key')
    expect(res.status).toBe(401)
  })

  it('allows access with valid API key', async () => {
    const res = await request(app)
      .get('/items')
      .set('X-API-Key', 'test-api-key')
    expect(res.status).toBe(200)
  })

  it('health endpoint does not require auth', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
