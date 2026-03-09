"use client";

interface EnergyKpiCardProps {
  label: string;
  value: string;
  subtitle: string;
  accentColor: string;
  index: number;
}

export function EnergyKpiCard({ label, value, subtitle, accentColor, index }: EnergyKpiCardProps) {
  return (
    <article
      className="card-surface animate-slideUp p-5"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={label}
    >
      <div className="mb-3 h-1 w-8 rounded-full" style={{ background: accentColor, opacity: 0.7 }} />
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 heading-display text-xl text-[var(--text-primary)] tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">{subtitle}</p>
    </article>
  );
}
