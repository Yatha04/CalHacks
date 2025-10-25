"use client";

import { VoterProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { getDifficultyColor } from "@/lib/utils";
import { MapPin, Briefcase, Users } from "lucide-react";

interface VoterProfileCardProps {
  profile: VoterProfile;
  onSelect: (profileId: string) => void;
}

export function VoterProfileCard({ profile, onSelect }: VoterProfileCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-black">{profile.name}</CardTitle>
            <CardDescription className="mt-2">{profile.description}</CardDescription>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getDifficultyColor(
              profile.difficulty
            )}`}
          >
            {profile.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {profile.age} • {profile.location}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{profile.occupation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{profile.votingHistory}</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-black mb-2">Key Issues:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {profile.keyIssues.slice(0, 3).map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <h4 className="font-semibold text-sm text-yellow-800 mb-1">
            Skepticism:
          </h4>
          <p className="text-xs text-yellow-700">{profile.skepticism}</p>
        </div>

        <Button
          onClick={() => onSelect(profile.id)}
          className="w-full"
          size="lg"
        >
          Start Practice Call
        </Button>
      </CardContent>
    </Card>
  );
}

