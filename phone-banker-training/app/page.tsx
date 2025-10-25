"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-6xl font-bold mb-4 text-black">
            PhoneBanker
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">
            Master the Art of Phone Banking with Agentic AI voter simulations
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Practice, build confidence, and deliver the vote. 
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all">
              <Phone className="w-5 h-5" />
              Start Training
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle className="text-black font-bold text-xl">Realistic Simulations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Practice with AI-powered voter personas that respond naturally to
                your pitch, just like real voters would.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle className="text-black font-bold text-xl">Multiple Difficulty Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Start with supportive voters and work your way up to challenging
                conversations with skeptical constituents.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:border-blue-600 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(59,130,246,1)] bg-white">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle className="text-black font-bold text-xl">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Get detailed feedback on your confidence, persuasiveness, and
                empathy with actionable improvement tips.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="max-w-4xl mx-auto scroll-mt-20">
          <h2 className="text-3xl font-bold text-black text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Choose Your Difficulty Level
                </h3>
                <p className="text-gray-600">
                  Select from Easy, Medium, or Hard voter profiles based on your
                  experience level. Each profile has unique concerns and
                  skepticism.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Practice Your Phone Call
                </h3>
                <p className="text-gray-600">
                  Engage in a realistic voice conversation with an AI-powered
                  voter. They&apos;ll respond naturally based on their profile,
                  concerns, and your approach.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Review Your Performance
                </h3>
                <p className="text-gray-600">
                  Get instant feedback with detailed metrics on confidence,
                  enthusiasm, clarity, persuasiveness, and empathy. Learn from
                  your strengths and areas for improvement.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg text-black mb-2">
                  Track Your Progress
                </h3>
                <p className="text-gray-600">
                  Monitor your improvement over time with comprehensive analytics
                  and progress tracking across all difficulty levels.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

