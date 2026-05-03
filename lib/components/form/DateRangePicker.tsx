"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Calendar } from "./Calendar";

export interface DateRangePickerProps {
  /** Controlled start date value (ISO date string: YYYY-MM-DD) */
  startValue?: string;
  onStartChange?: (value: string) => void;
  /** Controlled end date value (ISO date string: YYYY-MM-DD) */
  endValue?: string;
  onEndChange?: (value: string) => void;
  /** Minimum selectable date (ISO string) */
  min?: string;
  /** Maximum selectable date (ISO string) */
  max?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
  id?: string;
}

/**
 * MedixDeck DateRangePicker
 *
 * Uses the custom MedixDeck Calendar component for picking start and end dates.
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   label="Consultation Period"
 *   startValue={start}
 *   onStartChange={setStart}
 *   endValue={end}
 *   onEndChange={setEnd}
 * />
 * ```
 */
export function DateRangePicker({
  startValue,
  onStartChange,
  endValue,
  onEndChange,
  min,
  max,
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  id,
}: DateRangePickerProps) {
  const [activeInput, setActiveInput] = useState<"start" | "end" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeBorderColor = isInvalid
    ? "#DC2626"
    : activeInput
    ? "#0685FF"
    : "var(--medix-form-border)";

  const boxShadow = activeInput
    ? `0 0 0 3px ${isInvalid ? "rgba(220,38,38,0.15)" : "rgba(6,133,255,0.15)"}`
    : "none";

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: "100%",
    padding: "0 10px",
    background: "transparent",
    color: "var(--medix-form-text)",
    fontSize: "15px",
    fontFamily: "var(--font-body)",
    border: "none",
    outline: "none",
    cursor: isDisabled ? "not-allowed" : "pointer",
    colorScheme: "auto",
    width: "100%",
  };

  const formatDateValue = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const clampDateValue = (value: string) => {
    if (min && value < min) {
      return min;
    }
    if (max && value > max) {
      return max;
    }
    return value;
  };

  const handleDateSelect = (date: Date) => {
    const formatted = clampDateValue(formatDateValue(date));

    if (activeInput === "start") {
      onStartChange?.(formatted);
      if (endValue && endValue < formatted) {
        onEndChange?.("");
      }
      setActiveInput("end"); // auto move to end
    } else if (activeInput === "end") {
      onEndChange?.(formatted);
      if (startValue && startValue > formatted) {
        onStartChange?.("");
      }
      setActiveInput(null); // close popover
    }
  };

  const currentCalValue = activeInput === "start" ? startValue : endValue;
  const parsedDate = currentCalValue ? new Date(currentCalValue) : undefined;
  
  const displayStart = startValue && !isNaN(new Date(startValue).getTime())
    ? new Date(startValue).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";
    
  const displayEnd = endValue && !isNaN(new Date(endValue).getTime())
    ? new Date(endValue).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

  return (
    <Box w="100%" position="relative" ref={containerRef}>
      {label && (
        <Text mb="1.5" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box
        display="flex"
        alignItems="center"
        position="relative"
        style={{
          width: "100%",
          height: "40px",
          borderRadius: "10px",
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow,
          background: "var(--medix-form-bg)",
          transition: "border-color 0.15s, box-shadow 0.15s",
          opacity: isDisabled ? 0.5 : 1,
          overflow: "hidden",
        }}
      >
        <input
          id={id}
          readOnly
          type="text"
          value={displayStart}
          placeholder={startPlaceholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onClick={() => !isDisabled && setActiveInput("start")}
          style={{ ...inputStyle, textAlign: "center" }}
        />
        
        <Box color="text.muted" px="1" fontSize="sm">
          —
        </Box>

        <input
          readOnly
          type="text"
          value={displayEnd}
          placeholder={endPlaceholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onClick={() => !isDisabled && setActiveInput("end")}
          style={{ ...inputStyle, textAlign: "center" }}
        />
      </Box>

      {activeInput && (
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
