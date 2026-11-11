'use client';

import React from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrescriptionDrug {
  /** Drug name e.g. "Amoxicillin" */
  name: string;
  /** Dosage e.g. "500mg" */
  dosage: string;
  /** Frequency e.g. "Twice daily" */
  frequency: string;
  /** Duration e.g. "7 days" */
  duration?: string;
  /** Additional instructions e.g. "Take with food" */
  instructions?: string;
}

export interface PrescriptionCardProps extends Omit<BoxProps, 'onChange'> {
  /** Prescription / Rx ID */
  rxId?: string;
  /** Prescribing doctor */
  doctorName: string;
  /** Doctor specialty */
  doctorSpecialty?: string;
  /** Issue date (display string) */
  issuedDate: string;
  /** Expiry date (display string) */
  expiryDate?: string;
  /** List of prescribed drugs */
  drugs: PrescriptionDrug[];
  /** Number of refills remaining */
  refillsRemaining?: number;
  /** Status of the prescription */
  status?: 'active' | 'expired' | 'dispensed';
  /** Whether prescription has been dispensed / fulfilled */
  isDispensed?: boolean;
  /** Brand color scheme */
  colorScheme?: 'blue' | 'purple';
  /** Download / print action */
  onDownload?: () => void;
}

const statusConfig = {
  active: {
    label: 'Active',
    bg: 'color-mix(in srgb, var(--chakra-colors-status-success) 12%, transparent)',
    color: 'var(--chakra-colors-status-success)',
  },
  expired: {
    label: 'Expired',
    bg: 'color-mix(in srgb, var(--chakra-colors-status-error) 10%, transparent)',
    color: 'var(--chakra-colors-status-error)',
  },
  dispensed: {
    label: 'Dispensed',
    bg: 'color-mix(in srgb, var(--chakra-colors-blue-500) 10%, transparent)',
    color: 'var(--chakra-colors-blue-500)',
  },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const PillIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/**
 * MedixDeck PrescriptionCard
 *
 * Displays a digital prescription with drug list, dosage instructions,
 * prescriber info, refill count, and optional download action.
 *
 * @example
 * ```tsx
 * <PrescriptionCard
 *   rxId="RX-20260816-0042"
 *   doctorName="Dr. Amaka Okonkwo"
 *   doctorSpecialty="General Practitioner"
 *   issuedDate="Aug 16, 2026"
 *   expiryDate="Sep 16, 2026"
 *   status="active"
 *   refillsRemaining={2}
 *   drugs={[
 *     { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", duration: "7 days", instructions: "Take with food" },
 *     { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "7 days" },
 *   ]}
 *   onDownload={() => window.print()}
 * />
 * ```
 */
export function PrescriptionCard({
  rxId,
  doctorName,
  doctorSpecialty,
  issuedDate,
  expiryDate,
  drugs,
  refillsRemaining,
  status = 'active',
  colorScheme = 'blue',
  onDownload,
  ...props
}: PrescriptionCardProps) {
  const cfg = statusConfig[status];
  const accentColor = colorScheme === 'purple' ? '#7700CC' : '#0685FF';
  const accentBg =
    colorScheme === 'purple'
      ? 'color-mix(in srgb, #7700CC 8%, transparent)'
      : 'color-mix(in srgb, #0685FF 8%, transparent)';

  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border"
      borderRadius="card"
      overflow="hidden"
      {...props}
    >
      {/* Rx header strip */}
      <Box
        px="5"
        py="3.5"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{
          borderBottom: '1px solid var(--chakra-colors-border)',
          background: accentBg,
        }}
      >
        <Box display="flex" alignItems="center" gap="2">
          <Box style={{ color: accentColor }}>
            <PillIcon />
          </Box>
          <Box
            fontSize="sm"
            fontWeight="700"
            fontFamily="var(--font-heading)"
            style={{ color: accentColor }}
          >
            Prescription
          </Box>
          {rxId && (
            <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              {rxId}
            </Box>
          )}
        </Box>

        {/* Status badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            background: cfg.bg,
            color: cfg.color,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: cfg.color,
              display: 'inline-block',
            }}
          />
          {cfg.label}
        </span>
      </Box>

      {/* Doctor + date meta */}
      <Box
        px="5"
        py="3"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="border"
        flexWrap="wrap"
        gap="2"
      >
        <Box>
          <Box
            fontSize="sm"
            fontWeight="semibold"
            color="text.heading"
            fontFamily="var(--font-heading)"
          >
            {doctorName}
          </Box>
          {doctorSpecialty && (
            <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              {doctorSpecialty}
            </Box>
          )}
        </Box>
        <Box display="flex" gap="4">
          <Box>
            <Box display="flex" alignItems="center" gap="1" color="text.muted">
              <CalendarIcon />
              <Box fontSize="xs" fontFamily="var(--font-body)">
                Issued
              </Box>
            </Box>
            <Box
              fontSize="xs"
              fontWeight="medium"
              color="text.heading"
              fontFamily="var(--font-body)"
            >
              {issuedDate}
            </Box>
          </Box>
          {expiryDate && (
            <Box>
              <Box display="flex" alignItems="center" gap="1" color="text.muted">
                <CalendarIcon />
                <Box fontSize="xs" fontFamily="var(--font-body)">
                  Expires
                </Box>
              </Box>
              <Box
                fontSize="xs"
                fontWeight="medium"
                color="text.heading"
                fontFamily="var(--font-body)"
              >
                {expiryDate}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Drug list */}
      <Box px="5" py="4" display="flex" flexDirection="column" gap="3">
        {drugs.map((drug, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="flex-start"
            gap="3"
            p="3"
            borderRadius="md"
            bg="bg.subtle"
            border="1px solid"
            borderColor="border"
          >
            {/* Index pill */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: accentBg,
                color: accentColor,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </span>

            <Box flex="1" minW="0">
              <Box display="flex" alignItems="center" gap="2" flexWrap="wrap">
                <Box
                  fontSize="sm"
                  fontWeight="semibold"
                  color="text.heading"
                  fontFamily="var(--font-heading)"
                >
                  {drug.name}
                </Box>
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    background: accentBg,
                    color: accentColor,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {drug.dosage}
                </span>
              </Box>
              <Box display="flex" gap="3" mt="1" flexWrap="wrap">
                <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
                  🕐 {drug.frequency}
                </Box>
                {drug.duration && (
                  <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
                    📅 {drug.duration}
                  </Box>
                )}
                {drug.instructions && (
                  <Box
                    fontSize="xs"
                    color="text.body"
                    fontFamily="var(--font-body)"
                    fontStyle="italic"
                  >
                    ℹ️ {drug.instructions}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Footer: refills + download */}
      <Box
        px="5"
        py="3"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderTop="1px solid"
        borderColor="border"
      >
        {refillsRemaining !== undefined ? (
          <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
            <Box as="span" fontWeight="semibold" color="text.heading">
              {refillsRemaining}
            </Box>{' '}
            refill{refillsRemaining !== 1 ? 's' : ''} remaining
          </Box>
        ) : (
          <Box />
        )}

        {onDownload && (
          <button
            onClick={onDownload}
            aria-label="Download prescription"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              color: accentColor,
              background: accentBg,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
          >
            <DownloadIcon />
            Download
          </button>
        )}
      </Box>
    </Box>
  );
}
