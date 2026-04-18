"use client";

import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

// Omit onChange to avoid conflict with BoxProps (which defines onChange as FormEventHandler)
export interface PaginationProps extends Omit<BoxProps, "onChange"> {
  /** Total number of items */
  total: number;
  /** Items per page */
  pageSize?: number;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Callback for page change */
  onChange?: (page: number) => void;
  /** How many page buttons to show around current */
  siblingCount?: number;
  /** Show first/last page buttons */
  showEdges?: boolean;
  /** Compact mode */
  compact?: boolean;
}

function buildPages(
  currentPage: number,
  pageCount: number,
  siblingCount: number
): (number | "...")[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= pageCount) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const leftIdx = Math.max(currentPage - siblingCount, 1);
  const rightIdx = Math.min(currentPage + siblingCount, pageCount);
  const showLeft = leftIdx > 2;
  const showRight = rightIdx < pageCount - 2;

  if (!showLeft && showRight) {
    const leftCount = 3 + 2 * siblingCount;
    return [
      ...Array.from({ length: leftCount }, (_, i) => i + 1),
      "...",
      pageCount,
    ];
  }

  if (showLeft && !showRight) {
    const rightCount = 3 + 2 * siblingCount;
    return [
      1,
      "...",
      ...Array.from({ length: rightCount }, (_, i) => pageCount - rightCount + 1 + i),
    ];
  }

  return [
    1,
    "...",
    ...Array.from(
      { length: rightIdx - leftIdx + 1 },
      (_, i) => leftIdx + i
    ),
    "...",
    pageCount,
  ];
}

/**
 * MedixDeck Pagination
 *
 * @example
 * ```tsx
 * <Pagination total={245} pageSize={10} currentPage={3} onChange={setPage} />
 * ```
 */
export function Pagination({
  total,
  pageSize = 10,
  currentPage = 1,
  onChange,
  siblingCount = 1,
  showEdges = true,
  compact = false,
  ...props
}: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  const pages = buildPages(currentPage, pageCount, siblingCount);

  const btnBase: BoxProps = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    w: "9",
    h: "9",
    borderRadius: "md",
    fontSize: "sm",
    fontFamily: "var(--font-body)",
    fontWeight: "medium",
    cursor: "pointer",
    transition: "all 0.15s",
    border: "1px solid",
    userSelect: "none",
  };

  const NavBtn = ({
    children,
    disabled,
    onClick,
    label,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    label: string;
  }) => (
    <Box
      as="button"
      {...btnBase}
      borderColor="border"
      bg="bg.surface"
      color={disabled ? "text.muted" : "text.body"}
      opacity={disabled ? 0.4 : 1}
      pointerEvents={disabled ? "none" : undefined}
      onClick={onClick}
      aria-label={label}
      _hover={{ borderColor: "blue.400", color: "blue.500" }}
    >
      {children}
    </Box>
  );

  return (
    <Box
      as="nav"
      role="navigation"
      aria-label="Pagination"
      display="flex"
      alignItems="center"
      gap="1"
      flexWrap="wrap"
      {...props}
    >
      {showEdges && (
        <NavBtn disabled={currentPage === 1} onClick={() => onChange?.(1)} label="First page">
          «
        </NavBtn>
      )}
      <NavBtn
        disabled={currentPage === 1}
        onClick={() => onChange?.(currentPage - 1)}
        label="Previous page"
      >
        ‹
      </NavBtn>

      {!compact &&
        pages.map((page, idx) =>
          page === "..." ? (
            <Box
              key={`dots-${idx}`}
              {...btnBase}
              border="none"
              bg="transparent"
              color="text.muted"
              cursor="default"
              pointerEvents="none"
            >
              …
            </Box>
          ) : (
            <Box
              key={page}
              as="button"
              {...btnBase}
              borderColor={currentPage === page ? "blue.500" : "border"}
              bg={currentPage === page ? "blue.500" : "bg.surface"}
              color={currentPage === page ? "white" : "text.body"}
              onClick={() => onChange?.(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              _hover={
                currentPage !== page
                  ? { borderColor: "blue.400", color: "blue.500" }
                  : undefined
              }
            >
              {page}
            </Box>
          )
        )}

      {compact && (
        <Box
          px="3"
          fontSize="sm"
          color="text.body"
          fontFamily="var(--font-body)"
          whiteSpace="nowrap"
        >
          {currentPage} / {pageCount}
        </Box>
      )}

      <NavBtn
        disabled={currentPage === pageCount}
        onClick={() => onChange?.(currentPage + 1)}
        label="Next page"
      >
        ›
      </NavBtn>
      {showEdges && (
        <NavBtn
          disabled={currentPage === pageCount}
          onClick={() => onChange?.(pageCount)}
          label="Last page"
        >
          »
        </NavBtn>
      )}
    </Box>
  );
}
