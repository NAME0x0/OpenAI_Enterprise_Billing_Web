"use client";

import { Building2 } from "lucide-react";

import { useData } from "@/context/data-context";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { Department } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { DataTable, type Column } from "@/components/tables/data-table";

export default function DepartmentsPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Departments" description="Budget allocation and utilization by department." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  if (data.departments.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Departments" description="Budget allocation and utilization by department." badge="0" />
        <EmptyState
          title="No departments found"
          description="Department records will appear here once data is available."
          icon={Building2}
        />
      </section>
    );
  }

  const columns: Column<Department>[] = [
    { header: "Department", accessor: "name" },
    {
      header: "Budget",
      accessor: (row) => formatCurrency(row.budget, data.settings.currency),
      align: "right",
    },
    {
      header: "Spent",
      accessor: (row) => formatCurrency(row.spent, data.settings.currency),
      align: "right",
    },
    {
      header: "Utilization",
      accessor: (row) => {
        const utilization = row.budget > 0 ? (row.spent / row.budget) * 100 : 0;
        return (
          <div className="flex items-center gap-3">
            <Progress value={Math.min(utilization, 100)} className="h-2 w-28" />
            <span className="text-xs text-[var(--text-secondary)]">{formatPercent(utilization)}</span>
          </div>
        );
      },
    },
    { header: "Headcount", accessor: "headcount", align: "right" },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Departments"
        description="Track budget utilization, spend performance, and staffing by department."
        badge={`${data.departments.length} departments`}
      />
      <DataTable columns={columns} data={data.departments} caption="Departments budget and utilization table" />
    </section>
  );
}
