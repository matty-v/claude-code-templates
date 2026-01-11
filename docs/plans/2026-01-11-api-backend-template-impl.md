# API/Backend Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a fully functional REST API template with Express.js, TypeScript, Firestore, API key authentication, and Google Cloud Functions deployment.

**Architecture:** Express.js server with TypeScript (ESM). Firestore for data persistence. API key authentication middleware. Vitest + supertest for testing. GitHub Actions CI/CD with Cloud Functions deployment.

**Tech Stack:** Express.js, TypeScript, Firestore, Vitest, supertest, Google Cloud Functions

---

## Task 1: Create Template Directory Structure

**Files:**
- Create: `templates/api-backend/` (directory structure)
- Create: `templates/api-backend/.gitignore`
- Create: `templates/api-backend/.env.example`

**Step 1: Create directory structure**

```bash
mkdir -p templates/api-backend/{src/{middleware,routes,services},tests/{routes,middleware},.claude,.github/workflows,docs/plans}
```

**Step 2: Create .gitignore**

Create `templates/api-backend/.gitignore`:
```
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
```

**Step 3: Create .env.example**

Create `templates/api-backend/.env.example`:
```
API_KEY=your-secret-api-key
GCP_PROJECT=your-gcp-project-id
PORT=8080
```

**Step 4: Commit**

```bash
git add templates/api-backend/
git commit -m "feat: scaffold API backend template directory structure"
```

---

## Task 2: Create Package Configuration

**Files:**
- Create: `templates/api-backend/package.json`
- Create: `templates/api-backend/tsconfig.json`

**Step 1: Create package.json**

Create `templates/api-backend/package.json`:
```json
{
  "name": "api-backend-template",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "deploy": "./deploy.sh"
  },
  "dependencies": {
    "@google-cloud/firestore": "^7.11.0",
    "@google-cloud/functions-framework": "^3.4.5",
    "express": "^4.21.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.0",
    "@types/supertest": "^6.0.2",
    "supertest": "^7.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

**Step 2: Create tsconfig.json**

Create `templates/api-backend/tsconfig.json`:
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
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Step 3: Commit**

```bash
git add templates/api-backend/
git commit -m "feat: add package.json and tsconfig"
```

---

## Task 3: Create Configuration Module

**Files:**
- Create: `templates/api-backend/src/config.ts`

**Step 1: Create config.ts**

Create `templates/api-backend/src/config.ts`:
```typescript
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
```

**Step 2: Commit**

```bash
git add templates/api-backend/src/config.ts
git commit -m "feat: add configuration module"
```

---

## Task 4: Create Firestore Service

**Files:**
- Create: `templates/api-backend/src/services/firestore.ts`
- Create: `templates/api-backend/src/services/index.ts`

**Step 1: Create firestore.ts**

Create `templates/api-backend/src/services/firestore.ts`:
```typescript
import { Firestore } from '@google-cloud/firestore'

const db = new Firestore()

export interface WithId {
  id: string
}

export async function getAll<T extends WithId>(collection: string): Promise<T[]> {
  const snapshot = await db.collection(collection).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
}

export async function getById<T extends WithId>(collection: string, id: string): Promise<T | null> {
  const doc = await db.collection(collection).doc(id).get()
  return doc.exists ? { id: doc.id, ...doc.data() } as T : null
}

export async function create<T extends WithId>(collection: string, data: Omit<T, 'id'>): Promise<T> {
  const docRef = await db.collection(collection).add({
    ...data,
    createdAt: new Date().toISOString(),
  })
  return { id: docRef.id, ...data } as T
}

export async function update(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  await db.collection(collection).doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export async function remove(collection: string, id: string): Promise<void> {
  await db.collection(collection).doc(id).delete()
}

export { db }
```

**Step 2: Create services/index.ts**

Create `templates/api-backend/src/services/index.ts`:
```typescript
export * from './firestore.js'
```

**Step 3: Commit**

```bash
git add templates/api-backend/src/services/
git commit -m "feat: add Firestore service"
```

---

## Task 5: Create Middleware

**Files:**
- Create: `templates/api-backend/src/middleware/auth.ts`
- Create: `templates/api-backend/src/middleware/error.ts`
- Create: `templates/api-backend/src/middleware/index.ts`

**Step 1: Create auth.ts**

Create `templates/api-backend/src/middleware/auth.ts`:
```typescript
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
```

**Step 2: Create error.ts**

Create `templates/api-backend/src/middleware/error.ts`:
```typescript
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
```

**Step 3: Create middleware/index.ts**

Create `templates/api-backend/src/middleware/index.ts`:
```typescript
export { apiKeyAuth } from './auth.js'
export { errorHandler, notFoundHandler } from './error.js'
```

**Step 4: Commit**

```bash
git add templates/api-backend/src/middleware/
git commit -m "feat: add auth and error middleware"
```

---

## Task 6: Create Routes

**Files:**
- Create: `templates/api-backend/src/routes/health.ts`
- Create: `templates/api-backend/src/routes/items.ts`
- Create: `templates/api-backend/src/routes/index.ts`

**Step 1: Create health.ts**

Create `templates/api-backend/src/routes/health.ts`:
```typescript
import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export { router as healthRouter }
```

**Step 2: Create items.ts**

Create `templates/api-backend/src/routes/items.ts`:
```typescript
import { Router, Request, Response, NextFunction } from 'express'
import { getAll, getById, create, update, remove } from '../services/firestore.js'

const router = Router()
const COLLECTION = 'items'

interface Item {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

// GET /items - List all items
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await getAll<Item>(COLLECTION)
    res.json(items)
  } catch (error) {
    next(error)
  }
})

// GET /items/:id - Get item by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getById<Item>(COLLECTION, req.params.id)
    if (!item) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    res.json(item)
  } catch (error) {
    next(error)
  }
})

// POST /items - Create item
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body
    if (!name) {
      res.status(400).json({ error: 'Name is required' })
      return
    }
    const item = await create<Item>(COLLECTION, { name, description })
    res.status(201).json(item)
  } catch (error) {
    next(error)
  }
})

// PUT /items/:id - Update item
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await getById<Item>(COLLECTION, req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    const { name, description } = req.body
    await update(COLLECTION, req.params.id, { name, description })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

// DELETE /items/:id - Delete item
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await getById<Item>(COLLECTION, req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    await remove(COLLECTION, req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export { router as itemsRouter }
```

**Step 3: Create routes/index.ts**

Create `templates/api-backend/src/routes/index.ts`:
```typescript
export { healthRouter } from './health.js'
export { itemsRouter } from './items.js'
```

**Step 4: Commit**

```bash
git add templates/api-backend/src/routes/
git commit -m "feat: add health and items routes"
```

---

## Task 7: Create Express App Entry Point

**Files:**
- Create: `templates/api-backend/src/index.ts`

**Step 1: Create index.ts**

Create `templates/api-backend/src/index.ts`:
```typescript
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

// Local development
if (!config.isProduction) {
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`)
  })
}

export { app }
```

**Step 2: Commit**

```bash
git add templates/api-backend/src/index.ts
git commit -m "feat: add Express app entry point"
```

---

## Task 8: Create Test Setup and Tests

**Files:**
- Create: `templates/api-backend/vitest.config.ts`
- Create: `templates/api-backend/tests/setup.ts`
- Create: `templates/api-backend/tests/middleware/auth.test.ts`
- Create: `templates/api-backend/tests/routes/items.test.ts`

**Step 1: Create vitest.config.ts**

Create `templates/api-backend/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts'],
    },
  },
})
```

**Step 2: Create tests/setup.ts**

Create `templates/api-backend/tests/setup.ts`:
```typescript
import { vi } from 'vitest'

// Set test environment variables
process.env.API_KEY = 'test-api-key'
process.env.NODE_ENV = 'test'

// Mock Firestore
vi.mock('@google-cloud/firestore', () => {
  const mockData: Record<string, Record<string, unknown>[]> = {
    items: [],
  }

  return {
    Firestore: vi.fn().mockImplementation(() => ({
      collection: vi.fn().mockImplementation((name: string) => ({
        get: vi.fn().mockResolvedValue({
          docs: mockData[name]?.map((item, index) => ({
            id: `item-${index}`,
            data: () => item,
            exists: true,
          })) || [],
        }),
        doc: vi.fn().mockImplementation((id: string) => ({
          get: vi.fn().mockResolvedValue({
            id,
            exists: mockData[name]?.some((_, i) => `item-${i}` === id) || false,
            data: () => mockData[name]?.find((_, i) => `item-${i}` === id) || null,
          }),
          update: vi.fn().mockResolvedValue(undefined),
          delete: vi.fn().mockResolvedValue(undefined),
        })),
        add: vi.fn().mockResolvedValue({ id: 'new-item-id' }),
      })),
    })),
  }
})
```

**Step 3: Create tests/middleware/auth.test.ts**

Create `templates/api-backend/tests/middleware/auth.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../src/index.js'

describe('API Key Authentication', () => {
  it('returns 401 without API key', async () => {
    const res = await request(app).get('/items')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Unauthorized')
  })

  it('returns 401 with invalid API key', async () => {
    const res = await request(app)
      .get('/items')
      .set('X-API-Key', 'wrong-key')
    expect(res.status).toBe(401)
  })

  it('allows access with valid API key', async () => {
    const res = await request(app)
      .get('/items')
      .set('X-API-Key', 'test-api-key')
    expect(res.status).toBe(200)
  })

  it('health endpoint does not require auth', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
```

**Step 4: Create tests/routes/items.test.ts**

Create `templates/api-backend/tests/routes/items.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../src/index.js'

const API_KEY = 'test-api-key'

describe('Items API', () => {
  describe('GET /items', () => {
    it('returns array of items', async () => {
      const res = await request(app)
        .get('/items')
        .set('X-API-Key', API_KEY)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('POST /items', () => {
    it('returns 400 without name', async () => {
      const res = await request(app)
        .post('/items')
        .set('X-API-Key', API_KEY)
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name is required')
    })

    it('creates item with valid data', async () => {
      const res = await request(app)
        .post('/items')
        .set('X-API-Key', API_KEY)
        .send({ name: 'Test Item', description: 'A test item' })
      expect(res.status).toBe(201)
      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBe('Test Item')
    })
  })

  describe('GET /items/:id', () => {
    it('returns 404 for non-existent item', async () => {
      const res = await request(app)
        .get('/items/nonexistent')
        .set('X-API-Key', API_KEY)
      expect(res.status).toBe(404)
    })
  })
})
```

**Step 5: Commit**

```bash
git add templates/api-backend/vitest.config.ts templates/api-backend/tests/
git commit -m "feat: add Vitest configuration and tests"
```

---

## Task 9: Create Deploy Script

**Files:**
- Create: `templates/api-backend/deploy.sh`

**Step 1: Create deploy.sh**

Create `templates/api-backend/deploy.sh`:
```bash
#!/bin/bash
set -e

# Check for required environment variable
if [ -z "$GCP_PROJECT" ]; then
  echo "Error: GCP_PROJECT environment variable is required"
  exit 1
fi

# Build TypeScript
npm run build

# Deploy to Cloud Functions
gcloud functions deploy api \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=api \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="API_KEY=${API_KEY}" \
  --project="$GCP_PROJECT"

echo "Deployment complete!"
```

**Step 2: Make executable**

```bash
chmod +x templates/api-backend/deploy.sh
```

**Step 3: Commit**

```bash
git add templates/api-backend/deploy.sh
git commit -m "feat: add Cloud Functions deploy script"
```

---

## Task 10: Create GitHub Actions Workflows

**Files:**
- Create: `templates/api-backend/.github/workflows/ci.yml`
- Create: `templates/api-backend/.github/workflows/deploy.yml`

**Step 1: Create ci.yml**

Create `templates/api-backend/.github/workflows/ci.yml`:
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
        env:
          API_KEY: test-api-key

      - name: Build
        run: npm run build
```

**Step 2: Create deploy.yml**

Create `templates/api-backend/.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

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
        env:
          API_KEY: test-api-key

      - name: Build
        run: npm run build

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}

      - name: Deploy to Cloud Functions
        run: |
          gcloud functions deploy api \
            --gen2 \
            --runtime=nodejs20 \
            --region=us-central1 \
            --source=. \
            --entry-point=api \
            --trigger-http \
            --allow-unauthenticated \
            --set-env-vars="API_KEY=${{ secrets.API_KEY }}" \
            --project=${{ secrets.GCP_PROJECT }}
```

**Step 3: Commit**

```bash
git add templates/api-backend/.github/
git commit -m "feat: add GitHub Actions CI and deploy workflows"
```

---

## Task 11: Create Documentation

**Files:**
- Create: `templates/api-backend/CLAUDE.md`
- Create: `templates/api-backend/README.md`
- Create: `templates/api-backend/.claude/settings.local.json`

**Step 1: Create CLAUDE.md**

Create `templates/api-backend/CLAUDE.md`:
```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Build and Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled server
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run typecheck    # Type check without emitting
./deploy.sh          # Deploy to Cloud Functions
```

## Architecture Overview

REST API built with Express.js and TypeScript, deployed to Google Cloud Functions.

### Directory Structure

```
src/
  index.ts           # Express app, Cloud Functions export
  config.ts          # Environment validation
  middleware/
    auth.ts          # API key authentication
    error.ts         # Error handling
  routes/
    health.ts        # GET /health
    items.ts         # CRUD /items
  services/
    firestore.ts     # Firestore database helpers
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| GET | /items | Yes | List items |
| GET | /items/:id | Yes | Get item |
| POST | /items | Yes | Create item |
| PUT | /items/:id | Yes | Update item |
| DELETE | /items/:id | Yes | Delete item |

## Authentication

API uses X-API-Key header authentication:
- Set `API_KEY` environment variable
- Pass key in `X-API-Key` header
- /health endpoint is public

## Adding New Routes

1. Create route file in `src/routes/`
2. Export router from `src/routes/index.ts`
3. Mount in `src/index.ts` with appropriate middleware

## Development Workflow (TDD)

1. Write failing test in `tests/`
2. Run `npm test` to confirm failure
3. Implement minimal code to pass
4. Refactor while keeping tests green
5. Commit

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| API_KEY | Yes | Secret for authentication |
| GCP_PROJECT | Deploy | Google Cloud project ID |
| PORT | No | Server port (default 8080) |
```

**Step 2: Create README.md**

Create `templates/api-backend/README.md`:
```markdown
# API Backend Template

A REST API template with Express.js, TypeScript, Firestore, and Google Cloud Functions.

## Features

- Express.js with TypeScript
- Firestore database integration
- API key authentication
- Health check endpoint
- Example CRUD routes
- Vitest testing with supertest
- GitHub Actions CI/CD
- Cloud Functions deployment

## Quick Start

1. **Clone and install**
   ```bash
   cp -r templates/api-backend my-api
   cd my-api
   npm install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | / | No | API info |
| GET | /health | No | Health check |
| GET | /items | Yes | List items |
| GET | /items/:id | Yes | Get item |
| POST | /items | Yes | Create item |
| PUT | /items/:id | Yes | Update item |
| DELETE | /items/:id | Yes | Delete item |

## Authentication

Include the API key in requests:
```bash
curl -H "X-API-Key: your-key" http://localhost:8080/items
```

## Deployment

### Prerequisites

1. Google Cloud project with Firestore enabled
2. gcloud CLI installed and configured
3. Workload Identity Federation for GitHub Actions

### Manual Deploy

```bash
export GCP_PROJECT=your-project-id
export API_KEY=your-secret-key
./deploy.sh
```

### GitHub Actions

Add these secrets to your repository:
- `GCP_PROJECT`: Google Cloud project ID
- `API_KEY`: API authentication key
- `WIF_PROVIDER`: Workload Identity provider
- `WIF_SERVICE_ACCOUNT`: Service account email

## Project Structure

```
src/
├── index.ts          # App entry point
├── config.ts         # Configuration
├── middleware/       # Auth, error handling
├── routes/           # API routes
└── services/         # Firestore helpers
tests/
├── middleware/       # Middleware tests
└── routes/           # Route tests
```

## License

MIT
```

**Step 3: Create .claude/settings.local.json**

Create `templates/api-backend/.claude/settings.local.json`:
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

**Step 4: Commit**

```bash
git add -f templates/api-backend/CLAUDE.md templates/api-backend/README.md templates/api-backend/.claude/
git commit -m "feat: add CLAUDE.md, README, and Claude settings"
```

---

## Task 12: Final Verification

**Step 1: Install dependencies**

```bash
cd templates/api-backend
npm install
```

**Step 2: Run type check**

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass

**Step 4: Build**

```bash
npm run build
```

Expected: Builds successfully to dist/

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address verification issues"
```

---

## Summary

After completing all tasks, the `templates/api-backend/` directory contains:
- Express.js + TypeScript setup
- Firestore database integration
- API key authentication middleware
- Health check and CRUD routes
- Vitest + supertest testing
- GitHub Actions CI/CD
- Cloud Functions deployment
- CLAUDE.md and README documentation
