"use client";

import { useState } from "react";
import { AlertTriangle, Bell, Info, ShieldAlert } from "lucide-react";

import { useData } from "@/context/data-context";
import { formatDate, formatPercent } from "@/lib/formatters";
import type { Alert } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

function severityVariant(severity: Alert["severity"]) {
  if (severity === "critical") return "danger" as const;
  if (severity === "warning") return "warning" as const;
  return "info" as const;
}

function severityIcon(severity: Alert["severity"]) {
  if (severity === "critical") return ShieldAlert;
  if (severity === "warning") return AlertTriangle;
  return Info;
}

export default function AlertsPage() {
  const { data, loading, acknowledgeAlert, addAuditEntry } = useData();
  const [reviewedAutoAlerts, setReviewedAutoAlerts] = useState<Set<string>>(new Set());

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Alerts" description="Billing, quota, anomaly, and security alerts." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  const existingQuotaDepartmentIds = new Set(
    data.alerts.filter((alert) => alert.type === "quota" && alert.departmentId).map((alert) => alert.departmentId)
  );

  const autoQuotaAlerts = data.departments.reduce<Alert[]>((alerts, department) => {
      const utilization = department.budget > 0 ? (department.spent / department.budget) * 100 : 0;
      if (utilization < data.settings.quotaThreshold || existingQuotaDepartmentIds.has(department.id)) {
        return alerts;
      }

      alerts.push({
        id: `auto-quota-${department.id}`,
        type: "quota",
        severity: utilization >= 100 ? "critical" : "warning",
        title: `${department.name} exceeded threshold`,
        message: `${department.name} is at ${formatPercent(utilization)} of budget (threshold ${data.settings.quotaThreshold}%).`,
        departmentId: department.id,
        createdAt: new Date().toISOString(),
        acknowledged: false,
      });

      return alerts;
    }, []);

  const mergedAlerts = [...autoQuotaAlerts, ...data.alerts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (mergedAlerts.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Alerts" description="Billing, quota, anomaly, and security alerts." badge="0" />
        <EmptyState title="No active alerts" description="You are all caught up." icon={Bell} />
      </section>
    );
  }

  const departmentNames = new Map(data.departments.map((department) => [department.id, department.name]));

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Alerts"
        description="Review and acknowledge quota, anomaly, billing, and security notifications."
        badge={`${mergedAlerts.length} alerts`}
      />

      <div className="grid grid-cols-1 gap-3">
        {mergedAlerts.map((alert) => {
          const Icon = severityIcon(alert.severity);
          const isAuto = alert.id.startsWith("auto-quota-");

          return (
            <article
              key={alert.id}
              className="card-interactive p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{alert.title}</h3>
                      <StatusBadge status={alert.severity} variant={severityVariant(alert.severity)} />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{alert.message}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDate(alert.createdAt)}
                      {alert.departmentId && ` • ${departmentNames.get(alert.departmentId) ?? alert.departmentId}`}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  disabled={alert.acknowledged || reviewedAutoAlerts.has(alert.id)}
                  onClick={() => {
                    if (isAuto) {
                      setReviewedAutoAlerts((prev) => new Set(prev).add(alert.id));
                      addAuditEntry({
                        action: "auto_alert_reviewed",
                        actor: data.settings.role,
                        target: alert.id,
                        details: `Reviewed generated quota alert: ${alert.id}`,
                        category: "billing",
                      });
                      return;
                    }
                    acknowledgeAlert(alert.id);
                  }}
                >
                  {alert.acknowledged || reviewedAutoAlerts.has(alert.id) ? "Acknowledged" : "Acknowledge"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
