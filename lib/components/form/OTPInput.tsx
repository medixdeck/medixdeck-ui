"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

export interface OTPInputProps {
  /** Number of digits */
  length?: number;
  /** Controlled value (joined string) */
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Whether in error state */
  isInvalid?: boolean;
  /** Whether disabled */
  isDisabled?: boolean;
  /** Whether to mask like a password */
  mask?: boolean;
  /** Label above the input */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  errorMessage?: string;
}

/**
 * MedixDeck OTPInput / PinInput
 *
 * Single-character-per-box verification code input with full dark mode support.
 * Colors are driven by CSS custom properties (--medix-form-*) so they cascade
 * correctly with a .dark ancestor class — no JS theme hook needed.
 *
 * @example
 * ```tsx
 * <OTPInput
 *   length={6}
 *   label="Enter verification code"
 *   onComplete={(code) => verifyCode(code)}
 * />
 * ```
 */
export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  isInvalid = false,
  isDisabled = false,
  mask = false,
  label,
  helperText,
  errorMessage,
}: OTPInputProps) {
  const digits = value.split("").slice(0, length);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  // Idle border colour — uses CSS vars so it automatically flips in dark mode.
  // Error states use literal hex (same in both modes by design).
  const idleBorder = isInvalid
    ? "#DC2626"
    : "var(--medix-form-border)";
  const focusBorder = isInvalid ? "#DC2626" : "#0685FF";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[idx]) {
        newDigits[idx] = "";
        onChange?.(newDigits.join(""));
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        newDigits[idx - 1] = "";
        onChange?.(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;

    if (raw.length > 1) {
      const pasted = raw.split("").slice(0, length);
      const newDigits = [...Array(length).fill("")];
      pasted.forEach((d, i) => { newDigits[i] = d; });
      const joined = newDigits.join("");
      onChange?.(joined);
      const focusIdx = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIdx]?.focus();
      if (joined.length === length) onComplete?.(joined);
      return;
    }

    const newDigits = [...digits];
    while (newDigits.length < length) newDigits.push("");
    newDigits[idx] = raw;
    const joined = newDigits.join("");
    onChange?.(joined);
    if (idx < length - 1) inputRefs.current[idx + 1]?.focus();
    if (joined.replace(/\s/g, "").length === length) onComplete?.(joined);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  return (
    <Box w="fit-content">
      {label && (
        <Text mb="2" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box display="flex" gap="2" alignItems="center">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type={mask ? "password" : "text"}
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digits[idx] ?? ""}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onFocus={handleFocus}
            disabled={isDisabled}
            aria-label={`Digit ${idx + 1} of ${length}`}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              border: `1.5px solid ${idleBorder}`,
              /* CSS vars flip automatically when .dark is on any ancestor */
              background: "var(--medix-form-bg)",
              color: "var(--medix-form-text)",
              fontSize: "20px",
              fontWeight: 600,
              textAlign: "center",
              fontFamily: "var(--font-body)",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
              cursor: isDisabled ? "not-allowed" : "text",
              opacity: isDisabled ? 0.5 : 1,
            }}
            onFocusCapture={(e) => {
              (e.target as HTMLInputElement).style.borderColor = focusBorder;
              (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${
                isInvalid ? "rgba(220,38,38,0.15)" : "rgba(6,133,255,0.15)"
              }`;
            }}
            onBlurCapture={(e) => {
              (e.target as HTMLInputElement).style.borderColor = idleBorder;
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        ))}
      </Box>

      {(helperText || errorMessage) && (
        <Text mt="2" fontSize="xs" color={isInvalid ? "red.500" : "text.muted"} fontFamily="var(--font-body)">
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}

// ─── PinInput alias ───────────────────────────────────────────────────────────
export const PinInput = OTPInput;
export type PinInputProps = OTPInputProps;
