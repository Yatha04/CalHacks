-- Database schema for Phone Banker Training Platform
-- Run this in your Supabase SQL editor to set up the database

-- Users table (integrates with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  voter_profile_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  transcript TEXT,
  vapi_call_id TEXT,
  recording_url TEXT,
  recording_fetched_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('in-progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES call_sessions(id) ON DELETE CASCADE,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  enthusiasm INTEGER CHECK (enthusiasm >= 0 AND enthusiasm <= 100),
  clarity INTEGER CHECK (clarity >= 0 AND clarity <= 100),
  persuasiveness INTEGER CHECK (persuasiveness >= 0 AND persuasiveness <= 100),
  empathy INTEGER CHECK (empathy >= 0 AND empathy <= 100),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  strengths TEXT[],
  areas_for_improvement TEXT[],
  key_moments JSONB,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_call_sessions_user_id ON call_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_created_at ON call_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own call sessions" ON call_sessions;
DROP POLICY IF EXISTS "Users can view own performance metrics" ON performance_metrics;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can view their own call sessions
CREATE POLICY "Users can view own call sessions" ON call_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Users can view performance metrics for their own sessions
CREATE POLICY "Users can view own performance metrics" ON performance_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM call_sessions
      WHERE call_sessions.id = performance_metrics.session_id
      AND call_sessions.user_id = auth.uid()
    )
  );

-- Function to get user progress
CREATE OR REPLACE FUNCTION get_user_progress(p_user_id UUID)
RETURNS TABLE (
  total_calls BIGINT,
  easy_calls BIGINT,
  medium_calls BIGINT,
  hard_calls BIGINT,
  average_score NUMERIC,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_calls,
    COUNT(*) FILTER (WHERE voter_profile_id LIKE 'easy-%') as easy_calls,
    COUNT(*) FILTER (WHERE voter_profile_id LIKE 'medium-%') as medium_calls,
    COUNT(*) FILTER (WHERE voter_profile_id LIKE 'hard-%') as hard_calls,
    ROUND(AVG(pm.overall_score), 2) as average_score,
    ROUND(
      COUNT(*) FILTER (WHERE cs.status = 'completed')::NUMERIC / 
      NULLIF(COUNT(*)::NUMERIC, 0) * 100,
      2
    ) as completion_rate
  FROM call_sessions cs
  LEFT JOIN performance_metrics pm ON pm.session_id = cs.id
  WHERE cs.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

