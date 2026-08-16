'use client';

import React from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';
import { Avatar } from '../primitive/Avatar';
import { LuMic, LuMicOff, LuVideo, LuVideoOff, LuScreenShare, LuPhoneOff } from 'react-icons/lu';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TelehealthCallBarProps extends Omit<BoxProps, 'onChange'> {
  /** Name of the other participant (doctor or patient) */
  participantName: string;
  /** Participant's specialty or role label */
  participantRole?: string;
  /** Participant's avatar URL */
  participantAvatar?: string;
  /** Live call duration display string e.g. "04:32" */
  duration?: string;
  /** Whether local mic is muted */
  isMuted?: boolean;
  /** Whether local camera is off */
  isCameraOff?: boolean;
  /** Called when mute/unmute pressed */
  onToggleMute?: () => void;
  /** Called when camera on/off pressed */
  onToggleCamera?: () => void;
  /** Called when end call pressed */
  onEndCall?: () => void;
  /** Called when share screen pressed */
  onShareScreen?: () => void;
  /** Whether screen sharing is active */
  isSharingScreen?: boolean;
  /** Position of the bar */
  position?: 'bottom' | 'top';
  /**
   * Color scheme variant:
   * - `'adaptive'` (default): Seamlessly adapts to MedixDeck light and dark mode tokens.
   * - `'dark'`: Enforces classic dark glassmorphic styling for floating call overlays over video feeds.
   * @default "adaptive"
   */
  variant?: 'adaptive' | 'dark';
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const MicIcon = ({ muted }: { muted: boolean }) =>
  muted ? <LuMicOff size={18} aria-hidden="true" /> : <LuMic size={18} aria-hidden="true" />;

const VideoIcon = ({ off }: { off: boolean }) =>
  off ? <LuVideoOff size={18} aria-hidden="true" /> : <LuVideo size={18} aria-hidden="true" />;

const ScreenShareIcon = ({ active }: { active: boolean }) => (
  <LuScreenShare
    size={18}
    color={active ? 'var(--chakra-colors-status-success, #16A34A)' : 'currentColor'}
    aria-hidden="true"
  />
);

const PhoneOffIcon = () => <LuPhoneOff size={18} aria-hidden="true" />;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MedixDeck TelehealthCallBar
 *
 * Floating control bar for active telehealth video consultations.
 * Displays participant info, call duration, and media control actions.
 * Integrates MedixDeck semantic tokens for seamless light and dark mode support.
 *
 * @example
 * ```tsx
 * <TelehealthCallBar
 *   variant="adaptive"
 *   participantName="Dr. Amaka Okonkwo"
 *   participantRole="General Practitioner"
 *   duration="04:32"
 *   isMuted={muted}
 *   isCameraOff={cameraOff}
 *   onToggleMute={() => setMuted(m => !m)}
 *   onToggleCamera={() => setCameraOff(c => !c)}
 *   onEndCall={handleEndCall}
 * />
 * ```
 */
export function TelehealthCallBar({
  participantName,
  participantRole,
  participantAvatar,
  duration,
  isMuted = false,
  isCameraOff = false,
  isSharingScreen = false,
  onToggleMute,
  onToggleCamera,
  onEndCall,
  onShareScreen,
  position = 'bottom',
  variant = 'adaptive',
  ...props
}: TelehealthCallBarProps) {
  const [localMuted, setLocalMuted] = React.useState(isMuted);
  const [localCameraOff, setLocalCameraOff] = React.useState(isCameraOff);

  const isDarkVariant = variant === 'dark';

  const handleToggleMute = () => {
    setLocalMuted((prev) => !prev);
    onToggleMute?.();
  };

  const handleToggleCamera = () => {
    setLocalCameraOff((prev) => !prev);
    onToggleCamera?.();
  };

  const ControlButton = ({
    onClick,
    ariaLabel,
    active,
    isEndCall = false,
    children,
  }: {
    onClick?: () => void;
    ariaLabel: string;
    active?: boolean;
    isEndCall?: boolean;
    children: React.ReactNode;
  }) => {
    // Dynamic background and text based on variant and active/end call states
    let normalBg = isDarkVariant
      ? 'rgba(255,255,255,0.1)'
      : 'var(--chakra-colors-bg-subtle, #F0F4F8)';
    let normalColor = isDarkVariant ? 'white' : 'var(--chakra-colors-text-heading, #111926)';
    let hoverBg = isDarkVariant ? 'rgba(255,255,255,0.2)' : 'var(--chakra-colors-border, #E2E8F0)';

    if (isEndCall) {
      normalBg = 'var(--chakra-colors-status-error, #DC2626)';
      normalColor = 'white';
      hoverBg = 'color-mix(in srgb, var(--chakra-colors-status-error, #DC2626) 85%, black)';
    } else if (active) {
      normalBg = 'var(--chakra-colors-status-error-tint, rgba(220,38,38,0.15))';
      normalColor = 'var(--chakra-colors-status-error, #DC2626)';
      hoverBg = 'var(--chakra-colors-status-error-tint, rgba(220,38,38,0.25))';
    }

    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={active}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: active ? '1px solid var(--chakra-colors-status-error)' : '1px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          background: normalBg,
          color: normalColor,
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = hoverBg;
          el.style.transform = 'scale(1.06)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = normalBg;
          el.style.transform = 'scale(1)';
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <Box
      position="fixed"
      {...(position === 'bottom' ? { bottom: '0' } : { top: '0' })}
      left="0"
      right="0"
      zIndex="overlay"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={{ base: '4', md: '8' }}
      flexWrap="wrap"
      gap="4"
      bg={isDarkVariant ? undefined : 'bg.surface'}
      borderColor="border"
      style={{
        minHeight: 72,
        paddingTop: 12,
        paddingBottom: position === 'bottom' ? 'calc(12px + env(safe-area-inset-bottom, 0px))' : 12,
        background: isDarkVariant ? 'linear-gradient(135deg, #0A1220 0%, #0F1C2E 100%)' : undefined,
        borderTop: position === 'bottom' ? '1px solid var(--chakra-colors-border)' : 'none',
        borderBottom: position === 'top' ? '1px solid var(--chakra-colors-border)' : 'none',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
      {...props}
    >
      {/* Participant info */}
      <Box display="flex" alignItems="center" gap="3">
        <Avatar src={participantAvatar} name={participantName} size="md" />
        <Box>
          <Box
            fontSize="sm"
            fontWeight="semibold"
            fontFamily="var(--font-heading)"
            color={isDarkVariant ? 'white' : 'text.heading'}
          >
            {participantName}
          </Box>
          {participantRole && (
            <Box
              fontSize="xs"
              fontFamily="var(--font-body)"
              color={isDarkVariant ? 'rgba(255,255,255,0.6)' : 'text.muted'}
            >
              {participantRole}
            </Box>
          )}
        </Box>

        {/* Live indicator + duration */}
        <Box display="flex" alignItems="center" gap="2" ml="2">
          <span
            aria-label="Live call"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 700,
              background: 'var(--chakra-colors-status-error-tint, rgba(220,38,38,0.15))',
              color: 'var(--chakra-colors-status-error, #DC2626)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.05em',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--chakra-colors-status-error, #DC2626)',
                display: 'inline-block',
                animation: 'medixPulse 1.5s ease-in-out infinite',
              }}
            />
            LIVE
          </span>
          {duration && (
            <Box
              fontSize="sm"
              fontFamily="var(--font-mono, monospace)"
              fontWeight="600"
              color={isDarkVariant ? 'rgba(255,255,255,0.8)' : 'text.heading'}
              style={{ letterSpacing: '0.05em' }}
            >
              {duration}
            </Box>
          )}
        </Box>
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap="2">
        {onToggleMute && (
          <ControlButton
            onClick={handleToggleMute}
            ariaLabel={localMuted ? 'Unmute microphone' : 'Mute microphone'}
            active={localMuted}
          >
            <MicIcon muted={localMuted} />
          </ControlButton>
        )}

        {onToggleCamera && (
          <ControlButton
            onClick={handleToggleCamera}
            ariaLabel={localCameraOff ? 'Turn camera on' : 'Turn camera off'}
            active={localCameraOff}
          >
            <VideoIcon off={localCameraOff} />
          </ControlButton>
        )}

        {onShareScreen && (
          <ControlButton
            onClick={onShareScreen}
            ariaLabel={isSharingScreen ? 'Stop sharing screen' : 'Share screen'}
            active={isSharingScreen}
          >
            <ScreenShareIcon active={isSharingScreen} />
          </ControlButton>
        )}

        {onEndCall && (
          <ControlButton onClick={onEndCall} ariaLabel="End call" isEndCall>
            <PhoneOffIcon />
          </ControlButton>
        )}
      </Box>
    </Box>
  );
}
