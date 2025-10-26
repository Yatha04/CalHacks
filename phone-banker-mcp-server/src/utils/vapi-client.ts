interface VapiCallResponse {
  id: string;
  status: string;
  recording?: {
    url: string;
    duration?: number;
  };
  createdAt: string;
  endedAt?: string;
}

export class VapiClient {
  private apiKey: string;
  private baseUrl = "https://api.vapi.ai";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCallDetails(callId: string): Promise<VapiCallResponse> {
    const response = await fetch(`${this.baseUrl}/call/${callId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Call ${callId} not found`);
      }
      throw new Error(`Failed to fetch call details: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getRecordingUrl(callId: string): Promise<string | null> {
    try {
      const callDetails = await this.getCallDetails(callId);
      
      if (callDetails.recording?.url) {
        return callDetails.recording.url;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching recording for call ${callId}:`, error);
      return null;
    }
  }
}

export function createVapiClient(): VapiClient {
  const apiKey = process.env.VAPI_API_KEY;
  
  if (!apiKey) {
    throw new Error("VAPI_API_KEY environment variable is required");
  }
  
  return new VapiClient(apiKey);
}
