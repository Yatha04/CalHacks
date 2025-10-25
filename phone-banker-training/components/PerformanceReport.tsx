"use client";

import { useState } from "react";
import { PerformanceMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Home, X } from "lucide-react";

interface PerformanceReportProps {
  metrics: PerformanceMetrics;
  voterName: string;
  onContinue: () => void;
}

export function PerformanceReport({
  metrics,
  voterName,
  onContinue,
}: PerformanceReportProps) {
  const [showPositiveNote, setShowPositiveNote] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">






      {/* Positive Note */}
      {showPositiveNote && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="font-bold text-green-800 text-lg">Great Job!</h3>
                  <p className="text-green-700 text-sm">
                    You completed your phone banking practice session. Keep up the excellent work!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPositiveNote(false)}
                className="text-green-600 hover:text-green-800 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Transcript */}
      {metrics.transcript && (
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Call Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 max-h-[500px] overflow-y-auto space-y-3">
              {metrics.transcript.split("\n").map((line, idx) => (
                <div
                  key={idx}
                  className={`text-base ${
                    line.startsWith("Volunteer:")
                      ? "text-blue-700 font-semibold"
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

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onContinue} size="lg" className="gap-2">
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

