import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ScanHistoryItem {
  url: string;
  domain: string;
  overallScore: number;
  scannedAt: string;
  themeName: string;
  isShopify: boolean;
}

interface ScanState {
  currentScan: any | null;
  recentScans: ScanHistoryItem[];
  isScanning: boolean;
  scanningError: string | null;
  activeView: string;
  prefilledUrl: string;
  
  // Actions
  setCurrentScan: (scan: any) => void;
  addRecentScan: (item: ScanHistoryItem) => void;
  clearRecentScans: () => void;
  setScanning: (isScanning: boolean) => void;
  setScanningError: (error: string | null) => void;
  setActiveView: (view: string) => void;
  setPrefilledUrl: (url: string) => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      currentScan: null,
      recentScans: [],
      isScanning: false,
      scanningError: null,
      activeView: "landing",
      prefilledUrl: "",

      setCurrentScan: (scan) => set({ currentScan: scan }),
      
      addRecentScan: (item) =>
        set((state) => {
          // Remove duplicates of the same domain
          const filtered = state.recentScans.filter((s) => s.domain !== item.domain);
          return {
            recentScans: [item, ...filtered].slice(0, 10), // Limit to 10 items
          };
        }),

      clearRecentScans: () => set({ recentScans: [] }),
      setScanning: (isScanning) => set({ isScanning }),
      setScanningError: (error) => set({ scanningError: error }),
      setActiveView: (view) => set({ activeView: view }),
      setPrefilledUrl: (url) => set({ prefilledUrl: url }),
    }),
    {
      name: "shopify-toolkit-storage",
      partialize: (state) => ({
        recentScans: state.recentScans,
        currentScan: state.currentScan,
        // Exclude activeView and prefilledUrl from localStorage persistence
      }),
    }
  )
);
