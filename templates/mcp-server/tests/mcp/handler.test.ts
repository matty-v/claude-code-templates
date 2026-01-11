import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('MCPHandler', () => {
  let handler: any

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('../../src/mcp/handler.js')
    handler = module.mcpHandler
  })

  describe('initialize', () => {
    it('returns server info and capabilities', async () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test', version: '1.0' }
        }
      }

      const response = await handler(request, 'user@example.com')

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 1,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'mcp-server-template',
            version: '1.0.0'
          },
          capabilities: {
            tools: {}
          }
        }
      })
    })
  })

  describe('tools/list', () => {
    it('returns registered tools', async () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 2,
        method: 'tools/list',
        params: {}
      }

      const response = await handler(request, 'user@example.com')

      expect(response.jsonrpc).toBe('2.0')
      expect(response.id).toBe(2)
      expect(response.result).toHaveProperty('tools')
      expect(Array.isArray(response.result.tools)).toBe(true)
    })
  })

  describe('unknown method', () => {
    it('returns method not found error', async () => {
      const request = {
        jsonrpc: '2.0' as const,
        id: 3,
        method: 'unknown/method',
        params: {}
      }

      const response = await handler(request, 'user@example.com')

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 3,
        error: {
          code: -32601,
          message: 'Method not found: unknown/method'
        }
      })
    })
  })
})
