import express from 'express'
import { http } from '@google-cloud/functions-framework'
import { config } from './config.js'
import { apiKeyAuth, errorHandler, notFoundHandler } from './middleware/index.js'
import { healthRouter, itemsRouter } from './routes/index.js'

const app = express()

// Middleware
app.use(express.json())

// Public routes
app.get('/', (_req, res) => {
  res.json({
    name: 'API Backend Template',
    version: '1.0.0',
    endpoints: ['/health', '/items'],
  })
})
app.use('/health', healthRouter)

// Protected routes
app.use('/items', apiKeyAuth, itemsRouter)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Export for Cloud Functions
http('api', app)

// Local development (skip when running tests)
const isTest = process.env.NODE_ENV === 'test'
if (!config.isProduction && !isTest) {
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`)
  })
}

export { app }
