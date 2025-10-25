import { DifficultyLevel, KeyMoment } from "@/types";

/**
 * Analyzes call performance based on transcript, duration, and difficulty
 * In production, this would use AI (OpenAI, Claude, etc.) to analyze the conversation
 * For now, provides mock analysis with reasonable variance
 */
export async function analyzeCallPerformance(
  transcript: string,
  duration: number,
  difficulty: DifficultyLevel
) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Basic analysis factors
  const transcriptLength = transcript.length;
  const wordCount = transcript.split(/\s+/).length;
  const callQuality = Math.min(100, (duration / 60) * 30 + (wordCount / 100) * 20);

  // Adjust scores based on difficulty
  const difficultyMultiplier = {
    easy: 1.0,
    medium: 0.85,
    hard: 0.7,
  }[difficulty];

  // Generate performance metrics with some randomness
  const baseScore = 60 + Math.random() * 20; // 60-80 base
  const adjustedScore = Math.min(100, baseScore * difficultyMultiplier);

  const confidence = Math.round(
    Math.max(0, Math.min(100, adjustedScore + (Math.random() - 0.5) * 20))
  );
  const enthusiasm = Math.round(
    Math.max(0, Math.min(100, adjustedScore + (Math.random() - 0.5) * 20))
  );
  const clarity = Math.round(
    Math.max(0, Math.min(100, adjustedScore + (Math.random() - 0.5) * 15))
  );
  const persuasiveness = Math.round(
    Math.max(0, Math.min(100, adjustedScore + (Math.random() - 0.5) * 25))
  );
  const empathy = Math.round(
    Math.max(0, Math.min(100, adjustedScore + (Math.random() - 0.5) * 20))
  );

  const overallScore = Math.round(
    (confidence + enthusiasm + clarity + persuasiveness + empathy) / 5
  );

  // Generate strengths and areas for improvement
  const allMetrics = [
    { name: "confidence", score: confidence },
    { name: "enthusiasm", score: enthusiasm },
    { name: "clarity", score: clarity },
    { name: "persuasiveness", score: persuasiveness },
    { name: "empathy", score: empathy },
  ];

  const sortedMetrics = [...allMetrics].sort((a, b) => b.score - a.score);
  const strengths = sortedMetrics.slice(0, 2).map((m) => {
    const messages = {
      confidence: "You spoke with strong confidence and authority",
      enthusiasm: "Your energy and enthusiasm came through clearly",
      clarity: "Your points were well-articulated and easy to understand",
      persuasiveness: "You presented compelling arguments effectively",
      empathy: "You showed genuine empathy and understanding",
    };
    return messages[m.name as keyof typeof messages];
  });

  const areasForImprovement = sortedMetrics.slice(-2).map((m) => {
    const messages = {
      confidence: "Try to speak with more certainty and conviction",
      enthusiasm: "Bring more energy and passion to your delivery",
      clarity: "Work on making your points more concise and clear",
      persuasiveness: "Focus on addressing specific concerns more directly",
      empathy: "Show more understanding of the voter's perspective",
    };
    return messages[m.name as keyof typeof messages];
  });

  // Generate key moments
  const keyMoments: KeyMoment[] = [
    {
      timestamp: Math.floor(duration * 0.2),
      description: "Strong opening introduction",
      type: "success",
    },
    {
      timestamp: Math.floor(duration * 0.5),
      description: "Effectively addressed main concern",
      type: "success",
    },
    {
      timestamp: Math.floor(duration * 0.7),
      description: "Could have elaborated more on policy details",
      type: "missed-opportunity",
    },
  ];

  // Determine sentiment
  const sentiment: "positive" | "neutral" | "negative" =
    overallScore >= 75 ? "positive" : overallScore >= 50 ? "neutral" : "negative";

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

