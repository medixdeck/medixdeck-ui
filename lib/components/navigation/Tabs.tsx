'use client';

import React from 'react';
import { Box, Text, type BoxProps } from '@chakra-ui/react';
import { useHaptics } from '../../hooks/useHaptics';
import type { HapticInput } from '../../utils/haptics';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export type TabsColorScheme = 'blue' | 'purple';

// Omit onChange to avoid conflict with BoxProps (which defines onChange as FormEventHandler)
export interface TabsProps extends Omit<BoxProps, 'onChange'> {
  tabs: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  onChange?: (id: string) => void;
  variant?: 'line' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  renderContent?: boolean;
  /**
   * Brand accent color for line variant active/hover/focus states and badges.
   * @default "blue"
   */
  colorScheme?: TabsColorScheme;
  /** Haptic feedback intent/pattern on tab change. Set `false` to disable. */
  haptic?: HapticInput;
  /** Disable haptic feedback for tab changes. */
  disableHaptic?: boolean;
}

const sizeMap = {
  sm: { px: '3', py: '1.5', fontSize: 'sm' },
  md: { px: '4', py: '2', fontSize: 'md' },
  lg: { px: '5', py: '2.5', fontSize: 'lg' },
};

const TABS_SCHEME: Record<
  TabsColorScheme,
  {
    activeText: string;
    indicator: string;
    focusOutline: string;
    hoverText: string;
    badgeActiveBg: string;
    badgeActiveColor: string;
  }
> = {
  blue: {
    activeText: 'blue.500',
    indicator: 'blue.500',
    focusOutline: 'blue.500',
    hoverText: 'blue.500',
    badgeActiveBg: 'blue.100',
    badgeActiveColor: 'blue.700',
  },
  purple: {
    activeText: '#7700CC',
    indicator: '#7700CC',
    focusOutline: '#7700CC',
    hoverText: '#7700CC',
    badgeActiveBg: '#F3E8FF',
    badgeActiveColor: '#6B21A8',
  },
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
  variant = 'line',
  size = 'md',
  renderContent = true,
  colorScheme = 'blue',
  haptic,
  disableHaptic = false,
  ...props
}: TabsProps) {
  const { trigger } = useHaptics();
  const [internalId, setInternalId] = React.useState(defaultActiveId ?? tabs[0]?.id);
  const activeId = controlledId ?? internalId;
  const scheme = TABS_SCHEME[colorScheme];

  const handleChange = (id: string) => {
    if (id !== activeId && !disableHaptic && haptic !== false) {
      trigger(haptic ?? 'selection');
    }
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
        gap={variant === 'pill' ? '1' : '0'}
        borderBottom={variant === 'line' ? '1px solid' : 'none'}
        border={variant === 'pill' ? '1px solid' : 'none'}
        borderColor="border"
        bg={variant === 'pill' ? 'bg.subtle' : 'transparent'}
        p={variant === 'pill' ? '1' : '0'}
        borderRadius={variant === 'pill' ? 'full' : 'none'}
        overflowX="auto"
        flexWrap="nowrap"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
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
                if ((e.key === 'Enter' || e.key === ' ') && !tab.disabled) handleChange(tab.id);
              }}
              display="flex"
              alignItems="center"
              gap="2"
              justifyContent="center"
              px={variant === 'pill' ? '4' : sz.px}
              py={variant === 'pill' ? '3' : sz.py}
              fontFamily="var(--font-body)"
              fontWeight={isActive ? 'semibold' : 'medium'}
              fontSize={variant === 'pill' ? 'sm' : sz.fontSize}
              color={
                tab.disabled
                  ? 'text.muted'
                  : variant === 'pill'
                    ? isActive
                      ? 'text.heading'
                      : 'text.body'
                    : isActive
                      ? scheme.activeText
                      : 'text.body'
              }
              cursor={tab.disabled ? 'not-allowed' : 'pointer'}
              opacity={tab.disabled ? 0.5 : 1}
              transition="all 0.2s ease"
              whiteSpace="nowrap"
              flex={variant === 'pill' ? '1' : undefined}
              flexShrink={variant === 'pill' ? 1 : 0}
              bg={variant === 'pill' ? (isActive ? 'bg' : 'bg.surface') : 'transparent'}
              borderRadius={variant === 'pill' ? 'full' : 'none'}
              boxShadow="none"
              borderBottom={variant === 'line' ? '2px solid' : 'none'}
              borderColor={
                variant === 'line' ? (isActive ? scheme.indicator : 'transparent') : undefined
              }
              mb={variant === 'line' ? '-1px' : '0'}
              _hover={
                !tab.disabled
                  ? variant === 'line'
                    ? { color: scheme.hoverText }
                    : {
                        bg: isActive ? 'bg' : 'bg.subtle',
                        color: isActive ? 'text.heading' : 'text.heading',
                      }
                  : undefined
              }
              _focusVisible={{
                outline: '2px solid',
                outlineColor: scheme.focusOutline,
                outlineOffset: '2px',
                borderRadius: variant === 'pill' ? 'full' : 'sm',
              }}
            >
              <Text fontSize="inherit" fontWeight="inherit" color="inherit">
                {tab.label}
              </Text>
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
                  bg={
                    variant === 'pill'
                      ? isActive
                        ? 'bg.subtle'
                        : 'bg'
                      : isActive
                        ? scheme.badgeActiveBg
                        : 'bg.subtle'
                  }
                  color={
                    variant === 'pill'
                      ? isActive
                        ? 'text.heading'
                        : 'text.muted'
                      : isActive
                        ? scheme.badgeActiveColor
                        : 'text.muted'
                  }
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
