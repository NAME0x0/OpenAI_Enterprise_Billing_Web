"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "@/components/layout/sidebar";
import { Menu } from "lucide-react";
import { DataProvider } from "@/context/data-context";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleToggle = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggle();
      }
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggle, mobileOpen]);

  const marginLeft = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <DataProvider>
      <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div className="flex-1 transition-[margin] duration-200 ease-in-out">
          {/* Spacer for sidebar on desktop */}
          <style>{`
            @media (min-width: 768px) {
              #main-content { margin-left: ${marginLeft}px; }
            }
          `}</style>

          <div id="main-content">
            {/* Mobile Header */}
            <header
              className="flex h-14 items-center gap-3 md:hidden"
              style={{
                borderBottom: "1px solid var(--border-default)",
                background: "var(--bg-secondary)",
                padding: "0 16px",
              }}
            >
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-elevated)]"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                OpenAI Billing
              </span>
            </header>

            <main className="w-full">{children}</main>
          </div>
        </div>
      </div>
    </DataProvider>
  );
}
