"use client";

import { AlertCircle } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="animate-slideUp flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "rgba(248,113,113,0.1)", color: "var(--danger)" }}
      >
        <AlertCircle size={28} />
      </div>
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        Something went wrong
      </h2>
      <p className="max-w-md text-sm" style={{ color: "var(--text-muted)" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg px-4 py-2 text-sm font-medium"
        style={{
          background: "var(--accent)",
          color: "#fff",
        }}
      >
        Try again
      </button>
    </div>
  );
}
