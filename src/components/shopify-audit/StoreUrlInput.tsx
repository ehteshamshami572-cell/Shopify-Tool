"use client";

import React, { useState } from "react";
import { Search, Loader2, Sparkles, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StoreUrlInputProps {
  onStartAudit: (url: string) => void;
  isLoading: boolean;
  initialUrl?: string;
}

const EXAMPLE_STORES = [
  { name: "Gymshark", url: "https://www.gymshark.com" },
  { name: "Allbirds", url: "https://www.allbirds.com" },
  { name: "Kith", url: "https://kith.com" },
  { name: "Chubbies", url: "https://www.chubbiesshorts.com" },
];

export function StoreUrlInput({ onStartAudit, isLoading, initialUrl = "" }: StoreUrlInputProps) {
  const [url, setUrl] = useState(initialUrl);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setInputError("Please enter a Shopify store URL");
      return;
    }

    // Basic format check
    if (!trimmed.includes(".") || trimmed.length < 4) {
      setInputError("Please enter a valid store domain or URL (e.g., store.myshopify.com or brand.com)");
      return;
    }

    setInputError(null);
    onStartAudit(trimmed);
  };

  const handleSelectExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setInputError(null);
    onStartAudit(exampleUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Globe className="h-4 w-4" />
          </div>
          <Input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (inputError) setInputError(null);
            }}
            placeholder="e.g. gymshark.com or your-store.myshopify.com"
            disabled={isLoading}
            className="pl-10 pr-4 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-sm md:text-base"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Store...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run Deep Audit</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {inputError && (
        <div className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5 pl-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600" />
          {inputError}
        </div>
      )}

      {/* Suggested examples */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-400">Try popular stores:</span>
        {EXAMPLE_STORES.map((store) => (
          <button
            key={store.name}
            type="button"
            disabled={isLoading}
            onClick={() => handleSelectExample(store.url)}
            className="px-2.5 py-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-200/60"
          >
            {store.name}
          </button>
        ))}
      </div>
    </div>
  );
}
