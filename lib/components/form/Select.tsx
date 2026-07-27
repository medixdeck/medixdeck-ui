import React from 'react';
import {
  NativeSelect as ChakraNativeSelect,
  type NativeSelectRootProps,
  Box,
  Text,
} from '@chakra-ui/react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  NativeSelectRootProps,
  | 'size'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'name'
  | 'id'
  | 'disabled'
  | 'onBlur'
  | 'onFocus'
  | 'multiple'
> {
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

  // Explicit form props to attach to the inner <select> element
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  multiple?: boolean;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', { h: string; px: string; fontSize: string }> = {
  sm: { h: '8', px: '3', fontSize: 'sm' },
  md: { h: '10', px: '4', fontSize: 'md' },
  lg: { h: '12', px: '4', fontSize: 'lg' },
};

/**
 * Interactive MultiSelect implementation when `multiple={true}`.
 * Renders selected options as tag pills directly in the input container
 * and provides a searchable dropdown popover.
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedValues: string[] = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value) return [value];
    if (Array.isArray(defaultValue)) return defaultValue;
    if (typeof defaultValue === 'string' && defaultValue) return [defaultValue];
    return [];
  }, [value, defaultValue]);

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
    onChange?.(nextValues);
  };

  const removeOption = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(selectedValues.filter((v) => v !== optValue));
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
 * Supports both single selection (native select) and multi-selection (interactive chips).
 *
 * @example
 * ```tsx
 * // Single select
 * <Select options={[{ value: '1', label: 'Option 1' }]} />
 *
 * // Multi select with chips and search
 * <Select multiple value={selectedArray} onChange={setSelectedArray} options={options} />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    if (props.multiple) {
      return <MultiSelect {...props} />;
    }

    const {
      options = [],
      placeholder,
      isInvalid,
      errorMessage,
      size = 'md',
      colorScheme = 'blue',
      children,
      icon,
      value,
      defaultValue,
      onChange,
      name,
      id,
      disabled,
      onBlur,
      onFocus,
      ...rootProps
    } = props;

    const sz = sizeStyles[size];
    const focusBorder = colorScheme === 'purple' ? 'purple.500' : 'blue.500';
    const iconSpacingMap = {
      sm: '8',
      md: '10',
      lg: '12',
    };

    const singleValue = Array.isArray(value) ? value[0] : value;
    const singleDefaultValue = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;

    return (
      <Box w="100%">
        <ChakraNativeSelect.Root {...rootProps} disabled={disabled}>
          {icon && (
            <Box
              position="absolute"
              left={sz.px}
              top="0"
              bottom="0"
              display="flex"
              alignItems="center"
              pointerEvents="none"
              color="text.heading"
              zIndex={1}
            >
              {icon}
            </Box>
          )}
          <ChakraNativeSelect.Field
            ref={ref}
            name={name}
            id={id}
            value={singleValue}
            defaultValue={singleDefaultValue}
            onChange={
              onChange
                ? (e) => {
                    onChange(e.target.value);
                  }
                : undefined
            }
            onBlur={onBlur}
            onFocus={onFocus}
            h={sz.h}
            pl={icon ? iconSpacingMap[size] : sz.px}
            pr="8"
            fontSize={sz.fontSize}
            bg="bg.surface"
            border="1px solid"
            borderColor={isInvalid ? 'red.500' : 'border'}
            borderRadius="md"
            color="text.heading"
            fontFamily="var(--font-body)"
            _focus={{
              borderColor: isInvalid ? 'red.500' : focusBorder,
              boxShadow: 'none',
              outline: 'none',
            }}
            _dark={{
              bg: 'bg.surface',
              borderColor: isInvalid ? 'red.500' : 'border',
              color: 'text.heading',
            }}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
            {children}
          </ChakraNativeSelect.Field>
          <ChakraNativeSelect.Indicator />
        </ChakraNativeSelect.Root>
        {isInvalid && errorMessage && (
          <Text mt="1" fontSize="xs" color="red.500" fontFamily="var(--font-body)">
            {errorMessage}
          </Text>
        )}
      </Box>
    );
  },
);

Select.displayName = 'MedixSelect';
