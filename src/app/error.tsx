"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-slate-100 p-6 text-center space-y-4">
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full">
        <AlertTriangle className="h-10 w-10 animate-pulse" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h1 className="text-2xl font-black">Something went wrong</h1>
        <p className="text-xs text-slate-400 leading-normal">
          An unexpected error occurred. The application remains stable and safe to retry.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 mt-4"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
