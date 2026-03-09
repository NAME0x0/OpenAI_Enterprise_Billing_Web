"use client";

import { useEffect, useMemo, useState } from "react";
import { Settings } from "lucide-react";

import { useData } from "@/context/data-context";
import type { AppSettings } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const { data, loading, updateSettings } = useData();
  const [form, setForm] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  const hasChanges = useMemo(() => {
    if (!form || !data?.settings) return false;
    return JSON.stringify(form) !== JSON.stringify(data.settings);
  }, [form, data?.settings]);

  useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
    }
  }, [data?.settings]);

  if (loading || !data || !form) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Settings" description="Configure quota thresholds, alerts, and role-based preferences." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  if (!data.settings) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Settings" description="Configure quota thresholds, alerts, and role-based preferences." badge="0" />
        <EmptyState title="Settings unavailable" description="Settings data was not loaded." icon={Settings} />
      </section>
    );
  }

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Settings"
        description="Manage alert policies, currency display, and access role preferences."
        badge="Workspace settings"
      />

      <form
        className="card-surface space-y-6 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          updateSettings(form);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="quota-threshold">Quota Threshold</Label>
            <span className="text-xs text-[var(--text-secondary)]">{form.quotaThreshold}%</span>
          </div>
          <input
            id="quota-threshold"
            type="range"
            min={0}
            max={100}
            step={1}
            value={form.quotaThreshold}
            onChange={(event) =>
              setForm((prev) => (prev ? { ...prev, quotaThreshold: Number(event.target.value) } : prev))
            }
            className="w-full accent-[var(--accent)]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alert-email">Alert Email</Label>
          <input
            id="alert-email"
            type="email"
            value={form.alertEmail}
            onChange={(event) => setForm((prev) => (prev ? { ...prev, alertEmail: event.target.value } : prev))}
            className="h-9 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={form.currency}
              onValueChange={(value: AppSettings["currency"]) =>
                setForm((prev) => (prev ? { ...prev, currency: value } : prev))
              }
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.role}
              onValueChange={(value: AppSettings["role"]) =>
                setForm((prev) => (prev ? { ...prev, role: value } : prev))
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">user</SelectItem>
                <SelectItem value="manager">manager</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border-default)] pt-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Dark mode is fixed to true in v1. Data version: {form.dataVersion}
          </p>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-[var(--success)]">Settings saved</span>}
            <Button type="submit" disabled={!hasChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
