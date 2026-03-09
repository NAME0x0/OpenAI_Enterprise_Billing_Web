"use client";

import React from "react";

interface LoadingSkeletonProps {
  variant: "card" | "table" | "page";
}

export function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="h-32 w-full animate-pulse rounded-xl bg-[var(--bg-elevated)] opacity-50"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div role="status" aria-live="polite" className="flex w-full flex-col gap-4">
        <div className="h-10 w-full animate-pulse rounded-md bg-[var(--bg-elevated)] opacity-50" />
        <div className="h-8 w-[95%] animate-pulse rounded-md bg-[var(--bg-elevated)] opacity-40" />
        <div className="h-8 w-[90%] animate-pulse rounded-md bg-[var(--bg-elevated)] opacity-40" />
        <div className="h-8 w-[98%] animate-pulse rounded-md bg-[var(--bg-elevated)] opacity-40" />
        <div className="h-8 w-[85%] animate-pulse rounded-md bg-[var(--bg-elevated)] opacity-40" />
        <span className="sr-only">Loading table data...</span>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex w-full animate-pulse flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="h-6 w-48 rounded-md bg-[var(--bg-elevated)] opacity-60" />
        <div className="h-4 w-96 rounded-md bg-[var(--bg-elevated)] opacity-40" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-[var(--bg-elevated)] opacity-50" />
        ))}
      </div>
      <div className="h-64 w-full rounded-xl bg-[var(--bg-elevated)] opacity-40" />
      <span className="sr-only">Loading page data...</span>
    </div>
  );
}
