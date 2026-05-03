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
  experience?: string;
  consultationFee?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  availabilityLabel?: string;
  onBookClick?: () => void;
  onViewClick?: () => void;
  variant?: "standard" | "compact" | "featured";
}

/**
 * MedixDeck DoctorCard
 *
 * Card component for displaying doctor profiles.
 *
 * @example
 * ```tsx
 * <DoctorCard
 *   variant="standard"
 *   name="Dr. Amaka Okonkwo"
 *   specialty="General Practitioner"
 *   location="Lagos"
 *   rating={4.9}
 *   reviewCount={128}
 *   experience="8 yrs experience"
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
  experience,
  consultationFee,
  isVerified = false,
  isAvailable = false,
  availabilityLabel = "Available",
  onBookClick,
  onViewClick,
  variant = "standard",
  ...props
}: DoctorCardProps) {
  if (variant === "featured") {
    return (
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border"
        borderRadius="card"
        overflow="hidden"
        transition="all 0.2s ease"
        _hover={{ transform: "translateY(-2px)", borderColor: "blue.200" }}
        display="flex"
        flexDirection="column"
        {...props}
      >
        {/* Full width image */}
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          />
        ) : (
          <Box w="100%" h="240px" bg="blue.100" display="flex" alignItems="center" justifyContent="center">
            <Box fontSize="4xl" fontWeight="bold" color="blue.500">{name.charAt(0)}</Box>
          </Box>
        )}

        <Box p="5" display="flex" flexDirection="column" gap="4">
          {/* Header */}
          <Box>
            <Box display="flex" alignItems="center" gap="2" flexWrap="wrap">
              <Box fontSize="xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                {name}
              </Box>
              {isVerified && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92905C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92905 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92905L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92905 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#0685FF" />
                  <path d="M10.5 15.5L6.5 11.5L7.91 10.09L10.5 12.67L16.09 7.09L17.5 8.5L10.5 15.5Z" fill="white" />
                </svg>
              )}
            </Box>
            <Box fontSize="md" color="text.muted" fontFamily="var(--font-body)" mt="0.5">
              {specialty}{location ? ` • ${location}` : ""}
            </Box>
          </Box>

          {/* Badges */}
          <Box display="flex" alignItems="center" gap="4" mt="1">
            {isAvailable && (
              <Box
                display="inline-flex"
                alignItems="center"
                gap="2"
                px="3"
                py="1.5"
                bg="status.success.tint"
                color="status.success"
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
              >
                <Box w="1.5" h="1.5" borderRadius="full" bg="status.success" />
                {availabilityLabel}
              </Box>
            )}
            {isAvailable && experience && (
              <Box w="1px" h="20px" bg="border" />
            )}
            {experience && (
              <Box display="flex" alignItems="center" gap="2" fontSize="sm" color="text.heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-text-muted)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                {experience}
              </Box>
            )}
          </Box>

          <Box borderTop="1px solid" borderColor="border" my="1" />

          {/* Fee & Action */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {consultationFee && (
              <Box>
                <Box fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
                  Consultation fee
                </Box>
                <Box fontSize="xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                  {consultationFee}
                </Box>
              </Box>
            )}
            <Box display="flex" gap="3" alignItems="center">
              {onViewClick && (
                <Box
                  as="button"
                  px="3"
                  py="2"
                  fontSize="md"
                  fontWeight="medium"
                  fontFamily="var(--font-body)"
                  bg="transparent"
                  color="text.body"
                  border="none"
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ color: "blue.500" }}
                  onClick={onViewClick}
                >
                  view
                </Box>
              )}
              {onBookClick && (
                <Box
                  as="button"
                  px="5"
                  py="2.5"
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
                  Consult Now
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (variant === "compact") {
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
        transition="all 0.2s ease"
        _hover={{ transform: "translateY(-2px)", borderColor: "blue.200" }}
        {...props}
      >
        <Box display="flex" gap="4" alignItems="flex-start" justifyContent="space-between">
          <Box display="flex" gap="4">
            <Box flexShrink={0}>
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <Box w="64px" h="64px" borderRadius="full" bg="blue.500" display="flex" alignItems="center" justifyContent="center" fontSize="2xl" fontWeight="bold" color="white">
                  {name.charAt(0)}
                </Box>
              )}
            </Box>
            <Box pt="1">
              <Box fontSize="xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                {name}
              </Box>
              <Box fontSize="md" color="text.muted" fontFamily="var(--font-body)">
                {specialty}{location && variant !== "compact" ? ` • ${location}` : ""}
              </Box>
            </Box>
          </Box>
          {onViewClick && (
            <Box
              as="button"
              fontSize="md"
              fontWeight="medium"
              fontFamily="var(--font-body)"
              bg="transparent"
              color="text.heading"
              border="none"
              cursor="pointer"
              _hover={{ color: "blue.500" }}
              onClick={onViewClick}
              pt="1"
            >
              View
            </Box>
          )}
        </Box>

        {/* Rating and Info */}
        <Box display="flex" alignItems="center" gap="1.5" fontSize="md" color="text.muted" fontFamily="var(--font-body)">
          <Box as="span" color="status.warning" mt="-2px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </Box>
          <Box as="span" color="text.heading" mr="1">
            {rating?.toFixed(1) || "New"} {reviewCount ? `(${reviewCount})` : ""}
          </Box>
          {location && <Box as="span"> • {location}</Box>}
          {experience && <Box as="span"> • {experience}</Box>}
        </Box>

        <Box borderTop="1px solid" borderColor="border" mt="1" />

        {/* Fee & Action */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mt="1">
          {consultationFee && (
            <Box>
              <Box fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
                Consultation fee
              </Box>
              <Box fontSize="xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                {consultationFee}
              </Box>
            </Box>
          )}
          {onBookClick && (
            <Box
              as="button"
              px="5"
              py="2.5"
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
              Consult Now
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Default: variant === "standard"
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
      transition="all 0.2s ease"
      _hover={{ transform: "translateY(-2px)", borderColor: "blue.200" }}
      {...props}
    >
      <Box display="flex" gap="4" alignItems="flex-start" justifyContent="space-between">
        <Box display="flex" gap="4">
          <Box flexShrink={0}>
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <Box w="64px" h="64px" borderRadius="full" bg="blue.500" display="flex" alignItems="center" justifyContent="center" fontSize="2xl" fontWeight="bold" color="white">
                {name.charAt(0)}
              </Box>
            )}
          </Box>
          <Box pt="1">
            <Box display="flex" alignItems="center" gap="2" flexWrap="wrap">
              <Box fontSize="xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                {name}
              </Box>
              {isVerified && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92905C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92905 19.6049L6.41554 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92905L4.32435 6.41554C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92905 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z" fill="#0685FF" />
                  <path d="M10.5 15.5L6.5 11.5L7.91 10.09L10.5 12.67L16.09 7.09L17.5 8.5L10.5 15.5Z" fill="white" />
                </svg>
              )}
            </Box>
            <Box fontSize="md" color="text.muted" fontFamily="var(--font-body)">
              {specialty}{location ? ` • ${location}` : ""}
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap="1" fontSize="md" color="text.heading" fontFamily="var(--font-body)" pt="1">
          <Box as="span" color="status.warning" mt="-2px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </Box>
          {rating?.toFixed(1) || "New"} {reviewCount ? <Box as="span" color="text.muted">({reviewCount})</Box> : null}
        </Box>
      </Box>

      {/* Badges */}
      <Box display="flex" alignItems="center" gap="4" mt="1">
        {isAvailable && (
          <Box
            display="inline-flex"
            alignItems="center"
            gap="2"
            px="3"
            py="1.5"
            bg="status.success.tint"
            color="status.success"
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
          >
            <Box w="1.5" h="1.5" borderRadius="full" bg="status.success" />
            {availabilityLabel}
          </Box>
        )}
        {isAvailable && experience && (
          <Box w="1px" h="20px" bg="border" />
        )}
        {experience && (
          <Box display="flex" alignItems="center" gap="2" fontSize="sm" color="text.heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-text-muted)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
            {experience}
          </Box>
        )}
      </Box>

      <Box borderTop="1px solid" borderColor="border" my="1" />

      {/* Fee & Action */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt="1">
        {consultationFee && (
          <Box>
            <Box fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
              Consultation fee
            </Box>
            <Box fontSize="xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
              {consultationFee}
            </Box>
          </Box>
        )}
        <Box display="flex" gap="3" alignItems="center">
          {onViewClick && (
            <Box
              as="button"
              px="4"
              py="2"
              fontSize="md"
              fontWeight="medium"
              fontFamily="var(--font-body)"
              bg="transparent"
              color="text.heading"
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              cursor="pointer"
              transition="all 0.15s"
              _hover={{ borderColor: "blue.400", color: "blue.500" }}
              onClick={onViewClick}
            >
              view
            </Box>
          )}
          {onBookClick && (
            <Box
              as="button"
              px="5"
              py="2.5"
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
              Consult Now
            </Box>
          )}
        </Box>
      </Box>
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

const vitalStatusConfig: Record<VitalStatus, { bg: string; dot: string; border: string; text: string }> = {
  normal:   { bg: "rgba(27, 122, 56, 0.08)",  dot: "status.success", border: "rgba(22, 163, 74, 0.2)",  text: "status.success" },
  warning:  { bg: "rgba(217, 119, 6, 0.08)",  dot: "status.warning", border: "rgba(217, 119, 6, 0.2)",  text: "status.warning" },
  critical: { bg: "rgba(220, 38, 38, 0.08)",  dot: "status.error",   border: "rgba(220, 38, 38, 0.2)", text: "status.error" },
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
      borderColor={cfg.border}
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
  upcoming: { label: "Upcoming", color: "info" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
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
