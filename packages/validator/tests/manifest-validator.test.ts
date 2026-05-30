/**
 * Test: Manifest Validator
 *
 * Tests for Steps 2-4 of the validation pipeline:
 *   - App ID match check
 *   - Component existence check (with suggestions)
 *   - Field existence check (with suggestions)
 *   - Variant check
 *   - Slot check
 */

import { describe, it, expect } from 'vitest';
import { validateAgainstManifest } from '../src/manifest-validator.js';
import type { LayoutConfig, Manifest } from '../src/types.js';

// ─── Test Fixtures ───────────────────────────────────────────────────────────

const testManifest: Manifest = {
  ouas_version: '1.0',
  app_id: 'com.example.mailflow',
  app_name: 'MailFlow',
  generated_at: '2025-01-01T00:00:00Z',
  manifest_version: '1.0.0',
  components: [
    {
      id: 'email-row',
      display_name: 'Email Row',
      description: 'A single email item in a list showing sender and subject',
      category: 'list-item',
      data_source: 'emails',
      fields: {
        sender: { type: 'string', required: true, label: 'Sender name' },
        subject: { type: 'string', required: false, label: 'Subject' },
        preview: { type: 'string', required: false, label: 'Preview' },
        priority: {
          type: 'enum',
          required: false,
          label: 'Priority',
          values: ['high', 'normal', 'low'],
        },
      },
      slots: ['leading', 'trailing', 'actions'],
      variants: ['compact', 'comfortable', 'detailed'],
      constraints: { min_fields_visible: 1, required_fields_always_visible: ['sender'] },
    },
    {
      id: 'compose-button',
      display_name: 'Compose Button',
      description: 'A button that opens the email compose form',
      category: 'action',
      data_source: 'emails',
      fields: {
        label: { type: 'string', required: true, label: 'Button label' },
      },
      variants: ['floating', 'inline'],
    },
  ],
  data_sources: [
    {
      id: 'emails',
      description: 'User email messages',
      fields: ['sender', 'subject', 'preview', 'priority'],
    },
  ],
};

function makeConfig(overrides: Partial<LayoutConfig> = {}): LayoutConfig {
  return {
    ouas_version: '1.0',
    config_id: 'cfg_test_v1',
    app_id: 'com.example.mailflow',
    user_id: 'user_test_001',
    manifest_version: '1.0.0',
    created_by_agent: 'test-agent',
    created_at: '2025-01-01T00:00:00Z',
    description: 'Test config',
    layout: {
      type: 'single-column',
      regions: [
        {
          id: 'main-list',
          component: 'email-row',
          variant: 'compact',
          visible_fields: ['sender', 'subject'],
        },
      ],
    },
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Manifest Validator', () => {
  describe('Step 2: App match check', () => {
    it('passes when app_id matches', () => {
      const result = validateAgainstManifest(makeConfig(), testManifest);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails when app_id does not match', () => {
      const config = makeConfig({ app_id: 'com.other.app' });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.code).toBe('APP_ID_MISMATCH');
      expect(result.errors[0]!.message).toContain('com.other.app');
      expect(result.errors[0]!.message).toContain('com.example.mailflow');
    });
  });

  describe('Step 3: Component existence check', () => {
    it('passes when all components exist', () => {
      const result = validateAgainstManifest(makeConfig(), testManifest);
      expect(result.valid).toBe(true);
    });

    it('fails when component does not exist', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [{ id: 'r1', component: 'nonexistent-widget', visible_fields: ['sender'] }],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.code).toBe('COMPONENT_NOT_FOUND');
      expect(result.errors[0]!.available_values).toContain('email-row');
      expect(result.errors[0]!.available_values).toContain('compose-button');
    });

    it('suggests close matches for misspelled components', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [{ id: 'r1', component: 'email-rows', visible_fields: ['sender'] }],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.errors[0]!.suggestion).toContain('email-row');
    });

    it('fails when variant does not exist', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [
            {
              id: 'r1',
              component: 'email-row',
              variant: 'extra-large',
              visible_fields: ['sender'],
            },
          ],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.code).toBe('VARIANT_NOT_FOUND');
      expect(result.errors[0]!.available_values).toContain('compact');
    });

    it('fails when slot does not exist', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [
            {
              id: 'r1',
              component: 'email-row',
              visible_fields: ['sender'],
              slots: { nonexistent: 'compose-button' },
            },
          ],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.code).toBe('SLOT_NOT_FOUND');
    });
  });

  describe('Step 4: Field existence check', () => {
    it('passes when all fields exist', () => {
      const result = validateAgainstManifest(makeConfig(), testManifest);
      expect(result.valid).toBe(true);
    });

    it('fails when field does not exist', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [
            {
              id: 'r1',
              component: 'email-row',
              visible_fields: ['sender', 'urgency_score'],
            },
          ],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.code).toBe('FIELD_NOT_FOUND');
      expect(result.errors[0]!.field).toBe('urgency_score');
      expect(result.errors[0]!.message).toContain('urgency_score');
      expect(result.errors[0]!.available_values).toContain('sender');
      expect(result.errors[0]!.available_values).toContain('priority');
    });

    it('suggests close matches for misspelled fields', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [{ id: 'r1', component: 'email-row', visible_fields: ['sender', 'priorit'] }],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.errors[0]!.suggestion).toContain('priority');
    });

    it('checks hidden_fields for existence too', () => {
      const config = makeConfig({
        layout: {
          type: 'single-column',
          regions: [
            {
              id: 'r1',
              component: 'email-row',
              visible_fields: ['sender'],
              hidden_fields: ['nonexistent_field'],
            },
          ],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.code).toBe('FIELD_NOT_FOUND');
    });
  });

  describe('Multiple errors collected', () => {
    it('collects all errors in a single pass', () => {
      const config = makeConfig({
        app_id: 'com.wrong.app',
        layout: {
          type: 'single-column',
          regions: [
            {
              id: 'r1',
              component: 'nonexistent',
              visible_fields: ['fake_field'],
            },
            {
              id: 'r2',
              component: 'email-row',
              visible_fields: ['sender', 'does_not_exist'],
            },
          ],
        },
      });
      const result = validateAgainstManifest(config, testManifest);
      expect(result.valid).toBe(false);
      // Should have: APP_ID_MISMATCH + COMPONENT_NOT_FOUND + FIELD_NOT_FOUND
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});
