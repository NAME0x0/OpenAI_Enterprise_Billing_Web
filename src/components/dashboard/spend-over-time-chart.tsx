"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CHART_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { UsageRecord } from "@/lib/types";

interface SpendOverTimeChartProps {
  usage: UsageRecord[];
}

export function SpendOverTimeChart({ usage }: SpendOverTimeChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const record of usage) {
      const month = record.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + record.cost);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, cost]) => ({
        month,
        label: new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        cost: Number(cost.toFixed(2)),
      }));
  }, [usage]);

  if (data.length === 0) {
    return (
      <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Spend Over Time Chart">
        <h3 className="heading-section text-sm text-[var(--text-primary)]">Spend Over Time</h3>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">No usage data available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Spend Over Time Chart">
      <h3 className="mb-4 heading-section text-sm text-[var(--text-primary)]">Spend Over Time</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
              <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
          <YAxis
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
            tickFormatter={(value: number) => formatCurrency(value)}
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
            formatter={(value: number) => formatCurrency(value)}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke={CHART_COLORS[0]}
            fill="url(#spendGradient)"
            strokeWidth={2}
            isAnimationActive={!prefersReducedMotion}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
