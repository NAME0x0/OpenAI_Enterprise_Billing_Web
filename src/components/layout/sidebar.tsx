"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Key,
  FolderKanban,
  Building2,
  Bell,
  FileBarChart,
  ScrollText,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const PLATFORM_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Usage", icon: Activity, path: "/usage" },
  { label: "Models", icon: Cpu, path: "/models" },
  { label: "API Keys", icon: Key, path: "/api-keys" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
];

const GOVERNANCE_NAV = [
  { label: "Departments", icon: Building2, path: "/departments" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
  { label: "Reports", icon: FileBarChart, path: "/reports" },
  { label: "Audit Trail", icon: ScrollText, path: "/audit" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH };

function AnimatedIcon({
  icon: Icon,
  size,
  strokeWidth,
  isActive,
}: {
  icon: LucideIcon;
  size: number;
  strokeWidth: number;
  isActive: boolean;
}) {
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const triggerDraw = useCallback(() => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const elements = svg.querySelectorAll<SVGGeometryElement>(
      "path, line, circle, polyline, polygon, rect, ellipse"
    );
    elements.forEach((el) => {
      if (typeof el.getTotalLength !== "function") return;
      const len = el.getTotalLength();
      // Reset to hidden
      el.style.transition = "none";
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      // Force reflow
      void el.getBoundingClientRect();
      // Animate draw-in
      el.style.transition = "stroke-dashoffset 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.strokeDashoffset = "0";
    });
  }, []);

  return (
    <span
      ref={wrapperRef}
      className="sidebar-icon inline-flex shrink-0"
      onMouseEnter={triggerDraw}
    >
      <Icon
        size={size}
        strokeWidth={strokeWidth}
        style={{ color: isActive ? "var(--accent)" : undefined }}
      />
    </span>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const sidebar = document.getElementById("mobile-sidebar");
    if (!sidebar) return;
    const focusable = sidebar.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    if (first) first.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    sidebar.addEventListener("keydown", handleTab);
    return () => sidebar.removeEventListener("keydown", handleTab);
  }, [mobileOpen]);

  const renderNavGroup = (title: string, items: typeof PLATFORM_NAV) => (
    <div className="mb-4 flex flex-col gap-0.5">
      {!collapsed && (
        <div
          className="px-5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </div>
      )}
      {collapsed && <div className="mx-auto my-2 h-px w-6" style={{ background: "var(--border-default)" }} />}
      {items.map((item) => {
        const isActive = pathname === item.path;
        return (
          <div key={item.path} className={collapsed ? "px-2" : "px-3"}>
            <Link
              href={item.path}
              onClick={() => {
                if (mobileOpen) onMobileClose();
              }}
              className="sidebar-nav-link group relative flex items-center rounded-lg transition-all duration-150"
              style={{
                gap: collapsed ? 0 : 12,
                padding: collapsed ? "10px 0" : "8px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? "var(--accent-muted)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: isActive ? 500 : 400,
                fontSize: 13,
              }}
              title={collapsed ? item.label : undefined}
            >
              <AnimatedIcon
                icon={item.icon}
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                isActive={isActive}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {collapsed && (
                <div
                  className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                    zIndex: 60,
                  }}
                >
                  {item.label}
                </div>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <nav
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 z-40 flex flex-col"
        style={{
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-default)",
          transition: "width 200ms ease, transform 200ms ease",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
        // On desktop always visible; on mobile hidden unless mobileOpen
        data-mobile-open={mobileOpen}
      >
        {/* Responsive: hide on mobile unless open */}
        <style>{`
          @media (max-width: 767px) {
            nav#mobile-sidebar:not([data-mobile-open="true"]) {
              transform: translateX(-100%);
            }
          }
        `}</style>

        {/* Header */}
        <div
          className="flex shrink-0 items-center"
          style={{
            height: 56,
            padding: collapsed ? "0 8px" : "0 16px",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          <div
            className="flex items-center"
            style={{ gap: collapsed ? 0 : 12 }}
          >
            <div
              className="flex shrink-0 items-center justify-center rounded-lg sidebar-brand-icon"
              style={{
                width: 32,
                height: 32,
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              <Zap size={18} strokeWidth={2.2} />
            </div>
            {!collapsed && (
              <span
                className="whitespace-nowrap text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                OpenAI Billing
              </span>
            )}
          </div>
          {mobileOpen && (
            <button
              onClick={onMobileClose}
              className="md:hidden rounded-md p-1.5 transition-colors"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-3">
          {renderNavGroup("Platform", PLATFORM_NAV)}
          {renderNavGroup("Governance", GOVERNANCE_NAV)}
        </div>

        {/* Footer Toggle (desktop only) */}
        <div
          className="hidden md:flex"
          style={{
            borderTop: "1px solid var(--border-default)",
            padding: 8,
          }}
        >
          <button
            onClick={onToggle}
            className="sidebar-nav-link flex w-full items-center justify-center rounded-lg p-2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </nav>
    </>
  );
}
