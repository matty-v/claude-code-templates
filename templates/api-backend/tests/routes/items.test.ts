import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../src/index.js'

const API_KEY = 'test-api-key'

describe('Items API', () => {
  describe('GET /items', () => {
    it('returns array of items', async () => {
      const res = await request(app)
        .get('/items')
        .set('X-API-Key', API_KEY)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('POST /items', () => {
    it('returns 400 without name', async () => {
      const res = await request(app)
        .post('/items')
        .set('X-API-Key', API_KEY)
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name is required')
    })

    it('creates item with valid data', async () => {
      const res = await request(app)
        .post('/items')
        .set('X-API-Key', API_KEY)
        .send({ name: 'Test Item', description: 'A test item' })
      expect(res.status).toBe(201)
      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBe('Test Item')
    })
  })

  describe('GET /items/:id', () => {
    it('returns 404 for non-existent item', async () => {
      const res = await request(app)
        .get('/items/nonexistent')
        .set('X-API-Key', API_KEY)
      expect(res.status).toBe(404)
    })
  })
})
