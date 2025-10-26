"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProfileById } from "@/lib/voterProfiles";
import { CallInterface } from "@/components/CallInterface";
import { PerformanceReport } from "@/components/PerformanceReport";
import { analyzeCallPerformance } from "@/lib/analytics";
import { PerformanceMetrics } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth";
import { saveCallSession, savePerformanceMetrics, updateCallSession, ensureUserProfile } from "@/lib/supabase";

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const profileId = searchParams.get("profile");

  const [stage, setStage] = useState<"calling" | "report">("calling");
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);

  const profile = profileId ? getProfileById(profileId) : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg mb-4">Voter profile not found</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCallEnd = async (transcript: string, duration: number, vapiCallId?: string) => {
    console.log("📊 Call ended - Processing results...", { duration, vapiCallId });
    
    // Analyze the call performance
    const metrics = await analyzeCallPerformance(
      transcript,
      duration,
      profile.difficulty
    );

    // Create full performance metrics object
    const fullMetrics: PerformanceMetrics = {
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      ...metrics,
      transcript,
      createdAt: new Date(),
    };

    setPerformanceMetrics(fullMetrics);
    setStage("report");

    // Save to Supabase with authenticated user
    if (user) {
      try {
        console.log("💾 Saving call session to Supabase...");
        
        // Ensure user profile exists in database before saving call session
        const userExists = await ensureUserProfile(user.id, user.email || undefined, user.user_metadata?.full_name || user.user_metadata?.name);
        if (!userExists) {
          console.error("❌ Failed to ensure user profile exists. Cannot save call session.");
          alert("Failed to save call data. Please try logging out and back in.");
          return;
        }
        
        // Save call session to Supabase
        const callSession = await saveCallSession({
          userId: user.id,
          voterProfileId: profile.id,
          startTime: new Date(Date.now() - duration * 1000), // Calculate start time
          vapiCallId: vapiCallId
        });
        
        console.log("✅ Call session saved:", callSession.id);

        // Save performance metrics
        await savePerformanceMetrics({
          sessionId: callSession.id,
          confidence: fullMetrics.confidence,
          enthusiasm: fullMetrics.enthusiasm,
          clarity: fullMetrics.clarity,
          persuasiveness: fullMetrics.persuasiveness,
          empathy: fullMetrics.empathy,
          overallScore: fullMetrics.overallScore,
          strengths: fullMetrics.strengths,
          areasForImprovement: fullMetrics.areasForImprovement,
          keyMoments: fullMetrics.keyMoments,
          sentiment: fullMetrics.sentiment,
        });
        
        console.log("✅ Performance metrics saved");

        // Update call session with end time and duration
        await updateCallSession(callSession.id, {
          endTime: new Date(),
          duration: duration,
          transcript: transcript,
          status: "completed"
        });
        
        console.log("✅ Call session updated with final data");
      } catch (error) {
        const errorObj = error as any;
        console.error('❌ Error saving call data:', {
          message: errorObj?.message || 'Unknown error',
          details: errorObj?.details || 'No details',
          hint: errorObj?.hint || 'No hint',
          code: errorObj?.code || 'No code',
          error: errorObj
        });
        
        // Don't fail the UI if save fails - user can still see their report
        console.warn('⚠️ Call data not saved, but you can still view your performance report');
      }
    } else {
      console.warn('⚠️ Not authenticated - call data will not be saved');
    }
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {stage === "calling" && (
          <CallInterface
            profile={profile}
            onCallEnd={handleCallEnd}
            onCancel={() => router.push("/dashboard")}
          />
        )}

        {stage === "report" && performanceMetrics && (
          <PerformanceReport
            metrics={performanceMetrics}
            voterName={profile.name}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        }
      >
        <PracticeContent />
      </Suspense>
    </ProtectedRoute>
  );
}
