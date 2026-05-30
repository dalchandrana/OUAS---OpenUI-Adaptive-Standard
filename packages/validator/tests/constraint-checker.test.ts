/**
 * Test: Constraint Checker
 *
 * Tests for Steps 5-6 of the validation pipeline:
 *   - Required field visibility
 *   - min_fields_visible constraint
 *   - required_fields_always_visible constraint
 *   - Global max_components_per_layout
 */

import { describe, it, expect } from 'vitest';
import { checkConstraints } from '../src/constraint-checker.js';
import type { LayoutConfig, Manifest } from '../src/types.js';

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
      variants: ['compact', 'comfortable'],
      constraints: {
        min_fields_visible: 2,
        required_fields_always_visible: ['sender'],
      },
    },
  ],
  data_sources: [{ id: 'emails', description: 'Emails' }],
  constraints: {
    max_components_per_layout: 5,
  },
};

function makeConfig(regions: LayoutConfig['layout']['regions']): LayoutConfig {
  return {
    ouas_version: '1.0',
    config_id: 'cfg_test_v1',
    app_id: 'com.example.mailflow',
    user_id: 'user_test_001',
    manifest_version: '1.0.0',
    created_by_agent: 'test-agent',
    created_at: '2025-01-01T00:00:00Z',
    description: 'Test config',
    layout: { type: 'single-column', regions },
  };
}

describe('Constraint Checker', () => {
  describe('Step 5: Required field check', () => {
    it('passes when required fields are in visible_fields', () => {
      const config = makeConfig([
        { id: 'r1', component: 'email-row', visible_fields: ['sender', 'subject'] },
      ]);
      const result = checkConstraints(config, testManifest);
      expect(result.valid).toBe(true);
    });

    it('fails when required field is missing from visible_fields', () => {
      const config = makeConfig([
        { id: 'r1', component: 'email-row', visible_fields: ['subject', 'preview'] },
      ]);
      const result = checkConstraints(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.code).toBe('REQUIRED_FIELD_HIDDEN');
      expect(result.errors[0]!.field).toBe('sender');
    });
  });

  describe('Step 6: min_fields_visible constraint', () => {
    it('passes when visible_fields meets minimum', () => {
      const config = makeConfig([
        { id: 'r1', component: 'email-row', visible_fields: ['sender', 'subject'] },
      ]);
      const result = checkConstraints(config, testManifest);
      expect(result.valid).toBe(true);
    });

    it('fails when visible_fields below minimum', () => {
      const config = makeConfig([{ id: 'r1', component: 'email-row', visible_fields: ['sender'] }]);
      const result = checkConstraints(config, testManifest);
      expect(result.valid).toBe(false);
      const constraintError = result.errors.find((e) => e.code === 'CONSTRAINT_VIOLATION');
      expect(constraintError).toBeDefined();
      expect(constraintError!.message).toContain('min_fields_visible');
    });
  });

  describe('Step 6: required_fields_always_visible constraint', () => {
    it('fails when required_fields_always_visible field is missing', () => {
      const config = makeConfig([
        { id: 'r1', component: 'email-row', visible_fields: ['subject', 'preview'] },
      ]);
      const result = checkConstraints(config, testManifest);
      // Should have both REQUIRED_FIELD_HIDDEN and CONSTRAINT_VIOLATION
      const constraintErrors = result.errors.filter((e) => e.code === 'CONSTRAINT_VIOLATION');
      expect(constraintErrors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Global constraints', () => {
    it('passes when region count is within limit', () => {
      const config = makeConfig([
        { id: 'r1', component: 'email-row', visible_fields: ['sender', 'subject'] },
      ]);
      const result = checkConstraints(config, testManifest);
      expect(result.valid).toBe(true);
    });

    it('fails when region count exceeds max_components_per_layout', () => {
      const regions = Array.from({ length: 6 }, (_, i) => ({
        id: `r${i}`,
        component: 'email-row',
        visible_fields: ['sender', 'subject'],
      }));
      const config = makeConfig(regions);
      const result = checkConstraints(config, testManifest);
      expect(result.valid).toBe(false);
      expect(result.errors[0]!.message).toContain('max_components_per_layout');
    });
  });

  describe('Skips missing components', () => {
    it('does not crash on regions with nonexistent components', () => {
      const config = makeConfig([
        { id: 'r1', component: 'nonexistent', visible_fields: ['anything'] },
      ]);
      const result = checkConstraints(config, testManifest);
      // Should not produce constraint errors for unknown components
      // (component existence is checked in Step 3)
      expect(result.errors.filter((e) => e.code === 'CONSTRAINT_VIOLATION')).toHaveLength(0);
    });
  });
});
