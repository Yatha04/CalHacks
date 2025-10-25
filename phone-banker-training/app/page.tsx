"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Phone Banker Training Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Master the art of phone banking with AI-powered realistic voter
            simulations. Practice conversations, build confidence, and improve
            your persuasion skills.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-8 py-6">
              <Phone className="w-5 h-5" />
              Start Training
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 hover:border-black transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(0,0,0,1)]">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle className="text-black">Realistic Simulations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Practice with AI-powered voter personas that respond naturally to
                your pitch, just like real voters would.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-black transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(0,0,0,1)]">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle className="text-black">Multiple Difficulty Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Start with supportive voters and work your way up to challenging
                conversations with skeptical constituents.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-black transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] hover:shadow-[0_12px_0_0_rgba(0,0,0,1)]">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-black">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
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
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
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
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
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
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
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
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
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
            <Button size="lg" className="gap-2 text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

