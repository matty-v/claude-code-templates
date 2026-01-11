import { ToolRegistry } from '../types.js'

export const tools: ToolRegistry = {
  echo: {
    definition: {
      name: 'echo',
      description: 'Echoes back the input message. Use this as a template for creating new tools.',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'The message to echo back'
          }
        },
        required: ['message']
      }
    },
    handler: async (params, userId) => {
      const message = params.message as string
      if (!message) {
        throw new Error('message is required')
      }
      return {
        echo: message,
        user: userId,
        timestamp: new Date().toISOString()
      }
    }
  }
}
