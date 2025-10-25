"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Phone } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If we're already on the home page, scroll to the section
    if (pathname === "/") {
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // If we're on a different page, navigate to home then scroll
      router.push("/");
      setTimeout(() => {
        const element = document.getElementById("how-it-works");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Phone className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-black">PhoneBanker</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive("/") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <a
              href="#how-it-works"
              onClick={handleHowItWorksClick}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive("/dashboard") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Start Now
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive("/contact") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

