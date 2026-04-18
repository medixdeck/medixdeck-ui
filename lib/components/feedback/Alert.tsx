import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export type AlertStatus = "info" | "success" | "warning" | "error";
export type AlertVariant = "subtle" | "solid" | "left-accent";

export interface AlertProps extends BoxProps {
  status?: AlertStatus;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
}

const statusConfig: Record<
  AlertStatus,
  { bg: string; border: string; color: string; icon: string }
> = {
  info: {
    bg: "rgba(6, 133, 255, 0.08)",
    border: "rgba(6, 133, 255, 0.3)",
    color: "#0685FF",
    icon: "ℹ",
  },
  success: {
    bg: "rgba(27, 122, 56, 0.08)",
    border: "rgba(27, 122, 56, 0.3)",
    color: "#1B7A38",
    icon: "✓",
  },
  warning: {
    bg: "rgba(217, 119, 6, 0.08)",
    border: "rgba(217, 119, 6, 0.3)",
    color: "#D97706",
    icon: "⚠",
  },
  error: {
    bg: "rgba(220, 38, 38, 0.08)",
    border: "rgba(220, 38, 38, 0.3)",
    color: "#DC2626",
    icon: "✕",
  },
};

/**
 * MedixDeck Alert
 *
 * Feedback messages for user actions.
 *
 * @example
 * ```tsx
 * <Alert status="success" title="Appointment confirmed!" description="Dr. Okafor will see you at 2pm." closable />
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      status = "info",
      variant = "subtle",
      title,
      description,
      icon,
      onClose,
      closable = false,
      children,
      ...props
    },
    ref
  ) => {
    const cfg = statusConfig[status];

    const bgColor =
      variant === "solid" ? cfg.color : cfg.bg;
    const textColor = variant === "solid" ? "white" : "inherit";
    const borderLeft =
      variant === "left-accent" ? `4px solid ${cfg.color}` : undefined;
    const border = variant === "subtle" ? `1px solid ${cfg.border}` : undefined;

    return (
      <Box
        ref={ref}
        role="alert"
        display="flex"
        alignItems="flex-start"
        gap="3"
        p="4"
        borderRadius="md"
        bg={bgColor}
        border={border}
        borderLeft={borderLeft}
        color={textColor}
        {...props}
      >
        {/* Icon */}
        <Box
          flexShrink={0}
          w="5"
          h="5"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="bold"
          bg={variant === "solid" ? "rgba(255,255,255,0.2)" : cfg.color}
          color="white"
          mt="0.5"
        >
          {icon ?? cfg.icon}
        </Box>

        {/* Content */}
        <Box flex="1">
          {title && (
            <Box
              fontWeight="semibold"
              fontSize="sm"
              fontFamily="var(--font-body)"
              color={variant === "solid" ? "white" : cfg.color}
            >
              {title}
            </Box>
          )}
          {description && (
            <Box
              mt={title ? "0.5" : "0"}
              fontSize="sm"
              fontFamily="var(--font-body)"
              color={variant === "solid" ? "rgba(255,255,255,0.85)" : "text.body"}
              lineHeight="1.5"
            >
              {description}
            </Box>
          )}
          {children}
        </Box>

        {/* Close */}
        {closable && (
          <Box
            as="button"
            flexShrink={0}
            w="6"
            h="6"
            border="none"
            bg="transparent"
            cursor="pointer"
            color={variant === "solid" ? "rgba(255,255,255,0.7)" : "text.muted"}
            fontSize="lg"
            lineHeight="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="sm"
            _hover={{ color: variant === "solid" ? "white" : "text.heading" }}
            onClick={onClose}
            aria-label="Dismiss alert"
          >
            ×
          </Box>
        )}
      </Box>
    );
  }
);

Alert.displayName = "MedixAlert";
