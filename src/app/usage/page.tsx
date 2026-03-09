"use client";

import { Activity } from "lucide-react";

import { useData } from "@/context/data-context";
import { useFilters } from "@/hooks/use-filters";
import { exportToCsv } from "@/lib/csv-export";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import type { UsageRecord } from "@/lib/types";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/tables/data-table";

export default function UsagePage() {
  const { data, loading } = useData();
  const { filters, filteredUsage, updateFilter, resetFilters } = useFilters(data?.usage ?? []);

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Usage" description="Detailed API usage records across teams, models, and projects." />
        <LoadingSkeleton variant="table" />
      </section>
    );
  }

  if (data.usage.length === 0) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Usage" description="Detailed API usage records across teams, models, and projects." badge="0" />
        <EmptyState title="No usage records found" description="Usage activity will appear once data is loaded." icon={Activity} />
      </section>
    );
  }

  const departmentNames = new Map(data.departments.map((department) => [department.id, department.name]));

  const exportUsageCsv = () => {
    const rows = filteredUsage.map((row) => [
      row.date,
      departmentNames.get(row.departmentId) ?? row.departmentId,
      row.model,
      String(row.tokens),
      String(row.cost),
      row.project ?? "",
      row.user ?? "",
    ]);

    exportToCsv(
      `usage-report-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Date", "Department", "Model", "Tokens", "Cost", "Project", "User"],
      rows
    );
  };

  const columns: Column<UsageRecord>[] = [
    { header: "Date", accessor: (row) => formatDate(row.date) },
    {
      header: "Department",
      accessor: (row) => departmentNames.get(row.departmentId) ?? row.departmentId,
    },
    { header: "Model", accessor: "model" },
    { header: "Tokens", accessor: (row) => formatNumber(row.tokens), align: "right" },
    {
      header: "Cost",
      accessor: (row) => formatCurrency(row.cost, data.settings.currency),
      align: "right",
    },
    { header: "Project", accessor: (row) => row.project ?? "—" },
  ];

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Usage"
        description="Explore granular usage records by date, department, model, and project."
        badge={`${filteredUsage.length} records`}
      />

      <div className="card-surface grid grid-cols-1 gap-3 p-4 md:grid-cols-5">
        <Select value={filters.department} onValueChange={(value) => updateFilter("department", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {data.departments.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.model} onValueChange={(value) => updateFilter("model", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {data.models.map((model) => (
              <SelectItem key={model.id} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => updateFilter("dateFrom", event.target.value)}
          className="h-9 rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)]"
          aria-label="Date from"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => updateFilter("dateTo", event.target.value)}
          className="h-9 rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)]"
          aria-label="Date to"
        />

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button onClick={exportUsageCsv}>Export CSV</Button>
        </div>
      </div>

      {filteredUsage.length === 0 ? (
        <EmptyState
          title="No usage records match the current filters"
          description="Try broadening the date range or selecting all departments and models."
          icon={Activity}
        />
      ) : (
        <DataTable columns={columns} data={filteredUsage} caption="Usage records table" />
      )}
    </section>
  );
}
