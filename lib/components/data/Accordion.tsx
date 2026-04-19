"use client";

import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface AccordionItem {
  id: string;
  /** The question / trigger label */
  question: string;
  /** The answer / expanded body */
  answer: string | React.ReactNode;
}

export interface AccordionProps extends Omit<BoxProps, "onChange"> {
  items: AccordionItem[];
  /** Allow multiple items open simultaneously */
  allowMultiple?: boolean;
  /** Initially open item IDs */
  defaultOpenIds?: string[];
}

/**
 * MedixDeck Accordion / FAQ
 *
 * Each item is a rounded card. Closed state shows an outlined "+" circle;
 * open state shows a filled blue "−" circle. Matches the MedixDeck FAQ design.
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: "q1", question: "What is MedixDeck?", answer: "…" },
 *     { id: "q2", question: "Are the doctors qualified?", answer: "…" },
 *   ]}
 * />
 * ```
 */
export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  ...props
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap="4" {...props}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <Box
            key={item.id}
            bg="bg.primary"
            border="1px solid"
            borderColor="border"
            borderRadius="card"
            overflow="hidden"
            transition="border-color 0.2s"
            _hover={{ borderColor: isOpen ? "blue.500" : "border" }}
          >
            {/* ── Trigger row ─────────────────────────────────────────────── */}
            <Box
              as="button"
              w="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="4"
              px="6"
              py="5"
              bg="transparent"
              border="none"
              cursor="pointer"
              textAlign="left"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              {/* Question text */}
              <Box
                fontSize="lg"
                fontWeight="semibold"
                color="text.heading"
                fontFamily="var(--font-heading)"
                flex="1"
                lineHeight="short"
              >
                {item.question}
              </Box>

              {/* Toggle icon: outlined + (closed) → filled blue − (open) */}
              <Box
                flexShrink={0}
                w="10"
                h="10"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="background 0.2s, border-color 0.2s, color 0.2s"
                aria-hidden="true"
                style={{
                  border: isOpen ? "none" : "1.5px solid var(--medix-form-text)",
                  background: isOpen ? "#0685FF" : "transparent",
                  color: isOpen ? "#ffffff" : "inherit",
                  flexShrink: 0,
                }}
              >
                {/* SVG icons for crisp +/− at all sizes */}
                {isOpen ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <rect x="3" y="8.25" width="12" height="1.5" rx="0.75" fill=" var(--medix-form-text)" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <rect x="3" y="8.25" width="12" height="1.5" rx="0.75" fill=" var(--medix-form-text)" />
                    <rect x="8.25" y="3" width="1.5" height="12" rx="0.75" fill=" var(--medix-form-text)" />
                  </svg>
                )}
              </Box>
            </Box>

            {/* ── Animated answer panel ────────────────────────────────────── */}
            <Box
              overflow="hidden"
              maxH={isOpen ? "800px" : "0px"}
              opacity={isOpen ? 1 : 0}
              transition="max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease"
            >
              <Box
                px="6"
                pb="6"
                pt="0"
                fontSize="md"
                color="text.body"
                fontFamily="var(--font-body)"
                lineHeight="loose"
              >
                {item.answer}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
