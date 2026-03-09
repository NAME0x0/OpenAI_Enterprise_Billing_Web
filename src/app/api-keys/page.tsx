"use client";

import { KeyRound } from "lucide-react";

import { useData } from "@/context/data-context";
import { formatDate } from "@/lib/formatters";
import type { ApiKey } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/tables/data-table";

function apiKeyStatusVariant(status: ApiKey["status"]) {
  if (status === "active") return "success" as const;
  if (status === "revoked") return "danger" as const;
  return "warning" as const;
}

export default function ApiKeysPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="API Keys" description="Managed API credentials by department and lifecycle status." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  if (data.apiKeys.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="API Keys" description="Managed API credentials by department and lifecycle status." badge="0" />
        <EmptyState
          title="No API keys found"
          description="Provisioned API credentials will appear here."
          icon={KeyRound}
        />
      </section>
    );
  }

  const departmentNames = new Map(data.departments.map((department) => [department.id, department.name]));

  const columns: Column<ApiKey>[] = [
    { header: "Name", accessor: "name" },
    { header: "Masked Key", accessor: "key" },
    {
      header: "Department",
      accessor: (row) => departmentNames.get(row.departmentId) ?? row.departmentId,
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} variant={apiKeyStatusVariant(row.status)} />,
      align: "center",
    },
    { header: "Created", accessor: (row) => formatDate(row.createdAt), align: "right" },
    { header: "Last Used", accessor: (row) => formatDate(row.lastUsed), align: "right" },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="API Keys"
        description="Review key ownership, access status, and recent usage across teams."
        badge={`${data.apiKeys.length} keys`}
      />
      <DataTable columns={columns} data={data.apiKeys} caption="API keys table" />
    </section>
  );
}
