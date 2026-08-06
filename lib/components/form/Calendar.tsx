'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, type BoxProps } from '@chakra-ui/react';

export interface CalendarProps extends Omit<BoxProps, 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Brand color scheme ('blue' | 'purple') — defaults to 'blue' */
  colorScheme?: 'blue' | 'purple';
}

const WEEKDAYS = ['MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT', 'SUN'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Number of years shown per page in the year-picker view */
const YEARS_PER_PAGE = 12;

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
  d: number,
  m: number,
  y: number,
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

// Returns true if the entire month is outside the min/max bounds
function isMonthOutOfRange(m: number, y: number, minDate?: Date, maxDate?: Date): boolean {
  const lastDay = getDaysInMonth(y, m);
  const firstOfMonth = new Date(y, m, 1);
  const lastOfMonth = new Date(y, m, lastDay);
  if (minDate) {
    const minNorm = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (lastOfMonth < minNorm) return true;
  }
  if (maxDate) {
    const maxNorm = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (firstOfMonth > maxNorm) return true;
  }
  return false;
}

// Returns true if the entire year is outside the min/max bounds
function isYearOutOfRange(y: number, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && y < minDate.getFullYear()) return true;
  if (maxDate && y > maxDate.getFullYear()) return true;
  return false;
}

/** Base page offset: first page shows the 12 years whose range contains `year` */
function getInitialYearPage(year: number): number {
  // Page 0 starts at (year - 5), giving a 12-year window centred around the current year
  return 0;
}

/**
 * MedixDeck Re-usable Calendar Component
 *
 * Supports clicking the month or year label in the header to jump directly to
 * a month-picker or year-picker view, avoiding tedious arrow navigation.
 *
 * @example
 * ```tsx
 * <Calendar value={date} onChange={setDate} colorScheme="purple" />
 * ```
 */
export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  colorScheme = 'blue',
  ...props
}: CalendarProps) {
  const accentColor = colorScheme === 'purple' ? '#7700CC' : '#0685FF';
  const accentLight = colorScheme === 'purple' ? 'rgba(119,0,204,0.14)' : 'rgba(6,133,255,0.14)';

  const [currentMonth, setCurrentMonth] = useState(() => (value ? new Date(value) : new Date()));
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  // yearPage offset — each page shows YEARS_PER_PAGE years
  const [yearPageOffset, setYearPageOffset] = useState(0);

  // Sync displayed month whenever the controlled value moves to a different month
  useEffect(() => {
    if (value) {
      setCurrentMonth((prev) => {
        const next = new Date(value);
        if (prev.getFullYear() === next.getFullYear() && prev.getMonth() === next.getMonth()) {
          return prev; // already showing the right month — no re-render
        }
        return next;
      });
    }
  }, [value]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // ─── Year page helpers ───────────────────────────────────────────────────────
  // The "base" year for page 0: floor to the nearest YEARS_PER_PAGE boundary
  // e.g. 2026 → base 2024 so the grid shows 2024–2035
  const baseYear = Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  const yearPageStart = baseYear + yearPageOffset * YEARS_PER_PAGE;
  const yearPageEnd = yearPageStart + YEARS_PER_PAGE - 1;

  // ─── Day-view nav constraints ────────────────────────────────────────────────
  const canGoPrev =
    !minDate ||
    year > minDate.getFullYear() ||
    (year === minDate.getFullYear() && month > minDate.getMonth());

  const canGoNext =
    !maxDate ||
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
    setViewMode('day');
    if (
      onChange &&
      !isDateOutOfRange(today.getDate(), today.getMonth(), today.getFullYear(), minDate, maxDate)
    ) {
      onChange(today);
    }
  };

  // ─── Month-picker selection ─────────────────────────────────────────────────
  const handleMonthSelect = (m: number) => {
    setCurrentMonth(new Date(year, m, 1));
    setViewMode('day');
  };

  // ─── Year-picker selection ──────────────────────────────────────────────────
  const handleYearSelect = (y: number) => {
    setCurrentMonth(new Date(y, month, 1));
    setYearPageOffset(0); // reset page offset for next time the year picker opens
    setViewMode('month'); // drop into month-picker after choosing a year
  };

  // ─── Day-view cell rendering ────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = shiftDay(getFirstDayOfMonth(year, month));
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const totalCells = firstDay + daysInMonth > 35 ? 42 : 35;
  const daysInNextMonth = totalCells - (firstDay + daysInMonth);

  const isSelected = (d: number, m: number, y: number) => {
    if (!value) return false;
    return value.getDate() === d && value.getMonth() === m && value.getFullYear() === y;
  };

  const renderDayCells = () => {
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      const dayNum = prevMonthDays - firstDay + i + 1;
      cells.push(<DayCell key={`prev-${i}`} day={dayNum} isMuted accentColor={accentColor} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const outOfRange = isDateOutOfRange(i, month, year, minDate, maxDate);
      cells.push(
        <DayCell
          key={`curr-${i}`}
          day={i}
          isActive={isSelected(i, month, year)}
          isDisabled={outOfRange}
          accentColor={accentColor}
          accentLight={accentLight}
          onClick={outOfRange ? undefined : () => onChange?.(new Date(year, month, i))}
        />,
      );
    }

    for (let i = 1; i <= daysInNextMonth; i++) {
      cells.push(<DayCell key={`next-${i}`} day={i} isMuted accentColor={accentColor} />);
    }

    return cells;
  };

  // ─── Month grid ─────────────────────────────────────────────────────────────
  const renderMonthGrid = () => (
    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="2" p="1" mt="2">
      {MONTH_ABBR.map((abbr, idx) => {
        const isActive = idx === month;
        const disabled = isMonthOutOfRange(idx, year, minDate, maxDate);
        return (
          <MonthYearCell
            key={abbr}
            label={abbr}
            isActive={isActive}
            isDisabled={disabled}
            accentColor={accentColor}
            accentLight={accentLight}
            onClick={() => !disabled && handleMonthSelect(idx)}
          />
        );
      })}
    </Box>
  );

  // ─── Year grid ──────────────────────────────────────────────────────────────
  const renderYearGrid = () => {
    const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);
    return (
      <>
        {/* Year-page navigation */}
        <Flex justify="space-between" align="center" mb="3">
          <NavChevronButton
            direction="prev"
            enabled
            accentColor={accentColor}
            onClick={() => setYearPageOffset((p) => p - 1)}
            ariaLabel="Previous years"
          />
          <Text fontSize="sm" fontWeight="semibold" color="text.heading" fontFamily="var(--font-body)">
            {yearPageStart} – {yearPageEnd}
          </Text>
          <NavChevronButton
            direction="next"
            enabled
            accentColor={accentColor}
            onClick={() => setYearPageOffset((p) => p + 1)}
            ariaLabel="Next years"
          />
        </Flex>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="2" p="1">
          {years.map((y) => {
            const isActive = y === year;
            const disabled = isYearOutOfRange(y, minDate, maxDate);
            return (
              <MonthYearCell
                key={y}
                label={String(y)}
                isActive={isActive}
                isDisabled={disabled}
                accentColor={accentColor}
                accentLight={accentLight}
                onClick={() => !disabled && handleYearSelect(y)}
              />
            );
          })}
        </Box>
      </>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
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
      {/* ── Header ── */}
      <Flex justify="space-between" align="center" mb={viewMode === 'day' ? '6' : '4'}>
        <Flex align="center" gap="1">
          {/* Prev arrow — only shown in day-view */}
          {viewMode === 'day' && (
            <NavChevronButton
              direction="prev"
              enabled={canGoPrev}
              accentColor={accentColor}
              onClick={handlePrevMonth}
              ariaLabel="Go to previous month"
            />
          )}

          {/* Month label — clickable to toggle month-picker */}
          <HeaderPillButton
            label={MONTHS[month]}
            isActive={viewMode === 'month'}
            accentColor={accentColor}
            accentLight={accentLight}
            onClick={() => {
              setViewMode((v) => (v === 'month' ? 'day' : 'month'));
              setYearPageOffset(0);
            }}
          />

          {/* Year label — clickable to toggle year-picker */}
          <HeaderPillButton
            label={String(year)}
            isActive={viewMode === 'year'}
            accentColor={accentColor}
            accentLight={accentLight}
            onClick={() => {
              setViewMode((v) => (v === 'year' ? 'day' : 'year'));
              setYearPageOffset(0);
            }}
          />

          {/* Next arrow — only shown in day-view */}
          {viewMode === 'day' && (
            <NavChevronButton
              direction="next"
              enabled={canGoNext}
              accentColor={accentColor}
              onClick={handleNextMonth}
              ariaLabel="Go to next month"
            />
          )}
        </Flex>

        {/* Today button */}
        <Box
          as="button"
          // @ts-expect-error type is valid when as="button"
          type="button"
          onClick={handleToday}
          px="3"
          py="1"
          fontSize="sm"
          fontWeight="medium"
          borderRadius="md"
          border="1px solid"
          borderColor="border"
          color="text.heading"
          _hover={{ bg: 'bg.subtle' }}
        >
          Today
        </Box>
      </Flex>

      {/* ── Views ── */}
      {viewMode === 'day' && (
        <>
          {/* Weekday headers */}
          <Flex mb="3">
            {WEEKDAYS.map((day) => (
              <Box
                key={day}
                flex="1"
                textAlign="center"
                fontSize="xs"
                fontWeight="medium"
                color="text.muted"
              >
                {day}
              </Box>
            ))}
          </Flex>

          {/* Day grid */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gapY="2">
            {renderDayCells()}
          </Box>
        </>
      )}

      {viewMode === 'month' && renderMonthGrid()}
      {viewMode === 'year' && renderYearGrid()}
    </Box>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Chevron nav button used for month nav (day view) and year-page nav (year view) */
function NavChevronButton({
  enabled,
  onClick,
  direction,
  accentColor,
  ariaLabel,
}: {
  enabled: boolean;
  onClick: () => void;
  direction: 'prev' | 'next';
  accentColor: string;
  ariaLabel?: string;
}) {
  return (
    <Box
      as="button"
      // @ts-expect-error type is valid when as="button"
      type="button"
      aria-label={ariaLabel ?? (direction === 'prev' ? 'Go to previous month' : 'Go to next month')}
      aria-disabled={!enabled}
      disabled={!enabled}
      onClick={enabled ? onClick : undefined}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="7"
      h="7"
      borderRadius="md"
      cursor={enabled ? 'pointer' : 'not-allowed'}
      color={enabled ? 'text.heading' : 'text.muted'}
      opacity={enabled ? 1 : 0.35}
      p="0"
      flexShrink={0}
      _hover={enabled ? { color: accentColor, bg: 'bg.subtle' } : undefined}
      transition="all 0.15s"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </Box>
  );
}

/** Clickable pill button for the Month and Year labels in the calendar header */
function HeaderPillButton({
  label,
  isActive,
  accentColor,
  accentLight,
  onClick,
}: {
  label: string;
  isActive: boolean;
  accentColor: string;
  accentLight: string;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      // @ts-expect-error type is valid when as="button"
      type="button"
      onClick={onClick}
      title={isActive ? 'Click to collapse' : 'Click to browse'}
      display="inline-flex"
      alignItems="center"
      gap="0.5"
      px="2"
      py="0.5"
      borderRadius="md"
      bg={isActive ? accentLight : 'transparent'}
      color={isActive ? accentColor : 'text.heading'}
      fontWeight="semibold"
      fontSize="15px"
      fontFamily="var(--font-body)"
      cursor="pointer"
      lineHeight="1.4"
      _hover={!isActive ? { bg: accentLight, color: accentColor } : undefined}
      transition="all 0.15s"
    >
      {label}
      {/* Small caret indicator */}
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          opacity: 0.7,
          marginTop: '1px',
        }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </Box>
  );
}

/** Cell used in the month-picker and year-picker grids */
function MonthYearCell({
  label,
  isActive,
  isDisabled,
  accentColor,
  accentLight,
  onClick,
}: {
  label: string;
  isActive: boolean;
  isDisabled: boolean;
  accentColor: string;
  accentLight: string;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      // @ts-expect-error type is valid when as="button"
      type="button"
      onClick={isDisabled ? undefined : onClick}
      {...({ disabled: isDisabled } as Record<string, unknown>)}
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="10"
      borderRadius="md"
      border="1.5px solid"
      borderColor={isActive ? accentColor : 'transparent'}
      bg={isActive ? accentColor : 'transparent'}
      color={isActive ? 'white' : isDisabled ? 'text.muted' : 'text.heading'}
      fontSize="13px"
      fontWeight={isActive ? 'semibold' : 'medium'}
      fontFamily="var(--font-body)"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      opacity={isDisabled ? 0.35 : 1}
      _hover={
        !isDisabled && !isActive
          ? {
              bg: accentLight,
              color: accentColor,
              borderColor: accentColor,
            }
          : undefined
      }
      transition="all 0.15s"
    >
      {label}
    </Box>
  );
}

function DayCell({
  day,
  isActive,
  isMuted,
  isDisabled,
  accentColor,
  accentLight,
  onClick,
}: {
  day: number;
  isActive?: boolean;
  isMuted?: boolean;
  /** Out-of-range day: visible but not selectable */
  isDisabled?: boolean;
  accentColor: string;
  accentLight?: string;
  onClick?: () => void;
}) {
  return (
    <Flex justify="center" align="center" h="10">
      <Box
        as="button"
        // @ts-expect-error type is valid when as="button"
        type="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="9"
        h="9"
        borderRadius="full"
        fontSize="sm"
        fontWeight="medium"
        onClick={onClick}
        {...({ disabled: isMuted || isDisabled } as Record<string, unknown>)}
        cursor={isMuted ? 'default' : isDisabled ? 'not-allowed' : 'pointer'}
        opacity={isDisabled ? 0.35 : 1}
        style={{
          background: isActive ? accentColor : 'transparent',
          color: isActive ? '#ffffff' : undefined,
          transition: 'background 0.15s, color 0.15s',
        }}
        color={!isActive ? (isMuted || isDisabled ? 'text.muted' : 'text.heading') : undefined}
        _hover={
          !isMuted && !isDisabled && !isActive
            ? {
                bg: accentLight,
                color: accentColor,
              }
            : undefined
        }
        transition="all 0.2s"
      >
        {day}
      </Box>
    </Flex>
  );
}
