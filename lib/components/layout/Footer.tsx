"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Box,
  Container,
  Grid,
  Text,
  VStack,
  HStack,
  Flex,
  type BoxProps,
} from "@chakra-ui/react";
import { Logo } from "../primitive/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | "threads";
  href: string;
}

export interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  onSubmit?: (email: string) => void;
  hide?: boolean;
  buttonIcon?: React.ReactNode;
}

export interface BottomLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterProps extends Omit<BoxProps, "children"> {
  /** Company description shown under the logo */
  description?: string;
  /** Custom logo element. Defaults to MedixDeck Logo. */
  logo?: React.ReactNode;
  /** Navigation sections (COMPANY, RESOURCES, etc.) */
  sections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Copyright text. Defaults to "© {year} MedixDeck. MDCN & FMoH Certified Platform." */
  copyright?: string;
  /** Links at the bottom right corner */
  bottomLinks?: BottomLink[];
  /** Newsletter configuration */
  newsletter?: NewsletterProps;
  /** Custom link renderer for integration with routers */
  renderLink?: (link: { href: string; isExternal?: boolean }, children: React.ReactNode) => React.ReactNode;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const SocialIcons = {
  facebook: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="5" fill="#0685FF" />
      <g clipPath="url(#clip0_1217_192)">
        <path d="M11.0972 21V13.4923H9.112V10.7892H11.0972V8.4804C11.0972 6.66611 12.2698 5 14.9719 5C16.0659 5 16.8749 5.10488 16.8749 5.10488L16.8111 7.62914C16.8111 7.62914 15.9861 7.6211 15.0858 7.6211C14.1114 7.6211 13.9553 8.07014 13.9553 8.81544V10.7892H16.8886L16.761 13.4923H13.9553V21H11.0972Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1217_192">
          <rect width="8" height="16" fill="white" transform="translate(9 5)" />
        </clipPath>
      </defs>
    </svg>
  ),
  twitter: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="5" fill="#0685FF" />
      <g clipPath="url(#clip0_1217_186)">
        <path d="M14.8963 11.3512L20.3606 5H19.0656L14.3213 10.515L10.5319 5H6.16125L11.8913 13.3394L6.16125 20H7.45625L12.4663 14.1763L16.4681 20H20.8388L14.8963 11.3512ZM13.1231 13.4131L12.5425 12.5825L7.9225 5.975H9.91125L13.6394 11.3075L14.22 12.1381L19.0663 19.0694H17.0775L13.1231 13.4131Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1217_186">
          <rect width="15" height="15" fill="white" transform="translate(6 5)" />
        </clipPath>
      </defs>
    </svg>
  ),
  linkedin: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="5" fill="#0685FF" />
      <g clipPath="url(#clip0_1217_198)">
        <path d="M18.4298 5.31982H7.57025C6.97368 5.32059 6.40177 5.55791 5.97993 5.97975C5.55809 6.40158 5.32077 6.9735 5.32001 7.57006V18.4296C5.32077 19.0262 5.55809 19.5981 5.97993 20.0199C6.40177 20.4417 6.97368 20.6791 7.57025 20.6798H18.4298C19.0263 20.6791 19.5982 20.4417 20.0201 20.0199C20.4419 19.5981 20.6792 19.0262 20.68 18.4296V7.57006C20.6792 6.9735 20.4419 6.40158 20.0201 5.97975C19.5982 5.55791 19.0263 5.32059 18.4298 5.31982ZM10.7498 17.5003H8.94977V11.1998H10.7498V17.5003ZM10.7498 10.3003H8.94977V8.5003H10.7498V10.3003ZM17.0502 17.5003H15.2502V13.9003C15.2372 13.6704 15.1367 13.4542 14.9694 13.2961C14.802 13.1379 14.5805 13.0498 14.3502 13.0498C14.12 13.0498 13.8985 13.1379 13.7311 13.2961C13.5637 13.4542 13.4633 13.6704 13.4502 13.9003V17.5003H11.6502V11.1998H13.4502V11.5387C13.9216 11.3928 14.2278 11.1998 14.8 11.1998C16.0211 11.2008 17.0502 12.2961 17.0502 13.5902V17.5003Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1217_198">
          <rect width="16" height="16" fill="white" transform="translate(5 5)" />
        </clipPath>
      </defs>
    </svg>
  ),
  instagram: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="5" fill="#0685FF" />
      <g clipPath="url(#clip0_1217_183)">
        <path d="M10.3938 5.05251C9.5958 5.09014 9.05086 5.21751 8.57443 5.40464C8.08143 5.59682 7.66349 5.85464 7.24768 6.27195C6.83193 6.68926 6.5758 7.10745 6.38505 7.60132C6.20043 8.0787 6.0753 8.62414 6.04005 9.42257C6.0048 10.221 5.99699 10.4777 6.00093 12.5144C6.0048 14.5511 6.0138 14.8064 6.05249 15.6065C6.09061 16.4043 6.21749 16.9491 6.40468 17.4257C6.59718 17.9188 6.85468 18.3365 7.27218 18.7524C7.68961 19.1684 8.10749 19.4239 8.60249 19.6149C9.07949 19.7993 9.62505 19.925 10.4234 19.9599C11.2217 19.9949 11.4786 20.0031 13.5147 19.9991C15.5509 19.9953 15.8072 19.9862 16.6071 19.9483C17.4071 19.9103 17.949 19.7825 18.4257 19.5962C18.9188 19.4033 19.3369 19.1462 19.7525 18.7286C20.1681 18.311 20.4241 17.8925 20.6147 17.3984C20.7995 16.9214 20.925 16.3759 20.9597 15.5781C20.9947 14.7776 21.0029 14.522 20.9991 12.4856C20.9951 10.4492 20.9859 10.1939 20.948 9.39407C20.9101 8.59426 20.783 8.05114 20.5959 7.57426C20.4032 7.0812 20.1459 6.66376 19.7287 6.24751C19.3114 5.83126 18.8925 5.57551 18.3986 5.38532C17.9212 5.20064 17.3761 5.07482 16.5777 5.04032C15.7794 5.00582 15.5225 4.99689 13.4856 5.00089C11.4487 5.00476 11.1937 5.01351 10.3938 5.05251ZM10.4814 18.6107C9.75018 18.5789 9.35311 18.4574 9.08849 18.3557C8.73811 18.2207 8.48849 18.0575 8.2248 17.7963C7.96105 17.5352 7.79911 17.2847 7.6623 16.9351C7.55955 16.6704 7.4358 16.2738 7.40161 15.5426C7.36443 14.7523 7.35661 14.5149 7.35224 12.5126C7.34786 10.5103 7.35555 10.2732 7.39018 9.48257C7.42143 8.75195 7.54368 8.35445 7.64518 8.08995C7.78018 7.73914 7.9428 7.48995 8.20455 7.22645C8.4663 6.96289 8.71605 6.80057 9.06599 6.66376C9.33036 6.56057 9.72693 6.43789 10.4579 6.40307C11.2488 6.36557 11.4858 6.35807 13.4879 6.3537C15.4899 6.34932 15.7275 6.35682 16.5188 6.3917C17.2494 6.42345 17.6471 6.54451 17.9113 6.6467C18.2618 6.7817 18.5113 6.94382 18.7748 7.20607C19.0384 7.4682 19.2008 7.71707 19.3376 8.06776C19.4409 8.33132 19.5637 8.72776 19.5982 9.4592C19.6358 10.2501 19.6444 10.4873 19.6479 12.4892C19.6516 14.4911 19.6445 14.7288 19.6098 15.5192C19.5779 16.2504 19.4567 16.6476 19.3548 16.9126C19.2198 17.2628 19.0571 17.5126 18.7952 17.7759C18.5333 18.0394 18.2839 18.2016 17.9337 18.3384C17.6697 18.4415 17.2727 18.5645 16.5424 18.5993C15.7514 18.6365 15.5144 18.6443 13.5116 18.6487C11.5087 18.6531 11.2724 18.6449 10.4814 18.6107ZM16.5956 8.49151C16.5959 8.66953 16.649 8.84346 16.7481 8.99131C16.8473 9.13916 16.9881 9.25428 17.1527 9.32211C17.3173 9.38994 17.4983 9.40744 17.6728 9.37239C17.8473 9.33735 18.0076 9.25132 18.1332 9.12521C18.2588 8.9991 18.3443 8.83855 18.3787 8.66389C18.413 8.48922 18.3949 8.30828 18.3264 8.14395C18.258 7.97962 18.1423 7.83927 17.9941 7.74067C17.8459 7.64207 17.6718 7.58964 17.4937 7.59001C17.2551 7.59051 17.0264 7.68575 16.858 7.85481C16.6896 8.02386 16.5952 8.25288 16.5956 8.49151ZM9.64905 12.5075C9.65324 14.6345 11.3807 16.3548 13.5072 16.3508C15.6338 16.3468 17.3553 14.6195 17.3513 12.4925C17.3472 10.3655 15.6194 8.6447 13.4926 8.64889C11.3657 8.65307 9.64505 10.3808 9.64905 12.5075ZM11 12.5048C10.999 12.0104 11.1447 11.5267 11.4186 11.1151C11.6925 10.7034 12.0823 10.3822 12.5387 10.1921C12.9951 10.002 13.4977 9.95146 13.9828 10.047C14.468 10.1425 14.9139 10.3797 15.2642 10.7286C15.6146 11.0775 15.8535 11.5225 15.951 12.0073C16.0484 12.492 15.9999 12.9948 15.8116 13.452C15.6233 13.9092 15.3036 14.3003 14.8931 14.5758C14.4825 14.8513 13.9994 14.9989 13.505 14.9999C13.1767 15.0006 12.8514 14.9366 12.5478 14.8116C12.2443 14.6865 11.9683 14.5029 11.7357 14.2712C11.503 14.0395 11.3183 13.7643 11.1921 13.4612C11.0659 13.1581 11.0006 12.8331 11 12.5048Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1217_183">
          <rect width="15" height="15" fill="white" transform="translate(6 5)" />
        </clipPath>
      </defs>
    </svg>
  ),
  youtube: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="5" fill="#0685FF" />
      <g clipPath="url(#clip0_1217_195)">
        <path d="M20.6653 9.12395C20.5749 8.78346 20.3967 8.47271 20.1484 8.22279C19.9001 7.97287 19.5905 7.79258 19.2507 7.69995C18.0033 7.36328 13 7.36328 13 7.36328C13 7.36328 7.99667 7.36328 6.74867 7.69995C6.40894 7.79274 6.09953 7.9731 5.85139 8.223C5.60324 8.4729 5.42506 8.78357 5.33467 9.12395C5 10.3799 5 12.9999 5 12.9999C5 12.9999 5 15.6199 5.33467 16.8759C5.42506 17.2164 5.60332 17.5272 5.85159 17.7771C6.09987 18.027 6.40945 18.2073 6.74933 18.2999C7.99667 18.6366 13 18.6366 13 18.6366C13 18.6366 18.0033 18.6366 19.2513 18.2999C19.5912 18.2074 19.9009 18.0271 20.1491 17.7772C20.3974 17.5273 20.5757 17.2165 20.666 16.8759C21 15.6199 21 12.9999 21 12.9999C21 12.9999 21 10.3799 20.6653 9.12395ZM11.3633 15.3786V10.6213L15.5453 12.9999L11.3633 15.3786Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1217_195">
          <rect width="16" height="12" fill="white" transform="translate(5 7)" />
        </clipPath>
      </defs>
    </svg>
  ),
  threads: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="5" fill="#0685FF" />
      <g clipPath="url(#clip0_1217_189)">
        <path d="M13.6162 20H13.6119C11.3737 19.985 9.65312 19.2469 8.49687 17.8069C7.46875 16.525 6.9375 14.7413 6.92 12.5063V12.4956C6.93875 10.2587 7.46937 8.47688 8.49812 7.19438C9.65312 5.75312 11.375 5.015 13.6125 5H13.6212C15.3375 5.0125 16.7731 5.45312 17.8875 6.31125C18.9356 7.1175 19.6737 8.2675 20.0806 9.72813L18.8056 10.0837C18.1156 7.60875 16.3694 6.34375 13.6156 6.32437C11.7969 6.33812 10.4219 6.90937 9.52812 8.0225C8.69187 9.065 8.26 10.5712 8.24312 12.5C8.26 14.4288 8.69187 15.935 9.52875 16.9775C10.4225 18.0919 11.7981 18.6638 13.6162 18.6756C15.2556 18.6631 16.34 18.2812 17.2412 17.3975C18.2706 16.3894 18.2525 15.1519 17.9225 14.3988C17.7287 13.955 17.3769 13.5863 16.9012 13.305C16.7812 14.15 16.5125 14.8337 16.0987 15.35C15.545 16.0387 14.7612 16.415 13.7675 16.4688C13.0162 16.5094 12.2919 16.3325 11.7306 15.9681C11.0662 15.5375 10.6775 14.8806 10.6356 14.1156C10.595 13.3719 10.8906 12.6875 11.4669 12.1894C12.0169 11.7144 12.7912 11.435 13.7062 11.3825C14.3368 11.3431 14.9697 11.3729 15.5937 11.4713C15.515 11.0075 15.3594 10.6388 15.125 10.3731C14.8044 10.0069 14.3075 9.82125 13.6506 9.81687H13.6325C13.105 9.81687 12.3875 9.96188 11.9319 10.6419L10.8337 9.90438C11.4462 8.99563 12.4387 8.49437 13.6325 8.49437H13.66C15.6562 8.50688 16.8456 9.72875 16.9644 11.8619C17.0319 11.8906 17.0994 11.9206 17.165 11.9506C18.0962 12.3881 18.7775 13.0513 19.1362 13.8694C19.6344 15.0069 19.6806 16.8631 18.1687 18.3431C17.0125 19.4744 15.61 19.9856 13.6206 19.9994L13.6162 20ZM14.2431 12.6938C14.0919 12.6938 13.9387 12.6981 13.7812 12.7069C12.6337 12.7713 11.9187 13.2981 11.9587 14.0463C12.0006 14.8313 12.8662 15.1956 13.6987 15.1506C14.4637 15.11 15.46 14.8112 15.6275 12.8319C15.1722 12.7369 14.7082 12.6906 14.2431 12.6938Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1217_189">
          <rect width="15" height="15" fill="white" transform="translate(6 5)" />
        </clipPath>
      </defs>
    </svg>
  ),
};

const defaultDescription = "Nigeria's premium digital sanctuary for specialist healthcare. Bridging the gap between expert care and patient convenience.";

const defaultSections: FooterSection[] = [
  {
    title: "COMPANY",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "For Doctors", href: "/doctors" },
      { label: "For Businesses", href: "/businesses" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { platform: "instagram", href: "https://instagram.com/medixdeck" },
  { platform: "twitter", href: "https://twitter.com/medixdeck" },
  { platform: "threads", href: "https://threads.net/@medixdeck" },
  { platform: "facebook", href: "https://facebook.com/medixdeck" },
  { platform: "youtube", href: "https://youtube.com/medixdeck" },
  { platform: "linkedin", href: "https://linkedin.com/company/medixdeck" },
];

const defaultBottomLinks: BottomLink[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

const defaultRenderLink = (link: { href: string; isExternal?: boolean }, children: React.ReactNode) => (
  <a
    href={link.href}
    target={link.isExternal ? "_blank" : undefined}
    rel={link.isExternal ? "noopener noreferrer" : undefined}
    style={{ textDecoration: "none" }}
  >
    {children}
  </a>
);

/**
 * MedixDeck Footer
 *
 * Re-usable footer component with brand area, navigation links, newsletter form,
 * and social icons. Adapts perfectly to light and dark modes.
 *
 * @example
 * ```tsx
 * <Footer
 *   description="Nigeria's premium digital sanctuary."
 *   socialLinks={[{ platform: 'twitter', href: '...' }]}
 * />
 * ```
 */
export function Footer({
  description = defaultDescription,
  logo,
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  copyright,
  bottomLinks = defaultBottomLinks,
  newsletter,
  renderLink = defaultRenderLink,
  ...props
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const resolvedCopyright = copyright ?? `© ${currentYear} MedixDeck. MDCN & FMoH Certified Platform.`;
  const [email, setEmail] = useState("");

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletter?.onSubmit && email) {
      newsletter.onSubmit(email);
      setEmail("");
    }
  };

  return (
    <Box
      as="footer"
      bg="bg"
      py={{ base: 12, md: 16 }}
      {...props}
    >
      <Container maxWidth="7xl">
        <Grid
          templateColumns={{ base: "1fr", lg: "1.5fr 1fr 1.5fr" }}
          gap={{ base: 12, lg: 16 }}
          mb={16}
        >
          {/* Brand Area */}
          <Box>
            <Box mb={4}>
              {logo ?? <Logo variant="blue" height={28} />}
            </Box>
            <Text
              fontSize="sm"
              color="text.muted"
              maxW="320px"
              lineHeight="1.6"
              fontFamily="var(--font-body)"
            >
              {description}
            </Text>

            {/* Social Links */}
            <HStack mt={6} gap={2} flexWrap="wrap">
              {socialLinks.map((social) => {
                const Icon = SocialIcons[social.platform];
                return (
                  <Box
                    key={social.platform}
                    as="a"
                    // @ts-ignore this is a temp solution to fix the dark mode issue.
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="inline-flex"
                    transition="transform 0.2s ease, opacity 0.2s ease"
                    _hover={{
                      transform: "translateY(-2px)",
                      opacity: 0.9,
                    }}
                    title={social.platform}
                  >
                    <Icon />
                  </Box>
                );
              })}
            </HStack>
          </Box>

          {/* Navigation Sections */}
          <Grid templateColumns="1fr 1fr" gap={8}>
            {sections.map((section) => (
              <Box key={section.title}>
                <Text
                  fontWeight="700"
                  color="text.heading"
                  mb={4}
                  fontSize="xs"
                  fontFamily="var(--font-heading)"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                >
                  {section.title}
                </Text>
                <VStack align="flex-start" gap={3}>
                  {section.links.map((link) => (
                    <Box key={link.label} w="full">
                      {renderLink(
                        link,
                        <Box
                          as="span"
                          fontSize="sm"
                          color="text.muted"
                          fontFamily="var(--font-body)"
                          _hover={{ color: "blue.500" }}
                          transition="color 0.2s ease"
                          cursor="pointer"
                          display="block"
                        >
                          {link.label}
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))}
          </Grid>

          {/* Newsletter Box */}
          {!newsletter?.hide && (
            <Box>
              <Box
                p={6}
                borderRadius="2xl"
                border="1px solid"
                borderColor="border"
                bg="bg"
                _dark={{ bg: "rgba(255,255,255,0.02)" }}
              >
                <Text
                  fontWeight="700"
                  color="text.heading"
                  mb={2}
                  fontSize="md"
                  fontFamily="var(--font-heading)"
                >
                  {newsletter?.title ?? "Newsletter"}
                </Text>
                <Text
                  fontSize="sm"
                  color="text.muted"
                  mb={5}
                  fontFamily="var(--font-body)"
                  lineHeight="1.5"
                >
                  {newsletter?.description ?? "Get monthly health tips from our verified specialists."}
                </Text>

                <Box as="form" onSubmit={handleNewsletterSubmit} position="relative" display="flex">
                  <Box
                    as="input"
                    // @ts-ignore email
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder={newsletter?.placeholder ?? "email@address.com"}
                    w="full"
                    h="44px"
                    pl={4}
                    pr="50px"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="border"
                    bg="bg.surface"
                    fontSize="sm"
                    fontFamily="var(--font-body)"
                    color="text.body"
                    _placeholder={{ color: "text.muted" }}
                    _focus={{ outline: "none", borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                    transition="all 0.2s"
                    required
                  />
                  <Box
                    as="button"
                    // @ts-ignore type button
                    type="submit"
                    position="absolute"
                    right="4px"
                    top="4px"
                    bottom="4px"
                    w="36px"
                    bg="blue.500"
                    color="white"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    _hover={{ bg: "blue.600" }}
                    transition="background 0.2s ease"
                    aria-label="Subscribe"
                    border="none"
                  >
                    {newsletter?.buttonIcon ?? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>

        <Box borderTop="1px solid" borderColor="border" pt={6}>
          <Flex
            justify="space-between"
            align={{ base: "center", md: "flex-start" }}
            flexDir={{ base: "column-reverse", md: "row" }}
            gap={4}
          >
            <Text
              fontSize="xs"
              color="text.muted"
              fontFamily="var(--font-body)"
              textAlign={{ base: "center", md: "left" }}
            >
              {resolvedCopyright}
            </Text>

            <HStack gap={6} flexWrap="wrap" justify="center" alignItems="center">
              {bottomLinks.map((link) => (
                <Box key={link.label}>
                  {renderLink(
                    link,
                    <Box
                      as="span"
                      fontSize="xs"
                      color="text.muted"
                      fontFamily="var(--font-body)"
                      _hover={{ color: "text.heading" }}
                      transition="color 0.2s ease"
                      cursor="pointer"
                    >
                      {link.label}
                    </Box>
                  )}
                </Box>
              ))}

              {/* Theme Toggle Icon */}
              {mounted && (
                <Box
                  as="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  bg="bg.surface"
                  border="1px solid"
                  borderColor="border"
                  color="text.muted"
                  _hover={{ color: "text.heading", bg: "bg" }}
                  cursor="pointer"
                  transition="all 0.2s"
                  aria-label="Toggle theme"
                  ml={2}
                >
                  {theme === "dark" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  )}
                </Box>
              )}
            </HStack>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

Footer.displayName = "MedixFooter";
