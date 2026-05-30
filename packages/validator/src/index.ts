/**
 * @ouas/validator
 *
 * OUAS Layout Config validation engine.
 * Implements the full 7-step validation pipeline plus config migration.
 *
 * Usage:
 *   import { validate, validateFull, migrateConfig, needsMigration } from '@ouas/validator';
 *
 *   const result = validate(layoutConfig, manifest);
 *   if (!result.valid) {
 *     console.error(result.errors); // Agent-readable error messages
 *   }
 */

export { validateLayoutConfigSchema, validateManifestSchema } from './schema-validator.js';
export { validateAgainstManifest } from './manifest-validator.js';
export { checkConstraints } from './constraint-checker.js';
export { migrateConfig, needsMigration } from './config-migrator.js';
export { ErrorCodes, findClosestMatch } from './error-codes.js';

// Re-export all types
export type {
  Manifest,
  LayoutConfig,
  ComponentDefinition,
  FieldDefinition,
  DataSource,
  Region,
  Layout,
  Theme,
  SortInstruction,
  FilterInstruction,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  MigrationResult,
  MigrationWarning,
  ValidationErrorCode,
  ComponentCategory,
  OUASFieldType,
  LayoutType,
  ThemeDensity,
  RegionPosition,
  FilterOperator,
  MigrationWarningType,
  ComponentConstraints,
  GlobalConstraints,
} from './types.js';

import type { LayoutConfig, Manifest, ValidationResult, ValidationError } from './types.js';
import { validateLayoutConfigSchema, checkConfigSizeLimits } from './schema-validator.js';
import { validateAgainstManifest } from './manifest-validator.js';
import { checkConstraints, checkAgentScope } from './constraint-checker.js';
import { migrateConfig, needsMigration } from './config-migrator.js';
import { ErrorCodes } from './error-codes.js';

/**
 * Runs the full 7-step OUAS validation pipeline on a Layout Config.
 *
 * Steps:
 *   1. Schema check (JSON Schema validation)
 *   2. App match check (config.app_id vs manifest.app_id)
 *   3. Component existence check
 *   4. Field existence check
 *   5. Required field check
 *   6. Constraint check
 *   7. Data source check
 *
 * Also checks for manifest_version mismatch and runs migration if needed.
 *
 * @param config - The raw Layout Config (will be schema-validated first)
 * @param manifest - The app's Component Manifest
 * @returns ValidationResult with all errors and warnings collected
 */
export function validate(config: unknown, manifest: Manifest): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationResult['warnings'] = [];

  // Step 1: Schema check
  const schemaResult = validateLayoutConfigSchema(config);
  if (!schemaResult.valid) {
    return schemaResult; // Structural errors — can't proceed
  }

  const typedConfig = config as LayoutConfig;

  // Check for manifest version mismatch
  let migrationResult: ReturnType<typeof migrateConfig> | undefined;
  if (needsMigration(typedConfig, manifest)) {
    migrationResult = migrateConfig(typedConfig, manifest);

    if (migrationResult.unrecoverable) {
      return {
        valid: false,
        errors: [
          {
            code: 'CONFIG_UNRECOVERABLE',
            message: `Config migration failed: more than 50% of regions reference components that no longer exist. The config cannot be recovered. Falling back to default layout.`,
          },
        ],
        warnings: [],
        migration_applied: true,
        migration_warnings: migrationResult.warnings,
      };
    }
  }

  const configToValidate = migrationResult?.migrated ? migrationResult.config : typedConfig;

  // Steps 2-4 + 7: Manifest validation
  const manifestResult = validateAgainstManifest(configToValidate, manifest);
  allErrors.push(...manifestResult.errors);

  // Steps 5-6: Constraint checks
  const constraintResult = checkConstraints(configToValidate, manifest);
  allErrors.push(...constraintResult.errors);

  // Agent Scope Check
  const scopeErrors = checkAgentScope(configToValidate, manifest);
  allErrors.push(...scopeErrors);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    migration_applied: migrationResult?.migrated ?? false,
    migration_warnings: migrationResult?.warnings,
  };
}

/**
 * Validates a Layout Config from a raw JSON string.
 * This runs Step 0 (Size limits) before Steps 1-7.
 */
export function validateLayoutConfig(rawConfigJson: string, manifest: Manifest): ValidationResult {
  const limitErrors = checkConfigSizeLimits(rawConfigJson);
  if (limitErrors.length > 0) {
    return { valid: false, errors: limitErrors, warnings: [] };
  }

  let config: unknown;
  try {
    config = JSON.parse(rawConfigJson);
  } catch {
    return { 
      valid: false, 
      errors: [{ code: ErrorCodes.SCHEMA_INVALID, message: 'Config is not valid JSON.' }], 
      warnings: [] 
    };
  }

  return validate(config, manifest);
}
