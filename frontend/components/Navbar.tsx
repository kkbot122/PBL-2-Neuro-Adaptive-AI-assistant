"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // 1. HIDE NAVBAR ON LANDING PAGE
  // This ensures the navbar isn't visible on the initial welcome screen.
  if (pathname === "/") {
    return null;
  }

  // Helper to highlight the active link
  const linkStyle = (path: string) => 
    `px-4 py-2 rounded-md transition-all duration-200 ${
      pathname === path 
        ? "bg-blue-600 text-white shadow-md" 
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <div className="font-bold text-xl tracking-tighter text-blue-700 hidden sm:block">
            NEURO<span className="text-gray-900">ADAPT</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex gap-2 sm:gap-4 font-medium text-sm">
          <Link href="/read/1" className={linkStyle("/read/1")}>
            Reading Mission
          </Link>
          <Link href="/profile" className={linkStyle("/profile")}>
            My Learning Profile
          </Link>
        </div>

        {/* Status Indicator (Optional) */}
        <div className="hidden md:block text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          Profiling Active
        </div>
      </div>
    </nav>
  );
}