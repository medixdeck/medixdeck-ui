"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

export interface PhoneInputProps {
  /** Controlled value (full number including country code prefix) */
  value?: string;
  onChange?: (value: string) => void;
  /** Show country code selector */
  showCountryCode?: boolean;
  /** Default country code e.g. "+234" */
  defaultCountryCode?: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  isDisabled?: boolean;
  id?: string;
}

const COUNTRY_CODES = [
  { code: "+234", flag: "🇳🇬", country: "NG" },
  { code: "+1",   flag: "🇺🇸", country: "US" },
  { code: "+44",  flag: "🇬🇧", country: "GB" },
  { code: "+233", flag: "🇬🇭", country: "GH" },
  { code: "+254", flag: "🇰🇪", country: "KE" },
  { code: "+27",  flag: "🇿🇦", country: "ZA" },
  { code: "+251", flag: "🇪🇹", country: "ET" },
  { code: "+255", flag: "🇹🇿", country: "TZ" },
];

/**
 * MedixDeck PhoneInput
 *
 * Phone number input with country code selector (defaults to Nigeria +234).
 * Colors use CSS custom properties (--medix-form-*) that cascade from any
 * .dark ancestor, so dark mode works without any JS theme hook.
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   label="Phone number"
 *   placeholder="80 000 0000"
 *   defaultCountryCode="+234"
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
export function PhoneInput({
  value = "",
  onChange,
  showCountryCode = true,
  defaultCountryCode = "+234",
  placeholder = "80 000 0000",
  isInvalid = false,
  errorMessage,
  label,
  helperText,
  isDisabled = false,
  id,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState(defaultCountryCode);
  const [localNumber, setLocalNumber] = React.useState(value);
  const [isFocused, setIsFocused] = React.useState(false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-]/g, "");
    setLocalNumber(raw);
    onChange?.(`${countryCode}${raw.replace(/\s/g, "")}`);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
    onChange?.(`${e.target.value}${localNumber.replace(/\s/g, "")}`);
  };

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

      {/*
        Outer wrapper: background and border use CSS vars so they
        automatically switch when a .dark ancestor class is present.
      */}
      <Box
        display="flex"
        alignItems="center"
        overflow="hidden"
        borderRadius="10px"
        transition="border-color 0.15s, box-shadow 0.15s"
        opacity={isDisabled ? 0.5 : 1}
        pointerEvents={isDisabled ? "none" : undefined}
        style={{
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow,
          background: "var(--medix-form-bg)",
        }}
      >
        {showCountryCode && (
          <label
            htmlFor={`${id}-country`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "10px 12px",
              /* subtle bg separates the flag/code from the number input */
              background: "var(--medix-form-bg-subtle)",
              borderRight: "1px solid var(--medix-form-border)",
              cursor: "pointer",
              flexShrink: 0,
              minWidth: "80px",
            }}
          >
            <Text fontSize="lg" lineHeight="1">{selectedCountry.flag}</Text>
            <select
              id={`${id}-country`}
              value={countryCode}
              onChange={handleCountryChange}
              aria-label="Country code"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--medix-form-text)",
                cursor: "pointer",
                width: "42px",
              }}
            >
              {COUNTRY_CODES.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  style={{
                    background: "var(--medix-form-bg)",
                    color: "var(--medix-form-text)",
                  }}
                >
                  {c.code}
                </option>
              ))}
            </select>
          </label>
        )}

        <input
          id={id}
          type="tel"
          value={localNumber}
          onChange={handleLocalChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
            color: "var(--medix-form-text)",
            padding: "10px 16px",
            minWidth: 0,
          }}
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
