# Phone Banking MCP Server Integration - Progress Log

## Session Started: 2025-10-25

### Overview
Building an MCP server to expose phone banking call recordings and transcripts to Poke/Claude for AI-powered critiques.

---

## Progress Tracking

### ✅ Phase 1: Database Schema Updates
- [ ] Update DATABASE_SCHEMA.sql with recording_url columns
- [ ] Add helper functions to lib/supabase.ts

### ⏳ Phase 2: Next.js App Updates  
- [ ] Update CallInterface.tsx to capture Vapi call IDs
- [ ] Modify app/practice/page.tsx to save call sessions
- [ ] Update lib/vapi.ts if needed

### ⏳ Phase 3: MCP Server Foundation
- [ ] Create phone-banker-mcp-server directory structure
- [ ] Set up package.json with dependencies
- [ ] Create TypeScript configuration
- [ ] Set up .env.example

### ⏳ Phase 4: MCP Server Core
- [ ] Implement Supabase client utility
- [ ] Implement Vapi API client utility
- [ ] Create HTTP/SSE server foundation

### ⏳ Phase 5: MCP Tools Implementation
- [ ] Implement list-call-sessions tool
- [ ] Implement get-call-details tool
- [ ] Implement get-call-recording tool
- [ ] Implement get-user-progress tool

### ⏳ Phase 6: Deployment Setup
- [ ] Create Dockerfile
- [ ] Create deployment scripts
- [ ] Create deployment documentation

---

## Detailed Changes Log

### ✅ Phase 1: Database Schema Updates - COMPLETED
- **Updated DATABASE_SCHEMA.sql**: Added `recording_url` and `recording_fetched_at` columns to `call_sessions` table
- **Updated lib/supabase.ts**: Added `updateCallRecordingUrl()` helper function to cache recording URLs

### ✅ Phase 2: Next.js App Updates - COMPLETED  
- **Updated CallInterface.tsx**: 
  - Modified interface to pass `vapiCallId` to parent
  - Added `vapiCallIdRef` to capture call ID from Vapi events
  - Updated `call-start` event handler to capture Vapi call ID
  - Modified `onCallEnd` callback to include Vapi call ID
- **Updated app/practice/page.tsx**: Modified `handleCallEnd` to accept and handle Vapi call ID parameter

### ✅ Phase 3: MCP Server Foundation - COMPLETED
- **Created phone-banker-mcp-server/ directory structure**
- **Created package.json**: Dependencies for MCP SDK, Express, Supabase, Vapi client
- **Created tsconfig.json**: TypeScript configuration for Node.js
- **Created env.example**: Environment variable template

### ✅ Phase 4: MCP Server Core - COMPLETED
- **Created src/utils/supabase-client.ts**: Database access utilities with TypeScript interfaces
- **Created src/utils/vapi-client.ts**: Vapi API client for fetching recording URLs
- **Created src/server-http.ts**: Main HTTP/SSE server with MCP protocol implementation

### ✅ Phase 5: MCP Tools Implementation - COMPLETED
- **Created src/tools/list-call-sessions.ts**: Lists recent call sessions with filtering
- **Created src/tools/get-call-details.ts**: Fetches complete session details and performance metrics
- **Created src/tools/get-call-recording.ts**: Retrieves Vapi recording URLs with caching
- **Created src/tools/get-user-progress.ts**: Aggregates user statistics and progress

### ✅ Phase 6: Deployment Setup - COMPLETED
- **Created Dockerfile**: Multi-stage build for Cloud Run deployment
- **Created deploy.sh**: Automated deployment script for Google Cloud Run
- **Created README.md**: Comprehensive documentation and usage guide

## Files Modified

### phone-banker-training/
- `DATABASE_SCHEMA.sql` - Added recording URL columns
- `lib/supabase.ts` - Added recording URL helper function
- `components/CallInterface.tsx` - Capture Vapi call IDs
- `app/practice/page.tsx` - Handle Vapi call IDs

## Files Created

### phone-banker-mcp-server/
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `env.example` - Environment template
- `src/server-http.ts` - Main MCP server
- `src/utils/supabase-client.ts` - Database utilities
- `src/utils/vapi-client.ts` - Vapi API client
- `src/tools/list-call-sessions.ts` - List sessions tool
- `src/tools/get-call-details.ts` - Get details tool
- `src/tools/get-call-recording.ts` - Get recording tool
- `src/tools/get-user-progress.ts` - Get progress tool
- `Dockerfile` - Cloud Run deployment
- `deploy.sh` - Deployment script
- `README.md` - Documentation

## Next Steps

1. **Install MCP server dependencies**: `cd phone-banker-mcp-server && npm install`
2. **Configure environment variables**: Copy `env.example` to `.env` and fill in values
3. **Test locally**: `npm run dev` to test MCP server
4. **Deploy to Cloud Run**: Run `./deploy.sh` script
5. **Configure Poke**: Add MCP server URL and API key to Poke configuration
6. **Test integration**: Use Poke to access phone banking data and recordings


