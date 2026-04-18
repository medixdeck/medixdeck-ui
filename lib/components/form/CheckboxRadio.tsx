"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

// ─── Brand palette (mirrors Button.tsx exactly) ───────────────────────────────
const COLORS = {
  blue:   { solid: "#0685FF", ring: "rgba(6,133,255,0.30)",  tint: "#E8F3FF" },
  purple: { solid: "#7700CC", ring: "rgba(119,0,204,0.25)",  tint: "#F9F0FF" },
  green:  { solid: "#1B7A38", ring: "rgba(27,122,56,0.25)",  tint: "#F0FDF4" },
} as const;

type ColorScheme = keyof typeof COLORS;

// ─────────────────────────────────────────────────────────────────────────────
// CHECKBOX
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckboxProps {
  /** Brand color for the checked state */
  colorScheme?: ColorScheme;
  /** Controlled checked value */
  checked?: boolean;
  /** Default checked (uncontrolled) */
  defaultChecked?: boolean;
  /** Called when checked state changes */
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Show indeterminate dash instead of tick */
  indeterminate?: boolean;
  children?: React.ReactNode;
  /** Helper text below the label */
  description?: string;
  name?: string;
  value?: string;
  id?: string;
}

/**
 * MedixDeck Checkbox
 *
 * @example
 * ```tsx
 * <Checkbox colorScheme="blue">I agree to share my medical records</Checkbox>
 * <Checkbox colorScheme="purple" description="Required for video calls">Camera access</Checkbox>
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      colorScheme = "blue",
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      indeterminate = false,
      children,
      description,
      name,
      value,
      id,
    },
    ref
  ) => {
    const c = COLORS[colorScheme];
    const uid = id ?? React.useId();

    // Track checked state internally (for both controlled + uncontrolled)
    const [localChecked, setLocalChecked] = React.useState(defaultChecked);
    const [focused, setFocused] = React.useState(false);
    const isOn = controlledChecked !== undefined ? controlledChecked : localChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledChecked === undefined) setLocalChecked(e.target.checked);
      onChange?.(e.target.checked);
    };

    // ── visual control styles ────────────────────────────────────────────────
    const boxStyle: React.CSSProperties = {
      width: 18,
      height: 18,
      borderRadius: 4,
      border: `2px solid ${isOn || indeterminate ? c.solid : "var(--medix-form-border, #CBD5E1)"}`,
      background: isOn || indeterminate ? c.solid : "transparent",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginTop: 2,
      transition: "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
      boxShadow: focused ? `0 0 0 3px ${c.ring}` : "none",
      pointerEvents: "none",
    };

    return (
      <Box opacity={disabled ? 0.55 : 1}>
        <label
          htmlFor={uid}
          style={{
            display: "inline-flex",
            alignItems: "flex-start",
            gap: 10,
            cursor: disabled ? "not-allowed" : "pointer",
            userSelect: "none",
          }}
        >
          {/* Hidden native input — provides all a11y + form behaviour */}
          <input
            ref={ref}
            id={uid}
            type="checkbox"
            name={name}
            value={value}
            checked={isOn}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              opacity: 0,
              margin: 0,
              padding: 0,
              pointerEvents: "none",
            }}
          />

          {/* Visual checkbox box */}
          <span style={boxStyle} aria-hidden="true">
            {indeterminate ? (
              // Dash (−)
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <rect width="10" height="2" rx="1" fill="#fff" />
              </svg>
            ) : isOn ? (
              // Tick (✓)
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path
                  d="M1 4.5L4 7.5L10 1"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>

          {/* Label + description */}
          {children && (
            <Box>
              <Text as="span" fontFamily="var(--font-body)" fontSize="md" color="text.body" lineHeight="1.5">
                {children}
              </Text>
              {description && (
                <Text display="block" fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mt="0.5">
                  {description}
                </Text>
              )}
            </Box>
          )}
        </label>

        {/* Description without a label sibling */}
        {!children && description && (
          <Text mt="1" ml="7" fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
            {description}
          </Text>
        )}
      </Box>
    );
  }
);

Checkbox.displayName = "MedixCheckbox";

// ─────────────────────────────────────────────────────────────────────────────
// RADIOGROUP
// ─────────────────────────────────────────────────────────────────────────────

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  /** Controlled selected value */
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  /** Brand color for the selected dot */
  colorScheme?: "blue" | "purple";
  direction?: "row" | "column";
}

/**
 * MedixDeck RadioGroup
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   name="consultation-type"
 *   colorScheme="blue"
 *   options={[
 *     { value: "video",     label: "Video Consultation", description: "From anywhere" },
 *     { value: "in-person", label: "In-Person Visit",    description: "At the clinic" },
 *   ]}
 * />
 * ```
 */
export function RadioGroup({
  name,
  value: controlledValue,
  onChange,
  options,
  colorScheme = "blue",
  direction = "column",
}: RadioGroupProps) {
  const c = COLORS[colorScheme];
  const [localValue, setLocalValue] = React.useState<string>("");
  const selectedValue = controlledValue !== undefined ? controlledValue : localValue;

  const handleChange = (val: string) => {
    if (controlledValue === undefined) setLocalValue(val);
    onChange?.(val);
  };

  return (
    <Box
      display="flex"
      flexDirection={direction}
      gap={direction === "row" ? "5" : "3"}
      role="radiogroup"
    >
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <RadioItem
            key={opt.value}
            option={opt}
            name={name}
            isSelected={isSelected}
            onChange={handleChange}
            solidColor={c.solid}
            ring={c.ring}
          />
        );
      })}
    </Box>
  );
}

// ─── RadioItem (internal) ────────────────────────────────────────────────────

function RadioItem({
  option,
  name,
  isSelected,
  onChange,
  solidColor,
  ring,
}: {
  option: RadioOption;
  name: string;
  isSelected: boolean;
  onChange: (value: string) => void;
  solidColor: string;
  ring: string;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: 10,
        cursor: option.disabled ? "not-allowed" : "pointer",
        opacity: option.disabled ? 0.55 : 1,
        userSelect: "none",
      }}
    >
      {/* Hidden native radio input */}
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={isSelected}
        disabled={option.disabled}
        onChange={() => onChange(option.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          margin: 0,
          padding: 0,
          pointerEvents: "none",
        }}
      />

      {/* Visual radio ring + inner dot */}
      <span
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${isSelected ? solidColor : "var(--medix-form-border, #CBD5E1)"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          boxShadow: focused ? `0 0 0 3px ${ring}` : "none",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: solidColor,
            transform: isSelected ? "scale(1)" : "scale(0)",
            transition: "transform 0.15s ease",
          }}
        />
      </span>

      {/* Label text */}
      <Box>
        <Text as="span" fontFamily="var(--font-body)" fontSize="md" color="text.body" lineHeight="1.5">
          {option.label}
        </Text>
        {option.description && (
          <Text display="block" fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mt="0.5">
            {option.description}
          </Text>
        )}
      </Box>
    </label>
  );
}
