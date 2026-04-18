"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

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
  isInvalid?: boolean;
  isDisabled?: boolean;
}

const CHEVRON_DOWN = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Search...",
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
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
          setSearch("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const activeBorderColor = isInvalid
    ? "#DC2626"
    : isOpen
    ? "#0685FF"
    : "var(--medix-form-border)";
    
  const boxShadow = isOpen
    ? `0 0 0 3px ${isInvalid ? "rgba(220,38,38,0.15)" : "rgba(6,133,255,0.15)"}`
    : "none";

  return (
    <Box w="100%" position="relative" ref={containerRef}>
      {label && (
        <Text mb="1.5" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box position="relative">
        <input
          type="text"
          value={search}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange?.(""); // clear if empty
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: "100%",
            height: "40px",
            padding: "0 40px 0 16px",
            borderRadius: "10px",
            border: `1.5px solid ${activeBorderColor}`,
            boxShadow,
            background: "var(--medix-form-bg)",
            color: "var(--medix-form-text)",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            cursor: isDisabled ? "not-allowed" : "text",
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
          position="absolute"
          zIndex={10}
          top="100%"
          left="0"
          right="0"
          mt="1"
          bg="bg.surface"
          border="1px solid"
          borderColor="border"
          borderRadius="md"
          boxShadow="sm"
          maxH="200px"
          overflowY="auto"
          py="1"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <Box
                key={opt.value}
                px="3"
                py="2"
                fontSize="sm"
                fontFamily="var(--font-body)"
                color="text.body"
                cursor="pointer"
                _hover={{ bg: "bg.subtle" }}
                onClick={() => {
                  onChange?.(opt.value);
                  setSearch(opt.label);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </Box>
            ))
          ) : (
            <Box px="3" py="2" fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
              No options found
            </Box>
          )}
        </Box>
      )}

      {(helperText || errorMessage) && (
        <Text mt="1.5" fontSize="xs" color={isInvalid ? "red.500" : "text.muted"} fontFamily="var(--font-body)">
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}
