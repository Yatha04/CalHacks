import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { supabase, CallSession } from "../utils/supabase-client.js";

export const listCallSessionsTool: Tool = {
  name: "list-call-sessions",
  description: "Fetches recent call sessions from the phone banking training database",
  inputSchema: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "User ID to filter sessions (optional)"
      },
      limit: {
        type: "number",
        description: "Maximum number of sessions to return (default: 10)",
        default: 10
      },
      status: {
        type: "string",
        description: "Filter by session status: 'in-progress', 'completed', or 'abandoned' (optional)",
        enum: ["in-progress", "completed", "abandoned"]
      }
    }
  }
};

export async function listCallSessions(args: {
  userId?: string;
  limit?: number;
  status?: string;
}): Promise<string> {
  const { userId, limit = 10, status } = args;

  let query = supabase
    .from("call_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch call sessions: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return "No call sessions found matching the criteria.";
  }

  const sessions = data as CallSession[];
  
  const formattedSessions = sessions.map((session, index) => {
    const startTime = new Date(session.start_time).toLocaleString();
    const duration = session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : "N/A";
    const voterProfile = session.voter_profile_id.replace(/^(easy|medium|hard)-/, "").replace(/-/g, " ");
    
    return `${index + 1}. **${voterProfile}** (${session.voter_profile_id})
   - Session ID: ${session.id}
   - Date: ${startTime}
   - Duration: ${duration}
   - Status: ${session.status}
   - Vapi Call ID: ${session.vapi_call_id || "N/A"}
   - Recording: ${session.recording_url ? "Available" : "Not available"}`;
  }).join("\n\n");

  return `**Recent Call Sessions** (${sessions.length} found):\n\n${formattedSessions}`;
}
