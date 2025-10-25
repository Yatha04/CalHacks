"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { voterProfiles, getProfilesByDifficulty } from "@/lib/voterProfiles";
import { Trophy, TrendingUp, Phone as PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");

  const filteredProfiles =
    selectedDifficulty === "all"
      ? voterProfiles
      : getProfilesByDifficulty(selectedDifficulty);

  const handleSelectProfile = (profileId: string) => {
    router.push(`/practice?profile=${profileId}`);
  };

  // Mock stats - in production, these would come from Supabase
  const stats = {
    totalCalls: 0,
    averageScore: 0,
    easyCompleted: 0,
    mediumCompleted: 0,
    hardCompleted: 0,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-black">Training Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Choose a voter profile to start practicing
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      {stats.totalCalls === 0 && (
        <div className="bg-white">
          <div className="container mx-auto px-4 py-6">
            <Card className="max-w-14xl mx-auto bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-black">👋 Welcome! Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  This platform helps you practice phone banking conversations
                  with realistic AI-powered voter simulations.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-black">Quick Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>
                      Start with <span className="font-semibold">Easy</span>{" "}
                      profiles to build confidence
                    </li>
                    <li>
                      Read the voter&apos;s profile carefully before starting the call
                    </li>
                    <li>
                      Address their specific concerns, not just generic talking
                      points
                    </li>
                    <li>
                      Review your performance report after each call to improve
                    </li>
                    <li>
                      Challenge yourself with harder profiles as you improve
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCalls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.averageScore > 0 ? stats.averageScore : "--"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.easyCompleted}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Med/Hard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.mediumCompleted}/{stats.hardCompleted}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={selectedDifficulty === "all" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("all")}
          >
            All Profiles
          </Button>
          <Button
            variant={selectedDifficulty === "easy" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("easy")}
            className={
              selectedDifficulty === "easy"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : selectedDifficulty === "all"
                ? "bg-white hover:bg-gray-800 text-black border-black"
                : ""
            }
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("medium")}
            className={
              selectedDifficulty === "medium"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : selectedDifficulty === "all"
                ? "bg-white hover:bg-gray-800 text-black border-black"
                : ""
            }
          >
            Medium
          </Button>
          <Button
            variant={selectedDifficulty === "hard" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("hard")}
            className={
              selectedDifficulty === "hard"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : selectedDifficulty === "all"
                ? "bg-white hover:bg-gray-800 text-black border-black"
                : ""
            }
          >
            Hard
          </Button>
        </div>

        {/* Voter Profiles List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voter Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfiles.map((profile, index) => (
                <tr
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-3">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-medium text-black">
                        {profile.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {profile.location}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        profile.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : profile.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile.difficulty === "easy"
                        ? "Easy"
                        : profile.difficulty === "medium"
                        ? "Med."
                        : "Hard"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex gap-1 justify-end">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-4 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
