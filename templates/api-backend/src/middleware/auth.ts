import { Request, Response, NextFunction } from 'express'
import { config } from '../config.js'

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key']

  if (!apiKey || apiKey !== config.apiKey) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
