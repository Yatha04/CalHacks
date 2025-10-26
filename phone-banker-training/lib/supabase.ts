// Supabase client configuration

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Database features will be disabled.");
}

// Only create client if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper functions

/**
 * Ensure user profile exists in the database
 * This is a safety check to prevent foreign key constraint errors
 */
export async function ensureUserProfile(userId: string, email?: string, name?: string) {
  if (!supabase) {
    console.warn("Supabase not configured. User profile check skipped.");
    return false;
  }

  try {
    // First check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingUser) {
      console.log("✅ User profile already exists");
      return true;
    }

    // User doesn't exist, create it
    console.log("Creating user profile...");
    const { error } = await supabase
      .from("users")
      .upsert({
        id: userId,
        email: email,
        name: name,
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error("Error ensuring user profile:", error);
      return false;
    }

    console.log("✅ User profile created/updated successfully");
    return true;
  } catch (error) {
    console.error("Exception ensuring user profile:", error);
    return false;
  }
}

export async function saveCallSession(session: {
  userId: string;
  voterProfileId: string;
  startTime: Date;
  vapiCallId?: string;
}) {
  if (!supabase) {
    console.warn("Supabase not configured. Call session not saved.");
    throw new Error("Supabase not configured");
  }

  console.log("📝 Inserting call session:", {
    userId: session.userId,
    voterProfileId: session.voterProfileId,
    vapiCallId: session.vapiCallId,
  });

  const { data, error } = await supabase
    .from("call_sessions")
    .insert({
      user_id: session.userId,
      voter_profile_id: session.voterProfileId,
      start_time: session.startTime.toISOString(),
      vapi_call_id: session.vapiCallId,
      status: "in-progress",
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to save call session:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
  
  console.log("✅ Call session saved successfully:", data.id);
  return data;
}

export async function updateCallSession(
  sessionId: string,
  updates: {
    endTime?: Date;
    duration?: number;
    transcript?: string;
    status?: "completed" | "abandoned";
  }
) {
  if (!supabase) {
    console.warn("Supabase not configured. Call session not updated.");
    throw new Error("Supabase not configured");
  }

  console.log("📝 Updating call session:", sessionId);

  const { data, error } = await supabase
    .from("call_sessions")
    .update({
      end_time: updates.endTime?.toISOString(),
      duration: updates.duration,
      transcript: updates.transcript,
      status: updates.status,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to update call session:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
  
  console.log("✅ Call session updated successfully");
  return data;
}

export async function updateCallRecordingUrl(sessionId: string, recordingUrl: string) {
  if (!supabase) {
    console.warn("Supabase not configured. Recording URL not updated.");
    return null;
  }

  const { data, error } = await supabase
    .from("call_sessions")
    .update({
      recording_url: recordingUrl,
      recording_fetched_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function savePerformanceMetrics(metrics: {
  sessionId: string;
  confidence: number;
  enthusiasm: number;
  clarity: number;
  persuasiveness: number;
  empathy: number;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  keyMoments: unknown[];
  sentiment: string;
}) {
  if (!supabase) {
    console.warn("Supabase not configured. Performance metrics not saved.");
    throw new Error("Supabase not configured");
  }

  console.log("📝 Inserting performance metrics for session:", metrics.sessionId);

  const { data, error } = await supabase
    .from("performance_metrics")
    .insert({
      session_id: metrics.sessionId,
      confidence: metrics.confidence,
      enthusiasm: metrics.enthusiasm,
      clarity: metrics.clarity,
      persuasiveness: metrics.persuasiveness,
      empathy: metrics.empathy,
      overall_score: metrics.overallScore,
      strengths: metrics.strengths,
      areas_for_improvement: metrics.areasForImprovement,
      key_moments: metrics.keyMoments,
      sentiment: metrics.sentiment,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to save performance metrics:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
  
  console.log("✅ Performance metrics saved successfully");
  return data;
}

export async function getUserProgress(userId: string) {
  if (!supabase) {
    console.warn("Supabase not configured. User progress not retrieved.");
    return [];
  }

  const { data, error } = await supabase
    .from("call_sessions")
    .select("*, performance_metrics(*)")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (error) throw error;
  return data;
}

export async function getUserStats(userId: string) {
  if (!supabase) {
    console.warn("Supabase not configured. User stats not retrieved.");
    return {
      totalCalls: 0,
      easyCompleted: 0,
      mediumCompleted: 0,
      hardCompleted: 0,
    };
  }

  const { data, error } = await supabase.rpc("get_user_progress", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalCalls: 0,
      easyCompleted: 0,
      mediumCompleted: 0,
      hardCompleted: 0,
    };
  }

  // The RPC function returns an array with a single row
  const stats = data?.[0] || {
    total_calls: 0,
    easy_calls: 0,
    medium_calls: 0,
    hard_calls: 0,
  };

  return {
    totalCalls: Number(stats.total_calls) || 0,
    easyCompleted: Number(stats.easy_calls) || 0,
    mediumCompleted: Number(stats.medium_calls) || 0,
    hardCompleted: Number(stats.hard_calls) || 0,
  };
}

