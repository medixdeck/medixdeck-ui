"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

export interface Column<T = Record<string, unknown>> {
  /** Unique key matching the data field */
  key: string;
  /** Column header label */
  label: string;
  /** Minimum column width */
  minWidth?: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** Text alignment */
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string, direction: "asc" | "desc") => void;
  striped?: boolean;
  onRowClick?: (row: T, index: number) => void;
  caption?: string;
  /** Extra styles for the outer container */
  style?: React.CSSProperties;
  className?: string;
}

/**
 * MedixDeck DataTable
 *
 * Responsive data table with sorting.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: "name", label: "Patient Name", sortable: true },
 *     { key: "date", label: "Date", sortable: true },
 *     { key: "status", label: "Status", render: (v) => <Badge>{v}</Badge> },
 *   ]}
 *   data={patients}
 *   rowKey="id"
 *   onRowClick={(row) => router.push(`/patients/${row.id}`)}
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey = "id",
  isLoading = false,
  emptyMessage = "No data available",
  sortable = false,
  sortKey,
  sortDirection = "asc",
  onSort,
  striped = false,
  onRowClick,
  caption,
  style,
  className,
}: DataTableProps<T>) {
  const [internalSortKey, setInternalSortKey] = React.useState<string | undefined>(sortKey);
  const [internalDirection, setInternalDirection] = React.useState<"asc" | "desc">(sortDirection);

  const activeSortKey = sortKey ?? internalSortKey;
  const activeDirection = sortKey ? sortDirection : internalDirection;

  const handleSort = (key: string) => {
    const newDir = activeSortKey === key && activeDirection === "asc" ? "desc" : "asc";
    setInternalSortKey(key);
    setInternalDirection(newDir);
    onSort?.(key, newDir);
  };

  const sortedData = React.useMemo(() => {
    if (!activeSortKey || onSort) return data; // Controlled or no sort
    return [...data].sort((a, b) => {
      const aVal = a[activeSortKey];
      const bVal = b[activeSortKey];
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
      return activeDirection === "asc" ? cmp : -cmp;
    });
  }, [data, activeSortKey, activeDirection, onSort]);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (activeSortKey !== colKey) {
      return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    }
    return <span style={{ marginLeft: 4 }}>{activeDirection === "asc" ? "↑" : "↓"}</span>;
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--chakra-colors-text-muted, #6B7280)",
    fontFamily: "var(--font-body)",
    borderBottom: "1px solid var(--chakra-colors-border, #E2E8F0)",
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "var(--chakra-colors-text-body, #374151)",
    fontFamily: "var(--font-body)",
    verticalAlign: "middle",
  };

  return (
    <Box
      border="1px solid"
      borderColor="border"
      borderRadius="card"
      overflow="hidden"
      bg="bg.surface"
      boxShadow="card-light"
      _dark={{ boxShadow: "card-dark" }}
      style={style}
      className={className}
    >
      <Box overflowX="auto">
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          aria-label={caption}
        >
          {caption && <caption style={{ display: "none" }}>{caption}</caption>}
          <thead>
            <tr style={{ background: "var(--chakra-colors-bg-subtle, #F6F6F6)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...thStyle,
                    textAlign: col.align ?? "left",
                    minWidth: col.minWidth,
                    cursor: col.sortable || sortable ? "pointer" : "default",
                  }}
                  onClick={() => (col.sortable || sortable) ? handleSort(col.key) : undefined}
                  aria-sort={
                    activeSortKey === col.key
                      ? activeDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    {col.label}
                    {(col.sortable || sortable) && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} style={tdStyle}>
                      <Box
                        h="4"
                        bg="bg.subtle"
                        borderRadius="full"
                        w={`${60 + Math.random() * 30}%`}
                        style={{ animation: "medix-shimmer 1.5s infinite" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ ...tdStyle, textAlign: "center", padding: "48px 16px" }}>
                  <Text color="text.muted" fontFamily="var(--font-body)">{emptyMessage}</Text>
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIdx) => {
                const key = String(row[rowKey] ?? rowIdx);
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row, rowIdx)}
                    style={{
                      background: striped && rowIdx % 2 === 1
                        ? "var(--chakra-colors-bg-subtle, #F6F6F6)"
                        : undefined,
                      cursor: onRowClick ? "pointer" : "default",
                      borderBottom: "1px solid var(--chakra-colors-border, #E2E8F0)",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (onRowClick) (e.currentTarget as HTMLTableRowElement).style.background = "var(--chakra-colors-bg-subtle, #F6F6F6)";
                    }}
                    onMouseLeave={(e) => {
                      if (onRowClick) (e.currentTarget as HTMLTableRowElement).style.background = "";
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ ...tdStyle, textAlign: col.align ?? "left" }}
                      >
                        {col.render
                          ? col.render(row[col.key], row, rowIdx)
                          : String(row[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
