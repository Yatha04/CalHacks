"use client";

import { useState, useEffect, useRef } from "react";
import { VoterProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Phone, PhoneOff, Mic, MicOff, AlertCircle } from "lucide-react";
import { createVapiClient, createVoterAssistantConfig, isVapiConfigured, getVapiConfigError } from "@/lib/vapi";
import { formatDuration } from "@/lib/utils";
import Vapi from "@vapi-ai/web";

interface CallInterfaceProps {
  profile: VoterProfile;
  onCallEnd: (transcript: string, duration: number, vapiCallId?: string) => void;
  onCancel: () => void;
}

export function CallInterface({ profile, onCallEnd, onCancel }: CallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [configError, setConfigError] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const conversationRef = useRef<any[]>([]);
  const vapiCallIdRef = useRef<string | null>(null);
  const callEndedRef = useRef<boolean>(false);
  const callEndProcessedRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if Vapi is configured
    if (!isVapiConfigured()) {
      const errorMsg = getVapiConfigError();
      setConfigError(errorMsg);
      console.error("Vapi configuration error:", errorMsg);
      return;
    }

    // Initialize Vapi client
    try {
      vapiRef.current = createVapiClient();
      
      // Set up event listeners
      // Replace the "call-start" handler and add "call-start-success"
      vapiRef.current.on("call-start", () => {
        setCallStatus("connected");
        startTimer();
      });

      vapiRef.current.on("call-start-success", (event) => {
        if (event?.callId) {
          vapiCallIdRef.current = event.callId;
          console.log("Vapi call ID captured:", event.callId);
        }
      });

      vapiRef.current.on("call-end", () => {
        // Prevent processing call end multiple times
        if (callEndProcessedRef.current) {
          console.log("Call-end already processed, skipping duplicate");
          return;
        }
        
        callEndProcessedRef.current = true;
        callEndedRef.current = true;
        setCallStatus("ended");
        stopTimer();
        
        console.log("Call ended. Building transcript from conversation...");
        console.log("Conversation messages:", conversationRef.current);
        
        // Build transcript from conversation messages (skip first element which is system prompt)
        const fullTranscript = conversationRef.current
          .slice(1) // Skip index 0 (system prompt)
          .map((msg: any) => {
            const speaker = msg.role === "user" ? "Volunteer" : "Voter";
            return `${speaker}: ${msg.content || msg.message || ""}`;
          })
          .filter(line => line.trim().length > 3) // Remove empty lines
          .join("\n");
        
        console.log("Final transcript:", fullTranscript);
        
        const finalTranscript = fullTranscript || "No transcript available.";
        onCallEnd(finalTranscript, duration, vapiCallIdRef.current || undefined);
      });

      vapiRef.current.on("message", (message: unknown) => {
        const msg = message as any;
        
        // Handle conversation-update messages - this contains the full conversation
        if (msg.type === "conversation-update" && msg.conversation) {
          console.log("Conversation update - messages count:", msg.conversation.length);
          conversationRef.current = msg.conversation;
        }
        
        // Also handle individual transcript messages for real-time display
        if (msg.type === "transcript" && msg.transcript && msg.transcriptType === "final") {
          const speaker = msg.role === "user" ? "Volunteer" : "Voter";
          setTranscript((prev) => [...prev, `${speaker}: ${msg.transcript}`]);
        }
      });

      vapiRef.current.on("error", (error: unknown) => {
        // Extract error message from various possible structures
        let errorMessage = "Unknown error";
        const errorObj = error as any;
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof errorObj === "string") {
          errorMessage = errorObj;
        } else if (errorObj?.message) {
          errorMessage = errorObj.message;
        } else if (errorObj?.error?.message) {
          errorMessage = errorObj.error.message;
        } else if (errorObj?.error?.error?.error) {
          // Handle nested Vapi error structure: error.error.error.error
          errorMessage = errorObj.error.error.error;
        }
        
        // Check for specific Vapi error types
        if (errorObj?.type === "start-method-error") {
          const stage = errorObj.stage || "unknown";
          const errorType = errorObj.error?.type || "unknown";
          const errorDetail = errorObj.error?.error?.error || "Bad Request";
          errorMessage = `Failed to start call (${stage}): ${errorDetail} [${errorType}]`;
        }
        
        const lowerMessage = errorMessage.toLowerCase();
        
        // Ignore post-call-end errors as they're expected
        if (callEndedRef.current && (lowerMessage.includes("meeting has ended") || lowerMessage.includes("call has ended"))) {
          console.log("Post-call-end event received (ignoring)");
          return;
        }
        
        // Check if this is an empty/non-critical error
        const isEmptyError = !errorMessage || errorMessage === "Unknown error";
        const errorKeys = errorObj && typeof errorObj === "object" ? Object.keys(errorObj) : [];
        
        if (isEmptyError && errorKeys.length === 0) {
          console.log("Non-critical empty error event received, ignoring");
          return;
        }
        
        // Handle start-method errors with specific diagnostics
        if (errorObj?.type === "start-method-error") {
          console.error("❌ Failed to start Vapi call:", errorMessage);
          console.error("Error details:", {
            type: errorObj.type,
            stage: errorObj.stage,
            errorType: errorObj.error?.type,
            timestamp: errorObj.timestamp,
            duration: errorObj.totalDuration,
          });
          console.error("\nPossible causes:");
          console.error("  1. Invalid assistant configuration");
          console.error("  2. Invalid API key or insufficient credits");
          console.error("  3. Invalid voice provider or voice ID");
          console.error("  4. Invalid model configuration");
          console.error("\nTroubleshooting:");
          console.error("  - Check your VAPI_PUBLIC_KEY is valid");
          console.error("  - Verify you have credits in your Vapi account");
          console.error("  - Check the Vapi dashboard for more details");
          
          // Show user-friendly alert
          if (callStatus === "calling") {
            alert(`Failed to start call: ${errorMessage}\n\nPlease check:\n1. Your Vapi API key is valid\n2. You have sufficient credits\n3. Your internet connection\n\nSee console for more details.`);
          }
        } else if (lowerMessage.includes("ejection") || lowerMessage.includes("ejected") || errorMessage.includes("ejection")) {
          console.error("⚠️ Call was forcefully ended by Vapi (ejection):", errorMessage);
          console.error("\n🔍 Possible causes:");
          console.error("  1. Invalid voice provider or voice ID in configuration");
          console.error("  2. Invalid API key or insufficient credits");
          console.error("  3. Model configuration issues (try gpt-3.5-turbo or gpt-4)");
          console.error("  4. Network connectivity issues during call setup");
          console.error("  5. Invalid system prompt or messages format");
          console.error("\n💡 RECOMMENDED FIX:");
          console.error("  Create a pre-configured assistant in Vapi Dashboard:");
          console.error("  1. Go to https://dashboard.vapi.ai");
          console.error("  2. Create a new Assistant with your desired settings");
          console.error("  3. Copy the Assistant ID");
          console.error("  4. Add 'vapiAssistantId' to your voter profile");
          console.error("\nFull error details:", {
            message: errorMessage,
            error: errorObj,
            callStatus: callStatus,
            duration: duration
          });
          
          // Show user-friendly alert
          alert(`Call ended unexpectedly (ejection).\n\n` +
                `This usually means:\n` +
                `1. Invalid voice or model configuration\n` +
                `2. Insufficient Vapi credits\n` +
                `3. Invalid API key\n\n` +
                `RECOMMENDED: Use a pre-configured assistant from Vapi Dashboard instead of inline config.\n\n` +
                `See console for detailed troubleshooting steps.`);
        } else {
          // Log detailed error information for other real errors
          console.error("Vapi error occurred:", {
            error,
            errorType: typeof error,
            errorKeys,
            message: errorMessage,
            callStatus: callStatus,
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          });
        }
        
        // Only end the call for critical errors
        if (!isEmptyError || callStatus === "connected") {
          callEndedRef.current = true;
          setCallStatus("ended");
          stopTimer();
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to initialize Vapi:", errorMessage, error);
      setConfigError(errorMessage);
    }

    return () => {
      // Only stop the call if it hasn't already ended
      if (vapiRef.current && !callEndedRef.current) {
        try {
          vapiRef.current.stop();
        } catch (error) {
          // Silently ignore errors when stopping (call may have already ended)
          console.log("Call cleanup: call already ended");
        }
      }
      stopTimer();
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartCall = async () => {
    callEndedRef.current = false;
    callEndProcessedRef.current = false;
    setCallStatus("calling");
    
    console.log("🔵 Starting call...");
    console.log("Network status:", navigator.onLine ? "Online" : "Offline");
    
    try {
      // Check microphone permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log("✅ Microphone access granted");
      } catch (permError) {
        console.error("❌ Microphone access denied:", permError);
        alert("Microphone access is required for calls. Please grant permission and try again.");
        setCallStatus("idle");
        return;
      }
      
      // Use pre-configured assistant if available, otherwise create inline config
      if (profile.vapiAssistantId) {
        console.log("Using pre-configured assistant:", profile.vapiAssistantId);
        await vapiRef.current?.start(profile.vapiAssistantId);
      } else {
        const assistantConfig = createVoterAssistantConfig(profile);
        console.log("Using inline assistant config for:", profile.name);
        await vapiRef.current?.start(assistantConfig);
      }
      
      console.log("✅ Call start request sent successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Failed to start call:", errorMsg, error);
      setCallStatus("idle");
      
      // Provide more helpful error messages
      if (errorMsg.includes("key") || errorMsg.includes("auth")) {
        alert("Authentication error. Please check your VAPI_PUBLIC_KEY configuration.");
      } else if (errorMsg.includes("network") || !navigator.onLine) {
        alert("Network error. Please check your internet connection and try again.");
      } else {
        alert(`Failed to start call: ${errorMsg}\n\nPlease check the console for more details.`);
      }
    }
  };

  const handleEndCall = () => {
    if (!callEndedRef.current) {
      try {
        vapiRef.current?.stop();
      } catch (error) {
        console.log("Error stopping call:", error);
      }
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Configuration Error Alert */}
      {configError && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Configuration Required</h3>
                <p className="text-sm text-red-800 mb-3">{configError}</p>
                <div className="bg-red-100 border border-red-200 rounded p-3 text-sm text-red-900">
                  <p className="font-medium mb-2">To enable voice calls:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Create a <code className="bg-red-200 px-1 rounded">.env.local</code> file in the project root</li>
                    <li>Add: <code className="bg-red-200 px-1 rounded">NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_key_here</code></li>
                    <li>Get your key from <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">dashboard.vapi.ai</a></li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voter Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-black">
            <span>Calling: {profile.name}</span>
            <span className="text-sm font-normal text-gray-500">
              {profile.location} • {profile.difficulty}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{profile.description}</p>
        </CardContent>
      </Card>

      {/* Call Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Status and Timer */}
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {callStatus === "idle" && "Ready to Call"}
                {callStatus === "calling" && "Connecting..."}
                {callStatus === "connected" && formatDuration(duration)}
                {callStatus === "ended" && "Call Ended"}
              </div>
              <div className="text-gray-500">
                {callStatus === "connected" && "Call in Progress"}
                {callStatus === "calling" && "Please wait..."}
              </div>
            </div>

            {/* Call Buttons */}
            <div className="flex gap-4">
              {callStatus === "idle" && (
                <>
                  <Button 
                    onClick={handleStartCall} 
                    size="lg" 
                    className="gap-2"
                    disabled={!!configError}
                  >
                    <Phone className="w-5 h-5" />
                    Start Call
                  </Button>
                  <Button onClick={onCancel} variant="outline" size="lg">
                    Cancel
                  </Button>
                </>
              )}

              {(callStatus === "calling" || callStatus === "connected") && (
                <>
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Unmute
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Mute
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleEndCall}
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-black">💡 Tips for this Call</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-900">
            <li>Listen carefully to the voter&apos;s concerns</li>
            <li>Address their specific issues: {profile.keyIssues[0]}</li>
            <li>Build rapport before making your pitch</li>
            <li>Be authentic and conversational</li>
            <li>Don&apos;t give up if they&apos;re skeptical - acknowledge their concerns</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

