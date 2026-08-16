'use client';

import React from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';

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
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const MicIcon = ({ muted }: { muted: boolean }) =>
  muted ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

const VideoIcon = ({ off }: { off: boolean }) =>
  off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );

const ScreenShareIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#10B981' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3" />
    <polyline points="8 21 12 17 16 21" />
    <line x1="12" y1="17" x2="12" y2="12" />
    <polyline points="9 10 12 7 15 10" />
  </svg>
);

const PhoneOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.25 8.76 16.57 8.1 15.9M1 1l22 22" />
    <path d="M16.49 16.49A16.42 16.42 0 0 1 3.5 7.51M3.5 7.51A12.84 12.84 0 0 1 2 4.69 2 2 0 0 1 3.72 2.72 12.84 12.84 0 0 1 6.53 3.43a2 2 0 0 1 .45 2.11L5.71 6.81" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MedixDeck TelehealthCallBar
 *
 * Floating control bar for active telehealth video consultations.
 * Displays participant info, call duration, and media control actions.
 *
 * @example
 * ```tsx
 * <TelehealthCallBar
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
  ...props
}: TelehealthCallBarProps) {
  const [localMuted, setLocalMuted] = React.useState(isMuted);
  const [localCameraOff, setLocalCameraOff] = React.useState(isCameraOff);

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
  }) => (
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
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.15s, transform 0.1s',
        background: isEndCall
          ? '#EF4444'
          : active
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.1)',
        color: isEndCall ? 'white' : active ? 'rgba(255,255,255,0.5)' : 'white',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = isEndCall ? '#DC2626' : 'rgba(255,255,255,0.2)';
        el.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = isEndCall
          ? '#EF4444'
          : active
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.1)';
        el.style.transform = 'scale(1)';
      }}
    >
      {children}
    </button>
  );

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
      style={{
        minHeight: 72,
        paddingTop: 12,
        paddingBottom:
          position === 'bottom' ? 'calc(12px + env(safe-area-inset-bottom, 0px))' : 12,
        background: 'linear-gradient(135deg, #0A1220 0%, #0F1C2E 100%)',
        borderTop: position === 'bottom' ? '1px solid rgba(255,255,255,0.08)' : 'none',
        borderBottom: position === 'top' ? '1px solid rgba(255,255,255,0.08)' : 'none',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      {...props}
    >
      {/* Participant info */}
      <Box display="flex" alignItems="center" gap="3">
        {participantAvatar ? (
          <img
            src={participantAvatar}
            alt={participantName}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0685FF, #7700CC)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              fontFamily: 'var(--font-heading)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            {participantName.charAt(0)}
          </div>
        )}
        <Box>
          <Box
            fontSize="sm"
            fontWeight="semibold"
            fontFamily="var(--font-heading)"
            style={{ color: 'white' }}
          >
            {participantName}
          </Box>
          {participantRole && (
            <Box
              fontSize="xs"
              fontFamily="var(--font-body)"
              style={{ color: 'rgba(255,255,255,0.6)' }}
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
              background: 'rgba(239,68,68,0.2)',
              color: '#F87171',
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
                background: '#EF4444',
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
              style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}
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
          <ControlButton
            onClick={onEndCall}
            ariaLabel="End call"
            isEndCall
          >
            <PhoneOffIcon />
          </ControlButton>
        )}
      </Box>
    </Box>
  );
}
