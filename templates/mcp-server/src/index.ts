import express from 'express'
import { http } from '@google-cloud/functions-framework'
import { config } from './config.js'
import { oauthRouter, authMiddleware, AuthenticatedRequest } from './auth/index.js'
import { mcpHandler } from './mcp/index.js'

const app = express()

app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// OAuth routes (public)
app.use('/oauth', oauthRouter)

// MCP endpoint (authenticated)
app.post('/mcp', authMiddleware, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const response = await mcpHandler(req.body, req.user.sub)
  res.json(response)
})

// Landing page
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>MCP Server</title></head>
      <body>
        <h1>MCP Server</h1>
        <p>This is an MCP server. Configure your MCP client to connect to:</p>
        <code>${config.baseUrl}/mcp</code>
      </body>
    </html>
  `)
})

// Export for Cloud Functions
http('mcpServer', app)

// Local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`)
  })
}

export { app }
