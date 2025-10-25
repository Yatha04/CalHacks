// Sentiment analysis and performance evaluation

import { PerformanceMetrics, KeyMoment } from "@/types";

/**
 * Analyze call transcript and extract performance metrics
 * In production, this would call an AI service (OpenAI, Anthropic, etc.)
 * For now, this is a placeholder that returns mock data
 */
export async function analyzeCallPerformance(
  transcript: string,
  duration: number,
  voterProfileDifficulty: "easy" | "medium" | "hard"
): Promise<Omit<PerformanceMetrics, "id" | "sessionId" | "createdAt">> {
  // TODO: Implement actual AI-based sentiment analysis
  // This would typically:
  // 1. Send transcript to OpenAI/Anthropic API
  // 2. Use a prompt to extract metrics
  // 3. Analyze speech patterns, keywords, responses
  
  // For now, return structured data based on basic heuristics
  const transcriptLower = transcript.toLowerCase();
  const volunteerMessages = extractVolunteerMessages(transcript);
  const voterMessages = extractVoterMessages(transcript);
  
  // Basic sentiment analysis
  const positiveWords = ["agree", "sounds good", "yes", "sure", "okay", "thanks", "appreciate"];
  const negativeWords = ["no", "don't", "won't", "can't", "never", "disagree", "wrong"];
  
  const positiveCount = positiveWords.filter(word => transcriptLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => transcriptLower.includes(word)).length;
  
  const sentiment = positiveCount > negativeCount ? "positive" : 
                   negativeCount > positiveCount ? "negative" : "neutral";
  
  // Calculate metrics (0-100)
  const baseScore = 70;
  const difficultyModifier = voterProfileDifficulty === "easy" ? 10 : 
                            voterProfileDifficulty === "medium" ? 0 : -10;
  
  const confidence = Math.min(100, Math.max(0, baseScore + difficultyModifier + (positiveCount * 2) - (negativeCount * 2)));
  const enthusiasm = Math.min(100, Math.max(0, baseScore + difficultyModifier + 5));
  const clarity = Math.min(100, Math.max(0, baseScore + difficultyModifier + 3));
  const persuasiveness = Math.min(100, Math.max(0, baseScore + difficultyModifier + (positiveCount * 3) - (negativeCount * 1)));
  const empathy = Math.min(100, Math.max(0, baseScore + difficultyModifier + 7));
  
  const overallScore = Math.round((confidence + enthusiasm + clarity + persuasiveness + empathy) / 5);
  
  // Generate strengths and areas for improvement
  const strengths: string[] = [];
  const areasForImprovement: string[] = [];
  
  if (confidence > 75) strengths.push("Strong, confident communication");
  else areasForImprovement.push("Build more confidence in delivery");
  
  if (persuasiveness > 75) strengths.push("Effective persuasion techniques");
  else areasForImprovement.push("Practice addressing voter concerns more directly");
  
  if (empathy > 75) strengths.push("Good active listening and empathy");
  else areasForImprovement.push("Show more understanding of voter concerns");
  
  // Identify key moments (placeholder)
  const keyMoments: KeyMoment[] = [
    {
      timestamp: 30,
      description: "Strong opening introduction",
      type: "success",
    },
    {
      timestamp: 120,
      description: "Addressed voter concern about housing costs",
      type: "success",
    },
  ];
  
  if (negativeCount > 2) {
    keyMoments.push({
      timestamp: 180,
      description: "Voter expressed skepticism - could have addressed more directly",
      type: "missed-opportunity",
    });
  }
  
  return {
    confidence,
    enthusiasm,
    clarity,
    persuasiveness,
    empathy,
    overallScore,
    strengths,
    areasForImprovement,
    keyMoments,
    sentiment,
  };
}

function extractVolunteerMessages(transcript: string): string[] {
  // Basic extraction - in production, Vapi provides structured transcript
  return transcript.split("\n").filter(line => line.startsWith("Volunteer:"));
}

function extractVoterMessages(transcript: string): string[] {
  // Basic extraction - in production, Vapi provides structured transcript
  return transcript.split("\n").filter(line => line.startsWith("Voter:"));
}

/**
 * Get personalized coaching tips based on performance
 */
export function getCoachingTips(metrics: Pick<PerformanceMetrics, "confidence" | "persuasiveness" | "empathy" | "clarity">): string[] {
  const tips: string[] = [];
  
  if (metrics.confidence < 60) {
    tips.push("Practice your opening script until it feels natural and conversational");
    tips.push("Remember: voters respond better when you sound confident in your message");
  }
  
  if (metrics.persuasiveness < 60) {
    tips.push("Focus on addressing specific voter concerns rather than giving generic responses");
    tips.push("Use concrete examples and stories to make your points relatable");
  }
  
  if (metrics.empathy < 60) {
    tips.push("Practice active listening - acknowledge voter concerns before pivoting to your message");
    tips.push("Use phrases like 'I understand' and 'That makes sense' to build rapport");
  }
  
  if (metrics.clarity < 60) {
    tips.push("Keep your points concise and organized - avoid rambling");
    tips.push("Practice transitioning smoothly between topics");
  }
  
  if (tips.length === 0) {
    tips.push("Great job! Keep practicing to maintain your skills");
    tips.push("Try a harder difficulty level to challenge yourself");
  }
  
  return tips;
}

