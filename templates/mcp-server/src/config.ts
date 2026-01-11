function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  googleClientId: requireEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
  jwtSecret: requireEnv('JWT_SECRET'),
  allowedEmail: requireEnv('ALLOWED_EMAIL'),
  baseUrl: requireEnv('BASE_URL'),
  port: parseInt(process.env.PORT || '8080', 10)
}
