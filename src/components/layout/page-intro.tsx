"use client";

import React from "react";

interface PageIntroProps {
  title: string;
  description: string;
  badge?: string;
}

export function PageIntro({ title, description, badge }: PageIntroProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-8 animate-slideUp">
      <div className="flex items-center gap-3">
        <h1 className="heading-section text-xl text-[var(--text-primary)]">{title}</h1>
        {badge && (
          <span className="badge-chip">
            {badge}
          </span>
        )}
      </div>
      <p className="body-prose text-sm text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}
