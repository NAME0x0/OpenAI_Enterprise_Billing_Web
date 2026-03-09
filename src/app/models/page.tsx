"use client";

import { Cpu } from "lucide-react";

import { useData } from "@/context/data-context";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { Model } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/tables/data-table";

function modelStatusVariant(status: Model["status"]) {
  if (status === "active") return "success" as const;
  if (status === "restricted") return "warning" as const;
  return "neutral" as const;
}

export default function ModelsPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Models" description="Available model catalog with pricing and status." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  if (data.models.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Models" description="Available model catalog with pricing and status." badge="0" />
        <EmptyState
          title="No models configured"
          description="Model information will appear once data is loaded."
          icon={Cpu}
        />
      </section>
    );
  }

  const columns: Column<Model>[] = [
    { header: "Model", accessor: "name" },
    { header: "Provider", accessor: "provider" },
    {
      header: "Input / 1M",
      accessor: (row) => formatCurrency(row.costPer1kInput * 1000, data.settings.currency),
      align: "right",
    },
    {
      header: "Output / 1M",
      accessor: (row) => formatCurrency(row.costPer1kOutput * 1000, data.settings.currency),
      align: "right",
    },
    {
      header: "Context Window",
      accessor: (row) => formatNumber(row.contextWindow),
      align: "right",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} variant={modelStatusVariant(row.status)} />,
      align: "center",
    },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Models"
        description="Review model availability, pricing characteristics, and deployment status."
        badge={`${data.models.length} models`}
      />
      <DataTable columns={columns} data={data.models} caption="Models catalog and pricing table" />
    </section>
  );
}
