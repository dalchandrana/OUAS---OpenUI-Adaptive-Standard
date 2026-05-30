/**
 * OUAS Config Migrator
 *
 * Handles Layout Config migration when manifest_version mismatches.
 * Runs automatically when the renderer detects a version mismatch between
 * the saved config's manifest_version and the current manifest's version.
 *
 * Migration logic:
 * 1. Load the saved config and the current manifest.
 * 2. For each component ID in the config, check if it exists in the current manifest.
 * 3. If not found, check component_aliases map for renamed IDs.
 * 4. If an alias exists, rewrite the config with the new ID and log the migration.
 * 5. If no alias exists, remove that region and add to migration_warnings[].
 * 6. If more than 50% of regions were removed, config is unrecoverable → fall back to default.
 * 7. Save the migrated config with the updated manifest_version.
 */

import type { LayoutConfig, Manifest, MigrationResult, MigrationWarning, Region } from './types.js';

/**
 * Checks if a config needs migration by comparing manifest versions.
 *
 * @param config - The saved Layout Config
 * @param manifest - The current Manifest
 * @returns true if migration is needed
 */
export function needsMigration(config: LayoutConfig, manifest: Manifest): boolean {
  if (!manifest.manifest_version) return false;
  return config.manifest_version !== manifest.manifest_version;
}

/**
 * Migrates a Layout Config to be compatible with the current manifest version.
 *
 * @param config - The saved Layout Config (possibly outdated)
 * @param manifest - The current Manifest
 * @returns MigrationResult with the migrated config, warnings, and whether it's unrecoverable
 */
export function migrateConfig(config: LayoutConfig, manifest: Manifest): MigrationResult {
  // If no migration needed, return as-is
  if (!needsMigration(config, manifest)) {
    return {
      migrated: false,
      config,
      warnings: [],
      unrecoverable: false,
    };
  }

  const componentMap = new Map(manifest.components.map((c) => [c.id, c]));
  const aliases = manifest.component_aliases ?? {};
  const warnings: MigrationWarning[] = [];
  const migratedRegions: Region[] = [];
  const originalRegionCount = config.layout.regions.length;
  let removedCount = 0;

  for (const region of config.layout.regions) {
    // Step 2: Check if component exists in current manifest
    if (componentMap.has(region.component)) {
      // Component exists — keep the region, but validate fields
      const migratedRegion = migrateRegionFields(region, manifest, warnings);
      migratedRegions.push(migratedRegion);
      continue;
    }

    // Step 3: Check component_aliases for renamed IDs
    const newId = aliases[region.component];
    if (newId && componentMap.has(newId)) {
      // Step 4: Alias found — rewrite component ID
      warnings.push({
        type: 'component_renamed',
        old_id: region.component,
        new_id: newId,
        message: `Component '${region.component}' has been renamed to '${newId}'. Config updated automatically.`,
      });

      const migratedRegion = migrateRegionFields(
        { ...region, component: newId },
        manifest,
        warnings,
      );
      migratedRegions.push(migratedRegion);
      continue;
    }

    // Step 5: No alias — remove the region
    warnings.push({
      type: 'component_removed',
      old_id: region.component,
      message: `Component '${region.component}' no longer exists in the manifest and has no alias. Region '${region.id}' has been removed from the config.`,
    });
    removedCount++;
  }

  // Step 6: Check if config is unrecoverable (>50% regions removed)
  const removalPercentage = originalRegionCount > 0 ? removedCount / originalRegionCount : 0;
  if (removalPercentage > 0.5) {
    return {
      migrated: true,
      config,
      warnings,
      unrecoverable: true,
    };
  }

  // Step 7: Build the migrated config with updated manifest_version
  const migratedConfig: LayoutConfig = {
    ...config,
    manifest_version: manifest.manifest_version ?? config.manifest_version,
    layout: {
      ...config.layout,
      regions: migratedRegions,
    },
  };

  return {
    migrated: true,
    config: migratedConfig,
    warnings,
    unrecoverable: false,
  };
}

/**
 * Migrates a single region's fields to match the current manifest.
 * Removes any visible_fields or hidden_fields that no longer exist.
 */
function migrateRegionFields(
  region: Region,
  manifest: Manifest,
  warnings: MigrationWarning[],
): Region {
  const component = manifest.components.find((c) => c.id === region.component);
  if (!component) return region;

  const validFieldNames = new Set(Object.keys(component.fields));

  // Filter visible_fields to only valid ones
  const validVisibleFields = region.visible_fields.filter((f) => {
    if (validFieldNames.has(f)) return true;
    warnings.push({
      type: 'field_removed',
      old_id: f,
      message: `Field '${f}' no longer exists in component '${region.component}'. Removed from visible_fields.`,
    });
    return false;
  });

  // Ensure required fields are present
  for (const [fieldName, fieldDef] of Object.entries(component.fields)) {
    if (fieldDef.required && !validVisibleFields.includes(fieldName)) {
      validVisibleFields.push(fieldName);
    }
  }

  // Filter hidden_fields if present
  const validHiddenFields = region.hidden_fields?.filter((f) => validFieldNames.has(f));

  // Filter slots if present
  let validSlots = region.slots;
  if (region.slots && component.slots) {
    const validSlotNames = new Set(component.slots);
    validSlots = Object.fromEntries(
      Object.entries(region.slots).filter(([slotName]) => validSlotNames.has(slotName)),
    );
  }

  // Filter variant
  const validVariant =
    region.variant && component.variants?.includes(region.variant) ? region.variant : undefined;

  return {
    ...region,
    visible_fields: validVisibleFields,
    hidden_fields: validHiddenFields,
    slots: validSlots,
    variant: validVariant,
  };
}
