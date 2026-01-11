# API/Backend Template Design

## Overview

A template for building REST APIs with Express.js, TypeScript, Firestore, and Google Cloud Functions deployment.

## Key Decisions

| Aspect | Decision |
|--------|----------|
| Framework | Express.js + TypeScript (ESM) |
| Database | Firestore |
| Auth | API Key (X-API-Key header) |
| Deployment | Google Cloud Functions Gen 2 |
| Testing | Vitest + supertest |
| CI/CD | GitHub Actions |
| Example | Full CRUD on /items resource |

## Directory Structure

```
templates/api-backend/
├── .claude/
│   └── settings.local.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
│   └── plans/
├── src/
│   ├── index.ts              # Express app, Cloud Functions export
│   ├── config.ts             # Environment validation
│   ├── middleware/
│   │   ├── index.ts          # Re-exports
│   │   ├── auth.ts           # API key validation
│   │   └── error.ts          # Error handling middleware
│   ├── routes/
│   │   ├── index.ts          # Route registry
│   │   ├── health.ts         # GET /health
│   │   └── items.ts          # CRUD /items
│   └── services/
│       ├── index.ts          # Re-exports
│       └── firestore.ts      # Firestore client + helpers
├── tests/
│   ├── setup.ts              # Test setup, mocks
│   ├── routes/
│   │   └── items.test.ts     # Items route tests
│   └── middleware/
│       └── auth.test.ts      # Auth middleware tests
├── CLAUDE.md
├── README.md
├── deploy.sh
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
└── .env.example
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| GET | /items | Yes | List all items |
| GET | /items/:id | Yes | Get item by ID |
| POST | /items | Yes | Create item |
| PUT | /items/:id | Yes | Update item |
| DELETE | /items/:id | Yes | Delete item |

## Authentication

API Key authentication via `X-API-Key` header:
- Validated against `API_KEY` environment variable
- All routes except /health require authentication
- Returns 401 Unauthorized if missing/invalid

```typescript
// middleware/auth.ts
export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== config.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}
```

## Firestore Integration

```typescript
// services/firestore.ts
import { Firestore } from '@google-cloud/firestore'

const db = new Firestore()

export async function getAll<T>(collection: string): Promise<T[]> {
  const snapshot = await db.collection(collection).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
}

export async function getById<T>(collection: string, id: string): Promise<T | null> {
  const doc = await db.collection(collection).doc(id).get()
  return doc.exists ? { id: doc.id, ...doc.data() } as T : null
}

export async function create<T>(collection: string, data: Omit<T, 'id'>): Promise<T> {
  const docRef = await db.collection(collection).add(data)
  return { id: docRef.id, ...data } as T
}

export async function update<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
  await db.collection(collection).doc(id).update(data)
}

export async function remove(collection: string, id: string): Promise<void> {
  await db.collection(collection).doc(id).delete()
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| API_KEY | Secret key for API authentication |
| GCP_PROJECT | Google Cloud project ID |
| PORT | Local dev server port (default 8080) |

## Testing

Vitest with supertest for HTTP testing:

```typescript
// tests/routes/items.test.ts
import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../src/index'

describe('GET /items', () => {
  it('returns 401 without API key', async () => {
    const res = await request(app).get('/items')
    expect(res.status).toBe(401)
  })

  it('returns items with valid API key', async () => {
    const res = await request(app)
      .get('/items')
      .set('X-API-Key', 'test-key')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
```

## GitHub Actions

### CI Workflow
- Triggers on PR and push to main
- Steps: checkout, setup Node 20, install, typecheck, test

### Deploy Workflow
- Triggers on push to main
- Authenticates via Workload Identity Federation
- Deploys to Cloud Functions Gen 2

## npm Scripts

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit",
  "deploy": "./deploy.sh"
}
```

## References

Based on patterns from:
- sheets-db-api (Express + Firestore + Cloud Functions)
- github-mcp (TypeScript ESM structure)
- mcp-server template (testing patterns)
