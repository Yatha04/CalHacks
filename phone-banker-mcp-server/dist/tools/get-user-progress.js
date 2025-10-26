"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProgressTool = void 0;
exports.getUserProgress = getUserProgress;
const supabase_client_js_1 = require("../utils/supabase-client.js");
exports.getUserProgressTool = {
    name: "get-user-progress",
    description: "Fetches aggregate statistics and progress for a specific user",
    inputSchema: {
        type: "object",
        properties: {
            userId: {
                type: "string",
                description: "The unique identifier of the user"
            }
        },
        required: ["userId"]
    }
};
async function getUserProgress(args) {
    const { userId } = args;
    // Use the database function to get user progress
    const { data, error } = await supabase_client_js_1.supabase
        .rpc("get_user_progress", { p_user_id: userId });
    if (error) {
        throw new Error(`Failed to fetch user progress: ${error.message}`);
    }
    if (!data || data.length === 0) {
        return `No progress data found for user ${userId}.`;
    }
    const progress = data[0];
    // Fetch additional details about recent sessions
    const { data: recentSessions, error: sessionsError } = await supabase_client_js_1.supabase
        .from("call_sessions")
        .select("voter_profile_id, status, created_at, performance_metrics(overall_score)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
    if (sessionsError) {
        console.warn(`Failed to fetch recent sessions: ${sessionsError.message}`);
    }
    let response = `**User Progress Summary**\n\n`;
    response += `**Total Calls:** ${progress.total_calls}\n`;
    response += `**Easy Calls:** ${progress.easy_calls}\n`;
    response += `**Medium Calls:** ${progress.medium_calls}\n`;
    response += `**Hard Calls:** ${progress.hard_calls}\n`;
    response += `**Average Score:** ${progress.average_score || "N/A"}\n`;
    response += `**Completion Rate:** ${progress.completion_rate || "N/A"}%\n\n`;
    if (recentSessions && recentSessions.length > 0) {
        response += `**Recent Sessions:**\n`;
        recentSessions.forEach((session, index) => {
            const voterProfile = session.voter_profile_id.replace(/^(easy|medium|hard)-/, "").replace(/-/g, " ");
            const difficulty = session.voter_profile_id.startsWith("easy-") ? "Easy" :
                session.voter_profile_id.startsWith("medium-") ? "Medium" : "Hard";
            const date = new Date(session.created_at).toLocaleDateString();
            const score = session.performance_metrics?.[0]?.overall_score || "N/A";
            response += `${index + 1}. **${voterProfile}** (${difficulty}) - ${date} - Score: ${score}\n`;
        });
        response += "\n";
    }
    // Calculate difficulty distribution
    const totalCalls = progress.total_calls;
    if (totalCalls > 0) {
        const easyPercent = Math.round((progress.easy_calls / totalCalls) * 100);
        const mediumPercent = Math.round((progress.medium_calls / totalCalls) * 100);
        const hardPercent = Math.round((progress.hard_calls / totalCalls) * 100);
        response += `**Difficulty Distribution:**\n`;
        response += `- Easy: ${progress.easy_calls} (${easyPercent}%)\n`;
        response += `- Medium: ${progress.medium_calls} (${mediumPercent}%)\n`;
        response += `- Hard: ${progress.hard_calls} (${hardPercent}%)\n\n`;
    }
    if (progress.average_score) {
        let performanceLevel = "Beginner";
        if (progress.average_score >= 80)
            performanceLevel = "Expert";
        else if (progress.average_score >= 70)
            performanceLevel = "Advanced";
        else if (progress.average_score >= 60)
            performanceLevel = "Intermediate";
        response += `**Performance Level:** ${performanceLevel} (${progress.average_score}/100)\n`;
    }
    return response;
}
//# sourceMappingURL=get-user-progress.js.map