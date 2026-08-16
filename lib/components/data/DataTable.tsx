'use client';

import React, { useState, useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { SearchInput } from '../form/Input';
import { Pagination } from '../navigation/Pagination';

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
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  striped?: boolean;
  onRowClick?: (row: T, index: number) => void;
  caption?: string;

  /** Enable built-in pagination (default: false for backward compatibility) */
  enablePagination?: boolean;
  /** Number of rows per page when pagination is enabled (default: 10) */
  pageSize?: number;
  /** Controlled page number (1-indexed). If omitted, internal state is used. */
  page?: number;
  /** Page change callback */
  onPageChange?: (page: number) => void;

  /** Enable search input filter (default: false for backward compatibility) */
  enableSearch?: boolean;
  /** Custom placeholder for search input */
  searchPlaceholder?: string;
  /** Controlled search query. If omitted, internal state is used. */
  searchQuery?: string;
  /** Search query change callback */
  onSearchChange?: (query: string) => void;

  /** Extra styles for outer container */
  style?: React.CSSProperties;
  className?: string;
  /**
   * When true, the first column is pinned (sticky) to the left during
   * horizontal scrolling so patient names / IDs stay visible.
   * @default false
   */
  stickyFirstColumn?: boolean;
}

/**
 * MedixDeck DataTable
 *
 * Responsive data table with sorting, search filtering, pagination, and dark mode support.
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
 *   enableSearch
 *   enablePagination
 *   pageSize={10}
 *   onRowClick={(row) => router.push(`/patients/${row.id}`)}
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey = 'id',
  isLoading = false,
  emptyMessage = 'No data available',
  sortable = false,
  sortKey,
  sortDirection = 'asc',
  onSort,
  striped = true,
  onRowClick,
  caption,
  enablePagination = false,
  pageSize = 10,
  page,
  onPageChange,
  enableSearch = false,
  searchPlaceholder = 'Search table...',
  searchQuery,
  onSearchChange,
  style,
  className,
  stickyFirstColumn = false,
}: DataTableProps<T>) {
  // ─── Search State ──────────────────────────────────────────────────────────
  const [internalSearch, setInternalSearch] = useState('');
  const activeSearch = searchQuery ?? internalSearch;

  // ─── Pagination State ──────────────────────────────────────────────────────
  const [internalPage, setInternalPage] = useState(1);
  const activePage = page ?? internalPage;

  // ─── Sorting State ─────────────────────────────────────────────────────────
  const [internalSortKey, setInternalSortKey] = useState<string | undefined>(sortKey);
  const [internalDirection, setInternalDirection] = useState<'asc' | 'desc'>(sortDirection);

  const activeSortKey = sortKey ?? internalSortKey;
  const activeDirection = sortKey ? sortDirection : internalDirection;

  const handleSearchChange = (query: string) => {
    setInternalSearch(query);
    setInternalPage(1);
    onSearchChange?.(query);
  };

  const handleSort = (key: string) => {
    const newDir = activeSortKey === key && activeDirection === 'asc' ? 'desc' : 'asc';
    setInternalSortKey(key);
    setInternalDirection(newDir);
    onSort?.(key, newDir);
  };

  const handlePageChange = (newPage: number) => {
    setInternalPage(newPage);
    onPageChange?.(newPage);
  };

  // 1. Filter data by search query
  const filteredData = useMemo(() => {
    if (!activeSearch.trim()) return data;
    const q = activeSearch.toLowerCase().trim();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      }),
    );
  }, [data, columns, activeSearch]);

  // 2. Sort filtered data
  const sortedData = useMemo(() => {
    if (!activeSortKey || onSort) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[activeSortKey];
      const bVal = b[activeSortKey];
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' });
      return activeDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, activeSortKey, activeDirection, onSort]);

  // 3. Paginate sorted data
  const totalItems = sortedData.length;

  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const start = (activePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, enablePagination, activePage, pageSize]);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (activeSortKey !== colKey) {
      return (
        <Text as="span" opacity={0.3} ml="1" fontSize="xs">
          ↕
        </Text>
      );
    }
    return (
      <Text as="span" ml="1" color="text.heading" fontSize="xs">
        {activeDirection === 'asc' ? '↑' : '↓'}
      </Text>
    );
  };

  return (
    <Box
      border="1px solid"
      borderColor="border"
      borderRadius="card"
      overflow="hidden"
      bg="bg.surface"
      boxShadow="none"
      _dark={{ boxShadow: 'none' }}
      style={style}
      className={className}
    >
      {/* Search Header Toolbar */}
      {enableSearch && (
        <Box p="4" borderBottom="1px solid" borderColor="border" bg="bg.surface">
          <SearchInput
            placeholder={searchPlaceholder}
            value={activeSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            maxW="360px"
          />
        </Box>
      )}

      {/* Table Box */}
      <Box overflowX="auto">
        <Box as="table" w="full" style={{ borderCollapse: 'collapse' }} aria-label={caption}>
          {caption && <caption style={{ display: 'none' }}>{caption}</caption>}
          <Box as="thead">
            <Box as="tr" bg="bg.subtle" borderBottom="1px solid" borderColor="border">
              {columns.map((col, colIdx) => {
                const isStickyCol = stickyFirstColumn && colIdx === 0;

                return (
                  <Box
                    as="th"
                    key={col.key}
                    py="3"
                    px="4"
                    textAlign={col.align ?? 'left'}
                    minW={col.minWidth}
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                    color="text.muted"
                    fontFamily="var(--font-body)"
                    whiteSpace="nowrap"
                    userSelect="none"
                    cursor={col.sortable || sortable ? 'pointer' : 'default'}
                    _hover={col.sortable || sortable ? { color: 'text.heading' } : undefined}
                    onClick={() => (col.sortable || sortable ? handleSort(col.key) : undefined)}
                    aria-sort={
                      activeSortKey === col.key
                        ? activeDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                    position={isStickyCol ? 'sticky' : undefined}
                    left={isStickyCol ? 0 : undefined}
                    zIndex={isStickyCol ? 3 : undefined}
                    bg={isStickyCol ? 'bg.subtle' : undefined}
                    borderRight={isStickyCol ? '1px solid' : undefined}
                    borderColor={isStickyCol ? 'border' : undefined}
                    boxShadow={isStickyCol ? '2px 0 4px rgba(0, 0, 0, 0.05)' : undefined}
                  >
                    <Flex
                      as="span"
                      align="center"
                      justify={
                        col.align === 'right'
                          ? 'flex-end'
                          : col.align === 'center'
                            ? 'center'
                            : 'flex-start'
                      }
                    >
                      {col.label}
                      {(col.sortable || sortable) && <SortIcon colKey={col.key} />}
                    </Flex>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box as="tbody">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Box as="tr" key={i} borderBottom="1px solid" borderColor="border">
                  {columns.map((col) => (
                    <Box as="td" key={col.key} py="3.5" px="4">
                      <Box
                        h="4"
                        bg="bg.subtle"
                        borderRadius="full"
                        w={`${60 + Math.random() * 30}%`}
                        style={{ animation: 'medix-shimmer 1.5s infinite' }}
                      />
                    </Box>
                  ))}
                </Box>
              ))
            ) : paginatedData.length === 0 ? (
              <Box as="tr">
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: 'center',
                    padding: '48px 16px',
                  }}
                >
                  <Text color="text.muted" fontFamily="var(--font-body)" fontSize="sm">
                    {emptyMessage}
                  </Text>
                </td>
              </Box>
            ) : (
              paginatedData.map((row, rowIdx) => {
                const key = String(row[rowKey] ?? rowIdx);
                return (
                  <Box
                    as="tr"
                    key={key}
                    onClick={() => onRowClick?.(row, rowIdx)}
                    bg={striped && rowIdx % 2 === 1 ? 'bg.subtle' : 'transparent'}
                    borderBottom="1px solid"
                    borderColor="border"
                    cursor={onRowClick ? 'pointer' : 'default'}
                    transition="background 0.15s ease"
                    _hover={{ bg: 'bg.subtle' }}
                  >
                    {columns.map((col, colIdx) => {
                      const isStickyCol = stickyFirstColumn && colIdx === 0;

                      return (
                        <Box
                          as="td"
                          key={col.key}
                          py="3.5"
                          px="4"
                          textAlign={col.align ?? 'left'}
                          fontSize="sm"
                          color="text.body"
                          fontFamily="var(--font-body)"
                          verticalAlign="middle"
                          position={isStickyCol ? 'sticky' : undefined}
                          left={isStickyCol ? 0 : undefined}
                          zIndex={isStickyCol ? 2 : undefined}
                          bg={
                            isStickyCol
                              ? striped && rowIdx % 2 === 1
                                ? 'bg.subtle'
                                : 'bg.surface'
                              : undefined
                          }
                          borderRight={isStickyCol ? '1px solid' : undefined}
                          borderColor={isStickyCol ? 'border' : undefined}
                          boxShadow={isStickyCol ? '2px 0 4px rgba(0, 0, 0, 0.05)' : undefined}
                        >
                          {col.render
                            ? col.render(row[col.key], row, rowIdx)
                            : String(row[col.key] ?? '—')}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>

      {/* Pagination Footer Toolbar */}
      {enablePagination && (
        <Flex
          p="4"
          borderTop="1px solid"
          borderColor="border"
          bg="bg.surface"
          align="center"
          justify="space-between"
          flexWrap="wrap"
          gap="4"
        >
          <Text fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
            Showing {totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1} to{' '}
            {Math.min(activePage * pageSize, totalItems)} of {totalItems} entries
          </Text>
          <Pagination
            total={totalItems}
            pageSize={pageSize}
            currentPage={activePage}
            onChange={handlePageChange}
            compact
          />
        </Flex>
      )}
    </Box>
  );
}
