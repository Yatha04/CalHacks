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

export async function saveCallSession(session: {
  userId: string;
  voterProfileId: string;
  startTime: Date;
  vapiCallId?: string;
}) {
  if (!supabase) {
    console.warn("Supabase not configured. Call session not saved.");
    return null;
  }

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

  if (error) throw error;
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
    return null;
  }

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

  if (error) throw error;
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
    return null;
  }

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

  if (error) throw error;
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

