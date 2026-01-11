import { JsonRpcRequest, JsonRpcResponse, ToolRegistry } from './types.js'
import { tools } from './tools/index.js'

const SERVER_INFO = {
  name: 'mcp-server-template',
  version: '1.0.0'
}

export async function mcpHandler(
  request: JsonRpcRequest,
  userId: string
): Promise<JsonRpcResponse> {
  const { id, method, params = {} } = request

  try {
    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: SERVER_INFO,
            capabilities: {
              tools: {}
            }
          }
        }

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: Object.values(tools).map(t => t.definition)
          }
        }

      case 'tools/call': {
        const toolName = params.name as string
        const toolParams = (params.arguments || {}) as Record<string, unknown>

        const tool = tools[toolName]
        if (!tool) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: `Unknown tool: ${toolName}`
            }
          }
        }

        const result = await tool.handler(toolParams, userId)
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        }
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        }
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error'
      }
    }
  }
}
