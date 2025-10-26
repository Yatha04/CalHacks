# Phone Banking MCP Server

An MCP (Model Context Protocol) server that exposes phone banking training call recordings and transcripts to Poke/Claude for AI-powered critiques.

## Features

- **List Call Sessions**: Get recent training calls with metadata
- **Get Call Details**: Fetch complete transcripts and performance metrics
- **Get Call Recordings**: Retrieve Vapi recording URLs for audio analysis
- **Get User Progress**: View aggregate statistics and progress tracking

## Quick Start

### 1. Environment Setup

Copy the environment template:
```bash
cp env.example .env
```

Fill in your environment variables:
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Vapi API Configuration  
VAPI_API_KEY=your_vapi_server_api_key_here

# MCP Server Configuration
MCP_API_KEY=your_secure_api_key_for_poke_authentication
PORT=8080
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development

```bash
npm run dev
```

Server will start at `http://localhost:8080`

### 4. Production Build

```bash
npm run build
npm start
```

## Deployment to Google Cloud Run

### Prerequisites

1. Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. Authenticate: `gcloud auth login`
3. Set project: `gcloud config set project YOUR_PROJECT_ID`

### Deploy

```bash
./deploy.sh
```

Or manually:
```bash
gcloud run deploy phone-banker-mcp \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SUPABASE_URL="$SUPABASE_URL" \
  --set-env-vars SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  --set-env-vars VAPI_API_KEY="$VAPI_API_KEY" \
  --set-env-vars MCP_API_KEY="$MCP_API_KEY"
```

## Poke Configuration

Add to your Poke configuration:

```json
{
  "mcpServers": {
    "phone-banking": {
      "url": "https://phone-banker-mcp-xxxxx.run.app",
      "apiKey": "your-mcp-api-key",
      "transport": "sse"
    }
  }
}
```

## API Endpoints

- `GET /health` - Health check
- `GET /sse` - MCP SSE endpoint (requires API key)

## MCP Tools

### `list-call-sessions`
Fetches recent call sessions with optional filtering.

**Parameters:**
- `userId` (optional): Filter by user
- `limit` (optional): Max sessions to return (default: 10)
- `status` (optional): Filter by status

### `get-call-details`
Gets complete details for a specific call session.

**Parameters:**
- `sessionId` (required): Session ID

### `get-call-recording`
Retrieves Vapi recording URL for a session.

**Parameters:**
- `sessionId` (required): Session ID

### `get-user-progress`
Fetches aggregate statistics for a user.

**Parameters:**
- `userId` (required): User ID

## Usage Examples

Once configured in Poke, you can ask Claude:

- "Show me my recent phone banking training calls"
- "Get the details for my last call with Sarah Johnson"
- "Analyze the recording from my most recent training session"
- "What's my progress in phone banking training?"

## Architecture

```
Poke/Claude <---> MCP Server <---> Supabase Database
                      |
                      v
                 Vapi API (for recordings)
```

## Development

### Project Structure

```
src/
├── server-http.ts          # Main HTTP server
├── tools/                  # MCP tool implementations
│   ├── list-call-sessions.ts
│   ├── get-call-details.ts
│   ├── get-call-recording.ts
│   └── get-user-progress.ts
└── utils/                  # Utility modules
    ├── supabase-client.ts
    └── vapi-client.ts
```

### Adding New Tools

1. Create tool file in `src/tools/`
2. Export tool schema and handler function
3. Register in `server-http.ts`
4. Add to `ListToolsRequestSchema` handler

## Troubleshooting

### Common Issues

1. **"Missing Supabase configuration"**
   - Check your environment variables
   - Ensure Supabase project is set up correctly

2. **"Vapi call not found"**
   - Recording may not be ready yet (5-10 min delay)
   - Check Vapi call ID is stored correctly

3. **"Invalid API key"**
   - Verify MCP_API_KEY matches in Poke configuration
   - Check authorization header format

### Logs

View Cloud Run logs:
```bash
gcloud logs read --service=phone-banker-mcp --limit=50
```

## License

MIT
