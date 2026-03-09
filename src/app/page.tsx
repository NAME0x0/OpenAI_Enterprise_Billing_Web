"use client";

import { useMemo } from "react";

import { useData } from "@/context/data-context";
import { useFilters } from "@/hooks/use-filters";
import { computeEnergyMetrics } from "@/lib/energy";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import { PageIntro } from "@/components/layout/page-intro";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { EnergyKpiCard } from "@/components/dashboard/energy-kpi-card";
import { SpendOverTimeChart } from "@/components/dashboard/spend-over-time-chart";
import { CostByDepartmentChart } from "@/components/dashboard/cost-by-department-chart";
import { UsageByModelChart } from "@/components/dashboard/usage-by-model-chart";
import { QuotaUtilizationChart } from "@/components/dashboard/quota-utilization-chart";

export default function DashboardPage() {
  const { data, loading } = useData();
  const { filters, filteredUsage, updateFilter, resetFilters } = useFilters(data?.usage ?? []);

  const kpis = useMemo(() => {
    if (!data) {
      return { totalSpend: 0, totalTokens: 0, activeDepartments: 0, activeAlerts: 0 };
    }

    const totalSpend = filteredUsage.reduce((sum, record) => sum + record.cost, 0);
    const totalTokens = filteredUsage.reduce((sum, record) => sum + record.tokens, 0);
    const activeDepartments = new Set(filteredUsage.map((record) => record.departmentId)).size;
    const activeAlerts = data.alerts.filter((alert) => !alert.acknowledged).length;

    return { totalSpend, totalTokens, activeDepartments, activeAlerts };
  }, [filteredUsage, data]);

  const energy = useMemo(() => computeEnergyMetrics(kpis.totalTokens), [kpis.totalTokens]);

  if (loading || !data) {
    return (
      <section className="page-shell page-stack">
        <PageIntro title="Dashboard" description="Enterprise spend and usage overview." />
        <LoadingSkeleton variant="page" />
      </section>
    );
  }

  return (
    <section className="page-shell page-stack">
      <PageIntro
        title="Dashboard"
        description="Monitor billing trends, model usage, quota utilization, and sustainability metrics in one place."
        badge={`${filteredUsage.length} records`}
      />

      <div className="card-surface grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
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

        <div className="flex gap-2">
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => updateFilter("dateTo", event.target.value)}
            className="h-9 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)]"
            aria-label="Date to"
          />
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          index={0}
          label="Total Spend"
          value={formatCurrency(kpis.totalSpend, data.settings.currency)}
          subtitle="Filtered range"
          trend="up"
          trendValue="4.2%"
        />
        <KpiCard
          index={1}
          label="Active Departments"
          value={formatNumber(kpis.activeDepartments)}
          subtitle="With billable usage"
          trend="neutral"
          trendValue="Stable"
        />
        <KpiCard
          index={2}
          label="Total Tokens"
          value={formatNumber(kpis.totalTokens)}
          subtitle="Across filtered records"
          trend="up"
          trendValue="6.8%"
        />
        <KpiCard
          index={3}
          label="Active Alerts"
          value={formatNumber(kpis.activeAlerts)}
          subtitle="Unacknowledged alerts"
          trend={kpis.activeAlerts > 0 ? "down" : "neutral"}
          trendValue={kpis.activeAlerts > 0 ? "Needs review" : "Clear"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SpendOverTimeChart usage={filteredUsage} />
        <CostByDepartmentChart usage={filteredUsage} departments={data.departments} />
        <UsageByModelChart usage={filteredUsage} />
        <QuotaUtilizationChart departments={data.departments} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EnergyKpiCard
          label="Energy Use"
          value={`${formatNumber(Math.round(energy.totalKwh))} kWh`}
          subtitle="Estimated datacenter power draw"
          accentColor="var(--info)"
          index={0}
        />
        <EnergyKpiCard
          label="CO2 Emissions"
          value={`${formatNumber(Math.round(energy.co2Kg))} kg`}
          subtitle="Estimated carbon impact"
          accentColor="var(--warning)"
          index={1}
        />
        <EnergyKpiCard
          label="PUE Ratio"
          value={energy.pueRatio.toFixed(2)}
          subtitle="Power usage effectiveness"
          accentColor="var(--accent)"
          index={2}
        />
        <EnergyKpiCard
          label="Renewables"
          value={formatPercent(energy.renewablePercent)}
          subtitle="Estimated clean energy share"
          accentColor="var(--success)"
          index={3}
        />
      </div>
    </section>
  );
}
