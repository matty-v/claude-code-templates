import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
  status?: number
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message)

  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({ error: message })
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not Found' })
}
