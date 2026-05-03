"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Calendar } from "./Calendar";

export interface DatePickerProps {
  /** Controlled value (ISO date string: YYYY-MM-DD) */
  value?: string;
  onChange?: (value: string) => void;
  /** Minimum selectable date (ISO string) */
  min?: string;
  /** Maximum selectable date (ISO string) */
  max?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  id?: string;
  /** Whether to also show time input */
  includeTime?: boolean;
}

/**
 * MedixDeck DatePicker
 *
 * Uses the custom MedixDeck Calendar component.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Appointment Date"
 *   min={today}
 *   value={selectedDate}
 *   onChange={(date) => setSelectedDate(date)}
 * />
 * ```
 */
export function DatePicker({
  value,
  onChange,
  min,
  max,
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  placeholder = "Select date",
  id,
  includeTime = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeBorderColor = isInvalid
    ? "#DC2626"
    : isOpen
    ? "#0685FF"
    : "var(--medix-form-border)";

  const boxShadow = isOpen
    ? `0 0 0 3px ${isInvalid ? "rgba(220,38,38,0.15)" : "rgba(6,133,255,0.15)"}`
    : "none";

  const handleDateSelect = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    onChange?.(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const parsedDate = value ? new Date(value) : undefined;
  
  const displayValue = value && parsedDate && !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

  return (
    <Box w="100%" position="relative" ref={containerRef}>
      {label && (
        <Text mb="1.5" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box position="relative">
        <input
          id={id}
          readOnly
          type="text"
          value={displayValue}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          style={{
            width: "100%",
            height: "40px",
            padding: "0 40px 0 16px",
            borderRadius: "10px",
            border: `1.5px solid ${activeBorderColor}`,
            boxShadow,
            background: "var(--medix-form-bg)",
            color: "var(--medix-form-text)",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.5 : 1,
            colorScheme: "auto",
          }}
        />
        {/* Calendar icon */}
        <Box
          position="absolute"
          right="3"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          fontSize="md"
          color="text.muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </Box>
      </Box>

      {isOpen && (
        <Box 
          position="absolute" 
          top="calc(100% + 8px)" 
          left="0" 
          zIndex="10" 
          boxShadow="lg" 
          borderRadius="card"
          border="1px solid"
          borderColor="border"
          bg="bg.surface"
          overflow="hidden"
        >
          <Calendar value={parsedDate} onChange={handleDateSelect} />
        </Box>
      )}

      {(helperText || errorMessage) && (
        <Text mt="1.5" fontSize="xs" color={isInvalid ? "red.500" : "text.muted"} fontFamily="var(--font-body)">
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}
