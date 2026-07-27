import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
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
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: any) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  multiple?: boolean;
  onBlur?: React.FocusEventHandler<HTMLDivElement | HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement | HTMLInputElement>;
  style?: React.CSSProperties;
  className?: string;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', { h: string; px: string; fontSize: string }> = {
  sm: { h: '8', px: '3', fontSize: 'sm' },
  md: { h: '10', px: '4', fontSize: 'md' },
  lg: { h: '12', px: '4', fontSize: 'lg' },
};

/**
 * Custom SingleSelect component with MedixDeck popover dropdown options.
 */
function SingleSelect({
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
  name,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [internalValue, setInternalValue] = React.useState<string>(() => {
    if (typeof defaultValue === 'string') return defaultValue;
    if (Array.isArray(defaultValue) && defaultValue.length > 0) return defaultValue[0];
    return '';
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled
    ? typeof value === 'string'
      ? value
      : Array.isArray(value) && value.length > 0
        ? value[0]
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
    if (!isControlled) {
      setInternalValue(optValue);
    }
    onChange?.(optValue);
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
    <Box w="100%" position="relative" ref={containerRef}>
      {name && <input type="hidden" name={name} id={id} value={selectedValue} />}

      <Box
        onClick={() => !disabled && setIsOpen(!isOpen)}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        h={sz.h}
        px={sz.px}
        borderRadius="md"
        bg="bg.surface"
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
            <Box color="text.heading" display="flex" alignItems="center" flexShrink={0}>
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
            <Text
              fontSize={sz.fontSize}
              color="text.muted"
              fontFamily="var(--font-body)"
              truncate
            >
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Box>
      </Box>

      {isOpen && (
        <Box
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
          zIndex="popover"
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
                  style={{ position: 'absolute', left: '10px', opacity: 0.5, pointerEvents: 'none' }}
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
              filteredOptions.map((opt) => {
                const isSelected = opt.value === selectedValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelectOption(opt.value)}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      background: isSelected ? 'var(--medix-form-bg-subtle)' : 'transparent',
                      border: 'none',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--medix-form-text)',
                      opacity: opt.disabled ? 0.5 : 1,
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!opt.disabled) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'var(--medix-form-bg-subtle)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!opt.disabled) {
                        (e.currentTarget as HTMLButtonElement).style.background = isSelected
                          ? 'var(--medix-form-bg-subtle)'
                          : 'transparent';
                      }
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
function MultiSelect({
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
  name,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
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
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const toggleOption = (optValue: string) => {
    if (disabled) return;
    const isSelected = selectedValues.includes(optValue);
    const nextValues = isSelected
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue];
    if (!isControlled) {
      setInternalValues(nextValues);
    }
    onChange?.(nextValues);
  };

  const removeOption = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const nextValues = selectedValues.filter((v) => v !== optValue);
    if (!isControlled) {
      setInternalValues(nextValues);
    }
    onChange?.(nextValues);
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

  const tagBg = colorScheme === 'purple' ? 'purple.50' : 'blue.50';
  const tagColor = colorScheme === 'purple' ? 'purple.700' : 'blue.700';
  const tagBorder = colorScheme === 'purple' ? 'purple.200' : 'blue.200';

  return (
    <Box w="100%" position="relative" ref={containerRef}>
      {name && <input type="hidden" name={name} id={id} value={selectedValues.join(',')} />}

      <Box
        onClick={() => !disabled && setIsOpen(!isOpen)}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        minH={size === 'sm' ? '34px' : size === 'lg' ? '48px' : '42px'}
        py="1.5"
        px="3"
        borderRadius="md"
        bg="bg.surface"
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
            <Box color="text.heading" display="flex" alignItems="center" mr="1">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Box>
      </Box>

      {isOpen && (
        <Box
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
          zIndex="popover"
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
                  style={{ position: 'absolute', left: '10px', opacity: 0.5, pointerEvents: 'none' }}
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
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => toggleOption(opt.value)}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      background: isSelected ? 'var(--medix-form-bg-subtle)' : 'transparent',
                      border: 'none',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--medix-form-text)',
                      opacity: opt.disabled ? 0.5 : 1,
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!opt.disabled) {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'var(--medix-form-bg-subtle)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!opt.disabled) {
                        (e.currentTarget as HTMLButtonElement).style.background = isSelected
                          ? 'var(--medix-form-bg-subtle)'
                          : 'transparent';
                      }
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
