"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-slate-100 p-6 text-center space-y-4">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
        <AlertCircle className="h-10 w-10" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h1 className="text-3xl font-black">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400">The requested resource or auditing page could not be found.</p>
      </div>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 mt-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
