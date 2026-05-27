import React from "react";
import {
  NativeSelect as ChakraNativeSelect,
  type NativeSelectRootProps,
  Box,
  Text,
} from "@chakra-ui/react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<NativeSelectRootProps, "size"> {
  options?: SelectOption[];
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  /** Optional icon to render on the left side of the select field */
  icon?: React.ReactNode;
}

const sizeStyles: Record<"sm" | "md" | "lg", { h: string; px: string; fontSize: string }> = {
  sm: { h: "8", px: "3", fontSize: "sm" },
  md: { h: "10", px: "4", fontSize: "md" },
  lg: { h: "12", px: "4", fontSize: "lg" },
};

/**
 * MedixDeck Select
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options = [], placeholder, isInvalid, errorMessage, size = "md", children, icon, ...props }, ref) => {
    const sz = sizeStyles[size];
    const iconSpacingMap = {
      sm: "8",
      md: "10",
      lg: "12",
    };

    return (
      <Box w="100%">
        <ChakraNativeSelect.Root {...props}>
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
            h={sz.h}
            pl={icon ? iconSpacingMap[size] : sz.px}
            pr="8"
            fontSize={sz.fontSize}
            bg="bg.surface"
            border="1px solid"
            borderColor={isInvalid ? "red.500" : "border"}
            borderRadius="md"
            color="text.heading"
            fontFamily="var(--font-body)"
            _focus={{
              borderColor: isInvalid ? "red.500" : "blue.500",
              boxShadow: isInvalid
                ? "0 0 0 3px rgba(220,38,38,0.15)"
                : "0 0 0 3px rgba(6,133,255,0.15)",
              outline: "none",
            }}
            _dark={{
              bg: "bg.surface",
              borderColor: isInvalid ? "red.500" : "border",
              color: "text.heading",
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
  }
);

Select.displayName = "MedixSelect";
