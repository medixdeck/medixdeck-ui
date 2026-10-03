import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getEffectiveTextareaStorageKey,
  clearTextareaDraft,
  getTextareaDraft,
  saveTextareaDraft,
  TEXTAREA_DRAFT_PREFIX,
  TextareaDraftPayload,
} from './Textarea';

describe('Textarea localStorage draft utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getEffectiveTextareaStorageKey', () => {
    it('prioritizes explicit storageKey', () => {
      expect(
        getEffectiveTextareaStorageKey(
          'custom_textarea_key',
          'some-id',
          'some-name',
          'Describe symptoms…',
        ),
      ).toBe('custom_textarea_key');
    });

    it('falls back to id when storageKey is missing', () => {
      expect(
        getEffectiveTextareaStorageKey(undefined, 'patient-symptoms-id', 'symptoms', 'Placeholder'),
      ).toBe('id_patient-symptoms-id');
    });

    it('falls back to name when storageKey and id are missing', () => {
      expect(
        getEffectiveTextareaStorageKey(undefined, undefined, 'consultation_notes', 'Placeholder'),
      ).toBe('name_consultation_notes');
    });

    it('falls back to slugified placeholder when other keys are missing', () => {
      expect(
        getEffectiveTextareaStorageKey(
          undefined,
          undefined,
          undefined,
          'Describe your symptoms in detail…',
        ),
      ).toBe('ph_describe_your_symptoms_in_detail');
    });

    it('falls back to "default" when no identifiers are provided', () => {
      expect(getEffectiveTextareaStorageKey(undefined, undefined, undefined, undefined)).toBe(
        'default',
      );
    });
  });

  describe('saveTextareaDraft & getTextareaDraft', () => {
    it('saves and retrieves draft from localStorage correctly', () => {
      const payload: TextareaDraftPayload = {
        content: 'Patient reported recurring migraines for the past 3 days.',
        updatedAt: Date.now(),
        version: 1,
      };

      saveTextareaDraft('textarea_consult_1', payload);

      const retrieved = getTextareaDraft('textarea_consult_1');
      expect(retrieved).not.toBeNull();
      expect(retrieved?.content).toBe(payload.content);
    });

    it('returns null for non-existent draft', () => {
      expect(getTextareaDraft('non_existent_key')).toBeNull();
    });

    it('returns null and purges draft when it exceeds maxAgeMs', () => {
      const oldTime = Date.now() - 1000 * 60 * 60 * 24 * 10; // 10 days ago
      const payload: TextareaDraftPayload = {
        content: 'Outdated notes',
        updatedAt: oldTime,
        version: 1,
      };

      saveTextareaDraft('stale_textarea_draft', payload);

      const maxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days
      const retrieved = getTextareaDraft('stale_textarea_draft', maxAgeMs);
      expect(retrieved).toBeNull();

      // Check that it was purged from localStorage
      expect(
        window.localStorage.getItem(`${TEXTAREA_DRAFT_PREFIX}stale_textarea_draft`),
      ).toBeNull();
    });
  });

  describe('clearTextareaDraft', () => {
    it('removes draft from localStorage', () => {
      const payload: TextareaDraftPayload = {
        content: 'Draft content to be removed upon form submit',
        updatedAt: Date.now(),
        version: 1,
      };

      saveTextareaDraft('draft_to_clear', payload);
      expect(getTextareaDraft('draft_to_clear')).not.toBeNull();

      clearTextareaDraft('draft_to_clear');
      expect(getTextareaDraft('draft_to_clear')).toBeNull();
    });
  });
});
