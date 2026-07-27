'use client';

import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { Box, Text } from '@chakra-ui/react';
import { Button } from '../primitive/Button';
import { useIsDarkMode } from '../../hooks/useThemeMode';

export type CookieConsentComponentProps = React.ComponentProps<typeof CookieConsent>;

export interface CookieConsentBannerProps extends Omit<
  CookieConsentComponentProps,
  'style' | 'buttonStyle' | 'declineButtonStyle' | 'contentStyle'
> {
  /** Optional custom title for the banner */
  title?: string;
  /** Custom text for accept button. Defaults to "Accept All" */
  acceptText?: string;
  /** Custom text for decline button. Defaults to "Reject Non-Essential" */
  declineText?: string;
  /** Enables the decline button. Defaults to true for compliance. */
  enableDeclineButton?: boolean;
}

/**
 * MedixDeck CookieConsentBanner
 *
 * A GDPR/NDPR compliant cookie consent banner powered by react-cookie-consent.
 *
 * @example
 * ```tsx
 * <CookieConsentBanner />
 * ```
 */
export function CookieConsentBanner({
  title = 'We value your privacy',
  acceptText = 'Accept All',
  declineText = 'Reject Non-Essential',
  enableDeclineButton = true,
  children,
  ...props
}: CookieConsentBannerProps) {
  const isDark = useIsDarkMode();

  const bgColor = isDark ? '#152035' : '#F6F6F6';
  const textColor = isDark ? '#ABC0D6' : '#3D4F63';
  const borderColor = isDark ? '#1E3050' : '#E4E8F0';

  return (
    <>
      <style>{`
        .medixdeck-cookie-banner {
          background-color: ${bgColor} !important;
          color: ${textColor} !important;
          border-top: 1px solid ${borderColor} !important;
          padding: 1rem 1.5rem !important;
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          justify-content: space-between !important;
          box-shadow: none !important;
          font-family: var(--font-body) !important;
          z-index: 9999 !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          width: 100% !important;
        }
        @media (max-width: 768px) {
          .medixdeck-cookie-banner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
        .medixdeck-cookie-content {
          flex: 1 1 auto !important;
          margin: 0 !important;
          max-width: 800px !important;
        }
        .medixdeck-cookie-buttons {
          display: flex !important;
          gap: 0.75rem !important;
          align-items: center !important;
          flex-wrap: wrap !important;
        }
      `}</style>
      <CookieConsent
        location="bottom"
        buttonText={acceptText}
        declineButtonText={declineText}
        enableDeclineButton={enableDeclineButton}
        disableStyles={true}
        containerClasses="medixdeck-cookie-banner"
        contentClasses="medixdeck-cookie-content"
        buttonWrapperClasses="medixdeck-cookie-buttons"
        ButtonComponent={(btnProps: any) => (
          <Button
            variant="solid"
            colorScheme="blue"
            size="sm"
            onClick={btnProps.onClick}
            id={btnProps.id}
          >
            {btnProps.children}
          </Button>
        )}
        {...props}
      >
        <Box>
          {title && (
            <Text fontWeight="600" color="text.heading" mb={1} fontFamily="var(--font-heading)">
              {title}
            </Text>
          )}
          <Text fontSize="sm" color="text.muted" lineHeight="1.5">
            {children ||
              'We use cookies to securely manage your session, enhance your browsing experience, and analyze our platform\'s performance. By clicking "Accept All", you consent to our use of cookies.'}
          </Text>
        </Box>
      </CookieConsent>
    </>
  );
}

CookieConsentBanner.displayName = 'MedixCookieConsentBanner';
