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
