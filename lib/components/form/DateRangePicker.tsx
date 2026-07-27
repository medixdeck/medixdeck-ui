'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Calendar } from './Calendar';

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
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  id,
}: DateRangePickerProps) {
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeBorderColor = isInvalid
    ? '#DC2626'
    : activeInput
      ? '#0685FF'
      : 'var(--medix-form-border)';

  const boxShadow = 'none';

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    padding: '0 10px',
    background: 'transparent',
    color: 'var(--medix-form-text)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    border: 'none',
    outline: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    colorScheme: 'auto',
    width: '100%',
  };

  const formatDateValue = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
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

    if (activeInput === 'start') {
      onStartChange?.(formatted);
      if (endValue && endValue < formatted) {
        onEndChange?.('');
      }
      setActiveInput('end'); // auto move to end
    } else if (activeInput === 'end') {
      onEndChange?.(formatted);
      if (startValue && startValue > formatted) {
        onStartChange?.('');
      }
      setActiveInput(null); // close popover
    }
  };

  /** Parse a YYYY-MM-DD string into a local Date to avoid UTC off-by-one. */
  const parseLocalDate = (dateStr?: string): Date | undefined => {
    if (!dateStr) return undefined;
    const [y, m, d] = dateStr.split('-').map(Number);
    // Explicit bounds check before constructing to catch invalid inputs early
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return undefined;
    const parsed = new Date(y, m - 1, d);
    // Round-trip check rejects rolled-over dates (e.g. Feb 31 → Mar 3)
    if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d)
      return undefined;
    return parsed;
  };

  const currentCalValue = activeInput === 'start' ? startValue : endValue;
  const parsedDate = parseLocalDate(currentCalValue);

  const startDate = parseLocalDate(startValue);
  const endDate = parseLocalDate(endValue);

  const displayStart = startDate
    ? startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  const displayEnd = endDate
    ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <Box w="100%" position="relative" ref={containerRef}>
      {label && (
        <Text
          mb="1.5"
          fontSize="sm"
          fontWeight="medium"
          color="text.heading"
          fontFamily="var(--font-body)"
        >
          {label}
        </Text>
      )}

      <Box
        display="flex"
        alignItems="center"
        position="relative"
        style={{
          width: '100%',
          height: '40px',
          borderRadius: '10px',
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow,
          background: 'var(--medix-form-bg)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          opacity: isDisabled ? 0.5 : 1,
          overflow: 'hidden',
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
          aria-haspopup="dialog"
          aria-expanded={activeInput === 'start'}
          onClick={() => !isDisabled && setActiveInput('start')}
          onKeyDown={(e) => {
            if (!isDisabled) {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveInput('start');
              } else if (e.key === 'Escape') {
                setActiveInput(null);
              }
            }
          }}
          style={{ ...inputStyle, textAlign: 'center' }}
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
          aria-haspopup="dialog"
          aria-expanded={activeInput === 'end'}
          onClick={() => !isDisabled && setActiveInput('end')}
          onKeyDown={(e) => {
            if (!isDisabled) {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveInput('end');
              } else if (e.key === 'Escape') {
                setActiveInput(null);
              }
            }
          }}
          style={{ ...inputStyle, textAlign: 'center' }}
        />
      </Box>

      {activeInput && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left="0"
          zIndex="popover"
          boxShadow="none"
          borderRadius="card"
          border="1px solid"
          borderColor="border"
          bg="bg.surface"
          overflow="hidden"
        >
          <Calendar
            value={parsedDate}
            onChange={handleDateSelect}
            minDate={
              // When selecting the end date, the earliest selectable day is the
              // chosen start date (if set), otherwise fall back to the prop min.
              activeInput === 'end' ? (startDate ?? parseLocalDate(min)) : parseLocalDate(min)
            }
            maxDate={parseLocalDate(max)}
          />
        </Box>
      )}

      {(helperText || errorMessage) && (
        <Text
          mt="1.5"
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
