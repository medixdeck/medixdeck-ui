import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useHaptics } from '../../hooks/useHaptics';
import type { HapticInput } from '../../utils/haptics';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectCommonProps {
  options?: SelectOption[];
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Brand color scheme ('blue' | 'purple') */
  colorScheme?: 'blue' | 'purple';
  children?: React.ReactNode;
  /** Optional icon to render on the left side of the select field */
  icon?: React.ReactNode;

  // Form control props
  name?: string;
  id?: string;
  disabled?: boolean;
  /** Haptic feedback intent/pattern on selection/toggle. Set `false` to disable. */
  haptic?: HapticInput;
  /** Disable haptic feedback for this select. */
  disableHaptic?: boolean;
  onBlur?: React.FocusEventHandler<HTMLDivElement | HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement | HTMLInputElement>;
  style?: React.CSSProperties;
  className?: string;
  /** Accessible label/description wiring for custom trigger */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
}

export interface SingleSelectProps extends SelectCommonProps {
  multiple?: false;
  value?: string;
  defaultValue?: string | string[];
  onChange?: (value: string) => void;
}

export interface MultiSelectProps extends SelectCommonProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[] | string;
  onChange?: (value: string[]) => void;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

const sizeStyles: Record<'sm' | 'md' | 'lg', { h: string; px: string; fontSize: string }> = {
  sm: { h: '8', px: '3', fontSize: 'sm' },
  md: { h: '10', px: '4', fontSize: 'md' },
  lg: { h: '12', px: '4', fontSize: 'lg' },
};

/**
 * Custom SingleSelect component with MedixDeck popover dropdown options.
 */
function SingleSelect(props: SelectProps) {
  const {
    options = [],
    placeholder = 'Select option...',
    isInvalid = false,
    errorMessage,
    size = 'md',
    colorScheme = 'blue',
    icon,
    value,
    defaultValue,
    onChange,
    disabled = false,
    haptic,
    disableHaptic = false,
    name,
    id,
    ...ariaProps
  } = props as SingleSelectProps & Record<string, unknown>;
  const { trigger } = useHaptics();
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [internalValue, setInternalValue] = React.useState<string>(() => {
    if (typeof defaultValue === 'string') return defaultValue;
    if (Array.isArray(defaultValue)) return defaultValue[0] ?? '';
    return '';
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled
    ? typeof value === 'string'
      ? value
      : Array.isArray(value)
        ? (value[0] ?? '')
        : ''
    : internalValue;

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const handleSelectOption = (optValue: string) => {
    if (disabled) return;
    if (!disableHaptic && haptic !== false && optValue !== selectedValue) {
      trigger(haptic ?? 'selection');
    }
    if (!isControlled) {
      setInternalValue(optValue);
    }
    (onChange as ((value: string) => void) | undefined)?.(optValue);
    setIsOpen(false);
  };

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search]);

  const focusBorderColor = colorScheme === 'purple' ? '#7700CC' : '#0685FF';
  const activeBorderColor = isInvalid
    ? '#DC2626'
    : isOpen
      ? focusBorderColor
      : 'var(--medix-form-border)';

  const sz = sizeStyles[size];

  return (
    <Box w="100%" position="relative" zIndex={isOpen ? 1000 : undefined} ref={containerRef}>
      {name && <input type="hidden" name={name} id={id} value={selectedValue} />}

      <Box
        {...(ariaProps as Record<string, unknown>)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-invalid={
          isInvalid
            ? true
            : ((ariaProps as Record<string, unknown>)['aria-invalid'] as
                | boolean
                | 'true'
                | 'false'
                | undefined)
        }
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (disabled) return;
          if (!disableHaptic && haptic !== false) trigger(haptic ?? 'selection');
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disableHaptic && haptic !== false) trigger(haptic ?? 'selection');
            setIsOpen((o) => !o);
          } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
        }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        h={sz.h}
        px={sz.px}
        borderRadius="md"
        bg="bg"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.55 : 1}
        transition="border-color 0.15s ease"
        style={{
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow: 'none',
          background: 'var(--medix-form-bg)',
        }}
      >
        <Box display="flex" alignItems="center" gap="2.5" flex="1" minW="0">
          {icon && (
            <Box color="text.muted" display="flex" alignItems="center" flexShrink={0}>
              {icon}
            </Box>
          )}

          {selectedOption ? (
            <Text
              fontSize={sz.fontSize}
              color="text.heading"
              fontFamily="var(--font-body)"
              truncate
              fontWeight="500"
            >
              {selectedOption.label}
            </Text>
          ) : (
            <Text fontSize={sz.fontSize} color="text.muted" fontFamily="var(--font-body)" truncate>
              {placeholder}
            </Text>
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          color="text.muted"
          ml="2"
          flexShrink={0}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Box>
      </Box>

      {isOpen && (
        <Box
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt="1.5"
          maxH="280px"
          bg="bg.surface"
          border="1px solid"
          borderColor="border"
          borderRadius="card"
          zIndex={1000}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          boxShadow="none"
        >
          {options.length > 5 && (
            <Box p="2" borderBottom="1px solid" borderColor="border" bg="bg.surface">
              <Box position="relative" display="flex" alignItems="center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    borderRadius: '6px',
                    border: '1px solid var(--medix-form-border)',
                    background: 'var(--medix-form-bg)',
                    color: 'var(--medix-form-text)',
                    outline: 'none',
                  }}
                />
              </Box>
            </Box>
          )}

          <Box overflowY="auto" flex="1" py="1">
            {filteredOptions.length === 0 ? (
              <Box px="4" py="3" fontSize="xs" color="text.muted" textAlign="center">
                No options found
              </Box>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === selectedValue;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelectOption(opt.value)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      background:
                        isActive || isSelected ? 'var(--medix-form-bg-subtle)' : 'transparent',
                      border: 'none',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--medix-form-text)',
                      opacity: opt.disabled ? 0.5 : 1,
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                    {isSelected && (
                      <span style={{ color: focusBorderColor, fontWeight: 700, fontSize: '14px' }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </Box>
        </Box>
      )}

      {isInvalid && errorMessage && (
        <Text mt="1" fontSize="xs" color="red.500" fontFamily="var(--font-body)">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}

/**
 * Interactive MultiSelect component when `multiple={true}`.
 */
function MultiSelect(props: SelectProps) {
  const {
    options = [],
    placeholder = 'Select options...',
    isInvalid = false,
    errorMessage,
    size = 'md',
    colorScheme = 'blue',
    icon,
    value,
    defaultValue,
    onChange,
    disabled = false,
    haptic,
    disableHaptic = false,
    name,
    id,
    ...ariaProps
  } = props as MultiSelectProps & Record<string, unknown>;
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [internalValues, setInternalValues] = React.useState<string[]>(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    if (typeof defaultValue === 'string' && defaultValue) return [defaultValue];
    return [];
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const selectedValues: string[] = isControlled
    ? Array.isArray(value)
      ? value
      : typeof value === 'string' && value
        ? [value]
        : []
    : internalValues;

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      setSearch('');
      setActiveIndex(-1);
    }
  }, [isOpen]);

  const toggleOption = (optValue: string) => {
    if (disabled) return;
    const isSelected = selectedValues.includes(optValue);
    const nextValues = isSelected
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue];
    if (!disableHaptic && haptic !== false) {
      trigger(haptic ?? 'selection');
    }
    if (!isControlled) {
      setInternalValues(nextValues);
    }
    (onChange as ((value: string[]) => void) | undefined)?.(nextValues);
  };

  const removeOption = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (!disableHaptic && haptic !== false) {
      trigger(haptic ?? 'selection');
    }
    const nextValues = selectedValues.filter((v) => v !== optValue);
    if (!isControlled) {
      setInternalValues(nextValues);
    }
    (onChange as ((value: string[]) => void) | undefined)?.(nextValues);
  };

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search]);

  React.useEffect(() => {
    setActiveIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [filteredOptions.length, search]);

  const { trigger } = useHaptics();
  const focusBorderColor = colorScheme === 'purple' ? '#7700CC' : '#0685FF';
  const activeBorderColor = isInvalid
    ? '#DC2626'
    : isOpen
      ? focusBorderColor
      : 'var(--medix-form-border)';

  const tagBg = colorScheme === 'purple' ? 'purple.50' : 'blue.50';
  const tagColor = colorScheme === 'purple' ? 'purple.700' : 'blue.700';
  const tagBorder = colorScheme === 'purple' ? 'purple.200' : 'blue.200';

  return (
    <Box w="100%" position="relative" zIndex={isOpen ? 1000 : undefined} ref={containerRef}>
      {name && <input type="hidden" name={name} id={id} value={selectedValues.join(',')} />}

      <Box
        {...(ariaProps as Record<string, unknown>)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-invalid={
          isInvalid
            ? true
            : ((ariaProps as Record<string, unknown>)['aria-invalid'] as
                | boolean
                | 'true'
                | 'false'
                | undefined)
        }
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (disabled) return;
          if (!disableHaptic && haptic !== false) trigger(haptic ?? 'selection');
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (!isOpen) {
            if (
              e.key === 'Enter' ||
              e.key === ' ' ||
              e.key === 'ArrowDown' ||
              e.key === 'ArrowUp'
            ) {
              e.preventDefault();
              if (!disableHaptic && haptic !== false) trigger(haptic ?? 'selection');
              setIsOpen(true);
            }
            return;
          }

          if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => {
              const len = filteredOptions.length;
              if (len === 0) return -1;
              return i < 0 ? 0 : (i + 1) % len;
            });
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => {
              const len = filteredOptions.length;
              if (len === 0) return -1;
              return i <= 0 ? len - 1 : i - 1;
            });
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const opt = filteredOptions[activeIndex];
            if (opt && !opt.disabled) toggleOption(opt.value);
          }
        }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        minH={size === 'sm' ? '34px' : size === 'lg' ? '48px' : '42px'}
        py="1.5"
        px="3"
        borderRadius="md"
        bg="bg"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.55 : 1}
        transition="border-color 0.15s ease"
        style={{
          border: `1.5px solid ${activeBorderColor}`,
          boxShadow: 'none',
          background: 'var(--medix-form-bg)',
        }}
      >
        <Box display="flex" alignItems="center" flexWrap="wrap" gap="1.5" flex="1" minW="0">
          {icon && (
            <Box color="text.muted" display="flex" alignItems="center" mr="1">
              {icon}
            </Box>
          )}

          {selectedValues.length === 0 ? (
            <Text
              fontSize={size === 'sm' ? 'xs' : 'sm'}
              color="text.muted"
              fontFamily="var(--font-body)"
            >
              {placeholder}
            </Text>
          ) : (
            selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val);
              const labelText = opt ? opt.label : val;
              return (
                <Box
                  key={val}
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  gap="1"
                  px="2.5"
                  py="0.5"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="500"
                  fontFamily="var(--font-body)"
                  bg={tagBg}
                  color={tagColor}
                  border="1px solid"
                  borderColor={tagBorder}
                  _dark={{
                    bg:
                      colorScheme === 'purple'
                        ? 'rgba(119, 0, 204, 0.2)'
                        : 'rgba(6, 133, 255, 0.2)',
                    color: colorScheme === 'purple' ? 'purple.300' : 'blue.300',
                    borderColor:
                      colorScheme === 'purple'
                        ? 'rgba(119, 0, 204, 0.4)'
                        : 'rgba(6, 133, 255, 0.4)',
                  }}
                >
                  <span>{labelText}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeOption(val, e)}
                      aria-label={`Remove ${labelText}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        marginLeft: '2px',
                        cursor: 'pointer',
                        color: 'inherit',
                        fontSize: '13px',
                        lineHeight: 1,
                        opacity: 0.75,
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.opacity = '1')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.opacity = '0.75')
                      }
                    >
                      ×
                    </button>
                  )}
                </Box>
              );
            })
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          color="text.muted"
          ml="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Box>
      </Box>

      {isOpen && (
        <Box
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt="1.5"
          maxH="280px"
          bg="bg.surface"
          border="1px solid"
          borderColor="border"
          borderRadius="card"
          zIndex={1000}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          boxShadow="none"
        >
          {options.length > 5 && (
            <Box p="2" borderBottom="1px solid" borderColor="border" bg="bg.surface">
              <Box position="relative" display="flex" alignItems="center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    borderRadius: '6px',
                    border: '1px solid var(--medix-form-border)',
                    background: 'var(--medix-form-bg)',
                    color: 'var(--medix-form-text)',
                    outline: 'none',
                  }}
                />
              </Box>
            </Box>
          )}

          <Box overflowY="auto" flex="1" py="1">
            {filteredOptions.length === 0 ? (
              <Box px="4" py="3" fontSize="xs" color="text.muted" textAlign="center">
                No options found
              </Box>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = selectedValues.includes(opt.value);
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => toggleOption(opt.value)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      background:
                        isActive || isSelected ? 'var(--medix-form-bg-subtle)' : 'transparent',
                      border: 'none',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--medix-form-text)',
                      opacity: opt.disabled ? 0.5 : 1,
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                    {isSelected && (
                      <span style={{ color: focusBorderColor, fontWeight: 700, fontSize: '14px' }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </Box>
        </Box>
      )}

      {isInvalid && errorMessage && (
        <Text mt="1" fontSize="xs" color="red.500" fontFamily="var(--font-body)">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}

/**
 * MedixDeck Select
 *
 * Supports both single selection and multi-selection with custom popover dropdown options.
 *
 * @example
 * ```tsx
 * // Single select
 * <Select options={[{ value: '1', label: 'Option 1' }]} value={val} onChange={setVal} />
 *
 * // Multi select with chips and search
 * <Select multiple value={selectedArray} onChange={setSelectedArray} options={options} />
 * ```
 */
export function Select(props: SelectProps) {
  if (props.multiple) {
    return <MultiSelect {...props} />;
  }
  return <SingleSelect {...props} />;
}
