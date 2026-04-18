import React from "react";
import { Avatar as ChakraAvatar, type AvatarRootProps } from "@chakra-ui/react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps extends Omit<AvatarRootProps, "size"> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  showStatus?: boolean;
  statusColor?: string;
}

const sizeMap: Record<AvatarSize, "xs" | "sm" | "md" | "lg" | "xl" | "2xl"> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
};

/**
 * MedixDeck Avatar
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, name, size = "md", showStatus = false, statusColor = "green", ...props }, ref) => {
    return (
      <ChakraAvatar.Root
        ref={ref}
        size={sizeMap[size]}
        position="relative"
        {...props}
      >
        <ChakraAvatar.Fallback
          name={name}
          bg="blue.500"
          color="white"
          fontFamily="var(--font-body)"
        />
        {src && <ChakraAvatar.Image src={src} alt={name ?? ""} />}
        {showStatus && (
          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="3"
            h="3"
            bg={statusColor}
            borderRadius="full"
            border="2px solid"
            borderColor="bg"
          />
        )}
      </ChakraAvatar.Root>
    );
  }
);

Avatar.displayName = "MedixAvatar";

// ─── AvatarGroup (manual stacking, no ChakraAvatar.Group) ──────────────────

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
}

import { Box } from "@chakra-ui/react";

export function AvatarGroup({ children, max, size = "md" }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children);
  const visible = max ? childArray.slice(0, max) : childArray;
  const overflow = max ? Math.max(0, childArray.length - max) : 0;
  const sz = sizeMap[size];

  // Inject size via context workaround — re-render each Avatar with size
  return (
    <Box display="flex" alignItems="center">
      {visible.map((child, i) => (
        <Box key={i} ml={i === 0 ? "0" : "-2"} position="relative" zIndex={visible.length - i}>
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child}
        </Box>
      ))}
      {overflow > 0 && (
        <Box
          ml="-2"
          w={sz === "sm" ? "8" : sz === "lg" ? "12" : "10"}
          h={sz === "sm" ? "8" : sz === "lg" ? "12" : "10"}
          borderRadius="full"
          bg="bg.surface"
          border="2px solid"
          borderColor="border"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="medium"
          color="text.muted"
        >
          +{overflow}
        </Box>
      )}
    </Box>
  );
}
