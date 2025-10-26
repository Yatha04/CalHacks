"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions or need support? We're here to help!
            </p>
          </div>

          {/* Contact Card */}
          <div className="flex justify-center mb-12">
            <Card className="text-center max-w-sm">
              <CardHeader>
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg text-black">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">thekyleliao@gmail.com</p>
              </CardContent>
            </Card>
          </div>


          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-black">
                    How do I get started?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Simply click "Start Now" in the navigation to access the
                    dashboard and begin practicing with AI-powered voter
                    simulations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-black">
                    Do I need any special equipment?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    You'll need a computer with a microphone and internet
                    connection. We recommend using Chrome or Edge for the best
                    experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-black">
                    How are the calls evaluated?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our AI analyzes your conversation for confidence, empathy,
                    clarity, persuasiveness, and enthusiasm, providing detailed
                    feedback after each call.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
