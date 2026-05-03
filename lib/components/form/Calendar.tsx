"use client";

import React, { useState, useEffect } from "react";
import { Box, Flex, Text, type BoxProps } from "@chakra-ui/react";

export interface CalendarProps extends Omit<BoxProps, "onChange"> {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const WEEKDAYS = ["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Helper to get number of days in month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get starting day of week for month (0 = Sun, 1 = Mon ... 6 = Sat)
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Shift day so Monday = 0, Sunday = 6
function shiftDay(dayIndex: number) {
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

// Returns true if a date (in the current-month frame) is outside min/max bounds
function isDateOutOfRange(
  d: number, m: number, y: number,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  const date = new Date(y, m, d);
  if (minDate) {
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (date < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (date > max) return true;
  }
  return false;
}

/**
 * MedixDeck Re-usable Calendar Component
 * 
 * @example
 * ```tsx
 * <Calendar value={date} onChange={setDate} />
 * ```
 */
export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => value ? new Date(value) : new Date());

  // Sync displayed month whenever the controlled value moves to a different month
  useEffect(() => {
    if (value) {
      setCurrentMonth((prev) => {
        const next = new Date(value);
        if (
          prev.getFullYear() === next.getFullYear() &&
          prev.getMonth() === next.getMonth()
        ) {
          return prev; // already showing the right month — no re-render
        }
        return next;
      });
    }
  }, [value]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Constrain month navigation to minDate/maxDate bounds
  const canGoPrev = !minDate ||
    year > minDate.getFullYear() ||
    (year === minDate.getFullYear() && month > minDate.getMonth());

  const canGoNext = !maxDate ||
    year < maxDate.getFullYear() ||
    (year === maxDate.getFullYear() && month < maxDate.getMonth());

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    // Only fire onChange if today is within the allowed range
    if (onChange && !isDateOutOfRange(today.getDate(), today.getMonth(), today.getFullYear(), minDate, maxDate)) {
      onChange(today);
    }
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = shiftDay(getFirstDayOfMonth(year, month));

  const prevMonthDays = getDaysInMonth(year, month - 1);
  // Show either 5 or 6 rows depending on month overlap
  const totalCells = firstDay + daysInMonth > 35 ? 42 : 35;
  const daysInNextMonth = totalCells - (firstDay + daysInMonth);

  const isSelected = (d: number, m: number, y: number) => {
    if (!value) return false;
    return value.getDate() === d && value.getMonth() === m && value.getFullYear() === y;
  };

  const renderCells = () => {
    const cells = [];
    
    // Previous month cells
    for (let i = 0; i < firstDay; i++) {
      const dayNum = prevMonthDays - firstDay + i + 1;
      cells.push(
        <DayCell
          key={`prev-${i}`}
          day={dayNum}
          isMuted
        />
      );
    }
    
    // Current month cells
    for (let i = 1; i <= daysInMonth; i++) {
      const outOfRange = isDateOutOfRange(i, month, year, minDate, maxDate);
      cells.push(
        <DayCell
          key={`curr-${i}`}
          day={i}
          isActive={isSelected(i, month, year)}
          isDisabled={outOfRange}
          onClick={outOfRange ? undefined : () => onChange?.(new Date(year, month, i))}
        />
      );
    }
    
    // Next month cells
    for (let i = 1; i <= daysInNextMonth; i++) {
      cells.push(
        <DayCell
          key={`next-${i}`}
          day={i}
          isMuted
        />
      );
    }

    return cells;
  };

  return (
    <Box
      w="100%"
      maxW="360px"
      bg="bg.surface"
      borderRadius="card"
      p="5"
      fontFamily="var(--font-body)"
      {...props}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb="6">
        <Flex align="center" gap="4">
          <MonthNavButton enabled={canGoPrev} onClick={handlePrevMonth} direction="prev" />
          <Text fontWeight="semibold" fontSize="md" color="text.heading">
            {MONTHS[month]} {year}
          </Text>
          <MonthNavButton enabled={canGoNext} onClick={handleNextMonth} direction="next" />
        </Flex>
        
        <Box 
          as="button" 
          onClick={handleToday}
          px="3" 
          py="1" 
          fontSize="sm" 
          fontWeight="medium" 
          borderRadius="md" 
          border="1px solid" 
          borderColor="border" 
          color="text.heading"
          _hover={{ bg: "bg.subtle" }}
        >
          Today
        </Box>
      </Flex>

      {/* Weekdays */}
      <Flex mb="3">
        {WEEKDAYS.map((day) => (
          <Box key={day} flex="1" textAlign="center" fontSize="xs" fontWeight="medium" color="text.muted">
            {day}
          </Box>
        ))}
      </Flex>

      {/* Grid */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gapY="2">
        {renderCells()}
      </Box>
    </Box>
  );
}

function MonthNavButton({
  enabled,
  onClick,
  direction,
}: {
  enabled: boolean;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <Box
      as="button"
      aria-label={direction === "prev" ? "Go to previous month" : "Go to next month"}
      aria-disabled={!enabled}
      onClick={enabled ? onClick : undefined}
      cursor={enabled ? "pointer" : "not-allowed"}
      color={enabled ? "text.heading" : "text.muted"}
      opacity={enabled ? 1 : 0.4}
      _hover={enabled ? { color: "blue.500" } : undefined}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === "prev"
          ? <path d="M15 18l-6-6 6-6"/>
          : <path d="M9 18l6-6-6-6"/>}
      </svg>
    </Box>
  );
}

function DayCell({
  day,
  isActive,
  isMuted,
  isDisabled,
  onClick,
}: {
  day: number;
  isActive?: boolean;
  isMuted?: boolean;
  /** Out-of-range day: visible but not selectable */
  isDisabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Flex justify="center" align="center" h="10">
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="9"
        h="9"
        borderRadius="full"
        fontSize="sm"
        fontWeight="medium"
        onClick={onClick}
        // Native disabled prevents focus and click activation for both muted
        // (overflow) and out-of-range days, improving screen reader behavior.
        {...({ disabled: isMuted || isDisabled } as Record<string, unknown>)}
        cursor={isDisabled ? "not-allowed" : "pointer"}
        opacity={isDisabled ? 0.35 : 1}
        bg={isActive ? "blue.500" : "transparent"}
        color={isActive ? "white" : (isMuted || isDisabled) ? "text.muted" : "text.heading"}
        _hover={!isMuted && !isDisabled && !isActive ? { bg: "bg.subtle", color: "blue.500" } : undefined}
        transition="all 0.2s"
      >
        {day}
      </Box>
    </Flex>
  );
}
