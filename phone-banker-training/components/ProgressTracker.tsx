"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserProgress } from "@/types";
import { TrendingUp, Award, Clock } from "lucide-react";
import { getScoreColor } from "@/lib/utils";

interface ProgressTrackerProps {
  progress: UserProgress;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const totalAttempts =
    progress.callsByDifficulty.easy +
    progress.callsByDifficulty.medium +
    progress.callsByDifficulty.hard;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <TrendingUp className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {progress.totalCalls}
            </div>
            <div className="text-sm text-gray-600">Total Calls</div>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${getScoreColor(
                progress.averageScore
              )}`}
            >
              {progress.averageScore}
            </div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Math.round(progress.completionRate)}%
            </div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            By Difficulty
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-green-700">Easy</span>
                <span className="text-sm text-gray-600">
                  {progress.callsByDifficulty.easy} calls
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalAttempts > 0
                        ? (progress.callsByDifficulty.easy / totalAttempts) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-yellow-700">
                  Medium
                </span>
                <span className="text-sm text-gray-600">
                  {progress.callsByDifficulty.medium} calls
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalAttempts > 0
                        ? (progress.callsByDifficulty.medium / totalAttempts) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-red-700">Hard</span>
                <span className="text-sm text-gray-600">
                  {progress.callsByDifficulty.hard} calls
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalAttempts > 0
                        ? (progress.callsByDifficulty.hard / totalAttempts) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        {progress.lastCallDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
            <Clock className="w-4 h-4" />
            <span>
              Last call:{" "}
              {new Date(progress.lastCallDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Encouragement Message */}
        {progress.totalCalls === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            Start your first call to begin tracking your progress!
          </div>
        )}

        {progress.totalCalls > 0 && progress.averageScore >= 80 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            🎉 Excellent work! You&apos;re performing at a high level!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

