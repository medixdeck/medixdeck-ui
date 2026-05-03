"use client";

import React, { useState } from "react";
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

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    if (onChange) {
      onChange(new Date());
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
      cells.push(
        <DayCell
          key={`curr-${i}`}
          day={i}
          isActive={isSelected(i, month, year)}
          onClick={() => onChange?.(new Date(year, month, i))}
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
          <Box as="button" onClick={handlePrevMonth} cursor="pointer" color="text.heading" _hover={{ color: "blue.500" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Box>
          <Text fontWeight="semibold" fontSize="md" color="text.heading">
            {MONTHS[month]} {year}
          </Text>
          <Box as="button" onClick={handleNextMonth} cursor="pointer" color="text.heading" _hover={{ color: "blue.500" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </Box>
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

function DayCell({
  day,
  isActive,
  isMuted,
  onClick,
}: {
  day: number;
  isActive?: boolean;
  isMuted?: boolean;
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
        cursor={isMuted ? "default" : "pointer"}
        pointerEvents={isMuted ? "none" : "auto"}
        bg={isActive ? "blue.500" : "transparent"}
        color={isActive ? "white" : isMuted ? "text.muted" : "text.heading"}
        _hover={!isMuted && !isActive ? { bg: "bg.subtle", color: "blue.500" } : undefined}
        transition="all 0.2s"
      >
        {day}
      </Box>
    </Flex>
  );
}
