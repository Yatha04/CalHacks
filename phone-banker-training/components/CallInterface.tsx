"use client";

import { useState, useEffect, useRef } from "react";
import { VoterProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { createVapiClient, createVoterAssistantConfig } from "@/lib/vapi";
import { formatDuration } from "@/lib/utils";
import Vapi from "@vapi-ai/web";

interface CallInterfaceProps {
  profile: VoterProfile;
  onCallEnd: (transcript: string, duration: number) => void;
  onCancel: () => void;
}

export function CallInterface({ profile, onCallEnd, onCancel }: CallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize Vapi client
    try {
      vapiRef.current = createVapiClient();
      
      // Set up event listeners
      vapiRef.current.on("call-start", () => {
        setCallStatus("connected");
        startTimer();
      });

      vapiRef.current.on("call-end", () => {
        setCallStatus("ended");
        stopTimer();
        const fullTranscript = transcript.join("\n");
        onCallEnd(fullTranscript, duration);
      });

      vapiRef.current.on("message", (message: unknown) => {
        // Handle transcript updates
        const msg = message as { type: string; transcript?: string; role?: string };
        if (msg.type === "transcript" && msg.transcript) {
          setTranscript((prev) => [
            ...prev,
            `${msg.role === "user" ? "Volunteer" : "Voter"}: ${msg.transcript}`,
          ]);
        }
      });

      vapiRef.current.on("error", (error: unknown) => {
        console.error("Vapi error:", error);
        setCallStatus("ended");
        stopTimer();
      });
    } catch (error) {
      console.error("Failed to initialize Vapi:", error);
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
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
    setCallStatus("calling");
    try {
      const assistantConfig = createVoterAssistantConfig(profile);
      await vapiRef.current?.start(assistantConfig);
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus("idle");
      alert("Failed to start call. Please check your Vapi configuration.");
    }
  };

  const handleEndCall = () => {
    vapiRef.current?.stop();
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
                  <Button onClick={handleStartCall} size="lg" className="gap-2">
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

      {/* Live Transcript */}
      {transcript.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Live Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
              {transcript.map((line, idx) => (
                <div
                  key={idx}
                  className={`text-sm ${
                    line.startsWith("Volunteer:")
                      ? "text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

