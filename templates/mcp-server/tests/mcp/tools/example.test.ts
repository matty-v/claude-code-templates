import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('echo tool', () => {
  let tools: any

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('../../../src/mcp/tools/index.js')
    tools = module.tools
  })

  it('echoes back the message with user and timestamp', async () => {
    const result = await tools.echo.handler(
      { message: 'Hello, world!' },
      'user@example.com'
    )

    expect(result).toEqual({
      echo: 'Hello, world!',
      user: 'user@example.com',
      timestamp: expect.any(String)
    })
  })

  it('throws when message is missing', async () => {
    await expect(
      tools.echo.handler({}, 'user@example.com')
    ).rejects.toThrow('message is required')
  })

  it('has correct tool definition', () => {
    expect(tools.echo.definition).toEqual({
      name: 'echo',
      description: expect.any(String),
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: expect.any(String)
          }
        },
        required: ['message']
      }
    })
  })
})
