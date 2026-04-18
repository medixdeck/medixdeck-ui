"use client";

import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

// Omit onChange to avoid conflict with BoxProps (which defines onChange as FormEventHandler)
export interface TabsProps extends Omit<BoxProps, "onChange"> {
  tabs: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  onChange?: (id: string) => void;
  variant?: "line" | "pill";
  size?: "sm" | "md" | "lg";
  renderContent?: boolean;
}

const sizeMap = {
  sm: { px: "3", py: "1.5", fontSize: "sm" },
  md: { px: "4", py: "2", fontSize: "md" },
  lg: { px: "5", py: "2.5", fontSize: "lg" },
};

/**
 * MedixDeck Tabs
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: "overview", label: "Overview", content: <Overview /> },
 *     { id: "records", label: "Records", badge: "3", content: <Records /> },
 *   ]}
 * />
 * ```
 */
export function Tabs({
  tabs,
  defaultActiveId,
  activeId: controlledId,
  onChange,
  variant = "line",
  size = "md",
  renderContent = true,
  ...props
}: TabsProps) {
  const [internalId, setInternalId] = React.useState(defaultActiveId ?? tabs[0]?.id);
  const activeId = controlledId ?? internalId;

  const handleChange = (id: string) => {
    setInternalId(id);
    onChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === activeId);
  const sz = sizeMap[size];

  return (
    <Box {...props}>
      <Box
        role="tablist"
        display="flex"
        gap={variant === "pill" ? "1" : "0"}
        borderBottom={variant === "line" ? "1px solid" : "none"}
        borderColor="border"
        bg={variant === "pill" ? "bg.subtle" : "transparent"}
        p={variant === "pill" ? "1" : "0"}
        borderRadius={variant === "pill" ? "md" : "none"}
        overflowX="auto"
        flexWrap="nowrap"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <Box
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              tabIndex={tab.disabled ? -1 : 0}
              onClick={() => !tab.disabled && handleChange(tab.id)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !tab.disabled) handleChange(tab.id);
              }}
              display="flex"
              alignItems="center"
              gap="2"
              px={sz.px}
              py={sz.py}
              fontFamily="var(--font-body)"
              fontWeight={isActive ? "semibold" : "medium"}
              fontSize={sz.fontSize}
              color={tab.disabled ? "text.muted" : isActive ? "blue.500" : "text.body"}
              cursor={tab.disabled ? "not-allowed" : "pointer"}
              opacity={tab.disabled ? 0.5 : 1}
              transition="all 0.15s"
              whiteSpace="nowrap"
              flexShrink={0}
              bg={variant === "pill" && isActive ? "bg" : "transparent"}
              borderRadius={variant === "pill" ? "md" : "none"}
              boxShadow={variant === "pill" && isActive ? "sm" : "none"}
              borderBottom={variant === "line" ? "2px solid" : "none"}
              borderColor={
                variant === "line" ? (isActive ? "blue.500" : "transparent") : undefined
              }
              mb={variant === "line" ? "-1px" : "0"}
              _hover={
                !tab.disabled
                  ? variant === "line"
                    ? { color: "blue.500" }
                    : { bg: "bg" }
                  : undefined
              }
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "blue.500",
                outlineOffset: "2px",
                borderRadius: "sm",
              }}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  minW="5"
                  h="5"
                  px="1"
                  borderRadius="full"
                  fontSize="2xs"
                  fontWeight="bold"
                  bg={isActive ? "blue.100" : "bg.subtle"}
                  color={isActive ? "blue.700" : "text.muted"}
                >
                  {tab.badge}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {renderContent && activeTab?.content && (
        <Box role="tabpanel" mt="4">
          {activeTab.content}
        </Box>
      )}
    </Box>
  );
}
