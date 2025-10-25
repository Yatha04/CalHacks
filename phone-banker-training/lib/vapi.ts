// Vapi client and integration

import Vapi from "@vapi-ai/web";

const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";

if (!vapiPublicKey) {
  console.warn("Vapi public key not found. Voice features will be disabled.");
}

export function createVapiClient() {
  return new Vapi(vapiPublicKey);
}

/**
 * Start a call with Vapi using a configured assistant
 * or with inline assistant configuration
 */
export async function startVapiCall(
  vapi: Vapi,
  assistantId?: string,
  assistantConfig?: unknown
) {
  try {
    if (assistantId) {
      await vapi.start(assistantId);
    } else if (assistantConfig) {
      await vapi.start(assistantConfig);
    } else {
      throw new Error("Either assistantId or assistantConfig must be provided");
    }
  } catch (error) {
    console.error("Failed to start Vapi call:", error);
    throw error;
  }
}

/**
 * Create an assistant configuration for a voter profile
 */
export function createVoterAssistantConfig(voterProfile: {
  name: string;
  description: string;
  personality: string;
  keyIssues: string[];
  skepticism: string;
}): any {
  return {
    model: {
      provider: "openai" as const,
      model: "gpt-4" as const,
      messages: [
        {
          role: "system" as const,
          content: `You are roleplaying as a voter in a phone banking scenario. 

VOTER PROFILE:
Name: ${voterProfile.name}
Description: ${voterProfile.description}
Personality: ${voterProfile.personality}

KEY CONCERNS:
${voterProfile.keyIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")}

SKEPTICISM/CONCERNS:
${voterProfile.skepticism}

INSTRUCTIONS:
- Stay in character as this voter throughout the entire conversation
- Express the concerns and skepticism naturally in your responses
- React authentically to the volunteer's pitch based on this voter's profile
- Be realistic - if they address your concerns well, warm up gradually
- If they ignore your concerns or give generic answers, express frustration
- End the call naturally when the conversation reaches a conclusion
- Speak conversationally, like a real phone call

Remember: You are NOT an AI assistant. You are this specific voter answering a call from a political campaign volunteer.`,
        },
      ],
    },
    voice: {
      provider: "11labs" as const,
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Default voice, can be customized
    },
    name: `Voter: ${voterProfile.name}`,
    firstMessage: "Hello?",
    endCallMessage: "Thanks for calling. Goodbye.",
    recordingEnabled: true,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600, // 10 minutes max
  };
}

