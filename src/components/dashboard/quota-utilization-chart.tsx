"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatPercent } from "@/lib/formatters";
import type { Department } from "@/lib/types";

interface QuotaUtilizationChartProps {
  departments: Department[];
}

export function QuotaUtilizationChart({ departments }: QuotaUtilizationChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useMemo(() => {
    return departments.map((department) => {
      const utilization = department.budget > 0 ? (department.spent / department.budget) * 100 : 0;
      return {
        id: department.id,
        name: department.name,
        utilization: Number(utilization.toFixed(1)),
      };
    });
  }, [departments]);

  if (data.length === 0) {
    return (
      <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Quota Utilization Chart">
        <h3 className="heading-section text-sm text-[var(--text-primary)]">Quota Utilization</h3>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">No department quota data available.</p>
      </div>
    );
  }

  return (
    <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Quota Utilization Chart">
      <h3 className="mb-4 heading-section text-sm text-[var(--text-primary)]">Quota Utilization</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 120]}
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
            tickFormatter={(value: number) => formatPercent(value)}
          />
          <YAxis
            type="category"
            width={110}
            dataKey="name"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <ReferenceLine x={80} stroke="var(--warning)" strokeDasharray="4 4" />
          <ReferenceLine x={100} stroke="var(--danger)" strokeDasharray="4 4" />
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
            formatter={(value: number) => formatPercent(value)}
          />
          <Bar dataKey="utilization" radius={[0, 4, 4, 0]} isAnimationActive={!prefersReducedMotion}>
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.utilization >= 100 ? "var(--danger)" : entry.utilization >= 80 ? "var(--warning)" : "var(--success)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
