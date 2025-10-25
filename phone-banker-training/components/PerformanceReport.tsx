"use client";

import { PerformanceMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { getScoreColor } from "@/lib/utils";
import { CheckCircle, AlertCircle, TrendingUp, Home } from "lucide-react";

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
  const metricsList = [
    { name: "Confidence", value: metrics.confidence },
    { name: "Enthusiasm", value: metrics.enthusiasm },
    { name: "Clarity", value: metrics.clarity },
    { name: "Persuasiveness", value: metrics.persuasiveness },
    { name: "Empathy", value: metrics.empathy },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Call Complete!</h2>
            <p className="text-gray-600 mb-6">Voter: {voterName}</p>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(metrics.overallScore)}`}>
              {metrics.overallScore}
            </div>
            <div className="text-lg text-gray-600">Overall Performance Score</div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metricsList.map((metric) => (
              <div key={metric.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{metric.name}</span>
                  <span className={`font-bold ${getScoreColor(metric.value)}`}>
                    {metric.value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      metric.value >= 80
                        ? "bg-green-500"
                        : metric.value >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    data-width={metric.value}
                    style={{ width: `${metric.value}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {metrics.strengths.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {metrics.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-green-900">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {metrics.areasForImprovement.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <TrendingUp className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {metrics.areasForImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-yellow-900">
                  <span className="text-yellow-600 mt-1">→</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Key Moments */}
      {metrics.keyMoments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Key Moments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.keyMoments.map((moment, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    moment.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : moment.type === "challenge"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 mt-0.5 ${
                      moment.type === "success"
                        ? "text-green-600"
                        : moment.type === "challenge"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {Math.floor(moment.timestamp / 60)}:
                      {(moment.timestamp % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm">{moment.description}</div>
                  </div>
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

