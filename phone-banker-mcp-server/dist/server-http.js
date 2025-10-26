"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables FIRST
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const list_call_sessions_js_1 = require("./tools/list-call-sessions.js");
const get_call_details_js_1 = require("./tools/get-call-details.js");
const get_call_recording_js_1 = require("./tools/get-call-recording.js");
const get_user_progress_js_1 = require("./tools/get-user-progress.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Key authentication middleware
function authenticateApiKey(req, res, next) {
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
const server = new index_js_1.Server({
    name: "grassroots-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Register tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            list_call_sessions_js_1.listCallSessionsTool,
            get_call_details_js_1.getCallDetailsTool,
            get_call_recording_js_1.getCallRecordingTool,
            get_user_progress_js_1.getUserProgressTool,
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "list-call-sessions":
                return {
                    content: [
                        {
                            type: "text",
                            text: await (0, list_call_sessions_js_1.listCallSessions)(args),
                        },
                    ],
                };
            case "get-call-details":
                return {
                    content: [
                        {
                            type: "text",
                            text: await (0, get_call_details_js_1.getCallDetails)(args),
                        },
                    ],
                };
            case "get-call-recording":
                return {
                    content: [
                        {
                            type: "text",
                            text: await (0, get_call_recording_js_1.getCallRecording)(args),
                        },
                    ],
                };
            case "get-user-progress":
                return {
                    content: [
                        {
                            type: "text",
                            text: await (0, get_user_progress_js_1.getUserProgress)(args),
                        },
                    ],
                };
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
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
    const queryApiKey = req.query.apiKey;
    const apiKey = authHeader || queryApiKey;
    const expectedApiKey = process.env.MCP_API_KEY;
    // If MCP_API_KEY is configured, validate it
    if (expectedApiKey && apiKey !== expectedApiKey) {
        console.log("SSE connection rejected: Invalid or missing API key");
        return res.status(401).json({ error: "Invalid or missing API key" });
    }
    console.log("New SSE connection established");
    const transport = new sse_js_1.SSEServerTransport("/sse", res);
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
//# sourceMappingURL=server-http.js.map