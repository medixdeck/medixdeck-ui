"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

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
 * Styled wrapper around the native date/datetime-local input.
 * Colors use CSS custom properties (--medix-form-*) that cascade from any
 * .dark ancestor, so dark mode works without any JS theme hook.
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
  placeholder,
  id,
  includeTime = false,
}: DatePickerProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const activeBorderColor = isInvalid
    ? "#DC2626"
    : isFocused
    ? "#0685FF"
    : "var(--medix-form-border)";

  const boxShadow = isFocused
    ? `0 0 0 3px ${isInvalid ? "rgba(220,38,38,0.15)" : "rgba(6,133,255,0.15)"}`
    : "none";

  return (
    <Box w="100%">
      {label && (
        <Text mb="1.5" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box position="relative">
        <input
          id={id}
          type={includeTime ? "datetime-local" : "date"}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: "100%",
            height: "40px",
            padding: "0 40px 0 16px",
            borderRadius: "10px",
            border: `1.5px solid ${activeBorderColor}`,
            boxShadow,
            /* CSS vars flip automatically when .dark is on any ancestor */
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
        {/* Calendar icon — anchored to the right, not interactive */}
        <Box
          position="absolute"
          right="3"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          fontSize="md"
          color="text.muted"
        >
          📅
        </Box>
      </Box>

      {(helperText || errorMessage) && (
        <Text mt="1.5" fontSize="xs" color={isInvalid ? "red.500" : "text.muted"} fontFamily="var(--font-body)">
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}
