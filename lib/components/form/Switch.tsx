"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

// ─── Brand palette ────────────────────────────────────────────────────────────
const COLORS = {
  blue:   { solid: "#0685FF", ring: "rgba(6,133,255,0.30)",  track: "#0685FF" },
  purple: { solid: "#7700CC", ring: "rgba(119,0,204,0.25)",  track: "#7700CC" },
  green:  { solid: "#1B7A38", ring: "rgba(27,122,56,0.25)",  track: "#1B7A38" },
} as const;

type ColorScheme = keyof typeof COLORS;

const TRACK_SIZE = {
  sm: { width: 32, height: 18, thumbSize: 12, thumbOffset: 2 },
  md: { width: 42, height: 24, thumbSize: 16, thumbOffset: 3 },
  lg: { width: 52, height: 30, thumbSize: 20, thumbOffset: 4 },
} as const;

// ─── Props ───────────────────────────────────────────────────────────────────

export interface SwitchProps {
  /** Brand color for the on state */
  colorScheme?: ColorScheme;
  size?: "sm" | "md" | "lg";
  /** Controlled checked value */
  checked?: boolean;
  /** Default state for uncontrolled usage */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Label shown to the right */
  label?: string;
  /** Helper text shown below the label */
  description?: string;
  name?: string;
  id?: string;
}

/**
 * MedixDeck Switch / Toggle
 *
 * @example
 * ```tsx
 * <Switch label="Email notifications" description="Get reminders for appointments" />
 * <Switch colorScheme="purple" label="Dark mode" defaultChecked />
 * ```
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      colorScheme = "blue",
      size = "md",
      checked,
      defaultChecked = false,
      onChange,
      disabled = false,
      label,
      description,
      name,
      id,
    },
    ref
  ) => {
    const c = COLORS[colorScheme];
    const sz = TRACK_SIZE[size];
    const internalId = id ?? React.useId();

    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const [focused, setFocused] = React.useState(false);

    const isOn = checked !== undefined ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) setInternalChecked(e.target.checked);
      onChange?.(e.target.checked);
    };

    // ── Track styles ──────────────────────────────────────────────────────────
    const trackStyle: React.CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      width: sz.width,
      height: sz.height,
      borderRadius: sz.height,
      background: isOn ? c.track : "var(--medix-form-border, #CBD5E1)",
      transition: "background 0.2s ease, box-shadow 0.2s ease",
      boxShadow: focused ? `0 0 0 3px ${c.ring}` : "none",
      cursor: disabled ? "not-allowed" : "pointer",
      flexShrink: 0,
    };

    // ── Thumb styles ──────────────────────────────────────────────────────────
    const thumbStyle: React.CSSProperties = {
      position: "absolute",
      width: sz.thumbSize,
      height: sz.thumbSize,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
      top: sz.thumbOffset,
      left: isOn
        ? sz.width - sz.thumbSize - sz.thumbOffset
        : sz.thumbOffset,
      transition: "left 0.18s ease",
    };

    return (
      <Box display="flex" alignItems="flex-start" gap="3" opacity={disabled ? 0.55 : 1}>
        {/* Accessible label wrapping hidden input + visual track */}
        <label
          htmlFor={internalId}
          style={{ display: "inline-flex", cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {/* Hidden native checkbox — drives all a11y & form behaviour */}
          <input
            ref={ref}
            id={internalId}
            type="checkbox"
            role="switch"
            name={name}
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
          {/* Visual track + thumb */}
          <span style={trackStyle} aria-hidden="true">
            <span style={thumbStyle} />
          </span>
        </label>

        {(label || description) && (
          <Box>
            {label && (
              <label
                htmlFor={internalId}
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "inherit",
                  fontFamily: "var(--font-body)",
                  lineHeight: "1.4",
                  cursor: disabled ? "not-allowed" : "pointer",
                  userSelect: "none",
                }}
              >
                {label}
              </label>
            )}
            {description && (
              <Text fontSize="sm" color="text.muted" fontFamily="var(--font-body)" mt="0.5">
                {description}
              </Text>
            )}
          </Box>
        )}
      </Box>
    );
  }
);

Switch.displayName = "MedixSwitch";
