# MCP Server Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a fully functional MCP server template with OAuth2 auth, Firestore state, Vitest tests, and GitHub Actions CI/CD.

**Architecture:** Express server with modular auth (OAuth 2.1 + JWT) and MCP handler. Firestore persists auth state. Cloud Functions deployment with Workload Identity Federation for CI/CD.

**Tech Stack:** TypeScript, Express, Firestore, Vitest, GitHub Actions, Google Cloud Functions

---

## Task 1: Create Template Directory Structure

**Files:**
- Create: `templates/mcp-server/` (directory)
- Create: `templates/mcp-server/.gitignore`
- Create: `templates/mcp-server/.env.example`

**Step 1: Create directory structure**

```bash
mkdir -p templates/mcp-server/{src/{auth,mcp/tools},tests/{auth,mcp/tools},.claude,.github/workflows,docs/plans}
```

**Step 2: Create .gitignore**

Create `templates/mcp-server/.gitignore`:
```
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
```

**Step 3: Create .env.example**

Create `templates/mcp-server/.env.example`:
```
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Auth
JWT_SECRET=your-jwt-secret-min-32-chars
ALLOWED_EMAIL=your-email@gmail.com

# GCP
GCP_PROJECT=your-project-id
BASE_URL=https://your-region-your-project.cloudfunctions.net/mcp-server

# Local dev only
PORT=8080
```

**Step 4: Commit**

```bash
git add templates/mcp-server/
git commit -m "feat: scaffold MCP server template directory structure"
```

---

## Task 2: Create Package Configuration

**Files:**
- Create: `templates/mcp-server/package.json`
- Create: `templates/mcp-server/tsconfig.json`
- Create: `templates/mcp-server/vitest.config.ts`

**Step 1: Create package.json**

Create `templates/mcp-server/package.json`:
```json
{
  "name": "mcp-server-template",
  "version": "1.0.0",
  "description": "MCP server with OAuth2 authentication",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "deploy": "./deploy.sh"
  },
  "dependencies": {
    "@google-cloud/firestore": "^7.0.0",
    "@google-cloud/functions-framework": "^3.4.0",
    "express": "^4.18.2",
    "google-auth-library": "^9.0.0",
    "jsonwebtoken": "^9.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/node": "^20.0.0",
    "@types/uuid": "^9.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "engines": {
    "node": ">=20"
  }
}
```

**Step 2: Create tsconfig.json**

Create `templates/mcp-server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Step 3: Create vitest.config.ts**

Create `templates/mcp-server/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts']
    }
  }
})
```

**Step 4: Commit**

```bash
git add templates/mcp-server/package.json templates/mcp-server/tsconfig.json templates/mcp-server/vitest.config.ts
git commit -m "feat: add package.json, tsconfig, and vitest config"
```

---

## Task 3: Create Test Setup and Config Module

**Files:**
- Create: `templates/mcp-server/tests/setup.ts`
- Create: `templates/mcp-server/tests/config.test.ts`
- Create: `templates/mcp-server/src/config.ts`

**Step 1: Create test setup with Firestore mock**

Create `templates/mcp-server/tests/setup.ts`:
```typescript
import { vi } from 'vitest'

// Mock Firestore
vi.mock('@google-cloud/firestore', () => {
  const mockDoc = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    update: vi.fn()
  }
  const mockCollection = {
    doc: vi.fn(() => mockDoc),
    where: vi.fn(() => ({ get: vi.fn() })),
    get: vi.fn()
  }
  return {
    Firestore: vi.fn(() => ({
      collection: vi.fn(() => mockCollection)
    }))
  }
})

// Set test environment variables
process.env.GOOGLE_CLIENT_ID = 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
process.env.JWT_SECRET = 'test-jwt-secret-that-is-long-enough'
process.env.ALLOWED_EMAIL = 'test@example.com'
process.env.BASE_URL = 'http://localhost:8080'
```

**Step 2: Write failing test for config**

Create `templates/mcp-server/tests/config.test.ts`:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('config', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('exports validated config when env vars are set', async () => {
    const { config } = await import('../src/config.js')

    expect(config.googleClientId).toBe('test-client-id')
    expect(config.googleClientSecret).toBe('test-client-secret')
    expect(config.jwtSecret).toBe('test-jwt-secret-that-is-long-enough')
    expect(config.allowedEmail).toBe('test@example.com')
    expect(config.baseUrl).toBe('http://localhost:8080')
  })

  it('throws when required env var is missing', async () => {
    const originalClientId = process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_ID

    await expect(import('../src/config.js')).rejects.toThrow('GOOGLE_CLIENT_ID')

    process.env.GOOGLE_CLIENT_ID = originalClientId
  })
})
```

**Step 3: Run test to verify it fails**

Run: `cd templates/mcp-server && npm install && npm test`
Expected: FAIL with "Cannot find module '../src/config.js'"

**Step 4: Write minimal implementation**

Create `templates/mcp-server/src/config.ts`:
```typescript
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
```

**Step 5: Run test to verify it passes**

Run: `cd templates/mcp-server && npm test`
Expected: PASS

**Step 6: Commit**

```bash
git add templates/mcp-server/tests/ templates/mcp-server/src/config.ts
git commit -m "feat: add config module with env validation"
```

---

## Task 4: Create Auth State Module

**Files:**
- Create: `templates/mcp-server/tests/auth/state.test.ts`
- Create: `templates/mcp-server/src/auth/state.ts`
- Create: `templates/mcp-server/src/auth/index.ts`

**Step 1: Write failing test for auth state**

Create `templates/mcp-server/tests/auth/state.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Firestore } from '@google-cloud/firestore'

describe('AuthState', () => {
  let authState: any
  let mockFirestore: any
  let mockCollection: any
  let mockDoc: any

  beforeEach(async () => {
    vi.resetModules()

    mockDoc = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }
    mockCollection = {
      doc: vi.fn(() => mockDoc)
    }
    mockFirestore = {
      collection: vi.fn(() => mockCollection)
    }

    vi.mocked(Firestore).mockImplementation(() => mockFirestore as any)

    const module = await import('../../src/auth/state.js')
    authState = new module.AuthState()
  })

  describe('setPendingAuth', () => {
    it('stores pending auth state in Firestore', async () => {
      await authState.setPendingAuth('state123', {
        clientId: 'client1',
        redirectUri: 'http://localhost/callback',
        codeChallenge: 'challenge'
      })

      expect(mockFirestore.collection).toHaveBeenCalledWith('pendingAuth')
      expect(mockCollection.doc).toHaveBeenCalledWith('state123')
      expect(mockDoc.set).toHaveBeenCalled()
    })
  })

  describe('getPendingAuth', () => {
    it('retrieves pending auth state from Firestore', async () => {
      mockDoc.get.mockResolvedValue({
        exists: true,
        data: () => ({
          clientId: 'client1',
          redirectUri: 'http://localhost/callback',
          codeChallenge: 'challenge',
          expiresAt: Date.now() + 600000
        })
      })

      const result = await authState.getPendingAuth('state123')

      expect(result).toEqual({
        clientId: 'client1',
        redirectUri: 'http://localhost/callback',
        codeChallenge: 'challenge',
        expiresAt: expect.any(Number)
      })
    })

    it('returns null for expired state', async () => {
      mockDoc.get.mockResolvedValue({
        exists: true,
        data: () => ({
          clientId: 'client1',
          expiresAt: Date.now() - 1000
        })
      })

      const result = await authState.getPendingAuth('state123')

      expect(result).toBeNull()
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd templates/mcp-server && npm test`
Expected: FAIL with "Cannot find module '../../src/auth/state.js'"

**Step 3: Write minimal implementation**

Create `templates/mcp-server/src/auth/state.ts`:
```typescript
import { Firestore } from '@google-cloud/firestore'

interface PendingAuth {
  clientId: string
  redirectUri: string
  codeChallenge: string
  expiresAt: number
}

interface AuthCode {
  clientId: string
  userId: string
  codeChallenge: string
  expiresAt: number
}

interface GoogleCredentials {
  refreshToken: string
  accessToken: string
  expiresAt: number
}

const TEN_MINUTES = 10 * 60 * 1000
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export class AuthState {
  private db: Firestore

  constructor() {
    this.db = new Firestore()
  }

  // Pending Auth (10 min TTL)
  async setPendingAuth(state: string, data: Omit<PendingAuth, 'expiresAt'>): Promise<void> {
    await this.db.collection('pendingAuth').doc(state).set({
      ...data,
      expiresAt: Date.now() + TEN_MINUTES
    })
  }

  async getPendingAuth(state: string): Promise<PendingAuth | null> {
    const doc = await this.db.collection('pendingAuth').doc(state).get()
    if (!doc.exists) return null

    const data = doc.data() as PendingAuth
    if (data.expiresAt < Date.now()) {
      await this.deletePendingAuth(state)
      return null
    }
    return data
  }

  async deletePendingAuth(state: string): Promise<void> {
    await this.db.collection('pendingAuth').doc(state).delete()
  }

  // Auth Codes (10 min TTL)
  async setAuthCode(code: string, data: Omit<AuthCode, 'expiresAt'>): Promise<void> {
    await this.db.collection('authCodes').doc(code).set({
      ...data,
      expiresAt: Date.now() + TEN_MINUTES
    })
  }

  async getAuthCode(code: string): Promise<AuthCode | null> {
    const doc = await this.db.collection('authCodes').doc(code).get()
    if (!doc.exists) return null

    const data = doc.data() as AuthCode
    if (data.expiresAt < Date.now()) {
      await this.deleteAuthCode(code)
      return null
    }
    return data
  }

  async deleteAuthCode(code: string): Promise<void> {
    await this.db.collection('authCodes').doc(code).delete()
  }

  // Google Credentials (permanent, tokens have own expiry)
  async setGoogleCredentials(userId: string, credentials: GoogleCredentials): Promise<void> {
    await this.db.collection('googleCredentials').doc(userId).set(credentials)
  }

  async getGoogleCredentials(userId: string): Promise<GoogleCredentials | null> {
    const doc = await this.db.collection('googleCredentials').doc(userId).get()
    if (!doc.exists) return null
    return doc.data() as GoogleCredentials
  }

  // Registered Clients (permanent)
  async setClient(clientId: string, data: { clientSecret: string; redirectUris: string[] }): Promise<void> {
    await this.db.collection('registeredClients').doc(clientId).set(data)
  }

  async getClient(clientId: string): Promise<{ clientSecret: string; redirectUris: string[] } | null> {
    const doc = await this.db.collection('registeredClients').doc(clientId).get()
    if (!doc.exists) return null
    return doc.data() as { clientSecret: string; redirectUris: string[] }
  }
}

export const authState = new AuthState()
```

**Step 4: Create auth index**

Create `templates/mcp-server/src/auth/index.ts`:
```typescript
export { AuthState, authState } from './state.js'
```

**Step 5: Run test to verify it passes**

Run: `cd templates/mcp-server && npm test`
Expected: PASS

**Step 6: Commit**

```bash
git add templates/mcp-server/src/auth/ templates/mcp-server/tests/auth/
git commit -m "feat: add Firestore auth state management"
```

---

## Task 5: Create JWT Middleware

**Files:**
- Create: `templates/mcp-server/tests/auth/middleware.test.ts`
- Create: `templates/mcp-server/src/auth/middleware.ts`
- Update: `templates/mcp-server/src/auth/index.ts`

**Step 1: Write failing test for middleware**

Create `templates/mcp-server/tests/auth/middleware.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

describe('authMiddleware', () => {
  let authMiddleware: any
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  beforeEach(async () => {
    vi.resetModules()

    mockReq = {
      headers: {}
    }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    mockNext = vi.fn()

    const module = await import('../../src/auth/middleware.js')
    authMiddleware = module.authMiddleware
  })

  it('calls next() with valid Bearer token', async () => {
    const token = jwt.sign(
      { sub: 'user@example.com', type: 'access' },
      'test-jwt-secret-that-is-long-enough'
    )
    mockReq.headers = { authorization: `Bearer ${token}` }

    await authMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect((mockReq as any).user).toEqual({
      sub: 'user@example.com',
      type: 'access',
      iat: expect.any(Number)
    })
  })

  it('returns 401 when no authorization header', async () => {
    await authMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing authorization header' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns 401 for invalid token', async () => {
    mockReq.headers = { authorization: 'Bearer invalid-token' }

    await authMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd templates/mcp-server && npm test`
Expected: FAIL with "Cannot find module '../../src/auth/middleware.js'"

**Step 3: Write minimal implementation**

Create `templates/mcp-server/src/auth/middleware.ts`:
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string
    type: string
    iat: number
  }
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: 'Missing authorization header' })
    return
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Invalid authorization format' })
    return
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as {
      sub: string
      type: string
      iat: number
    }
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

**Step 4: Update auth index**

Update `templates/mcp-server/src/auth/index.ts`:
```typescript
export { AuthState, authState } from './state.js'
export { authMiddleware, AuthenticatedRequest } from './middleware.js'
```

**Step 5: Run test to verify it passes**

Run: `cd templates/mcp-server && npm test`
Expected: PASS

**Step 6: Commit**

```bash
git add templates/mcp-server/src/auth/ templates/mcp-server/tests/auth/
git commit -m "feat: add JWT auth middleware"
```

---

## Task 6: Create MCP Types and Handler

**Files:**
- Create: `templates/mcp-server/src/mcp/types.ts`
- Create: `templates/mcp-server/tests/mcp/handler.test.ts`
- Create: `templates/mcp-server/src/mcp/handler.ts`
- Create: `templates/mcp-server/src/mcp/index.ts`

**Step 1: Create MCP types**

Create `templates/mcp-server/src/mcp/types.ts`:
```typescript
export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: string | number
  method: string
  params?: Record<string, unknown>
}

export interface JsonRpcResponse {
  jsonrpc: '2.0'
  id: string | number
  result?: unknown
  error?: {
    code: number
    message: string
    data?: unknown
  }
}

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export interface ToolHandler {
  (params: Record<string, unknown>, userId: string): Promise<unknown>
}

export interface ToolRegistry {
  [toolName: string]: {
    definition: ToolDefinition
    handler: ToolHandler
  }
}
```

**Step 2: Write failing test for handler**

Create `templates/mcp-server/tests/mcp/handler.test.ts`:
```typescript
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
```

**Step 3: Run test to verify it fails**

Run: `cd templates/mcp-server && npm test`
Expected: FAIL with "Cannot find module '../../src/mcp/handler.js'"

**Step 4: Write minimal implementation**

Create `templates/mcp-server/src/mcp/handler.ts`:
```typescript
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
```

**Step 5: Create MCP index**

Create `templates/mcp-server/src/mcp/index.ts`:
```typescript
export * from './types.js'
export { mcpHandler } from './handler.js'
```

**Step 6: Run test to verify it passes (will fail - need tools)**

Run: `cd templates/mcp-server && npm test`
Expected: FAIL - need to create tools/index.ts first

---

## Task 7: Create Example Tool

**Files:**
- Create: `templates/mcp-server/src/mcp/tools/index.ts`
- Create: `templates/mcp-server/tests/mcp/tools/example.test.ts`

**Step 1: Create tools registry with example tool**

Create `templates/mcp-server/src/mcp/tools/index.ts`:
```typescript
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
```

**Step 2: Write test for example tool**

Create `templates/mcp-server/tests/mcp/tools/example.test.ts`:
```typescript
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
```

**Step 3: Run all tests**

Run: `cd templates/mcp-server && npm test`
Expected: PASS

**Step 4: Commit**

```bash
git add templates/mcp-server/src/mcp/ templates/mcp-server/tests/mcp/
git commit -m "feat: add MCP handler with example echo tool"
```

---

## Task 8: Create OAuth Routes

**Files:**
- Create: `templates/mcp-server/src/auth/oauth.ts`
- Update: `templates/mcp-server/src/auth/index.ts`

**Step 1: Create OAuth routes**

Create `templates/mcp-server/src/auth/oauth.ts`:
```typescript
import { Router, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config.js'
import { authState } from './state.js'

const router = Router()

const googleClient = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  `${config.baseUrl}/oauth/google/callback`
)

// OAuth 2.1 Authorization endpoint
router.get('/authorize', async (req: Request, res: Response) => {
  const { client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.query

  if (!client_id || !redirect_uri || !state || !code_challenge) {
    res.status(400).json({ error: 'Missing required parameters' })
    return
  }

  if (code_challenge_method !== 'S256') {
    res.status(400).json({ error: 'Only S256 code challenge method is supported' })
    return
  }

  // Store pending auth state
  await authState.setPendingAuth(state as string, {
    clientId: client_id as string,
    redirectUri: redirect_uri as string,
    codeChallenge: code_challenge as string
  })

  // Redirect to Google OAuth
  const googleAuthUrl = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile'],
    state: state as string,
    prompt: 'consent'
  })

  res.redirect(googleAuthUrl)
})

// Google OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query

  if (error) {
    res.status(400).json({ error: `Google OAuth error: ${error}` })
    return
  }

  if (!code || !state) {
    res.status(400).json({ error: 'Missing code or state' })
    return
  }

  const pending = await authState.getPendingAuth(state as string)
  if (!pending) {
    res.status(400).json({ error: 'Invalid or expired state' })
    return
  }

  try {
    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code as string)
    googleClient.setCredentials(tokens)

    // Get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: config.googleClientId
    })
    const payload = ticket.getPayload()!
    const email = payload.email!

    // Check if user is allowed
    if (email !== config.allowedEmail) {
      res.status(403).json({ error: 'User not authorized' })
      return
    }

    // Store Google credentials
    await authState.setGoogleCredentials(email, {
      refreshToken: tokens.refresh_token!,
      accessToken: tokens.access_token!,
      expiresAt: tokens.expiry_date || Date.now() + 3600000
    })

    // Generate auth code for client
    const authCode = uuidv4()
    await authState.setAuthCode(authCode, {
      clientId: pending.clientId,
      userId: email,
      codeChallenge: pending.codeChallenge
    })

    // Clean up pending state
    await authState.deletePendingAuth(state as string)

    // Redirect back to client
    const redirectUrl = new URL(pending.redirectUri)
    redirectUrl.searchParams.set('code', authCode)
    redirectUrl.searchParams.set('state', state as string)
    res.redirect(redirectUrl.toString())
  } catch (err) {
    console.error('OAuth callback error:', err)
    res.status(500).json({ error: 'OAuth flow failed' })
  }
})

// Token endpoint
router.post('/token', async (req: Request, res: Response) => {
  const { grant_type, code, code_verifier, client_id, client_secret, refresh_token } = req.body

  if (grant_type === 'authorization_code') {
    if (!code || !code_verifier || !client_id) {
      res.status(400).json({ error: 'Missing required parameters' })
      return
    }

    const authCode = await authState.getAuthCode(code)
    if (!authCode) {
      res.status(400).json({ error: 'Invalid or expired code' })
      return
    }

    // Verify PKCE
    const crypto = await import('crypto')
    const expectedChallenge = crypto
      .createHash('sha256')
      .update(code_verifier)
      .digest('base64url')

    if (expectedChallenge !== authCode.codeChallenge) {
      res.status(400).json({ error: 'Invalid code verifier' })
      return
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { sub: authCode.userId, type: 'access' },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    const newRefreshToken = jwt.sign(
      { sub: authCode.userId, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    )

    // Clean up auth code
    await authState.deleteAuthCode(code)

    res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60,
      refresh_token: newRefreshToken
    })
  } else if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      res.status(400).json({ error: 'Missing refresh token' })
      return
    }

    try {
      const payload = jwt.verify(refresh_token, config.jwtSecret) as { sub: string; type: string }
      if (payload.type !== 'refresh') {
        res.status(400).json({ error: 'Invalid token type' })
        return
      }

      const accessToken = jwt.sign(
        { sub: payload.sub, type: 'access' },
        config.jwtSecret,
        { expiresIn: '7d' }
      )
      const newRefreshToken = jwt.sign(
        { sub: payload.sub, type: 'refresh' },
        config.jwtSecret,
        { expiresIn: '30d' }
      )

      res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 7 * 24 * 60 * 60,
        refresh_token: newRefreshToken
      })
    } catch {
      res.status(400).json({ error: 'Invalid refresh token' })
    }
  } else {
    res.status(400).json({ error: 'Unsupported grant type' })
  }
})

// Client registration (for MCP dynamic client registration)
router.post('/register', async (req: Request, res: Response) => {
  const { redirect_uris } = req.body

  if (!redirect_uris || !Array.isArray(redirect_uris)) {
    res.status(400).json({ error: 'redirect_uris required' })
    return
  }

  const clientId = uuidv4()
  const clientSecret = uuidv4()

  await authState.setClient(clientId, {
    clientSecret,
    redirectUris: redirect_uris
  })

  res.json({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris
  })
})

export { router as oauthRouter }
```

**Step 2: Update auth index**

Update `templates/mcp-server/src/auth/index.ts`:
```typescript
export { AuthState, authState } from './state.js'
export { authMiddleware, AuthenticatedRequest } from './middleware.js'
export { oauthRouter } from './oauth.js'
```

**Step 3: Commit**

```bash
git add templates/mcp-server/src/auth/
git commit -m "feat: add OAuth 2.1 routes with PKCE support"
```

---

## Task 9: Create Main Express App

**Files:**
- Create: `templates/mcp-server/src/index.ts`

**Step 1: Create main entry point**

Create `templates/mcp-server/src/index.ts`:
```typescript
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
```

**Step 2: Commit**

```bash
git add templates/mcp-server/src/index.ts
git commit -m "feat: add main Express app with MCP endpoint"
```

---

## Task 10: Create Deploy Script

**Files:**
- Create: `templates/mcp-server/deploy.sh`

**Step 1: Create deploy script**

Create `templates/mcp-server/deploy.sh`:
```bash
#!/bin/bash
set -e

# Check required env vars
if [ -z "$GCP_PROJECT" ]; then
  echo "Error: GCP_PROJECT environment variable is required"
  exit 1
fi

FUNCTION_NAME="${FUNCTION_NAME:-mcp-server}"
REGION="${REGION:-us-central1}"

echo "Building..."
npm run build

echo "Deploying to Cloud Functions..."
gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=nodejs20 \
  --region="$REGION" \
  --source=. \
  --entry-point=mcpServer \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="BASE_URL=https://$REGION-$GCP_PROJECT.cloudfunctions.net/$FUNCTION_NAME" \
  --project="$GCP_PROJECT"

echo ""
echo "Deployed successfully!"
echo "URL: https://$REGION-$GCP_PROJECT.cloudfunctions.net/$FUNCTION_NAME"
```

**Step 2: Make executable and commit**

```bash
chmod +x templates/mcp-server/deploy.sh
git add templates/mcp-server/deploy.sh
git commit -m "feat: add GCP Cloud Functions deploy script"
```

---

## Task 11: Create GitHub Actions Workflows

**Files:**
- Create: `templates/mcp-server/.github/workflows/ci.yml`
- Create: `templates/mcp-server/.github/workflows/deploy.yml`

**Step 1: Create CI workflow**

Create `templates/mcp-server/.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

**Step 2: Create deploy workflow**

Create `templates/mcp-server/.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    # Only deploy after CI passes
    needs: []

    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}

      - name: Setup gcloud
        uses: google-github-actions/setup-gcloud@v2

      - name: Deploy to Cloud Functions
        env:
          GCP_PROJECT: ${{ secrets.GCP_PROJECT }}
          FUNCTION_NAME: ${{ secrets.FUNCTION_NAME || 'mcp-server' }}
          REGION: ${{ secrets.REGION || 'us-central1' }}
        run: |
          gcloud functions deploy "$FUNCTION_NAME" \
            --gen2 \
            --runtime=nodejs20 \
            --region="$REGION" \
            --source=. \
            --entry-point=mcpServer \
            --trigger-http \
            --allow-unauthenticated \
            --project="$GCP_PROJECT"
```

**Step 3: Commit**

```bash
git add templates/mcp-server/.github/
git commit -m "feat: add GitHub Actions CI and deploy workflows"
```

---

## Task 12: Create CLAUDE.md

**Files:**
- Create: `templates/mcp-server/CLAUDE.md`

**Step 1: Create CLAUDE.md**

Create `templates/mcp-server/CLAUDE.md`:
```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run build        # Compile TypeScript to dist/
npm run dev          # Watch mode for development
npm run start        # Run the compiled server
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run typecheck    # Type check without emitting
./deploy.sh          # Deploy to Cloud Functions (requires GCP_PROJECT)
```

## Architecture Overview

This is an MCP (Model Context Protocol) server with OAuth 2.1 authentication running on Google Cloud Functions.

### Directory Structure

```
src/
  index.ts          # Express app, Cloud Functions export
  config.ts         # Environment variable validation
  auth/
    index.ts        # Re-exports
    state.ts        # Firestore auth state (persistent)
    middleware.ts   # JWT auth middleware
    oauth.ts        # OAuth 2.1 routes
  mcp/
    index.ts        # Re-exports
    types.ts        # TypeScript interfaces
    handler.ts      # JSON-RPC dispatcher
    tools/
      index.ts      # Tool registry - ADD YOUR TOOLS HERE
```

### Firestore Collections

| Collection | Purpose | TTL |
|------------|---------|-----|
| `pendingAuth` | OAuth authorization flow state | 10 minutes |
| `authCodes` | Short-lived authorization codes | 10 minutes |
| `registeredClients` | OAuth client registrations | Permanent |
| `googleCredentials` | Google API refresh tokens | Permanent |

### Token Lifetimes

| Token Type | Duration |
|------------|----------|
| Access token | 7 days |
| Refresh token | 30 days |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Secret for signing JWT tokens (min 32 chars) |
| `ALLOWED_EMAIL` | Authorized user email |
| `BASE_URL` | Deployed function URL |
| `GCP_PROJECT` | Google Cloud project ID |
| `PORT` | Local dev server port (default 8080) |

## Adding New Tools

Add tools in `src/mcp/tools/index.ts`:

```typescript
export const tools: ToolRegistry = {
  your_tool: {
    definition: {
      name: 'your_tool',
      description: 'What this tool does',
      inputSchema: {
        type: 'object',
        properties: {
          param: { type: 'string', description: 'Parameter description' }
        },
        required: ['param']
      }
    },
    handler: async (params, userId) => {
      // Implementation
      return { result: 'data' }
    }
  }
}
```

## Development Workflow (TDD)

1. **Write failing test first** in `tests/`
2. **Run test** to confirm it fails: `npm test`
3. **Implement minimal code** to make test pass
4. **Run tests** to confirm pass: `npm test`
5. **Refactor** while keeping tests green
6. **Commit** with descriptive message

## Testing

- `npm test` - Run all tests
- `npm run test:watch` - Watch mode for development
- `npm run test:coverage` - Generate coverage report

Tests use mocked Firestore - no GCP credentials needed for testing.

## PR Conventions

- Descriptive title summarizing the change
- All tests must pass
- Include tests for new tools
- Reference any related issues

## Deployment

1. Set required environment variables in GCP
2. Configure Workload Identity Federation for GitHub Actions
3. Push to main branch to trigger deploy
```

**Step 2: Commit**

```bash
git add templates/mcp-server/CLAUDE.md
git commit -m "feat: add CLAUDE.md with project context and TDD guidance"
```

---

## Task 13: Create Claude Settings and README

**Files:**
- Create: `templates/mcp-server/.claude/settings.local.json`
- Create: `templates/mcp-server/README.md`

**Step 1: Create Claude settings**

Create `templates/mcp-server/.claude/settings.local.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test*)",
      "Bash(npx vitest*)",
      "Bash(git *)"
    ]
  }
}
```

**Step 2: Create README**

Create `templates/mcp-server/README.md`:
```markdown
# MCP Server Template

A template for building MCP (Model Context Protocol) servers with OAuth 2.1 authentication, running on Google Cloud Functions.

## Features

- OAuth 2.1 with PKCE for secure authentication
- Google login with single-user restriction
- Firestore for persistent auth state
- Vitest for testing
- GitHub Actions for CI/CD
- TypeScript with ESM

## Quick Start

1. **Clone and install**
   ```bash
   cp -r templates/mcp-server my-mcp-server
   cd my-mcp-server
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## GCP Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized redirect URI: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/mcp-server/oauth/google/callback`

### 2. Enable Required APIs

```bash
gcloud services enable \
  cloudfunctions.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com
```

### 3. Create Firestore Database

```bash
gcloud firestore databases create --location=us-central1
```

### 4. Deploy

```bash
GCP_PROJECT=your-project-id ./deploy.sh
```

## GitHub Actions Setup

### Workload Identity Federation

1. Create a Workload Identity Pool and Provider
2. Grant the service account Cloud Functions Developer role
3. Add these secrets to your GitHub repo:
   - `GCP_PROJECT`: Your GCP project ID
   - `WIF_PROVIDER`: Workload Identity Provider resource name
   - `WIF_SERVICE_ACCOUNT`: Service account email

See [GitHub's OIDC documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-google-cloud-platform) for detailed setup.

## Adding Tools

Edit `src/mcp/tools/index.ts` to add your MCP tools. See `CLAUDE.md` for the tool structure.

## License

MIT
```

**Step 3: Commit**

```bash
git add templates/mcp-server/.claude/ templates/mcp-server/README.md
git commit -m "feat: add Claude settings and README"
```

---

## Task 14: Final Verification

**Step 1: Install dependencies and run tests**

```bash
cd templates/mcp-server
npm install
npm test
```

Expected: All tests pass

**Step 2: Type check**

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Build**

```bash
npm run build
```

Expected: Compiles successfully to dist/

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any issues from final verification"
```

---

## Summary

After completing all tasks, the `templates/mcp-server/` directory contains:
- Full OAuth 2.1 implementation with Firestore persistence
- MCP handler with example tool
- Vitest tests with mocked dependencies
- GitHub Actions for CI and deployment
- CLAUDE.md with TDD workflow guidance
- README with setup instructions
