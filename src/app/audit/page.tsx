"use client";

import { ScrollText } from "lucide-react";

import { useData } from "@/context/data-context";
import type { AuditEntry } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/tables/data-table";

function categoryVariant(category: AuditEntry["category"]) {
  if (category === "security") return "danger" as const;
  if (category === "billing") return "warning" as const;
  if (category === "access") return "info" as const;
  return "neutral" as const;
}

export default function AuditPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Audit Trail" description="Immutable activity log across access, configuration, and billing actions." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  const sortedAuditLog = [...data.auditLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedAuditLog.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Audit Trail" description="Immutable activity log across access, configuration, and billing actions." badge="0" />
        <EmptyState title="No audit entries found" description="Recorded actions will appear here." icon={ScrollText} />
      </section>
    );
  }

  const columns: Column<AuditEntry>[] = [
    {
      header: "Timestamp",
      accessor: (row) =>
        new Date(row.timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    { header: "Action", accessor: "action" },
    { header: "Actor", accessor: "actor" },
    { header: "Target", accessor: "target" },
    {
      header: "Category",
      accessor: (row) => <StatusBadge status={row.category} variant={categoryVariant(row.category)} />,
      align: "center",
    },
    { header: "Details", accessor: "details" },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Audit Trail"
        description="Track system actions in reverse chronological order for compliance and troubleshooting."
        badge={`${sortedAuditLog.length} entries`}
      />
      <DataTable columns={columns} data={sortedAuditLog} caption="Audit trail entries table" />
    </section>
  );
}
