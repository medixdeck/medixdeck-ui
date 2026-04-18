"use client";

import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface Step {
  id: string | number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperProps extends BoxProps {
  /** Array of step definitions */
  steps: Step[];
  /**
   * Index of the currently active step (1-indexed to match natural language,
   * e.g. currentStep={2} means step 2 is active).
   */
  currentStep: number;
  variant?: "default" | "compact";
  orientation?: "horizontal" | "vertical";
  /** Brand color used for active/completed states */
  colorScheme?: "blue" | "purple";
}

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2 7L5.5 10.5L12 4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * MedixDeck Stepper
 *
 * Horizontal multi-step progress indicator. Each step shows a circular
 * indicator and a label badge. Completed steps get a checkmark, the active
 * step is highlighted, and upcoming steps appear in muted gray.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: 1, title: "Verified" },
 *     { id: 2, title: "Personal Info" },
 *     { id: 3, title: "Health Info" },
 *   ]}
 *   currentStep={2}
 * />
 * ```
 */
export function Stepper({
  steps,
  currentStep,
  variant = "default",
  orientation = "horizontal",
  colorScheme = "blue",
  ...props
}: StepperProps) {
  const brandColor = colorScheme === "blue" ? "#0685FF" : "#7700CC";
  const brandBg = colorScheme === "blue" ? "rgba(6,133,255,0.10)" : "rgba(119,0,204,0.10)";

  const isVertical = orientation === "vertical";

  // ── Vertical fallback (unchanged style) ───────────────────────────────────
  if (isVertical) {
    return (
      <Box display="flex" flexDirection="column" alignItems="flex-start" {...props}>
        {steps.map((step, idx) => {
          const isCompleted = idx + 1 < currentStep;
          const isCurrent = idx + 1 === currentStep;
          const isLast = idx === steps.length - 1;
          const circleColor = isCompleted || isCurrent ? brandColor : "var(--chakra-colors-border, #E2E8F0)";

          return (
            <Box key={step.id} display="flex" flexDirection="row" alignItems="flex-start" gap="3">
              <Box display="flex" flexDirection="column" alignItems="center">
                {/* Circle */}
                <Box
                  w="8" h="8"
                  borderRadius="full"
                  flexShrink={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={isCompleted || isCurrent ? brandColor : "bg.subtle"}
                  border="2px solid"
                  borderColor={circleColor}
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  fontFamily="var(--font-body)"
                  transition="all 0.25s"
                >
                  {isCompleted ? CHECK_ICON : step.icon ?? (idx + 1)}
                </Box>

                {/* Vertical connector */}
                {!isLast && (
                  <Box
                    w="2px"
                    flex="1"
                    minH="8"
                    bg={isCompleted ? brandColor : "border"}
                    my="1"
                    transition="background 0.25s"
                  />
                )}
              </Box>

              {/* Label */}
              {variant !== "compact" && (
                <Box pt="1" pb={!isLast ? "8" : "0"}>
                  <Box
                    fontSize="sm"
                    fontWeight={isCurrent ? "semibold" : "medium"}
                    color={isCompleted || isCurrent ? brandColor : "text.muted"}
                    fontFamily="var(--font-body)"
                    transition="color 0.25s"
                  >
                    {step.title}
                  </Box>
                  {step.description && (
                    <Box fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mt="0.5">
                      {step.description}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

  // ── Horizontal layout (pill label style matching design) ──────────────────
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="0"
      role="list"
      aria-label="Progress steps"
      {...props}
    >
      {steps.map((step, idx) => {
        const isCompleted = idx + 1 < currentStep;
        const isCurrent = idx + 1 === currentStep;
        const isUpcoming = idx + 1 > currentStep;
        const isLast = idx === steps.length - 1;

        // ── Circle ────────────────────────────────────────────────────────
        // bg.subtle = #F0F4F8 light / #0F1C2E dark — visually distinct from bg
        const circleBg = isUpcoming ? "bg.subtle" : brandColor;

        const circleContent = isCompleted ? (
          CHECK_ICON
        ) : step.icon ? (
          step.icon
        ) : (
          // Step number — use Chakra color prop, not inline style CSS var
          <Box
            as="span"
            fontSize="13px"
            fontWeight="700"
            fontFamily="var(--font-body)"
            color={isUpcoming ? "text.muted" : "white"}
            lineHeight="1"
          >
            {idx + 1}
          </Box>
        );

        // ── Label pill ────────────────────────────────────────────────────
        const showPill = !isUpcoming && variant !== "compact";
        // Upcoming → muted; active/completed → brand color
        const labelColor = isUpcoming ? "text.muted" : brandColor;

        return (
          <React.Fragment key={step.id}>
            {/* Step item */}
            <Box
              role="listitem"
              aria-current={isCurrent ? "step" : undefined}
              display="inline-flex"
              alignItems="center"
              gap="0"
            >
              {/* Circle + label pill grouped together */}
              <Box
                display="inline-flex"
                alignItems="center"
                gap="2"
                px={showPill ? "2" : "0"}
                py={showPill ? "1.5" : "0"}
                bg={showPill ? brandBg : "transparent"}
                borderRadius="full"
                transition="all 0.25s ease"
              >
                {/* Circle */}
                <Box
                  w="7"
                  h="7"
                  borderRadius="full"
                  flexShrink={0}
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={circleBg}
                  border={isUpcoming ? "1.5px solid" : "none"}
                  borderColor="var(--chakra-colors-border, #E2E8F0)"
                  transition="all 0.25s ease"
                  flexDirection="row"
                >
                  {circleContent}
                </Box>

                {/* Label */}
                {variant !== "compact" && (
                  <Box
                    as="span"
                    fontSize="sm"
                    fontWeight={isCurrent || isCompleted ? "semibold" : "medium"}
                    fontFamily="var(--font-body)"
                    color={labelColor}
                    whiteSpace="nowrap"
                    transition="color 0.25s"
                  >
                    {step.title}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Connector line between steps */}
            {!isLast && (
              <Box
                display="inline-flex"
                alignItems="center"
                px="1"
                flexShrink={0}
              >
                <Box
                  h="1.5px"
                  w="10"
                  bg={isCompleted ? brandColor : "var(--chakra-colors-border, #E2E8F0)"}
                  borderRadius="full"
                  transition="background 0.25s ease"
                />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}
