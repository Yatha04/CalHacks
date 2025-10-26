"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallDetailsTool = void 0;
exports.getCallDetails = getCallDetails;
const supabase_client_js_1 = require("../utils/supabase-client.js");
exports.getCallDetailsTool = {
    name: "get-call-details",
    description: "Fetches complete details for a specific call session including transcript and performance metrics",
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
async function getCallDetails(args) {
    const { sessionId } = args;
    // Fetch call session details
    const { data: sessionData, error: sessionError } = await supabase_client_js_1.supabase
        .from("call_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
    if (sessionError) {
        throw new Error(`Failed to fetch call session: ${sessionError.message}`);
    }
    if (!sessionData) {
        return `Call session ${sessionId} not found.`;
    }
    const session = sessionData;
    // Fetch performance metrics if available
    const { data: metricsData, error: metricsError } = await supabase_client_js_1.supabase
        .from("performance_metrics")
        .select("*")
        .eq("session_id", sessionId)
        .single();
    const metrics = metricsData;
    // Format the response
    const startTime = new Date(session.start_time).toLocaleString();
    const endTime = session.end_time ? new Date(session.end_time).toLocaleString() : "N/A";
    const duration = session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : "N/A";
    const voterProfile = session.voter_profile_id.replace(/^(easy|medium|hard)-/, "").replace(/-/g, " ");
    let response = `**Call Session Details**\n\n`;
    response += `**Session ID:** ${session.id}\n`;
    response += `**Voter Profile:** ${voterProfile} (${session.voter_profile_id})\n`;
    response += `**User ID:** ${session.user_id}\n`;
    response += `**Start Time:** ${startTime}\n`;
    response += `**End Time:** ${endTime}\n`;
    response += `**Duration:** ${duration}\n`;
    response += `**Status:** ${session.status}\n`;
    response += `**Vapi Call ID:** ${session.vapi_call_id || "N/A"}\n`;
    response += `**Recording URL:** ${session.recording_url || "Not available"}\n\n`;
    if (session.transcript) {
        response += `**Transcript:**\n${session.transcript}\n\n`;
    }
    else {
        response += `**Transcript:** Not available\n\n`;
    }
    if (metrics) {
        response += `**Performance Metrics:**\n`;
        response += `- Confidence: ${metrics.confidence}/100\n`;
        response += `- Enthusiasm: ${metrics.enthusiasm}/100\n`;
        response += `- Clarity: ${metrics.clarity}/100\n`;
        response += `- Persuasiveness: ${metrics.persuasiveness}/100\n`;
        response += `- Empathy: ${metrics.empathy}/100\n`;
        response += `- Overall Score: ${metrics.overall_score}/100\n`;
        response += `- Sentiment: ${metrics.sentiment}\n\n`;
        if (metrics.strengths && metrics.strengths.length > 0) {
            response += `**Strengths:**\n${metrics.strengths.map(s => `- ${s}`).join("\n")}\n\n`;
        }
        if (metrics.areas_for_improvement && metrics.areas_for_improvement.length > 0) {
            response += `**Areas for Improvement:**\n${metrics.areas_for_improvement.map(a => `- ${a}`).join("\n")}\n\n`;
        }
        if (metrics.key_moments && metrics.key_moments.length > 0) {
            response += `**Key Moments:**\n${metrics.key_moments.map((km) => `- ${km.timestamp}s: ${km.description} (${km.type})`).join("\n")}\n\n`;
        }
    }
    else {
        response += `**Performance Metrics:** Not available\n\n`;
    }
    return response;
}
//# sourceMappingURL=get-call-details.js.map