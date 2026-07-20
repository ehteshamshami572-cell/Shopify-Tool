"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface TrendChartProps {
  data: { label: string; score: number }[];
  color?: string;
  height?: number;
}

export function TrendChart({
  data,
  color = "#6366F1", // Indigo
  height = 180,
}: TrendChartProps) {
  return (
    <div style={{ width: "100%", height }} className="select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#121215",
              borderColor: "#27272A",
              borderRadius: "8px",
              color: "#F4F4F5",
              fontSize: "11px",
            }}
          />
          <Area type="monotone" dataKey="score" stroke={color} strokeWidth={2.5} fillOpacity={1} fill="url(#chartGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
