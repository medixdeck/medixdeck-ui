import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface TestimonialCardProps extends BoxProps {
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: string;
  rating?: number;
}

/**
 * MedixDeck TestimonialCard
 */
export function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  authorAvatar,
  rating,
  ...props
}: TestimonialCardProps) {
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
      {...props}
    >
      {rating !== undefined && (
        <Box display="flex" gap="0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} as="span" fontSize="sm" color={i < rating ? "#F59E0B" : "text.muted"}>
              ★
            </Box>
          ))}
        </Box>
      )}

      <Box
        as="blockquote"
        m="0"
        fontSize="sm"
        color="text.body"
        fontFamily="var(--font-body)"
        lineHeight="loose"
        fontStyle="italic"
      >
        "{quote}"
      </Box>

      <Box display="flex" alignItems="center" gap="3" mt="auto">
        {authorAvatar ? (
          // Use a native <img> to avoid Chakra Box prop restrictions
          <img
            src={authorAvatar}
            alt={authorName}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <Box
            w="9"
            h="9"
            borderRadius="full"
            bg="blue.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            fontWeight="semibold"
            color="white"
            flexShrink={0}
          >
            {authorName.charAt(0).toUpperCase()}
          </Box>
        )}
        <Box>
          <Box fontSize="sm" fontWeight="semibold" color="text.heading" fontFamily="var(--font-body)">
            {authorName}
          </Box>
          {authorTitle && (
            <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              {authorTitle}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── BlogCard ─────────────────────────────────────────────────────────────────

export interface BlogCardProps extends Omit<BoxProps, "onClick"> {
  /** Article headline */
  title: string;
  /** Short excerpt shown below the title (optional, max 2 lines clamped) */
  excerpt?: string;
  /** Category label displayed as a solid blue pill tag below the image */
  category?: string;
  /**
   * Publication date — accepts any format parseable by `new Date()`.
   *
   * When parseable (e.g. "2025-11-20" or "2025-11-20T08:00:00Z"), the badge
   * inside the image shows the numeric day in large blue text with the 3-letter
   * weekday abbreviation below it.
   *
   * If the string is NOT parseable (e.g. "Nov 20, 2025") the value is ignored
   * (no badge is rendered) to avoid showing NaN.
   */
  date?: string;
  /** Hero / cover image URL */
  coverImage?: string;
  /** Navigable URL – wraps the entire card in an <a> tag */
  href?: string;
  /** Click handler – wraps the entire card in a <button> */
  onClick?: () => void;
}

/** Try to derive { day, weekday } from a date string. Returns null if unparseable. */
function parseDateBadge(date: string | undefined): { day: string; weekday: string } | null {
  if (!date) return null;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return {
      day: String(d.getUTCDate()),
      weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).toUpperCase(),
    };
  } catch {
    return null;
  }
}

/**
 * MedixDeck BlogCard
 *
 * Full-bleed cover image with a floating date badge (day + weekday) in the
 * bottom-right corner of the image, a solid blue pill category tag immediately
 * below the image, bold title, and an optional clamped excerpt.
 *
 * @example
 * ```tsx
 * <BlogCard
 *   coverImage="/images/surgery.jpg"
 *   date="2025-11-20"
 *   category="Medical Support"
 *   title="Recognizing Critical Moments: Key Indicators for Emergency Room Visits"
 *   href="/blog/emergency-room"
 * />
 * ```
 */
export function BlogCard({
  title,
  excerpt,
  category,
  date,
  coverImage,
  href,
  onClick,
  ...props
}: BlogCardProps) {
  const isInteractive = Boolean(href || onClick);
  const dateBadge = parseDateBadge(date);

  const cardStyles: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: isInteractive ? "pointer" : "default",
    width: "100%",
    textAlign: "left",
  };

  const inner = (
    <Box
      bg="bg.primary"
      borderRadius="card"
      overflow="hidden"
      transition="transform 0.22s ease, box-shadow 0.22s ease"
      _dark={{ bg: "bg.primary" }}
      _hover={
        isInteractive
          ? { transform: "translateY(-4px)" }
          : undefined
      }
      {...props}
    >
      {/* ── Image area ──────────────────────────────────── */}
      <Box position="relative" overflow="hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          />
        ) : (
          /* Gradient placeholder when no image is provided */
          <Box
            borderRadius="card"
            h="220px"
            style={{ background: "linear-gradient(135deg, #0685FF 0%, #7700CC 100%)" }}
          />
        )}

        {/* Date badge, bottom-right inside the image */}
        {dateBadge && (
          <Box
            position="absolute"
            bottom="3"
            right="3"
            bg="white"
            borderRadius="10px"
            px="3"
            py="2"
            display="flex"
            flexDirection="column"
            alignItems="center"
            minW="44px"
            boxShadow="0 2px 8px rgba(0,0,0,0.16)"
          >
            {/* Day number — large blue */}
            <Box
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0685FF",
                lineHeight: 1,
                fontFamily: "var(--font-heading)",
              }}
            >
              {dateBadge.day}
            </Box>
            {/* Weekday abbreviation — small muted */}
            <Box
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#6B7280",
                letterSpacing: "0.08em",
                marginTop: 2,
                fontFamily: "var(--font-body)",
              }}
            >
              {dateBadge.weekday}
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Content area ────────────────────────────────── */}
      <Box px="4" pt="3" pb="4">
        {/* Category pill — solid blue, white text, full-radius */}
        {category && (
          <Box
            display="inline-flex"
            alignItems="center"
            px="3"
            py="1"
            mb="3"
            borderRadius="full"
            bg="blue.500"
            color="white"
            fontSize="xs"
            fontWeight="medium"
            fontFamily="var(--font-body)"
            letterSpacing="wide"
          >
            {category}
          </Box>
        )}

        {/* Title */}
        <Box
          fontSize="md"
          fontWeight="semibold"
          color="text.heading"
          fontFamily="var(--font-heading)"
          lineHeight="snug"
          mb={excerpt ? "2" : "0"}
        >
          {title}
        </Box>

        {/* Optional excerpt — clamped to 2 lines */}
        {excerpt && (
          <Box
            fontSize="sm"
            color="text.body"
            fontFamily="var(--font-body)"
            lineHeight="relaxed"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (href) {
    return (
      <a href={href} style={cardStyles} onClick={onClick}>
        {inner}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" style={cardStyles} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return inner;
}
