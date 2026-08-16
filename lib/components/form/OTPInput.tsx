'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export interface OTPInputProps {
  /** Number of digits */
  length?: number;
  /** Default uncontrolled value */
  defaultValue?: string;
  /** Controlled value (joined string) */
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Brand color scheme ('blue' | 'purple') */
  colorScheme?: 'blue' | 'purple';
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
  value,
  defaultValue = '',
  onChange,
  onComplete,
  colorScheme = 'blue',
  isInvalid = false,
  isDisabled = false,
  mask = false,
  label,
  helperText,
  errorMessage,
}: OTPInputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focusedIdx, setFocusedIdx] = React.useState<number | null>(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const digits = currentValue.split('').slice(0, length);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  // Idle border colour — uses CSS vars so it automatically flips in dark mode.
  // Error states use literal hex (same in both modes by design).
  const idleBorder = isInvalid
    ? '#DC2626'
    : 'var(--medix-form-border, var(--chakra-colors-border, #E2E8F0))';
  const focusBorder = isInvalid ? '#DC2626' : colorScheme === 'purple' ? '#7700CC' : '#0685FF';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[idx]) {
        newDigits[idx] = '';
        const joined = newDigits.join('');
        if (!isControlled) setInternalValue(joined);
        onChange?.(joined);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        newDigits[idx - 1] = '';
        const joined = newDigits.join('');
        if (!isControlled) setInternalValue(joined);
        onChange?.(joined);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, '');
    const newDigits = [...digits];
    while (newDigits.length < length) newDigits.push('');

    if (!raw) {
      newDigits[idx] = '';
      const joined = newDigits.join('');
      if (!isControlled) setInternalValue(joined);
      onChange?.(joined);
      return;
    }

    // Single character typed — place it and advance focus
    newDigits[idx] = raw[0];
    const joined = newDigits.join('');
    if (!isControlled) setInternalValue(joined);
    onChange?.(joined);
    if (idx < length - 1) inputRefs.current[idx + 1]?.focus();
    if (joined.replace(/\s/g, '').length === length) onComplete?.(joined);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    // Prevent the browser from inserting the text (which would be truncated
    // to 1 char by maxLength before onChange ever fires).
    e.preventDefault();

    const raw = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!raw) return;

    const newDigits = [...digits];
    while (newDigits.length < length) newDigits.push('');

    // Fill digits starting from the box that received the paste
    const chars = raw.split('').slice(0, length - idx);
    chars.forEach((d, i) => {
      newDigits[idx + i] = d;
    });

    const joined = newDigits.join('');
    if (!isControlled) setInternalValue(joined);
    onChange?.(joined);

    // Move focus to the last box if complete, otherwise the next empty slot
    const nextFocusIdx =
      joined.replace(/\s/g, '').length === length
        ? length - 1
        : Math.min(idx + chars.length, length - 1);
    inputRefs.current[nextFocusIdx]?.focus();

    if (joined.replace(/\s/g, '').length === length) onComplete?.(joined);
  };

  return (
    <Box w="fit-content">
      {label && (
        <Text
          mb="2"
          fontSize="sm"
          fontWeight="medium"
          color="text.heading"
          fontFamily="var(--font-body)"
        >
          {label}
        </Text>
      )}

      <Box display="flex" gap="2" alignItems="center">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type={mask ? 'password' : 'text'}
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digits[idx] ?? ''}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={(e) => handlePaste(e, idx)}
            onFocus={(e) => {
              e.target.select();
              setFocusedIdx(idx);
            }}
            onBlur={() => setFocusedIdx(null)}
            disabled={isDisabled}
            aria-label={`Digit ${idx + 1} of ${length}`}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              border: `1.5px solid ${focusedIdx === idx ? focusBorder : idleBorder}`,
              boxShadow: 'none',
              /* CSS vars flip automatically when .dark is on any ancestor */
              background: 'var(--medix-form-bg, var(--chakra-colors-bg-surface, #FFFFFF))',
              color: 'var(--medix-form-text, var(--chakra-colors-text-heading, #0F172A))',
              fontSize: '20px',
              fontWeight: 600,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              cursor: isDisabled ? 'not-allowed' : 'text',
              opacity: isDisabled ? 0.5 : 1,
            }}
          />
        ))}
      </Box>

      {(helperText || errorMessage) && (
        <Text
          mt="2"
          fontSize="xs"
          color={isInvalid ? 'red.500' : 'text.muted'}
          fontFamily="var(--font-body)"
        >
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}

// ─── PinInput alias ───────────────────────────────────────────────────────────
export const PinInput = OTPInput;
export type PinInputProps = OTPInputProps;
