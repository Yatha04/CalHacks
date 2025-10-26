// Vapi client and integration

import Vapi from "@vapi-ai/web";

const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";

if (!vapiPublicKey) {
  console.warn("Vapi public key not found. Voice features will be disabled.");
}

/**
 * Check if Vapi is properly configured with a valid public key
 */
export function isVapiConfigured(): boolean {
  return vapiPublicKey.length > 0;
}

/**
 * Get configuration error message if Vapi is not configured
 */
export function getVapiConfigError(): string | null {
  if (!vapiPublicKey) {
    return "Vapi is not configured. Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your .env.local file. See README.md for setup instructions.";
  }
  return null;
}

export function createVapiClient() {
  if (!vapiPublicKey) {
    throw new Error(getVapiConfigError() || "Vapi public key is missing");
  }
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
  const systemPrompt = `You are roleplaying as a voter in a phone banking scenario. 

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
- follow the system prompt exactly given to you. Do not deviate from it.
- If they ignore your concerns or give generic answers, express frustration and anger.
- Speak conversationally, like a real phone call

Remember: You are NOT an AI assistant. You are this specific voter answering a call from a political campaign volunteer.`;

  return {
    name: `Voter: ${voterProfile.name}`,
    model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
    },
    voice: {
      provider: "azure",
      voiceId: "andrew",
    },
    firstMessage: "Hello?",
    recordingEnabled: true,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600,
  };
}

