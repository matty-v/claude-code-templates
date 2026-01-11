#!/bin/bash
set -e

# Check required env vars
if [ -z "$GCP_PROJECT" ]; then
  echo "Error: GCP_PROJECT environment variable is required"
  exit 1
fi

FUNCTION_NAME="${FUNCTION_NAME:-mcp-server}"
REGION="${REGION:-us-central1}"

echo "Building..."
npm run build

echo "Deploying to Cloud Functions..."
gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=nodejs20 \
  --region="$REGION" \
  --source=. \
  --entry-point=mcpServer \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="BASE_URL=https://$REGION-$GCP_PROJECT.cloudfunctions.net/$FUNCTION_NAME" \
  --project="$GCP_PROJECT"

echo ""
echo "Deployed successfully!"
echo "URL: https://$REGION-$GCP_PROJECT.cloudfunctions.net/$FUNCTION_NAME"
