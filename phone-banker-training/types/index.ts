// Core type definitions for the phone banker training platform

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface VoterProfile {
  id: string;
  name: string;
  difficulty: DifficultyLevel;
  description: string;
  age: string;
  location: string;
  occupation: string;
  income: string;
  votingHistory: string;
  keyIssues: string[];
  skepticism: string;
  personality: string;
  vapiAssistantId?: string; // Vapi assistant configured for this profile
}

export interface CallSession {
  id: string;
  userId: string;
  voterProfileId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  transcript?: string;
  vapiCallId?: string;
  status: "in-progress" | "completed" | "abandoned";
}

export interface PerformanceMetrics {
  id: string;
  sessionId: string;
  confidence: number; // 0-100
  enthusiasm: number; // 0-100
  clarity: number; // 0-100
  persuasiveness: number; // 0-100
  empathy: number; // 0-100
  overallScore: number; // 0-100
  strengths: string[];
  areasForImprovement: string[];
  keyMoments: KeyMoment[];
  sentiment: "positive" | "neutral" | "negative";
  createdAt: Date;
}

export interface KeyMoment {
  timestamp: number; // seconds into the call
  description: string;
  type: "success" | "challenge" | "missed-opportunity";
}

export interface UserProgress {
  userId: string;
  totalCalls: number;
  callsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  averageScore: number;
  completionRate: number;
  lastCallDate?: Date;
}

export interface VapiMessage {
  type: "function-call" | "transcript" | "conversation-update";
  functionCall?: {
    name: string;
    parameters: Record<string, unknown>;
  };
  transcript?: string;
  timestamp: number;
}

export interface AnalysisSummary {
  callId: string;
  summary: string;
  userMessages: string[];
  voterMessages: string[];
  successIndicators: string[];
  missedOpportunities: string[];
}

