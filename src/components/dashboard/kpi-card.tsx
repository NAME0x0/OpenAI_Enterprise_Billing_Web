"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  index?: number;
}

export function KpiCard({ label, value, subtitle, trend = "neutral", trendValue, index = 0 }: KpiCardProps) {
  const trendIcon =
    trend === "up" ? (
      <ArrowUpRight className="h-3.5 w-3.5" />
    ) : trend === "down" ? (
      <ArrowDownRight className="h-3.5 w-3.5" />
    ) : (
      <Minus className="h-3.5 w-3.5" />
    );

  const trendColor =
    trend === "up"
      ? "var(--success)"
      : trend === "down"
        ? "var(--danger)"
        : "var(--text-muted)";

  return (
    <article
      className="card-interactive animate-slideUp p-5"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={label}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 heading-display text-2xl text-[var(--text-primary)] tabular-nums">{value}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-[var(--text-secondary)]">{subtitle ?? ""}</p>
        {trendValue && (
          <span className="inline-flex items-center gap-1 text-xs" style={{ color: trendColor }}>
            {trendIcon}
            {trendValue}
          </span>
        )}
      </div>
    </article>
  );
}
