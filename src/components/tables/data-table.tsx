"use client";

import type { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
}

function alignClass(align: "left" | "center" | "right" = "left"): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function getRowKey<T>(row: T, index: number): string {
  const r = row as Record<string, unknown>;
  if (typeof r.id === "string") return r.id;
  if (typeof r.id === "number") return String(r.id);
  return String(index);
}

export function DataTable<T>({ columns, data, caption }: DataTableProps<T>) {
  return (
    <div className="card-surface overflow-x-auto">
      <table className="min-w-full text-sm" aria-label={caption}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${alignClass(column.align)}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)} className="row-hover border-b border-[var(--border-default)] last:border-b-0">
              {columns.map((column) => {
                const cell =
                  typeof column.accessor === "function"
                    ? column.accessor(row)
                    : (row[column.accessor] as ReactNode);
                return (
                  <td key={column.header} className={`px-4 py-3 text-[var(--text-primary)] ${alignClass(column.align)}`}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { Column, DataTableProps };
