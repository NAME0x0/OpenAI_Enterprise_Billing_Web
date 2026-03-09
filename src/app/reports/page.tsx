"use client";

import { FileBarChart } from "lucide-react";

import { useData } from "@/context/data-context";
import { exportToCsv } from "@/lib/csv-export";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

type ExportableRow = object;

function exportCollectionCsv(filename: string, rows: ExportableRow[]) {
  if (rows.length === 0) {
    exportToCsv(filename, [], []);
    return;
  }

  const headers = Object.keys(rows[0] as Record<string, unknown>);
  const tableRows = rows.map((row) => {
    const record = row as Record<string, unknown>;
    return headers.map((header) => String(record[header] ?? ""));
  });
  exportToCsv(filename, headers, tableRows);
}

export default function ReportsPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Reports" description="Export billing datasets and review summary metrics." />
        <LoadingSkeleton variant="page" />
      </section>
    );
  }

  const totalSpend = data.usage.reduce((sum, row) => sum + row.cost, 0);
  const totalTokens = data.usage.reduce((sum, row) => sum + row.tokens, 0);

  const summaryCards = [
    { label: "Total Spend", value: formatCurrency(totalSpend, data.settings.currency) },
    { label: "Total Tokens", value: formatNumber(totalTokens) },
    { label: "Usage Records", value: formatNumber(data.usage.length) },
    { label: "Audit Entries", value: formatNumber(data.auditLog.length) },
  ];

  const exportOptions = [
    { key: "departments", label: "Departments", rows: data.departments as ExportableRow[] },
    { key: "usage", label: "Usage", rows: data.usage as ExportableRow[] },
    { key: "models", label: "Models", rows: data.models as ExportableRow[] },
    { key: "api-keys", label: "API Keys", rows: data.apiKeys as ExportableRow[] },
    { key: "alerts", label: "Alerts", rows: data.alerts as ExportableRow[] },
    { key: "projects", label: "Projects", rows: data.projects as ExportableRow[] },
    { key: "audit-log", label: "Audit Log", rows: data.auditLog as ExportableRow[] },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Reports"
        description="Generate CSV exports for billing analysis, compliance review, and stakeholder reporting."
        badge={`${exportOptions.length} exports`}
      />

      {exportOptions.every((option) => option.rows.length === 0) ? (
        <EmptyState
          title="No report data available"
          description="Load data first to generate export files."
          icon={FileBarChart}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.label}
                className="card-surface p-5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{card.label}</p>
                <p className="mt-2 heading-display text-xl text-[var(--text-primary)] tabular-nums">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="card-surface grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
            {exportOptions.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between rounded-lg border border-[var(--border-default)] p-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{option.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{formatNumber(option.rows.length)} records</p>
                </div>
                <Button
                  onClick={() =>
                    exportCollectionCsv(
                      `${option.key}-${new Date().toISOString().slice(0, 10)}.csv`,
                      option.rows
                    )
                  }
                >
                  Export CSV
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
