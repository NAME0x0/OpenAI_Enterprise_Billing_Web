"use client";

import React from "react";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  status: string;
  variant: StatusVariant;
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          wrapper: "border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.05)] text-[var(--success)]",
          dot: "bg-[var(--success)]",
        };
      case "warning":
        return {
          wrapper: "border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.05)] text-[var(--warning)]",
          dot: "bg-[var(--warning)]",
        };
      case "danger":
        return {
          wrapper: "border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.05)] text-[var(--danger)]",
          dot: "bg-[var(--danger)]",
        };
      case "info":
        return {
          wrapper: "border-[rgba(56,189,248,0.2)] bg-[rgba(56,189,248,0.05)] text-[var(--info)]",
          dot: "bg-[var(--info)]",
        };
      case "neutral":
      default:
        return {
          wrapper: "border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
          dot: "bg-[var(--text-muted)]",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-none ${styles.wrapper}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
