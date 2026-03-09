"use client";

import { FolderKanban } from "lucide-react";

import { useData } from "@/context/data-context";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { Project } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { DataTable, type Column } from "@/components/tables/data-table";

function projectStatusVariant(status: Project["status"]) {
  if (status === "active") return "success" as const;
  if (status === "paused") return "warning" as const;
  return "neutral" as const;
}

export default function ProjectsPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Projects" description="Budget and progress tracking across AI initiatives." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  if (data.projects.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Projects" description="Budget and progress tracking across AI initiatives." badge="0" />
        <EmptyState title="No projects found" description="Project records will appear here." icon={FolderKanban} />
      </section>
    );
  }

  const departmentNames = new Map(data.departments.map((department) => [department.id, department.name]));

  const columns: Column<Project>[] = [
    { header: "Project", accessor: "name" },
    { header: "Department", accessor: (row) => departmentNames.get(row.departmentId) ?? row.departmentId },
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
      header: "Progress",
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
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} variant={projectStatusVariant(row.status)} />,
      align: "center",
    },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Projects"
        description="Monitor project-level budget utilization and execution status by department."
        badge={`${data.projects.length} projects`}
      />
      <DataTable columns={columns} data={data.projects} caption="Project budget utilization table" />
    </section>
  );
}
