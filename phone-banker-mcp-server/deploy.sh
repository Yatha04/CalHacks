#!/bin/bash

# Phone Banking MCP Server Deployment Script
# Deploys to Google Cloud Run

set -e

echo "🚀 Deploying Phone Banking MCP Server to Google Cloud Run..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with gcloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

# Set default project if not set
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "⚠️  GOOGLE_CLOUD_PROJECT not set. Using default project."
    GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
    if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
        echo "❌ No default project set. Please run:"
        echo "   gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
fi

echo "📦 Building and deploying to project: $GOOGLE_CLOUD_PROJECT"

# Deploy to Cloud Run
gcloud run deploy phone-banker-mcp \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SUPABASE_URL="$SUPABASE_URL" \
  --set-env-vars SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  --set-env-vars VAPI_API_KEY="$VAPI_API_KEY" \
  --set-env-vars MCP_API_KEY="$MCP_API_KEY" \
  --set-env-vars PORT=8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 300

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your MCP server is now available at:"
gcloud run services describe phone-banker-mcp --region us-central1 --format="value(status.url)"

echo ""
echo "📋 Next steps:"
echo "1. Test the health endpoint: curl \$(gcloud run services describe phone-banker-mcp --region us-central1 --format='value(status.url)')/health"
echo "2. Configure Poke with the SSE endpoint URL and your MCP_API_KEY"
echo "3. Start using the MCP tools in Poke!"
