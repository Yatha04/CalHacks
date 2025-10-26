export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
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
//# sourceMappingURL=supabase-client.d.ts.map