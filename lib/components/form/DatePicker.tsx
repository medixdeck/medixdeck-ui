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
    if (includeTime) {
      // Preserve any existing time component; default to 00:00
      const existingTime = value?.includes("T") ? (value.split("T")[1]?.slice(0, 5) || "00:00") : "00:00";
      onChange?.(`${yyyy}-${mm}-${dd}T${existingTime}`);
      // Keep picker open so the user can also adjust the time
    } else {
      onChange?.(`${yyyy}-${mm}-${dd}`);
      setIsOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const dateStr = value?.split("T")[0] ?? "";
    if (dateStr) {
      onChange?.(`${dateStr}T${newTime}`);
    }
  };

  const parseLocalDate = (dateValue?: string) => {
    if (!dateValue) {
      return undefined;
    }

    const [yearString, monthString, dayString] = dateValue.split("-");
    const year = Number(yearString);
    const month = Number(monthString);
    // Strip any time component that may be appended (e.g. "15T14:30")
    const day = Number(dayString?.split("T")[0]);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return undefined;
    }

    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return undefined;
    }

    return parsed;
  };

  // When includeTime is true, value may be "YYYY-MM-DDTHH:MM" — strip the time for date parsing
  const parsedDate = parseLocalDate(value?.split("T")[0]);

  const displayValue = parsedDate && !isNaN(parsedDate.getTime())
    ? includeTime && value?.includes("T")
      ? `${parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} ${value.split("T")[1]?.slice(0, 5) || "00:00"}`
      : parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
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
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (!isDisabled) {
              if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                e.preventDefault();
                setIsOpen(true);
              } else if (e.key === "Escape") {
                setIsOpen(false);
              }
            }
          }}
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
          <Calendar
            value={parsedDate}
            onChange={handleDateSelect}
            minDate={parseLocalDate(min)}
            maxDate={parseLocalDate(max)}
          />
          {includeTime && (
            <Box px="5" pb="4" borderTop="1px solid" borderColor="border">
              <Text fontSize="xs" fontWeight="medium" color="text.muted" mb="1.5" fontFamily="var(--font-body)">
                Time
              </Text>
              <input
                type="time"
                value={value?.includes("T") ? (value.split("T")[1]?.slice(0, 5) || "00:00") : "00:00"}
                onChange={handleTimeChange}
                disabled={!parsedDate}
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--medix-form-border)",
                  background: "var(--medix-form-bg)",
                  color: "var(--medix-form-text)",
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  opacity: parsedDate ? 1 : 0.4,
                  cursor: parsedDate ? "default" : "not-allowed",
                  colorScheme: "auto",
                }}
              />
            </Box>
          )}
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
