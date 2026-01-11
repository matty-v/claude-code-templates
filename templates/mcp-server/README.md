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
