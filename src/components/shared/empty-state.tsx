"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="glass-surface animate-slideUp flex flex-col items-center justify-center rounded-xl px-8 py-12 text-center"
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
      {description && <p className="mt-1 max-w-[250px] text-xs text-[var(--text-muted)]">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
