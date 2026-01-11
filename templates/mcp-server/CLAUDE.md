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
