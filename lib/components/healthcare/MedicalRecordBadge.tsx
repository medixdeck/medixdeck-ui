'use client';

import React from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';

// ─── ICD-10 Code Badge ────────────────────────────────────────────────────────

export interface ICD10BadgeProps extends Omit<BoxProps, 'onChange'> {
  /** ICD-10 code e.g. "J45.9" */
  code: string;
  /** Human-readable description e.g. "Unspecified asthma, uncomplicated" */
  description?: string;
  /** Clinical category for color coding */
  category?: 'primary' | 'secondary' | 'chronic' | 'acute';
  colorScheme?: 'blue' | 'purple';
}

const icd10CategoryConfig = {
  primary: { label: 'Primary', bg: 'color-mix(in srgb, #0685FF 10%, transparent)', color: '#0685FF', border: 'color-mix(in srgb, #0685FF 25%, transparent)' },
  secondary: { label: 'Secondary', bg: 'color-mix(in srgb, #64748B 10%, transparent)', color: '#64748B', border: 'color-mix(in srgb, #64748B 25%, transparent)' },
  chronic: { label: 'Chronic', bg: 'color-mix(in srgb, #F59E0B 10%, transparent)', color: '#B45309', border: 'color-mix(in srgb, #F59E0B 25%, transparent)' },
  acute: { label: 'Acute', bg: 'color-mix(in srgb, #EF4444 10%, transparent)', color: '#DC2626', border: 'color-mix(in srgb, #EF4444 25%, transparent)' },
};

/**
 * MedixDeck ICD10Badge
 *
 * Displays a standardized ICD-10 diagnosis code chip with optional description.
 *
 * @example
 * ```tsx
 * <ICD10Badge code="J45.9" description="Unspecified asthma" category="chronic" />
 * ```
 */
export function ICD10Badge({ code, description, category = 'primary', ...props }: ICD10BadgeProps) {
  const cfg = icd10CategoryConfig[category];
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="1.5"
      {...props}
    >
      <span
        title={description}
        aria-label={`ICD-10 code ${code}${description ? `: ${description}` : ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'var(--font-mono, monospace)',
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          cursor: description ? 'help' : 'default',
          whiteSpace: 'nowrap',
        }}
      >
        {code}
      </span>
      {description && (
        <Box
          as="span"
          fontSize="xs"
          color="text.muted"
          fontFamily="var(--font-body)"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {description}
        </Box>
      )}
    </Box>
  );
}



// ─── Blood Type Badge ─────────────────────────────────────────────────────────

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodTypeBadgeProps extends Omit<BoxProps, 'onChange'> {
  /** ABO blood group with Rh factor */
  bloodType: BloodType;
}

/**
 * MedixDeck BloodTypeBadge
 *
 * Displays a patient's ABO blood group with Rh factor in a high-visibility
 * red badge, consistent with clinical standards.
 *
 * @example
 * ```tsx
 * <BloodTypeBadge bloodType="O+" />
 * ```
 */
export function BloodTypeBadge({ bloodType, ...props }: BloodTypeBadgeProps) {
  return (
    <Box display="inline-flex" alignItems="center" {...props}>
      <span
        aria-label={`Blood type ${bloodType}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          background: 'color-mix(in srgb, #DC2626 12%, transparent)',
          color: '#DC2626',
          border: '1px solid color-mix(in srgb, #DC2626 30%, transparent)',
          letterSpacing: '0.02em',
        }}
      >
        {/* Blood drop icon */}
        <svg width="10" height="12" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
          <path d="M6 0C6 0 0 7.5 0 11a6 6 0 0 0 12 0C12 7.5 6 0 6 0z" />
        </svg>
        {bloodType}
      </span>
    </Box>
  );
}

// ─── Allergy Alert Badge ──────────────────────────────────────────────────────

export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life-threatening';

export interface AllergyBadgeProps extends Omit<BoxProps, 'onChange'> {
  /** Allergen name e.g. "Penicillin", "Latex" */
  allergen: string;
  /** Clinical reaction severity */
  severity?: AllergySeverity;
}

const allergyConfig: Record<AllergySeverity, { label: string; bg: string; color: string; border: string; icon: string }> = {
  mild: {
    label: 'Mild',
    bg: 'color-mix(in srgb, #F59E0B 8%, transparent)',
    color: '#B45309',
    border: 'color-mix(in srgb, #F59E0B 30%, transparent)',
    icon: '⚠',
  },
  moderate: {
    label: 'Moderate',
    bg: 'color-mix(in srgb, #F97316 10%, transparent)',
    color: '#C2410C',
    border: 'color-mix(in srgb, #F97316 30%, transparent)',
    icon: '⚠',
  },
  severe: {
    label: 'Severe',
    bg: 'color-mix(in srgb, #EF4444 10%, transparent)',
    color: '#DC2626',
    border: 'color-mix(in srgb, #EF4444 30%, transparent)',
    icon: '🚫',
  },
  'life-threatening': {
    label: 'Life-threatening',
    bg: 'color-mix(in srgb, #7F1D1D 15%, transparent)',
    color: '#991B1B',
    border: '#DC2626',
    icon: '⛔',
  },
};

/**
 * MedixDeck AllergyBadge
 *
 * High-visibility badge for patient allergies with severity classification.
 * Life-threatening allergies display with a bold red border for immediate recognition.
 *
 * @example
 * ```tsx
 * <AllergyBadge allergen="Penicillin" severity="severe" />
 * <AllergyBadge allergen="Latex" severity="mild" />
 * ```
 */
export function AllergyBadge({ allergen, severity = 'mild', ...props }: AllergyBadgeProps) {
  const cfg = allergyConfig[severity];
  return (
    <Box display="inline-flex" alignItems="center" {...props}>
      <span
        aria-label={`Allergy: ${allergen} — ${cfg.label} severity`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          borderLeftWidth: severity === 'life-threatening' ? 3 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        <span aria-hidden="true">{cfg.icon}</span>
        {allergen}
        <span
          style={{
            opacity: 0.7,
            fontSize: 10,
          }}
        >
          · {cfg.label}
        </span>
      </span>
    </Box>
  );
}

// ─── MedicalRecordBadge ───────────────────────────────────────────────────────

export interface MedicalRecordBadgeProps extends Omit<BoxProps, 'onChange'> {
  /** ICD-10 diagnoses */
  diagnoses?: Array<{ code: string; description?: string; category?: ICD10BadgeProps['category'] }>;
  /** Blood type */
  bloodType?: BloodType;
  /** Known allergies */
  allergies?: Array<{ allergen: string; severity?: AllergySeverity }>;
  /** Layout direction */
  direction?: 'row' | 'column';
}

/**
 * MedixDeck MedicalRecordBadge
 *
 * Composite component that renders a patient's key medical identifiers:
 * ICD-10 diagnoses, blood type, and allergy alerts in a single compact strip.
 *
 * @example
 * ```tsx
 * <MedicalRecordBadge
 *   bloodType="O+"
 *   diagnoses={[
 *     { code: "E11.9", description: "Type 2 Diabetes", category: "chronic" },
 *     { code: "I10", description: "Essential Hypertension", category: "chronic" },
 *   ]}
 *   allergies={[
 *     { allergen: "Penicillin", severity: "severe" },
 *     { allergen: "Sulfa drugs", severity: "moderate" },
 *   ]}
 * />
 * ```
 */
export function MedicalRecordBadge({
  diagnoses,
  bloodType,
  allergies,
  direction = 'row',
  ...props
}: MedicalRecordBadgeProps) {
  return (
    <Box
      display="flex"
      flexDirection={direction}
      flexWrap="wrap"
      gap="2"
      alignItems={direction === 'row' ? 'center' : 'flex-start'}
      {...props}
    >
      {bloodType && <BloodTypeBadge bloodType={bloodType} />}

      {diagnoses?.map((d, i) => (
        <ICD10Badge
          key={i}
          code={d.code}
          description={d.description}
          category={d.category}
        />
      ))}

      {allergies?.map((a, i) => (
        <AllergyBadge
          key={i}
          allergen={a.allergen}
          severity={a.severity}
        />
      ))}
    </Box>
  );
}
