/**
 * Test: Config Migrator
 *
 * Tests for config versioning and migration:
 *   - Config with current manifest version → no migration
 *   - Component renamed with alias → migrated correctly
 *   - Component deleted with no alias → region removed, warning emitted
 *   - >50% regions unresolvable → falls back to default, user notified
 *   - Field migration when fields are removed
 */

import { describe, it, expect } from 'vitest';
import { needsMigration, migrateConfig } from '../src/config-migrator.js';
import type { LayoutConfig, Manifest } from '../src/types.js';

const currentManifest: Manifest = {
  ouas_version: '1.0',
  app_id: 'com.example.mailflow',
  app_name: 'MailFlow',
  generated_at: '2025-06-01T00:00:00Z',
  manifest_version: '2.0.0',
  components: [
    {
      id: 'email-list-item', // Renamed from 'email-row'
      display_name: 'Email List Item',
      description: 'A single email item in a list showing sender and subject',
      category: 'list-item',
      data_source: 'emails',
      fields: {
        sender: { type: 'string', required: true },
        subject: { type: 'string', required: false },
        // 'preview' field removed in v2
        priority: { type: 'enum', required: false, values: ['high', 'normal', 'low'] },
        is_starred: { type: 'boolean', required: false }, // New field in v2
      },
      variants: ['compact', 'detailed'], // 'comfortable' removed in v2
      slots: ['leading', 'trailing'],
    },
    {
      id: 'compose-button',
      display_name: 'Compose Button',
      description: 'A button that opens the email compose form',
      category: 'action',
      data_source: 'emails',
      fields: {
        label: { type: 'string', required: true },
      },
      variants: ['floating', 'inline'],
    },
  ],
  data_sources: [{ id: 'emails', description: 'Emails' }],
  component_aliases: {
    'email-row': 'email-list-item', // Old name → new name
  },
};

function makeOldConfig(regions: LayoutConfig['layout']['regions']): LayoutConfig {
  return {
    ouas_version: '1.0',
    config_id: 'cfg_test_v1',
    app_id: 'com.example.mailflow',
    user_id: 'user_test_001',
    manifest_version: '1.0.0', // Old version
    created_by_agent: 'test-agent',
    created_at: '2025-01-01T00:00:00Z',
    description: 'Test config from v1',
    layout: { type: 'single-column', regions },
  };
}

describe('Config Migrator', () => {
  describe('needsMigration', () => {
    it('returns false when manifest versions match', () => {
      const config = makeOldConfig([]);
      const manifest = { ...currentManifest, manifest_version: '1.0.0' };
      expect(needsMigration(config, manifest)).toBe(false);
    });

    it('returns true when manifest versions differ', () => {
      const config = makeOldConfig([]);
      expect(needsMigration(config, currentManifest)).toBe(true);
    });

    it('returns false when manifest has no version', () => {
      const config = makeOldConfig([]);
      const manifest = { ...currentManifest, manifest_version: undefined };
      expect(needsMigration(config, manifest)).toBe(false);
    });
  });

  describe('migrateConfig', () => {
    it('returns unchanged config when no migration needed', () => {
      const config = makeOldConfig([
        { id: 'r1', component: 'compose-button', visible_fields: ['label'] },
      ]);
      const manifest = { ...currentManifest, manifest_version: '1.0.0' };
      const result = migrateConfig(config, manifest);
      expect(result.migrated).toBe(false);
      expect(result.config).toBe(config);
      expect(result.warnings).toHaveLength(0);
    });

    it('migrates renamed components using aliases', () => {
      const config = makeOldConfig([
        {
          id: 'r1',
          component: 'email-row', // Old name
          visible_fields: ['sender', 'subject'],
        },
      ]);
      const result = migrateConfig(config, currentManifest);
      expect(result.migrated).toBe(true);
      expect(result.unrecoverable).toBe(false);
      expect(result.config.layout.regions[0]!.component).toBe('email-list-item');
      expect(result.warnings.some((w) => w.type === 'component_renamed')).toBe(true);
    });

    it('removes regions with deleted components (no alias)', () => {
      const config = makeOldConfig([
        {
          id: 'r1',
          component: 'deleted-widget', // Doesn't exist, no alias
          visible_fields: ['foo'],
        },
        {
          id: 'r2',
          component: 'compose-button', // Still exists
          visible_fields: ['label'],
        },
      ]);
      const result = migrateConfig(config, currentManifest);
      expect(result.migrated).toBe(true);
      expect(result.unrecoverable).toBe(false);
      expect(result.config.layout.regions).toHaveLength(1);
      expect(result.config.layout.regions[0]!.component).toBe('compose-button');
      expect(result.warnings.some((w) => w.type === 'component_removed')).toBe(true);
    });

    it('marks config as unrecoverable when >50% regions removed', () => {
      const config = makeOldConfig([
        { id: 'r1', component: 'deleted-a', visible_fields: ['foo'] },
        { id: 'r2', component: 'deleted-b', visible_fields: ['foo'] },
        { id: 'r3', component: 'compose-button', visible_fields: ['label'] },
      ]);
      // 2 out of 3 regions deleted = 66% > 50%
      const result = migrateConfig(config, currentManifest);
      expect(result.unrecoverable).toBe(true);
      expect(result.warnings.length).toBeGreaterThanOrEqual(2);
    });

    it('does NOT mark as unrecoverable at exactly 50%', () => {
      const config = makeOldConfig([
        { id: 'r1', component: 'deleted-a', visible_fields: ['foo'] },
        { id: 'r2', component: 'compose-button', visible_fields: ['label'] },
      ]);
      // 1 out of 2 = 50%, which is NOT > 50%
      const result = migrateConfig(config, currentManifest);
      expect(result.unrecoverable).toBe(false);
    });

    it('removes fields that no longer exist in the component', () => {
      const config = makeOldConfig([
        {
          id: 'r1',
          component: 'email-row', // Will be aliased to email-list-item
          visible_fields: ['sender', 'preview'], // 'preview' was removed in v2
        },
      ]);
      const result = migrateConfig(config, currentManifest);
      expect(result.migrated).toBe(true);
      // 'preview' should be removed, 'sender' should remain
      expect(result.config.layout.regions[0]!.visible_fields).toContain('sender');
      expect(result.config.layout.regions[0]!.visible_fields).not.toContain('preview');
      expect(result.warnings.some((w) => w.type === 'field_removed')).toBe(true);
    });

    it('updates manifest_version in the migrated config', () => {
      const config = makeOldConfig([
        { id: 'r1', component: 'compose-button', visible_fields: ['label'] },
      ]);
      const result = migrateConfig(config, currentManifest);
      expect(result.config.manifest_version).toBe('2.0.0');
    });

    it('removes invalid variants after migration', () => {
      const config = makeOldConfig([
        {
          id: 'r1',
          component: 'email-row',
          variant: 'comfortable', // Removed in v2
          visible_fields: ['sender', 'subject'],
        },
      ]);
      const result = migrateConfig(config, currentManifest);
      expect(result.config.layout.regions[0]!.variant).toBeUndefined();
    });

    it('ensures required fields are added after migration removes them', () => {
      const config = makeOldConfig([
        {
          id: 'r1',
          component: 'email-row',
          visible_fields: ['preview'], // Only 'preview' which gets removed; 'sender' is required
        },
      ]);
      const result = migrateConfig(config, currentManifest);
      // 'preview' removed, but 'sender' (required) should be auto-added
      expect(result.config.layout.regions[0]!.visible_fields).toContain('sender');
    });
  });
});
