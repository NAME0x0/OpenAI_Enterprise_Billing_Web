"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CHART_COLORS } from "@/lib/constants";
import { formatNumber } from "@/lib/formatters";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { UsageRecord } from "@/lib/types";

interface UsageByModelChartProps {
  usage: UsageRecord[];
}

export function UsageByModelChart({ usage }: UsageByModelChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useMemo(() => {
    const tokenByModel = new Map<string, number>();
    for (const record of usage) {
      tokenByModel.set(record.model, (tokenByModel.get(record.model) ?? 0) + record.tokens);
    }
    return Array.from(tokenByModel.entries())
      .map(([model, tokens]) => ({ model, tokens }))
      .sort((a, b) => b.tokens - a.tokens);
  }, [usage]);

  if (data.length === 0) {
    return (
      <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Usage by Model Chart">
        <h3 className="heading-section text-sm text-[var(--text-primary)]">Usage by Model</h3>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">No token usage available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Usage by Model Chart">
      <h3 className="mb-4 heading-section text-sm text-[var(--text-primary)]">Usage by Model</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
            tickFormatter={(value: number) => formatNumber(value)}
          />
          <YAxis
            type="category"
            width={120}
            dataKey="model"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              fontSize: 13,
              padding: "10px 12px",
            }}
            labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }}
            itemStyle={{ color: "var(--text-primary)" }}
            cursor={{ fill: "rgba(129,140,248,0.06)" }}
            formatter={(value: number) => formatNumber(value)}
          />
          <Bar dataKey="tokens" radius={[0, 4, 4, 0]} fill={CHART_COLORS[5]} isAnimationActive={!prefersReducedMotion} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
