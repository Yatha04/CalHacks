import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CallSession {
  id: string;
  user_id: string;
  voter_profile_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  transcript?: string;
  vapi_call_id?: string;
  recording_url?: string;
  recording_fetched_at?: string;
  status: "in-progress" | "completed" | "abandoned";
  created_at: string;
}

export interface PerformanceMetrics {
  id: string;
  session_id: string;
  confidence: number;
  enthusiasm: number;
  clarity: number;
  persuasiveness: number;
  empathy: number;
  overall_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  key_moments: any[];
  sentiment: "positive" | "neutral" | "negative";
  created_at: string;
}

export interface UserProgress {
  total_calls: number;
  easy_calls: number;
  medium_calls: number;
  hard_calls: number;
  average_score: number;
  completion_rate: number;
}
