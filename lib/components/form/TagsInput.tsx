'use client';

import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Box, Text } from '@chakra-ui/react';

export interface TagsInputProps {
  /** Array of tag strings */
  value: string[];
  /** Callback when tag list changes */
  onChange: (tags: string[]) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Field label */
  label?: string;
  /** Helper text displayed below input */
  helperText?: string;
  /** Error message displayed below input */
  errorMessage?: string;
  /** Whether the field is invalid */
  isInvalid?: boolean;
  /** Brand color theme ('blue' | 'purple') */
  colorScheme?: 'blue' | 'purple';
  /** Field size ('sm' | 'md' | 'lg') */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  isDisabled?: boolean;
  /** Read-only state */
  isReadOnly?: boolean;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Allow duplicate tags (default: false) */
  allowDuplicates?: boolean;
  /** Add tag when input loses focus (default: false) */
  addOnBlur?: boolean;
  /** Custom delimiter character to trigger tag addition (e.g. ',') */
  delimiter?: string;
  /** HTML input id */
  id?: string;
  /** HTML input name */
  name?: string;
  /** Extra container styles */
  style?: React.CSSProperties;
  className?: string;
}

export type TagInputProps = TagsInputProps;

const sizeStyles = {
  sm: {
    minH: '34px',
    py: '1',
    px: '2.5',
    fontSize: '13px',
    tagPy: '1px',
    tagPx: '2',
    tagFontSize: '12px',
  },
  md: {
    minH: '42px',
    py: '1.5',
    px: '3',
    fontSize: '14px',
    tagPy: '2px',
    tagPx: '2.5',
    tagFontSize: '12px',
  },
  lg: {
    minH: '48px',
    py: '2',
    px: '4',
    fontSize: '15px',
    tagPy: '3px',
    tagPx: '3',
    tagFontSize: '13px',
  },
};

const brandColors = {
  blue: {
    focusBorder: '#0685FF',
    tagBgLight: '#EBF5FF',
    tagBgDark: 'rgba(6, 133, 255, 0.18)',
    tagTextLight: '#0062CC',
    tagTextDark: '#60A5FA',
    tagBorderLight: 'rgba(6, 133, 255, 0.25)',
    tagBorderDark: 'rgba(6, 133, 255, 0.35)',
  },
  purple: {
    focusBorder: '#7700CC',
    tagBgLight: '#F3E8FF',
    tagBgDark: 'rgba(119, 0, 204, 0.18)',
    tagTextLight: '#5B0099',
    tagTextDark: '#C084FC',
    tagBorderLight: 'rgba(119, 0, 204, 0.25)',
    tagBorderDark: 'rgba(119, 0, 204, 0.35)',
  },
};

/**
 * MedixDeck TagsInput / TagInput
 *
 * Interactive input component for tags, keywords, allergies, and multi-selection pills.
 * Fully aligned with MedixDeck brand design system, light/dark mode, and colorScheme options.
 *
 * @example
 * ```tsx
 * <TagsInput
 *   label="Known Allergies"
 *   value={allergies}
 *   onChange={setAllergies}
 *   placeholder="Type allergy and press Enter..."
 *   colorScheme="blue"
 * />
 * ```
 */
export function TagsInput({
  value = [],
  onChange,
  placeholder = 'Add tag...',
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  colorScheme = 'blue',
  size = 'md',
  isDisabled = false,
  isReadOnly = false,
  maxTags,
  allowDuplicates = false,
  addOnBlur = false,
  delimiter = ',',
  id,
  name,
  style,
  className,
}: TagsInputProps) {
  const fallbackId = React.useId();
  const inputId = id ?? fallbackId;
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const brand = brandColors[colorScheme] ?? brandColors.blue;
  const sz = sizeStyles[size] ?? sizeStyles.md;

  const addTag = (text: string) => {
    if (isDisabled || isReadOnly) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    if (maxTags != null && value.length >= maxTags) return;
    if (!allowDuplicates && value.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...value, trimmed]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    if (isDisabled || isReadOnly) return;
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (delimiter && e.key === delimiter) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (addOnBlur && inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const activeBorderColor = isInvalid
    ? '#DC2626'
    : isFocused
      ? brand.focusBorder
      : 'var(--medix-form-border)';

  return (
    <Box w="100%" style={style} className={className}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--medix-form-text)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {label}
        </label>
      )}

      {/* Container Box */}
      <Box
        onClick={() => !isDisabled && inputRef.current?.focus()}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        gap="1.5"
        minH={sz.minH}
        py={sz.py}
        px={sz.px}
        borderRadius="10px"
        bg="bg.surface"
        cursor={isDisabled ? 'not-allowed' : 'text'}
        opacity={isDisabled ? 0.55 : 1}
        transition="border-color 0.15s ease"
        style={{
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow: 'none',
          background: 'var(--medix-form-bg)',
        }}
      >
        {/* Render Tag Pills */}
        {value.map((tag, idx) => (
          <Box
            key={`${tag}-${idx}`}
            as="span"
            display="inline-flex"
            alignItems="center"
            gap="1"
            px={sz.tagPx}
            py={sz.tagPy}
            borderRadius="full"
            fontSize={sz.tagFontSize}
            fontWeight="500"
            fontFamily="var(--font-body)"
            lineHeight="1.4"
            whiteSpace="nowrap"
            bg={colorScheme === 'purple' ? 'purple.50' : 'blue.50'}
            color={colorScheme === 'purple' ? 'purple.700' : 'blue.700'}
            border="1px solid"
            borderColor={colorScheme === 'purple' ? 'purple.200' : 'blue.200'}
            _dark={{
              bg: colorScheme === 'purple' ? 'rgba(119, 0, 204, 0.2)' : 'rgba(6, 133, 255, 0.2)',
              color: colorScheme === 'purple' ? 'purple.300' : 'blue.300',
              borderColor:
                colorScheme === 'purple' ? 'rgba(119, 0, 204, 0.4)' : 'rgba(6, 133, 255, 0.4)',
            }}
          >
            <span>{tag}</span>
            {!isDisabled && !isReadOnly && (
              <button
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  removeTag(idx);
                }}
                aria-label={`Remove ${tag}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  padding: '0',
                  marginLeft: '2px',
                  cursor: 'pointer',
                  opacity: 0.7,
                  color: 'inherit',
                  fontSize: '14px',
                  lineHeight: 1,
                  transition: 'opacity 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '0.7';
                }}
              >
                ×
              </button>
            )}
          </Box>
        ))}

        {/* Text Input Element */}
        {!isDisabled && !isReadOnly && (
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={isDisabled}
            readOnly={isReadOnly}
            style={{
              flex: 1,
              minWidth: '120px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: sz.fontSize,
              fontFamily: 'var(--font-body)',
              color: 'var(--medix-form-text)',
              padding: 0,
            }}
          />
        )}
      </Box>

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

// Export TagInput as alias for TagsInput
export const TagInput = TagsInput;
