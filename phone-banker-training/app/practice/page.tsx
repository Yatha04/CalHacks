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

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const handleCallEnd = async (transcript: string, duration: number) => {
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
      createdAt: new Date(),
    };

    setPerformanceMetrics(fullMetrics);
    setStage("report");

    // TODO: Save to Supabase
    // await saveCallSession(...)
    // await savePerformanceMetrics(...)
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
