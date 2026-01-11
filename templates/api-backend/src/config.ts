function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}

export const config = {
  apiKey: requireEnv('API_KEY'),
  gcpProject: process.env.GCP_PROJECT || '',
  port: parseInt(optionalEnv('PORT', '8080'), 10),
  isProduction: process.env.NODE_ENV === 'production',
}
