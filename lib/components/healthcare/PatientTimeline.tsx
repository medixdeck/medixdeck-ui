'use client';

import React from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';
import {
  LuPhoneCall,
  LuFlaskConical,
  LuPill,
  LuActivity,
  LuFileText,
  LuHospital,
  LuLogOut,
  LuCircle,
} from 'react-icons/lu';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineEventType =
  | 'consultation'
  | 'lab'
  | 'prescription'
  | 'vitals'
  | 'note'
  | 'admission'
  | 'discharge'
  | 'custom';

export interface TimelineEvent {
  /** Unique ID for the event */
  id: string;
  /** Event type — controls icon and color */
  type: TimelineEventType;
  /** Primary event title */
  title: string;
  /** Secondary description or summary */
  description?: string;
  /** Date/time display string */
  date: string;
  /** Optional provider / actor name */
  provider?: string;
  /** Optional badge label e.g. "Completed", "Pending" */
  badgeLabel?: string;
  /** Badge status for color */
  badgeStatus?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** Custom icon override (React node) */
  icon?: React.ReactNode;
  /** Click handler for event drill-down */
  onClick?: () => void;
}

export interface PatientTimelineProps extends Omit<BoxProps, 'onChange'> {
  /** Array of timeline events in chronological order (newest first) */
  events: TimelineEvent[];
  /** Whether to show compact view (hide descriptions) */
  compact?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Number of skeleton rows to show when loading */
  loadingCount?: number;
  /** Brand color scheme for active connector line */
  colorScheme?: 'blue' | 'purple';
}

// ─── Event type config ────────────────────────────────────────────────────────

const eventConfig: Record<
  TimelineEventType,
  { bg: string; color: string; icon: React.ReactNode }
> = {
  consultation: {
    bg: 'color-mix(in srgb, #0685FF 12%, transparent)',
    color: '#0685FF',
    icon: <LuPhoneCall size={14} aria-hidden="true" />,
  },
  lab: {
    bg: 'color-mix(in srgb, #7700CC 12%, transparent)',
    color: '#7700CC',
    icon: <LuFlaskConical size={14} aria-hidden="true" />,
  },
  prescription: {
    bg: 'color-mix(in srgb, #10B981 12%, transparent)',
    color: '#10B981',
    icon: <LuPill size={14} aria-hidden="true" />,
  },
  vitals: {
    bg: 'color-mix(in srgb, #F59E0B 12%, transparent)',
    color: '#D97706',
    icon: <LuActivity size={14} aria-hidden="true" />,
  },
  note: {
    bg: 'color-mix(in srgb, #64748B 12%, transparent)',
    color: '#64748B',
    icon: <LuFileText size={14} aria-hidden="true" />,
  },
  admission: {
    bg: 'color-mix(in srgb, #EF4444 12%, transparent)',
    color: '#EF4444',
    icon: <LuHospital size={14} aria-hidden="true" />,
  },
  discharge: {
    bg: 'color-mix(in srgb, #10B981 12%, transparent)',
    color: '#10B981',
    icon: <LuLogOut size={14} aria-hidden="true" />,
  },
  custom: {
    bg: 'color-mix(in srgb, #0685FF 10%, transparent)',
    color: '#0685FF',
    icon: <LuCircle size={14} aria-hidden="true" />,
  },
};

const badgeStatusColors: Record<NonNullable<TimelineEvent['badgeStatus']>, { bg: string; color: string }> = {
  success: { bg: 'color-mix(in srgb, #10B981 12%, transparent)', color: '#10B981' },
  warning: { bg: 'color-mix(in srgb, #F59E0B 12%, transparent)', color: '#D97706' },
  error: { bg: 'color-mix(in srgb, #EF4444 12%, transparent)', color: '#EF4444' },
  info: { bg: 'color-mix(in srgb, #0685FF 12%, transparent)', color: '#0685FF' },
  neutral: { bg: 'color-mix(in srgb, #64748B 12%, transparent)', color: '#64748B' },
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonTimelineRow() {
  return (
    <Box display="flex" gap="4" alignItems="flex-start">
      {/* Icon circle skeleton */}
      <Box flexShrink={0} display="flex" flexDirection="column" alignItems="center">
        <Box w="8" h="8" borderRadius="full" bg="bg.subtle" style={{ animation: 'medix-shimmer 1.5s infinite' }} />
        <Box w="px" flex="1" minH="8" bg="border" mt="2" />
      </Box>
      {/* Content skeleton */}
      <Box flex="1" pb="6">
        <Box h="4" bg="bg.subtle" borderRadius="full" w="40%" mb="2" style={{ animation: 'medix-shimmer 1.5s infinite' }} />
        <Box h="3" bg="bg.subtle" borderRadius="full" w="65%" style={{ animation: 'medix-shimmer 1.5s infinite' }} />
      </Box>
    </Box>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MedixDeck PatientTimeline
 *
 * Vertical activity timeline for patient medical history.
 * Supports consultation, lab, prescription, vitals, notes, admission, and discharge events.
 *
 * @example
 * ```tsx
 * <PatientTimeline
 *   colorScheme="blue"
 *   events={[
 *     {
 *       id: "1",
 *       type: "consultation",
 *       title: "Video Consultation",
 *       description: "Follow-up on hypertension management.",
 *       date: "Aug 16, 2026 · 10:30 AM",
 *       provider: "Dr. Amaka Okonkwo",
 *       badgeLabel: "Completed",
 *       badgeStatus: "success",
 *     },
 *     {
 *       id: "2",
 *       type: "lab",
 *       title: "Blood Panel Results",
 *       date: "Aug 14, 2026",
 *       badgeLabel: "Abnormal",
 *       badgeStatus: "warning",
 *     },
 *   ]}
 * />
 * ```
 */
export function PatientTimeline({
  events,
  compact = false,
  isLoading = false,
  loadingCount = 4,
  colorScheme = 'blue',
  ...props
}: PatientTimelineProps) {
  const connectorColor = colorScheme === 'purple'
    ? 'var(--chakra-colors-purple-200, rgba(119,0,204,0.2))'
    : 'var(--chakra-colors-blue-200, rgba(6,133,255,0.2))';

  if (isLoading) {
    return (
      <Box {...props}>
        {Array.from({ length: loadingCount }).map((_, i) => (
          <SkeletonTimelineRow key={i} />
        ))}
      </Box>
    );
  }

  return (
    <Box {...props} role="feed" aria-label="Patient medical timeline">
      {events.map((event, idx) => {
        const cfg = eventConfig[event.type];
        const isLast = idx === events.length - 1;

        return (
          <Box
            key={event.id}
            display="flex"
            gap="4"
            alignItems="flex-start"
            role="article"
            aria-label={`${event.title} on ${event.date}`}
          >
            {/* Icon column + connector line */}
            <Box flexShrink={0} display="flex" flexDirection="column" alignItems="center">
              {/* Event icon circle */}
              <Box
                w="8"
                h="8"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{
                  background: cfg.bg,
                  color: cfg.color,
                  border: `1.5px solid ${cfg.color}40`,
                  cursor: event.onClick ? 'pointer' : 'default',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  flexShrink: 0,
                }}
                onClick={event.onClick}
                role={event.onClick ? 'button' : undefined}
                tabIndex={event.onClick ? 0 : undefined}
                onKeyDown={event.onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') event.onClick!(); } : undefined}
                _hover={event.onClick ? { transform: 'scale(1.1)' } : undefined}
              >
                {event.icon ?? cfg.icon}
              </Box>

              {/* Vertical connector */}
              {!isLast && (
                <Box
                  w="1px"
                  flex="1"
                  minH="8"
                  mt="1"
                  style={{ background: connectorColor }}
                />
              )}
            </Box>

            {/* Event content */}
            <Box
              flex="1"
              pb={isLast ? '0' : '5'}
              cursor={event.onClick ? 'pointer' : 'default'}
              onClick={event.onClick}
              _hover={event.onClick ? { opacity: 0.85 } : undefined}
              transition="opacity 0.15s"
            >
              {/* Title row */}
              <Box display="flex" alignItems="center" gap="2" flexWrap="wrap">
                <Box
                  fontSize="sm"
                  fontWeight="semibold"
                  color="text.heading"
                  fontFamily="var(--font-heading)"
                >
                  {event.title}
                </Box>
                {event.badgeLabel && event.badgeStatus && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '1px 7px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      background: badgeStatusColors[event.badgeStatus].bg,
                      color: badgeStatusColors[event.badgeStatus].color,
                    }}
                  >
                    {event.badgeLabel}
                  </span>
                )}
              </Box>

              {/* Description */}
              {!compact && event.description && (
                <Box
                  fontSize="sm"
                  color="text.muted"
                  fontFamily="var(--font-body)"
                  mt="0.5"
                >
                  {event.description}
                </Box>
              )}

              {/* Meta row: date + provider */}
              <Box display="flex" alignItems="center" gap="3" mt="1" flexWrap="wrap">
                <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
                  {event.date}
                </Box>
                {event.provider && (
                  <>
                    <Box
                      w="1px"
                      h="3"
                      style={{ background: 'var(--chakra-colors-border)' }}
                    />
                    <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
                      {event.provider}
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
