import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { Badge } from "../primitive/Badge";

// ─── DoctorCard ───────────────────────────────────────────────────────────────

export interface DoctorCardProps extends BoxProps {
  name: string;
  specialty: string;
  location?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  consultationFee?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  availabilityLabel?: string;
  onBookClick?: () => void;
  onViewClick?: () => void;
}

/**
 * MedixDeck DoctorCard
 *
 * Card component for displaying doctor profiles.
 *
 * @example
 * ```tsx
 * <DoctorCard
 *   name="Dr. Amaka Okonkwo"
 *   specialty="Cardiologist"
 *   rating={4.9}
 *   reviewCount={128}
 *   consultationFee="₦5,000"
 *   isVerified
 *   isAvailable
 *   onBookClick={() => router.push("/book/amaka")}
 * />
 * ```
 */
export function DoctorCard({
  name,
  specialty,
  location,
  avatar,
  rating,
  reviewCount,
  consultationFee,
  isVerified = false,
  isAvailable = false,
  availabilityLabel = "Available today",
  onBookClick,
  onViewClick,
  ...props
}: DoctorCardProps) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border"
      borderRadius="card"
      p="5"
      display="flex"
      flexDirection="column"
      gap="4"
      boxShadow="card-light"
      _dark={{ boxShadow: "card-dark" }}
      transition="all 0.2s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "lg", borderColor: "blue.200" }}
      {...props}
    >
      {/* Header */}
      <Box display="flex" gap="3" alignItems="flex-start">
        {/* Avatar */}
        <Box position="relative" flexShrink={0}>
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--chakra-colors-border)",
                display: "block",
              }}
            />
          ) : (
            <Box
              w="14"
              h="14"
              borderRadius="full"
              bg="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xl"
              fontWeight="bold"
              color="white"
              border="2px solid"
              borderColor="blue.200"
            >
              {name.charAt(0)}
            </Box>
          )}
          {isAvailable && (
            <Box
              position="absolute"
              bottom="0"
              right="0"
              w="3.5"
              h="3.5"
              bg="green.500"
              borderRadius="full"
              border="2px solid"
              borderColor="bg.surface"
            />
          )}
        </Box>

        {/* Info */}
        <Box flex="1">
          <Box display="flex" alignItems="center" gap="1.5" flexWrap="wrap">
            <Box
              fontSize="md"
              fontWeight="semibold"
              color="text.heading"
              fontFamily="var(--font-heading)"
            >
              {name}
            </Box>
            {isVerified && (
              <Box color="blue.500" fontSize="md" title="MDCN Verified">
                ✓
              </Box>
            )}
          </Box>
          <Box fontSize="sm" color="blue.500" fontFamily="var(--font-body)" mt="0.5">
            {specialty}
          </Box>
          {location && (
            <Box
              display="flex"
              alignItems="center"
              gap="1"
              mt="0.5"
              fontSize="xs"
              color="text.muted"
              fontFamily="var(--font-body)"
            >
              <Box as="span">📍</Box>
              <Box as="span">{location}</Box>
            </Box>
          )}
        </Box>

        {isAvailable && (
          <Badge status="success" size="sm">
            {availabilityLabel}
          </Badge>
        )}
      </Box>

      {/* Rating */}
      {rating !== undefined && (
        <Box display="flex" alignItems="center" gap="2">
          <Box display="flex" gap="0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} as="span" fontSize="sm" color={i < Math.round(rating) ? "#F59E0B" : "text.muted"}>
                ★
              </Box>
            ))}
          </Box>
          <Box fontSize="sm" fontWeight="semibold" color="text.heading" fontFamily="var(--font-body)">
            {rating.toFixed(1)}
          </Box>
          {reviewCount !== undefined && (
            <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              ({reviewCount} reviews)
            </Box>
          )}
        </Box>
      )}

      {/* Fee */}
      {consultationFee && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pt="3"
          borderTop="1px solid"
          borderColor="border"
          mt="auto"
        >
          <Box>
            <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              Consultation fee
            </Box>
            <Box
              fontSize="lg"
              fontWeight="bold"
              color="text.heading"
              fontFamily="var(--font-heading)"
            >
              {consultationFee}
            </Box>
          </Box>
          <Box display="flex" gap="2">
            {onViewClick && (
              <Box
                as="button"
                px="3"
                py="1.5"
                fontSize="sm"
                fontWeight="medium"
                fontFamily="var(--font-body)"
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                bg="transparent"
                color="text.body"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ borderColor: "blue.400", color: "blue.500" }}
                onClick={onViewClick}
              >
                View
              </Box>
            )}
            {onBookClick && (
              <Box
                as="button"
                px="4"
                py="1.5"
                fontSize="sm"
                fontWeight="semibold"
                fontFamily="var(--font-body)"
                bg="blue.500"
                color="white"
                borderRadius="md"
                border="none"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ bg: "blue.600" }}
                onClick={onBookClick}
              >
                Book
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── VitalBadge ───────────────────────────────────────────────────────────────

export type VitalStatus = "normal" | "warning" | "critical";

export interface VitalBadgeProps extends BoxProps {
  label: string;
  value: string;
  unit?: string;
  status?: VitalStatus;
}

const vitalStatusConfig: Record<VitalStatus, { bg: string; dot: string; text: string }> = {
  normal: { bg: "rgba(27, 122, 56, 0.08)", dot: "#1B7A38", text: "#1B7A38" },
  warning: { bg: "rgba(217, 119, 6, 0.08)", dot: "#D97706", text: "#D97706" },
  critical: { bg: "rgba(220, 38, 38, 0.08)", dot: "#DC2626", text: "#DC2626" },
};

/**
 * MedixDeck VitalBadge
 *
 * Compact display for patient vital signs.
 *
 * @example
 * ```tsx
 * <VitalBadge label="Blood Pressure" value="138/89" unit="mmHg" status="warning" />
 * ```
 */
export function VitalBadge({ label, value, unit, status = "normal", ...props }: VitalBadgeProps) {
  const cfg = vitalStatusConfig[status];

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="2"
      px="3"
      py="2"
      borderRadius="md"
      bg={cfg.bg}
      border="1px solid"
      borderColor={`${cfg.dot}33`}
      {...props}
    >
      <Box w="2" h="2" borderRadius="full" bg={cfg.dot} flexShrink={0} />
      <Box>
        <Box fontSize="2xs" color="text.muted" fontFamily="var(--font-body)" textTransform="uppercase" letterSpacing="wide">
          {label}
        </Box>
        <Box display="flex" alignItems="baseline" gap="1">
          <Box fontSize="md" fontWeight="bold" color="text.heading" fontFamily="var(--font-mono, monospace)">
            {value}
          </Box>
          {unit && (
            <Box fontSize="xs" color={cfg.text} fontFamily="var(--font-body)">
              {unit}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── AppointmentCard ──────────────────────────────────────────────────────────

export type AppointmentType = "video" | "in-person";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface AppointmentCardProps extends BoxProps {
  doctorName: string;
  doctorSpecialty?: string;
  doctorAvatar?: string;
  date: string;
  time: string;
  type?: AppointmentType;
  status?: AppointmentStatus;
  onCancel?: () => void;
  onReschedule?: () => void;
  onJoin?: () => void;
}

const appointmentStatusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  upcoming:  { label: "Upcoming",  color: "info"    },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "error"   },
};

/**
 * MedixDeck AppointmentCard
 *
 * Patient appointment display card.
 */
export function AppointmentCard({
  doctorName,
  doctorSpecialty,
  doctorAvatar,
  date,
  time,
  type = "video",
  status = "upcoming",
  onCancel,
  onReschedule,
  onJoin,
  ...props
}: AppointmentCardProps) {
  const cfg = appointmentStatusConfig[status];

  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border"
      borderRadius="card"
      p="5"
      display="flex"
      flexDirection="column"
      gap="4"
      {...props}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap="3">
          {doctorAvatar ? (
            <img
              src={doctorAvatar}
              alt={doctorName}
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <Box w="10" h="10" borderRadius="full" bg="blue.500" display="flex" alignItems="center" justifyContent="center" fontSize="md" fontWeight="bold" color="white">
              {doctorName.charAt(0)}
            </Box>
          )}
          <Box>
            <Box fontSize="md" fontWeight="semibold" color="text.heading" fontFamily="var(--font-heading)">
              {doctorName}
            </Box>
            {doctorSpecialty && (
              <Box fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
                {doctorSpecialty}
              </Box>
            )}
          </Box>
        </Box>
        <Badge
          status={cfg.color as "success" | "info" | "warning" | "error" | "neutral"}
          size="sm"
        >
          {cfg.label}
        </Badge>
      </Box>

      <Box
        display="flex"
        gap="4"
        py="3"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Box>
          <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">Date</Box>
          <Box fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">{date}</Box>
        </Box>
        <Box>
          <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">Time</Box>
          <Box fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">{time}</Box>
        </Box>
        <Box>
          <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">Type</Box>
          <Box fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)" textTransform="capitalize">
            {type === "video" ? "🎥 Video Call" : "🏥 In-Person"}
          </Box>
        </Box>
      </Box>

      {status === "upcoming" && (
        <Box display="flex" gap="2">
          {onJoin && (
            <Box
              as="button"
              flex="1"
              py="2"
              bg="blue.500"
              color="white"
              borderRadius="md"
              border="none"
              fontSize="sm"
              fontWeight="semibold"
              fontFamily="var(--font-body)"
              cursor="pointer"
              _hover={{ bg: "blue.600" }}
              transition="all 0.15s"
              onClick={onJoin}
            >
              Join Call
            </Box>
          )}
          {onReschedule && (
            <Box
              as="button"
              flex="1"
              py="2"
              bg="transparent"
              color="text.body"
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              fontSize="sm"
              fontWeight="medium"
              fontFamily="var(--font-body)"
              cursor="pointer"
              _hover={{ borderColor: "blue.400", color: "blue.500" }}
              transition="all 0.15s"
              onClick={onReschedule}
            >
              Reschedule
            </Box>
          )}
          {onCancel && (
            <Box
              as="button"
              py="2"
              px="3"
              bg="transparent"
              color="red.500"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              fontSize="sm"
              fontFamily="var(--font-body)"
              cursor="pointer"
              _hover={{ bg: "red.50" }}
              transition="all 0.15s"
              onClick={onCancel}
            >
              Cancel
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
