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
    w: "8",
    h: "8",
    borderRadius: "md",
    fontSize: "sm",
    fontFamily: "var(--font-body)",
    fontWeight: "semibold",
    cursor: "pointer",
    transition: "all 0.15s",
    border: "none",
    userSelect: "none",
  };

  const NavBtn = ({
    children,
    disabled,
    onClick,
    label,
    icon,
    isNext,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    label: string;
    icon?: React.ReactNode;
    isNext?: boolean;
  }) => (
    <Box
      as="button"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap="1.5"
      h="8"
      px="2"
      borderRadius="md"
      fontSize="sm"
      fontFamily="var(--font-body)"
      fontWeight="medium"
      cursor="pointer"
      transition="all 0.15s"
      userSelect="none"
      border="none"
      bg="transparent"
      color="text.muted"
      opacity={disabled ? 0.4 : 1}
      pointerEvents={disabled ? "none" : undefined}
      onClick={onClick}
      aria-label={label}
      _hover={{ color: "blue.500" }}
    >
      {!isNext && icon && <Box as="span" display="flex" alignItems="center">{icon}</Box>}
      {children}
      {isNext && icon && <Box as="span" display="flex" alignItems="center">{icon}</Box>}
    </Box>
  );

  const ChevronLeft = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  );
  
  const ChevronRight = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );

  return (
    <Box
      as="nav"
      role="navigation"
      aria-label="Pagination"
      display="flex"
      alignItems="center"
      gap="2"
      flexWrap="wrap"
      {...props}
    >
      {showEdges && (
        <NavBtn disabled={currentPage === 1} onClick={() => onChange?.(1)} label="First page" icon={ChevronLeft}>
          First
        </NavBtn>
      )}
      <NavBtn
        disabled={currentPage === 1}
        onClick={() => onChange?.(currentPage - 1)}
        label="Previous page"
        icon={ChevronLeft}
      >
        Prev
      </NavBtn>

      {!compact &&
        pages.map((page, idx) =>
          page === "..." ? (
            <Box
              key={`dots-${idx}`}
              {...btnBase}
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
              bg={currentPage === page ? "blue.500" : "blue.100"}
              color={currentPage === page ? "white" : "blue.500"}
              _dark={{
                bg: currentPage === page ? "blue.500" : "rgba(6, 133, 255, 0.12)",
                color: currentPage === page ? "white" : "blue.200",
              }}
              onClick={() => onChange?.(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              _hover={
                currentPage !== page
                  ? { bg: "blue.200", _dark: { bg: "rgba(6, 133, 255, 0.2)" } }
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
        icon={ChevronRight}
        isNext
      >
        Next
      </NavBtn>
      {showEdges && (
        <NavBtn
          disabled={currentPage === pageCount}
          onClick={() => onChange?.(pageCount)}
          label="Last page"
          icon={ChevronRight}
          isNext
        >
          Last
        </NavBtn>
      )}
    </Box>
  );
}
