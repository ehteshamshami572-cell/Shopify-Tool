"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtext?: string;
}

export function ScoreCircle({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  subtext = "/100",
}: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 90) return "#10B981"; // Emerald
    if (val >= 75) return "#6366F1"; // Indigo
    if (val >= 50) return "#F59E0B"; // Amber
    return "#EF4444"; // Rose
  };

  const strokeColor = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1F1F24"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle stroke */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-xl font-black text-slate-100"
          >
            {score}
          </motion.span>
          {subtext && <span className="text-[10px] text-slate-500 font-semibold">{subtext}</span>}
        </div>
      </div>

      {label && <span className="text-xs font-bold text-slate-300">{label}</span>}
    </div>
  );
}
