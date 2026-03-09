"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CHART_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Department, UsageRecord } from "@/lib/types";

interface CostByDepartmentChartProps {
  usage: UsageRecord[];
  departments: Department[];
}

export function CostByDepartmentChart({ usage, departments }: CostByDepartmentChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useMemo(() => {
    const departmentNames = new Map(departments.map((d) => [d.id, d.name]));
    const costByDepartment = new Map<string, number>();

    for (const record of usage) {
      costByDepartment.set(record.departmentId, (costByDepartment.get(record.departmentId) ?? 0) + record.cost);
    }

    return Array.from(costByDepartment.entries())
      .map(([departmentId, cost]) => ({
        departmentId,
        name: departmentNames.get(departmentId) ?? departmentId,
        cost: Number(cost.toFixed(2)),
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [usage, departments]);

  if (data.length === 0) {
    return (
      <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Cost by Department Chart">
        <h3 className="heading-section text-sm text-[var(--text-primary)]">Cost by Department</h3>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">No department costs available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="card-surface animate-fadeIn p-5" role="img" aria-label="Cost by Department Chart">
      <h3 className="mb-4 heading-section text-sm text-[var(--text-primary)]">Cost by Department</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 10, left: 10, bottom: 12 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
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
          <Bar dataKey="cost" radius={[4, 4, 0, 0]} fill={CHART_COLORS[1]} isAnimationActive={!prefersReducedMotion} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
