"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Shopify Audit Route Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Failed to load Shopify Audit
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {error.message || "An unexpected error occurred while loading this view."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </Button>
          <a href="/">
            <Button variant="outline" className="text-xs">
              Return to Home
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
