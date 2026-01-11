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
