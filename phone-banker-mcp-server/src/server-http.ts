// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { listCallSessionsTool, listCallSessions } from "./tools/list-call-sessions.js";
import { getCallDetailsTool, getCallDetails } from "./tools/get-call-details.js";
import { getCallRecordingTool, getCallRecording } from "./tools/get-call-recording.js";
import { getUserProgressTool, getUserProgress } from "./tools/get-user-progress.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// API Key authentication middleware
function authenticateApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  const apiKey = req.headers.authorization?.replace("Bearer ", "");
  const expectedApiKey = process.env.MCP_API_KEY;
  
  if (!expectedApiKey) {
    return res.status(500).json({ error: "Server not configured with API key" });
  }
  
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  
  next();
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Debug endpoint to check if MCP_API_KEY is set (DO NOT expose in production)
app.get("/debug/auth", (req, res) => {
  const hasApiKey = !!process.env.MCP_API_KEY;
  const apiKeyLength = process.env.MCP_API_KEY?.length || 0;
  const apiKeyPrefix = process.env.MCP_API_KEY?.substring(0, 8) || "not-set";
  
  res.json({
    hasApiKey,
    apiKeyLength,
    apiKeyPrefix: apiKeyPrefix + "...",
    message: "Check if this matches what you're sending"
  });
});

// MCP Server setup
const server = new Server(
  {
    name: "grassroots-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      listCallSessionsTool,
      getCallDetailsTool,
      getCallRecordingTool,
      getUserProgressTool,
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list-call-sessions":
        return {
          content: [
            {
              type: "text",
              text: await listCallSessions(args as any),
            },
          ],
        };

      case "get-call-details":
        return {
          content: [
            {
              type: "text",
              text: await getCallDetails(args as any),
            },
          ],
        };

      case "get-call-recording":
        return {
          content: [
            {
              type: "text",
              text: await getCallRecording(args as any),
            },
          ],
        };

      case "get-user-progress":
        return {
          content: [
            {
              type: "text",
              text: await getUserProgress(args as any),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// OPTIONS endpoint for CORS preflight
app.options("/sse", (req, res) => {
  res.status(200).end();
});

// SSE endpoint for MCP
app.get("/sse", async (req, res) => {
  // Check for API key in Authorization header or query parameter
  const authHeader = req.headers.authorization?.replace("Bearer ", "");
  const queryApiKey = req.query.apiKey as string;
  const apiKey = authHeader || queryApiKey;
  const expectedApiKey = process.env.MCP_API_KEY;
  
  // If MCP_API_KEY is configured, validate it
  if (expectedApiKey && apiKey !== expectedApiKey) {
    console.log("SSE connection rejected: Invalid or missing API key");
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  
  console.log("New SSE connection established");
  
  const transport = new SSEServerTransport("/sse", res);
  await server.connect(transport);
  
  // Handle client disconnect
  req.on("close", () => {
    console.log("SSE connection closed");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Grassroots MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  process.exit(0);
});
