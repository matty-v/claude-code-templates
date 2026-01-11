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
