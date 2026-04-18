"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

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
 * Styled wrapper around two native date inputs (start and end).
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
  startPlaceholder,
  endPlaceholder,
  id,
}: DateRangePickerProps) {
  const [activeInput, setActiveInput] = React.useState<"start" | "end" | null>(null);

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

  return (
    <Box w="100%">
      {label && (
        <Text mb="1.5" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box
        display="flex"
        alignItems="center"
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
          type="date"
          value={startValue ?? ""}
          onChange={(e) => onStartChange?.(e.target.value)}
          min={min}
          max={endValue || max}
          placeholder={startPlaceholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onFocus={() => setActiveInput("start")}
          onBlur={() => setActiveInput(null)}
          style={inputStyle}
        />
        
        <Box color="text.muted" px="1" fontSize="sm">
          —
        </Box>

        <input
          type="date"
          value={endValue ?? ""}
          onChange={(e) => onEndChange?.(e.target.value)}
          min={startValue || min}
          max={max}
          placeholder={endPlaceholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onFocus={() => setActiveInput("end")}
          onBlur={() => setActiveInput(null)}
          style={inputStyle}
        />
      </Box>

      {(helperText || errorMessage) && (
        <Text mt="1.5" fontSize="xs" color={isInvalid ? "red.500" : "text.muted"} fontFamily="var(--font-body)">
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}
