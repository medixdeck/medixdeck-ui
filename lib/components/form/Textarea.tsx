import React from 'react';
import {
  Textarea as ChakraTextarea,
  type TextareaProps as ChakraTextareaProps,
  Box,
  Text,
} from '@chakra-ui/react';

export interface TextareaDraftPayload {
  /** The saved textarea content */
  content: string;
  /** Timestamp when draft was last written to localStorage (milliseconds) */
  updatedAt: number;
  /** Schema version */
  version: 1;
}

export const TEXTAREA_DRAFT_PREFIX = 'medix_textarea_draft_';

/**
 * Returns the effective localStorage key for a Textarea instance.
 */
export function getEffectiveTextareaStorageKey(
  storageKey?: string,
  id?: string,
  name?: string,
  placeholder?: string,
): string {
  if (storageKey) return storageKey;
  if (id) return `id_${id}`;
  if (name) return `name_${name}`;
  if (placeholder) {
    const slug = placeholder
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (slug) return `ph_${slug}`;
  }
  return 'default';
}

/**
 * Safely removes a saved draft from localStorage.
 */
export function clearTextareaDraft(storageKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    const fullKey = storageKey.startsWith(TEXTAREA_DRAFT_PREFIX)
      ? storageKey
      : `${TEXTAREA_DRAFT_PREFIX}${storageKey}`;
    window.localStorage.removeItem(fullKey);
  } catch {
    // Ignore localStorage exceptions (e.g. private browsing or quota limits)
  }
}

/**
 * Safely retrieves a saved draft from localStorage.
 */
export function getTextareaDraft(
  storageKey: string,
  maxAgeMs?: number,
): TextareaDraftPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const fullKey = storageKey.startsWith(TEXTAREA_DRAFT_PREFIX)
      ? storageKey
      : `${TEXTAREA_DRAFT_PREFIX}${storageKey}`;
    const raw = window.localStorage.getItem(fullKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TextareaDraftPayload;
    if (!parsed || typeof parsed.content !== 'string') return null;
    if (maxAgeMs && maxAgeMs > 0 && parsed.updatedAt) {
      if (Date.now() - parsed.updatedAt > maxAgeMs) {
        window.localStorage.removeItem(fullKey);
        return null;
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Safely writes a draft to localStorage.
 */
export function saveTextareaDraft(storageKey: string, payload: TextareaDraftPayload): void {
  if (typeof window === 'undefined') return;
  try {
    const fullKey = storageKey.startsWith(TEXTAREA_DRAFT_PREFIX)
      ? storageKey
      : `${TEXTAREA_DRAFT_PREFIX}${storageKey}`;
    window.localStorage.setItem(fullKey, JSON.stringify(payload));
  } catch {
    // Ignore localStorage exceptions (e.g. QuotaExceededError)
  }
}

export interface TextareaProps extends ChakraTextareaProps {
  /** Brand color scheme ('blue' | 'purple') */
  colorScheme?: 'blue' | 'purple';
  /** Error state */
  isInvalid?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Show character count */
  maxLength?: number;
  /** Show remaining character count */
  showCount?: boolean;
  /**
   * Unique storage key for persisting drafts to localStorage.
   * If omitted, falls back to `id`, `name`, or slugified `placeholder`.
   */
  storageKey?: string;
  /**
   * Automatically save typed content to localStorage to prevent data loss on page refresh.
   * Defaults to `true`. Set to `false` to disable.
   */
  persistDraft?: boolean;
  /**
   * Milliseconds of typing inactivity before writing draft to localStorage.
   * @default 400
   */
  debounceMs?: number;
  /**
   * Maximum age of a saved draft in ms before it is considered expired.
   * @default 604800000 (7 days)
   */
  draftMaxAgeMs?: number;
  /**
   * Display a subtle "Saving draft..." / "Draft saved" status in the footer.
   * @default false
   */
  showDraftStatus?: boolean;
  /**
   * Callback invoked when a saved draft is restored from localStorage on mount.
   */
  onDraftRestored?: (draft: TextareaDraftPayload) => void;
}

/**
 * MedixDeck Textarea
 *
 * Multi-line text input for notes, messages, and descriptions with automatic
 * localStorage draft persistence to prevent data loss on page refresh.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Describe your symptoms…" rows={4} maxLength={500} showCount />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      colorScheme = 'blue',
      isInvalid,
      errorMessage,
      maxLength,
      showCount = false,
      onChange,
      value,
      defaultValue,
      storageKey,
      persistDraft = true,
      debounceMs = 400,
      draftMaxAgeMs = 7 * 24 * 60 * 60 * 1000,
      showDraftStatus = false,
      onDraftRestored,
      id,
      name,
      placeholder,
      disabled = false,
      readOnly = false,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState<string>(() => {
      if (isControlled && typeof value === 'string') return value;
      if (typeof defaultValue === 'string') return defaultValue;
      return '';
    });

    const currentValue = isControlled ? (typeof value === 'string' ? value : '') : innerValue;
    const [charCount, setCharCount] = React.useState(currentValue.length);
    const [draftStatus, setDraftStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');

    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

    // Resolve storage key for draft persistence
    const resolvedKey = React.useMemo(
      () => getEffectiveTextareaStorageKey(storageKey, id, name, placeholder),
      [storageKey, id, name, placeholder],
    );

    const pendingDraftRef = React.useRef<string | null>(null);
    const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasRestoredRef = React.useRef(false);

    // Debounced auto-save function
    const scheduleSaveDraft = React.useCallback(
      (text: string) => {
        if (!persistDraft || disabled || readOnly) return;

        const isBlank = !text || text.trim() === '';
        if (isBlank) {
          if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
          }
          pendingDraftRef.current = null;
          clearTextareaDraft(resolvedKey);
          setDraftStatus('idle');
          return;
        }

        pendingDraftRef.current = text;
        setDraftStatus('saving');

        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(() => {
          if (pendingDraftRef.current !== null) {
            saveTextareaDraft(resolvedKey, {
              content: pendingDraftRef.current,
              updatedAt: Date.now(),
              version: 1,
            });
            pendingDraftRef.current = null;
            setDraftStatus('saved');
          }
        }, debounceMs);
      },
      [persistDraft, disabled, readOnly, resolvedKey, debounceMs],
    );

    // Flush pending draft immediately on page refresh, navigation, or component unmount
    React.useEffect(() => {
      if (!persistDraft) return;

      const flushDraft = () => {
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
          saveTimerRef.current = null;
        }
        if (pendingDraftRef.current !== null) {
          saveTextareaDraft(resolvedKey, {
            content: pendingDraftRef.current,
            updatedAt: Date.now(),
            version: 1,
          });
          pendingDraftRef.current = null;
          setDraftStatus('saved');
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', flushDraft);
        window.addEventListener('pagehide', flushDraft);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('beforeunload', flushDraft);
          window.removeEventListener('pagehide', flushDraft);
        }
        flushDraft();
      };
    }, [persistDraft, resolvedKey]);

    // Restore saved draft on mount (client-safe)
    React.useEffect(() => {
      if (hasRestoredRef.current || !persistDraft || disabled || readOnly) return;
      hasRestoredRef.current = true;

      const draft = getTextareaDraft(resolvedKey, draftMaxAgeMs);
      if (!draft || !draft.content || draft.content.trim() === '') {
        return;
      }

      // If controlled with non-empty external value, skip if value already matches draft
      if (isControlled && typeof value === 'string' && value.trim() !== '') {
        if (value === draft.content) return;
      }

      if (!isControlled) {
        setInnerValue(draft.content);
      }
      setCharCount(draft.content.length);

      if (internalRef.current) {
        internalRef.current.value = draft.content;
      }

      if (onChange) {
        const syntheticEvent = {
          target: { value: draft.content, name },
          currentTarget: { value: draft.content, name },
        } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }

      setDraftStatus('saved');
      onDraftRestored?.(draft);
    }, [
      persistDraft,
      disabled,
      readOnly,
      resolvedKey,
      draftMaxAgeMs,
      isControlled,
      value,
      name,
      onChange,
      onDraftRestored,
    ]);

    // Synchronize controlled value changes
    React.useEffect(() => {
      if (isControlled && typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [isControlled, value]);

    const focusBorder = colorScheme === 'purple' ? 'purple.500' : 'blue.500';

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      if (!isControlled) {
        setInnerValue(newText);
      }
      setCharCount(newText.length);
      onChange?.(e);
      scheduleSaveDraft(newText);
    };

    return (
      <Box w="100%">
        <ChakraTextarea
          ref={internalRef}
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          bg="bg.surface"
          border="1px solid"
          borderColor={isInvalid ? 'red.500' : 'border'}
          borderRadius="md"
          color="text.heading"
          fontFamily="var(--font-body)"
          fontSize="md"
          px="4"
          py="3"
          resize="vertical"
          maxLength={maxLength}
          value={isControlled ? value : innerValue}
          onChange={handleChange}
          _placeholder={{ color: 'text.muted' }}
          _focus={{
            borderColor: isInvalid ? 'red.500' : focusBorder,
            boxShadow: 'none',
            outline: 'none',
          }}
          _dark={{
            bg: 'bg.surface',
            borderColor: isInvalid ? 'red.500' : 'border',
            color: 'text.heading',
            _placeholder: { color: 'text.muted' },
          }}
          {...props}
        />
        <Box display="flex" justifyContent="space-between" mt="1">
          {isInvalid && errorMessage ? (
            <Text fontSize="xs" color="red.500" fontFamily="var(--font-body)">
              {errorMessage}
            </Text>
          ) : showDraftStatus && draftStatus !== 'idle' ? (
            <Box display="inline-flex" alignItems="center" gap="1.5">
              <Box
                w="1.5"
                h="1.5"
                borderRadius="full"
                bg={draftStatus === 'saving' ? 'orange.400' : 'green.500'}
              />
              <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
                {draftStatus === 'saving' ? 'Saving draft...' : 'Draft saved'}
              </Text>
            </Box>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              {charCount}/{maxLength}
            </Text>
          )}
        </Box>
      </Box>
    );
  },
);

Textarea.displayName = 'MedixTextarea';

