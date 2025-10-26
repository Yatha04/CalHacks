"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallRecordingTool = void 0;
exports.getCallRecording = getCallRecording;
const supabase_client_js_1 = require("../utils/supabase-client.js");
const vapi_client_js_1 = require("../utils/vapi-client.js");
exports.getCallRecordingTool = {
    name: "get-call-recording",
    description: "Retrieves the recording URL for a specific call session from Vapi",
    inputSchema: {
        type: "object",
        properties: {
            sessionId: {
                type: "string",
                description: "The unique identifier of the call session"
            }
        },
        required: ["sessionId"]
    }
};
async function getCallRecording(args) {
    const { sessionId } = args;
    // First, check if we already have the recording URL cached
    const { data: sessionData, error: sessionError } = await supabase_client_js_1.supabase
        .from("call_sessions")
        .select("vapi_call_id, recording_url, recording_fetched_at")
        .eq("id", sessionId)
        .single();
    if (sessionError) {
        throw new Error(`Failed to fetch call session: ${sessionError.message}`);
    }
    if (!sessionData) {
        return `Call session ${sessionId} not found.`;
    }
    const session = sessionData;
    // If we already have a cached recording URL, return it
    if (session.recording_url) {
        const fetchedAt = session.recording_fetched_at ? new Date(session.recording_fetched_at).toLocaleString() : "Unknown";
        return `**Recording URL (Cached):**\n${session.recording_url}\n\n**Cached at:** ${fetchedAt}\n\n*Note: This URL may expire. If it doesn't work, try fetching a fresh URL.*`;
    }
    // If no Vapi call ID, we can't get the recording
    if (!session.vapi_call_id) {
        return `No Vapi call ID found for session ${sessionId}. Recording not available.`;
    }
    try {
        // Fetch recording URL from Vapi API
        const vapiClient = (0, vapi_client_js_1.createVapiClient)();
        const recordingUrl = await vapiClient.getRecordingUrl(session.vapi_call_id);
        if (!recordingUrl) {
            return `Recording not yet available for session ${sessionId}. Vapi recordings are typically available 5-10 minutes after the call ends.`;
        }
        // Cache the recording URL in the database
        const { error: updateError } = await supabase_client_js_1.supabase
            .from("call_sessions")
            .update({
            recording_url: recordingUrl,
            recording_fetched_at: new Date().toISOString()
        })
            .eq("id", sessionId);
        if (updateError) {
            console.warn(`Failed to cache recording URL: ${updateError.message}`);
        }
        return `**Recording URL (Fresh):**\n${recordingUrl}\n\n**Fetched at:** ${new Date().toLocaleString()}\n\n*Note: This URL has been cached for future use.*`;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return `Failed to fetch recording for session ${sessionId}: ${errorMessage}`;
    }
}
//# sourceMappingURL=get-call-recording.js.map