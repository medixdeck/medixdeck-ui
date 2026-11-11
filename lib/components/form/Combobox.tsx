'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useHaptics } from '../../hooks/useHaptics';
import type { HapticInput } from '../../utils/haptics';

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  /** Brand color scheme ('blue' | 'purple') */
  colorScheme?: 'blue' | 'purple';
  isInvalid?: boolean;
  isDisabled?: boolean;
  /** Haptic feedback intent/pattern on selection. Set `false` to disable. */
  haptic?: HapticInput;
  /** Disable haptic feedback for this combobox. */
  disableHaptic?: boolean;
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
}

const CHEVRON_DOWN = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  label,
  helperText,
  errorMessage,
  colorScheme = 'blue',
  isInvalid = false,
  isDisabled = false,
  haptic,
  disableHaptic = false,
  id,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
}: ComboboxProps) {
  const { trigger } = useHaptics();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync external value to search text
    if (value) {
      const selected = options.find((opt) => opt.value === value);
      if (selected) setSearch(selected.label);
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search to strict bound value if clicked outside without selecting
        if (value) {
          const selected = options.find((opt) => opt.value === value);
          if (selected) setSearch(selected.label);
        } else {
          setSearch('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    setActiveIndex(isOpen && filteredOptions.length > 0 ? 0 : -1);
  }, [isOpen, search, filteredOptions.length]);

  const focusColor = colorScheme === 'purple' ? '#7700CC' : '#0685FF';
  const activeBorderColor = isInvalid
    ? '#DC2626'
    : isOpen
      ? focusColor
      : 'var(--medix-form-border)';

  const boxShadow = 'none';

  return (
    <Box w="100%" position="relative" zIndex={isOpen ? 1000 : undefined} ref={containerRef}>
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

      <Box position="relative">
        <input
          id={id}
          name={name}
          type="text"
          value={search}
          placeholder={placeholder}
          disabled={isDisabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={id ? `${id}-listbox` : undefined}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={isInvalid || ariaInvalid || undefined}
          aria-required={ariaRequired}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange?.(''); // clear if empty
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!isOpen) {
                setIsOpen(true);
                return;
              }
              setActiveIndex((i) => {
                if (filteredOptions.length === 0) return -1;
                return i < 0 ? 0 : (i + 1) % filteredOptions.length;
              });
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!isOpen) {
                setIsOpen(true);
                return;
              }
              setActiveIndex((i) => {
                if (filteredOptions.length === 0) return -1;
                return i <= 0 ? filteredOptions.length - 1 : i - 1;
              });
            } else if (e.key === 'Enter') {
              if (isOpen) {
                const opt = filteredOptions[activeIndex];
                if (opt) {
                  e.preventDefault();
                  if (!disableHaptic && haptic !== false && opt.value !== value) {
                    trigger(haptic ?? 'selection');
                  }
                  onChange?.(opt.value);
                  setSearch(opt.label);
                  setIsOpen(false);
                }
              }
            }
          }}
          style={{
            width: '100%',
            height: '40px',
            padding: '0 40px 0 16px',
            borderRadius: '10px',
            border: `1.5px solid ${activeBorderColor}`,
            boxShadow,
            background: 'var(--medix-form-bg)',
            color: 'var(--medix-form-text)',
            fontSize: '15px',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 0.5 : 1,
          }}
        />

        <Box
          position="absolute"
          right="3"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          color="text.muted"
        >
          {CHEVRON_DOWN}
        </Box>
      </Box>

      {isOpen && !isDisabled && (
        <Box
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          position="absolute"
          zIndex={1000}
          top="100%"
          left="0"
          right="0"
          mt="1"
          bg="bg.surface"
          border="1px solid"
          borderColor="border"
          borderRadius="md"
          boxShadow="none"
          maxH="200px"
          overflowY="auto"
          py="1"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const selected = opt.value === value;
              const active = idx === activeIndex;
              return (
                <Box
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  px="3"
                  py="2"
                  fontSize="sm"
                  fontFamily="var(--font-body)"
                  color="text.body"
                  cursor="pointer"
                  bg={active || selected ? 'bg.subtle' : undefined}
                  _hover={{ bg: 'bg.subtle' }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    if (!disableHaptic && haptic !== false && opt.value !== value) {
                      trigger(haptic ?? 'selection');
                    }
                    onChange?.(opt.value);
                    setSearch(opt.label);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </Box>
              );
            })
          ) : (
            <Box px="3" py="2" fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
              No options found
            </Box>
          )}
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
