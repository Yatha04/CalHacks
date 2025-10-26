"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VapiClient = void 0;
exports.createVapiClient = createVapiClient;
const node_fetch_1 = __importDefault(require("node-fetch"));
class VapiClient {
    constructor(apiKey) {
        this.baseUrl = "https://api.vapi.ai";
        this.apiKey = apiKey;
    }
    async getCallDetails(callId) {
        const response = await (0, node_fetch_1.default)(`${this.baseUrl}/call/${callId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Call ${callId} not found`);
            }
            throw new Error(`Failed to fetch call details: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    async getRecordingUrl(callId) {
        try {
            const callDetails = await this.getCallDetails(callId);
            if (callDetails.recording?.url) {
                return callDetails.recording.url;
            }
            return null;
        }
        catch (error) {
            console.error(`Error fetching recording for call ${callId}:`, error);
            return null;
        }
    }
}
exports.VapiClient = VapiClient;
function createVapiClient() {
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) {
        throw new Error("VAPI_API_KEY environment variable is required");
    }
    return new VapiClient(apiKey);
}
//# sourceMappingURL=vapi-client.js.map