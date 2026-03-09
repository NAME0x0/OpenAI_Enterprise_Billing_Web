"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AppData, AppSettings, AuditEntry } from "@/lib/types";
import { STORAGE_KEY, DATA_VERSION } from "@/lib/constants";

interface DataContextValue {
  data: AppData | null;
  loading: boolean;
  updateSettings: (settings: Partial<AppSettings>) => void;
  acknowledgeAlert: (alertId: string) => void;
  addAuditEntry: (entry: Omit<AuditEntry, "id" | "timestamp">) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as AppData;
          if (parsed.settings?.dataVersion === DATA_VERSION) {
            setData(parsed);
            setLoading(false);
            return;
          }
        } catch {
          // fall through to static data fetch
        }
      }

      try {
        const basePath = "/OpenAI_Enterprise_Billing_Web";
        const [departments, usage, models, apiKeys, alerts, projects, auditLog, settings] = await Promise.all([
          fetch(`${basePath}/data/departments.json`).then((r) => r.json()),
          fetch(`${basePath}/data/usage.json`).then((r) => r.json()),
          fetch(`${basePath}/data/models.json`).then((r) => r.json()),
          fetch(`${basePath}/data/api-keys.json`).then((r) => r.json()),
          fetch(`${basePath}/data/alerts.json`).then((r) => r.json()),
          fetch(`${basePath}/data/projects.json`).then((r) => r.json()),
          fetch(`${basePath}/data/audit-log.json`).then((r) => r.json()),
          fetch(`${basePath}/data/settings.json`).then((r) => r.json()),
        ]);

        const appData: AppData = { departments, usage, models, apiKeys, alerts, projects, auditLog, settings };
        setData(appData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      } catch (error) {
        console.error("Failed to load billing data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setData((prev) => {
      if (!prev) return prev;
      const newSettings = { ...prev.settings, ...partial };
      const entry: AuditEntry = {
        id: `audit-${Date.now()}`,
        action: "settings_updated",
        actor: prev.settings.role,
        target: "settings",
        timestamp: new Date().toISOString(),
        details: `Updated: ${Object.keys(partial).join(", ")}`,
        category: "config",
      };
      return { ...prev, settings: newSettings, auditLog: [entry, ...prev.auditLog] };
    });
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        alerts: prev.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)),
        auditLog: [
          {
            id: `audit-${Date.now()}`,
            action: "alert_acknowledged",
            actor: prev.settings.role,
            target: alertId,
            timestamp: new Date().toISOString(),
            details: `Alert ${alertId} acknowledged`,
            category: "security",
          },
          ...prev.auditLog,
        ],
      };
    });
  }, []);

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, "id" | "timestamp">) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        auditLog: [{ ...entry, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() }, ...prev.auditLog],
      };
    });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, updateSettings, acknowledgeAlert, addAuditEntry }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
