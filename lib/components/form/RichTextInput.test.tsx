import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getEffectiveStorageKey,
  clearRichTextDraft,
  getRichTextDraft,
  saveRichTextDraft,
  DRAFT_STORAGE_PREFIX,
  RichTextDraftPayload,
} from './RichTextInput';

describe('RichTextInput localStorage draft utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getEffectiveStorageKey', () => {
    it('prioritizes explicit storageKey', () => {
      expect(getEffectiveStorageKey('custom_key', 'some-id', 'some-name', 'Some Label')).toBe(
        'custom_key',
      );
    });

    it('falls back to id when storageKey is missing', () => {
      expect(getEffectiveStorageKey(undefined, 'patient-notes-id', 'patient_name', 'Label')).toBe(
        'id_patient-notes-id',
      );
    });

    it('falls back to name when storageKey and id are missing', () => {
      expect(getEffectiveStorageKey(undefined, undefined, 'clinical_summary', 'Label')).toBe(
        'name_clinical_summary',
      );
    });

    it('falls back to slugified label when other keys are missing', () => {
      expect(getEffectiveStorageKey(undefined, undefined, undefined, 'Doctor Notes (Private)')).toBe(
        'label_doctor_notes_private',
      );
    });

    it('falls back to "default" when no identifiers are provided', () => {
      expect(getEffectiveStorageKey(undefined, undefined, undefined, undefined)).toBe('default');
    });
  });

  describe('saveRichTextDraft & getRichTextDraft', () => {
    it('saves and retrieves draft from localStorage correctly', () => {
      const payload: RichTextDraftPayload = {
        content: '<p>Patient had headache and mild fever.</p>',
        mode: 'wysiwyg',
        format: 'html',
        updatedAt: Date.now(),
        version: 1,
      };

      saveRichTextDraft('consultation_1', payload);

      const retrieved = getRichTextDraft('consultation_1');
      expect(retrieved).not.toBeNull();
      expect(retrieved?.content).toBe(payload.content);
      expect(retrieved?.mode).toBe('wysiwyg');
      expect(retrieved?.format).toBe('html');
    });

    it('handles markdown mode drafts', () => {
      const payload: RichTextDraftPayload = {
        content: '# Patient Diagnosis\n\n- Blood pressure normal',
        mode: 'markdown',
        format: 'markdown',
        updatedAt: Date.now(),
        version: 1,
      };

      saveRichTextDraft('consultation_md', payload);

      const retrieved = getRichTextDraft('consultation_md');
      expect(retrieved?.content).toBe(payload.content);
      expect(retrieved?.mode).toBe('markdown');
    });

    it('returns null for non-existent draft', () => {
      expect(getRichTextDraft('non_existent_key')).toBeNull();
    });

    it('returns null and removes draft when it exceeds maxAgeMs', () => {
      const oldTime = Date.now() - 1000 * 60 * 60 * 24 * 10; // 10 days ago
      const payload: RichTextDraftPayload = {
        content: '<p>Old draft</p>',
        mode: 'wysiwyg',
        format: 'html',
        updatedAt: oldTime,
        version: 1,
      };

      saveRichTextDraft('stale_draft', payload);

      const maxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days
      const retrieved = getRichTextDraft('stale_draft', maxAgeMs);
      expect(retrieved).toBeNull();

      // Check that it was purged from localStorage
      expect(window.localStorage.getItem(`${DRAFT_STORAGE_PREFIX}stale_draft`)).toBeNull();
    });
  });

  describe('clearRichTextDraft', () => {
    it('removes draft from localStorage', () => {
      const payload: RichTextDraftPayload = {
        content: '<p>Content to clear</p>',
        mode: 'wysiwyg',
        format: 'html',
        updatedAt: Date.now(),
        version: 1,
      };

      saveRichTextDraft('note_to_clear', payload);
      expect(getRichTextDraft('note_to_clear')).not.toBeNull();

      clearRichTextDraft('note_to_clear');
      expect(getRichTextDraft('note_to_clear')).toBeNull();
    });
  });
});
