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
            <Card className="max-w-14xl mx-auto border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
              <CardHeader>
                <CardTitle className="text-black font-bold text-xl">👋 Welcome! Ready to get started?</CardTitle>
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
          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-blue-600" />
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{stats.totalCalls}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {stats.averageScore > 0 ? stats.averageScore : "--"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-600" />
                Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.easyCompleted}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-600" />
                Med/Hard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
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
            className={
              selectedDifficulty === "all"
                ? "bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
                : "bg-white hover:bg-blue-50 text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
            }
          >
            All Profiles
          </Button>
          <Button
            variant={selectedDifficulty === "easy" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("easy")}
            className={
              selectedDifficulty === "easy"
                ? "bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
                : "bg-white hover:bg-blue-50 text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
            }
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("medium")}
            className={
              selectedDifficulty === "medium"
                ? "bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
                : "bg-white hover:bg-blue-50 text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
            }
          >
            Medium
          </Button>
          <Button
            variant={selectedDifficulty === "hard" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("hard")}
            className={
              selectedDifficulty === "hard"
                ? "bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
                : "bg-white hover:bg-blue-50 text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all"
            }
          >
            Hard
          </Button>
        </div>

        {/* Voter Profiles List */}
        <div className="bg-white rounded-lg border-2 border-black shadow-[0_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50 border-b-2 border-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Voter Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-black">
              {filteredProfiles.map((profile, index) => (
                <tr
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-blue-600 text-sm mr-3 font-bold">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-bold text-black">
                        {profile.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {profile.location}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border-2 border-black shadow-[0_2px_0_0_rgba(0,0,0,1)] ${
                        profile.difficulty === "easy"
                          ? "bg-blue-100 text-blue-800"
                          : profile.difficulty === "medium"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-blue-300 text-blue-900"
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
                          className="w-1 h-4 bg-blue-200 rounded border border-black"
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
