# Claude Code Templates

A collection of project templates for developing applications with Claude Code. Each template is a complete, working project with tests, CI/CD, and deployment ready.

## Available Templates

### MCP Server (`templates/mcp-server/`)

An MCP (Model Context Protocol) server with OAuth 2.1 authentication running on Google Cloud Functions.

**Tech Stack:** Express.js, TypeScript, Firestore, JWT, Vitest

**Features:**
- OAuth 2.1 authentication flow
- Google sign-in integration
- JWT token management
- Tool registry for MCP tools
- Vitest testing with mocked Firestore

### React Web App (`templates/react-web-app/`)

A React web application with modern tooling and component library.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Radix UI

**Features:**
- 8 UI components (Button, Input, Card, Dialog, Select, Tabs, Toast, Label)
- TanStack Query for data fetching
- React Router for navigation
- Vitest + Playwright testing
- Firebase Hosting deployment

### API Backend (`templates/api-backend/`)

A REST API with Express.js, TypeScript, and Firestore.

**Tech Stack:** Express.js, TypeScript, Firestore, Vitest

**Features:**
- API key authentication
- CRUD operations example
- Health check endpoint
- Vitest + supertest testing
- Google Cloud Functions deployment

## Quick Start

1. **Copy a template**
   ```bash
   cp -r templates/api-backend my-project
   cd my-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Template Structure

Each template includes:
- `CLAUDE.md` - Guidance for Claude Code
- `README.md` - User documentation
- `.claude/settings.local.json` - Claude Code permissions
- `.github/workflows/` - CI/CD pipelines
- `tests/` - Test suites
- `docs/plans/` - Implementation plans (for reference)

## Development Workflow

All templates follow TDD (Test-Driven Development):

1. Write failing test
2. Run test to confirm failure
3. Implement minimal code to pass
4. Refactor while keeping tests green
5. Commit

## License

MIT
