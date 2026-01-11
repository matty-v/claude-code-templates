# MCP Server Template Design

## Overview

A template for building MCP (Model Context Protocol) servers that run on Google Cloud Functions with OAuth 2.1 authentication and Firestore state persistence.

## Key Decisions

| Aspect | Decision |
|--------|----------|
| Auth | OAuth 2.1 + Google login + Firestore state |
| Deployment | Google Cloud Functions (Node 20, ESM) |
| Testing | Vitest with mocked Firestore |
| CI/CD | GitHub Actions - tests on PR, deploy on merge to main |
| Structure | Standalone `templates/mcp-server/` directory |
| Claude Context | CLAUDE.md + .claude/ + docs/plans/ |
| Workflow | TDD guidance baked into CLAUDE.md |
| GCP Auth | Workload Identity Federation (no JSON keys) |

## Directory Structure

```
templates/mcp-server/
├── .claude/
│   └── settings.local.json      # Allowed commands, preferences
├── .github/
│   └── workflows/
│       ├── ci.yml               # Tests + type-check on PR
│       └── deploy.yml           # Deploy to GCP on merge to main
├── docs/
│   └── plans/                   # Design documents go here
├── src/
│   ├── index.ts                 # Express app, Cloud Functions export
│   ├── config.ts                # Environment validation
│   ├── auth/
│   │   ├── index.ts             # Re-exports
│   │   ├── state.ts             # Firestore auth state
│   │   ├── middleware.ts        # JWT verification
│   │   └── oauth.ts             # OAuth 2.1 routes
│   └── mcp/
│       ├── index.ts             # Re-exports
│       ├── handler.ts           # JSON-RPC dispatcher
│       ├── types.ts             # MCP types
│       └── tools/
│           └── index.ts         # Tool registry (user adds tools here)
├── tests/
│   ├── setup.ts                 # Vitest setup, mocks
│   ├── auth/
│   │   ├── oauth.test.ts
│   │   └── middleware.test.ts
│   └── mcp/
│       ├── handler.test.ts
│       └── tools/
│           └── example.test.ts
├── CLAUDE.md                    # Claude Code context
├── deploy.sh                    # GCP deployment script
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── .env.example
└── README.md                    # Setup instructions
```

## CLAUDE.md Content

The CLAUDE.md will include:

1. **Build and Development Commands** - npm scripts, deploy command
2. **Architecture Overview** - MCP server structure, auth flow, Firestore usage
3. **Firestore Collections** - Table of collections with purpose and TTL
4. **Environment Variables** - Required env vars with descriptions
5. **Adding New Tools** - Instructions and example structure
6. **Development Workflow (TDD)** - Write test first, implement, refactor
7. **Testing** - How to run tests, coverage requirements
8. **PR Conventions** - Title format, test requirements

## GitHub Actions Workflows

### CI Workflow (ci.yml)

Triggers on pull requests:
- Checkout code
- Setup Node 20
- Install dependencies (npm ci)
- Type check (tsc --noEmit)
- Run tests (npm test)

### Deploy Workflow (deploy.yml)

Triggers on push to main:
- Checkout code
- Authenticate to GCP via Workload Identity Federation
- Setup Node 20
- Install + Build
- Run tests (safety check)
- Deploy via gcloud functions deploy

## Dependencies

### Production
- `@google-cloud/functions-framework` - Cloud Functions runtime
- `@google-cloud/firestore` - Auth state persistence
- `express` - HTTP routing
- `jsonwebtoken` - JWT token handling
- `google-auth-library` - Google OAuth
- `uuid` - State/code generation

### Development
- `typescript` - Type checking
- `tsx` - Dev server with watch
- `vitest` - Testing framework
- `@types/*` - Type definitions

## Test Structure

Tests use Vitest with mocked Firestore so they run without GCP credentials.

Example test demonstrating TDD pattern:
```typescript
describe('example_tool', () => {
  it('returns expected result for valid input', async () => {
    const result = await handleTool('example_tool', { param: 'value' })
    expect(result).toEqual({ success: true, data: 'expected' })
  })

  it('throws for missing required param', async () => {
    await expect(handleTool('example_tool', {}))
      .rejects.toThrow('param is required')
  })
})
```

## What Users Customize

After cloning the template:
1. Add their own tools in `src/mcp/tools/`
2. Set environment variables (Google OAuth credentials, project ID, etc.)
3. Configure GCP project and Workload Identity Federation
4. Update README with project-specific details

## References

Based on patterns from existing MCP servers:
- google-drive-mcp (OAuth + Firestore pattern)
- github-mcp (Cloud Functions deployment)
- google-sheets-mcp (MCP handler structure)
