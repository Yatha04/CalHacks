"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { voterProfiles, getProfilesByDifficulty } from "@/lib/voterProfiles";
import { Trophy, Phone as PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth";
import { getUserStats } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");
  const [stats, setStats] = useState({
    totalCalls: 0,
    easyCompleted: 0,
    mediumCompleted: 0,
    hardCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  const filteredProfiles =
    selectedDifficulty === "all"
      ? voterProfiles
      : getProfilesByDifficulty(selectedDifficulty);

  const handleSelectProfile = (profileId: string) => {
    router.push(`/practice?profile=${profileId}`);
  };

  // Fetch user stats when user is available
  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userStats = await getUserStats(user.id);
        setStats(userStats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
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
            <Card className="max-w-14xl mx-auto border-2 border-black hover:border-blue-400 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-blue-600">
              <CardHeader>
                <CardTitle className="text-white font-bold text-xl">👋 Welcome! Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-100">
                  This platform helps you practice political phone banking conversations
                  with realistic AI-powered voter simulations.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-white">Quick Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-100">
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

          <Card className="border-2 border-black hover:border-green-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(34,197,94,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-600" />
                Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.easyCompleted}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-yellow-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(234,179,8,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                Medium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.mediumCompleted}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-red-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(239,68,68,1)] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-red-600" />
                Hard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats.hardCompleted}
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
                ? "bg-green-200 hover:bg-green-300 text-green-800 font-bold border-2 border-green-400 shadow-[0_4px_0_0_rgba(34,197,94,1)] hover:shadow-[0_6px_0_0_rgba(34,197,94,1)] transition-all"
                : "bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200 shadow-[0_4px_0_0_rgba(34,197,94,1)] hover:shadow-[0_6px_0_0_rgba(34,197,94,1)] transition-all"
            }
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("medium")}
            className={
              selectedDifficulty === "medium"
                ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold border-2 border-yellow-400 shadow-[0_4px_0_0_rgba(234,179,8,1)] hover:shadow-[0_6px_0_0_rgba(234,179,8,1)] transition-all"
                : "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-2 border-yellow-200 shadow-[0_4px_0_0_rgba(234,179,8,1)] hover:shadow-[0_6px_0_0_rgba(234,179,8,1)] transition-all"
            }
          >
            Medium
          </Button>
          <Button
            variant={selectedDifficulty === "hard" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("hard")}
            className={
              selectedDifficulty === "hard"
                ? "bg-red-200 hover:bg-red-300 text-red-800 font-bold border-2 border-red-400 shadow-[0_4px_0_0_rgba(239,68,68,1)] hover:shadow-[0_6px_0_0_rgba(239,68,68,1)] transition-all"
                : "bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200 shadow-[0_4px_0_0_rgba(239,68,68,1)] hover:shadow-[0_6px_0_0_rgba(239,68,68,1)] transition-all"
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
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border-2 shadow-[0_2px_0_0_rgba(0,0,0,1)] ${
                        profile.difficulty === "easy"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : profile.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "bg-red-100 text-red-800 border-red-300"
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
    </ProtectedRoute>
  );
}
