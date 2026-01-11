# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Repository Overview

This repository contains project templates for developing different types of applications with Claude Code. Each template is a standalone, working project.

## Available Templates

| Template | Path | Purpose |
|----------|------|---------|
| MCP Server | `templates/mcp-server/` | OAuth 2.1 MCP server on Cloud Functions |
| React Web App | `templates/react-web-app/` | React + Tailwind + Radix UI web app |
| API Backend | `templates/api-backend/` | Express.js REST API on Cloud Functions |

## Working With Templates

When working within a specific template, refer to its local `CLAUDE.md`:
- `templates/mcp-server/CLAUDE.md`
- `templates/react-web-app/CLAUDE.md`
- `templates/api-backend/CLAUDE.md`

## Common Commands

All templates use similar npm scripts:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run typecheck    # TypeScript type check
```

## Development Workflow

All templates follow TDD (Test-Driven Development):

1. Write failing test first
2. Run test to confirm failure
3. Implement minimal code to pass
4. Refactor while keeping tests green
5. Commit with descriptive message

## Design and Implementation Plans

Implementation plans are stored in `docs/plans/`:
- Design documents: `YYYY-MM-DD-<feature>-design.md`
- Implementation plans: `YYYY-MM-DD-<feature>-impl.md`

Each template also has a local `docs/plans/` directory.

## Adding New Templates

When creating a new template:

1. Create directory in `templates/<template-name>/`
2. Include standard files:
   - `CLAUDE.md` (template-specific guidance)
   - `README.md` (user documentation)
   - `.claude/settings.local.json` (permissions)
   - `.github/workflows/` (CI/CD)
   - `tests/` (test suite)
3. Follow TDD workflow
4. Ensure all tests pass before committing
