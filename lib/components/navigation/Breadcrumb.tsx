import React from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type BreadcrumbColorScheme = 'blue' | 'purple';

export interface BreadcrumbProps extends BoxProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  /**
   * Brand accent color for interactive breadcrumb link hover state.
   * @default "blue"
   */
  colorScheme?: BreadcrumbColorScheme;
  renderLink?: (item: BreadcrumbItem, children: React.ReactNode) => React.ReactNode;
}

const defaultSeparator = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const defaultRenderLink = (item: BreadcrumbItem, children: React.ReactNode) =>
  item.href ? (
    <a href={item.href} style={{ textDecoration: 'none' }}>
      {children}
    </a>
  ) : (
    <>{children}</>
  );

/**
 * MedixDeck Breadcrumb
 *
 * Page location indicator.
 *
 * @example
 * ```tsx
 * <Breadcrumb items={[
 *   { label: "Home", href: "/" },
 *   { label: "For Doctors", href: "/for-doctors" },
 *   { label: "Profile" },
 * ]} />
 * ```
 */
const BREADCRUMB_SCHEME: Record<BreadcrumbColorScheme, { hoverColor: string }> = {
  blue: { hoverColor: 'blue.500' },
  purple: { hoverColor: '#7700CC' },
};

export function Breadcrumb({
  items,
  separator = defaultSeparator,
  colorScheme = 'blue',
  renderLink = defaultRenderLink,
  ...props
}: BreadcrumbProps) {
  const scheme = BREADCRUMB_SCHEME[colorScheme];
  return (
    <Box
      as="nav"
      aria-label="Breadcrumb"
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      gap="1.5"
      {...props}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <Box key={idx} display="flex" alignItems="center" gap="1.5">
            {renderLink(
              item,
              <Box
                as="span"
                display="inline-block"
                lineHeight="1.2"
                fontSize="sm"
                fontFamily="var(--font-body)"
                fontWeight={isLast ? 'medium' : 'normal'}
                color={isLast ? 'text.heading' : 'text.muted'}
                _hover={!isLast ? { color: scheme.hoverColor } : undefined}
                cursor={!isLast && item.href ? 'pointer' : 'default'}
                transition="color 0.15s"
                wordBreak="break-word"
                whiteSpace={!isLast ? 'nowrap' : 'normal'}
              >
                {item.label}
              </Box>,
            )}
            {!isLast && (
              <Box color="text.muted" display="flex" alignItems="center" flexShrink={0} mt="0.5">
                {separator}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
