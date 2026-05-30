/**
 * OUAS Manifest Validator
 *
 * Steps 2-4 of the validation pipeline:
 *   Step 2: App match check (config.app_id vs manifest.app_id)
 *   Step 3: Component existence check
 *   Step 4: Field existence check
 *
 * Also validates variants and slots as part of Step 3.
 */

import type { LayoutConfig, Manifest, ValidationError, ValidationResult } from './types.js';
import {
  ErrorCodes,
  appIdMismatchMessage,
  componentNotFoundMessage,
  fieldNotFoundMessage,
  variantNotFoundMessage,
  findClosestMatch,
} from './error-codes.js';

/**
 * Validates a Layout Config against a Manifest.
 * Runs Steps 2-4 of the 7-step validation pipeline.
 *
 * @param config - The Layout Config to validate
 * @param manifest - The app's Component Manifest
 * @returns ValidationResult with all errors found in Steps 2-4
 */
export function validateAgainstManifest(
  config: LayoutConfig,
  manifest: Manifest,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Step 2: App match check
  if (config.app_id !== manifest.app_id) {
    errors.push({
      code: ErrorCodes.APP_ID_MISMATCH,
      message: appIdMismatchMessage(config.app_id, manifest.app_id),
    });
  }

  // Build component lookup map
  const componentMap = new Map(manifest.components.map((c) => [c.id, c]));
  const componentIds = manifest.components.map((c) => c.id);
  const dataSourceIds = manifest.data_sources.map((ds) => ds.id);

  for (const region of config.layout.regions) {
    const component = componentMap.get(region.component);

    // Step 3: Component existence check
    if (!component) {
      const suggestion = findClosestMatch(region.component, componentIds);
      errors.push({
        code: ErrorCodes.COMPONENT_NOT_FOUND,
        component: region.component,
        region: region.id,
        message: componentNotFoundMessage(region.component, componentIds),
        suggestion: suggestion ? `Did you mean '${suggestion}'?` : undefined,
        available_values: componentIds,
      });
      continue; // Skip field checks if component doesn't exist
    }

    // Step 3 (continued): Variant check
    if (region.variant && component.variants && !component.variants.includes(region.variant)) {
      errors.push({
        code: ErrorCodes.VARIANT_NOT_FOUND,
        component: component.id,
        region: region.id,
        field: region.variant,
        message: variantNotFoundMessage(region.variant, component.id, component.variants),
        suggestion: findClosestMatch(region.variant, component.variants)
          ? `Did you mean '${findClosestMatch(region.variant, component.variants)}'?`
          : undefined,
        available_values: component.variants,
      });
    }

    // Step 3 (continued): Slot check
    if (region.slots && component.slots) {
      for (const slotName of Object.keys(region.slots)) {
        if (!component.slots.includes(slotName)) {
          errors.push({
            code: ErrorCodes.SLOT_NOT_FOUND,
            component: component.id,
            region: region.id,
            field: slotName,
            message: `Slot '${slotName}' does not exist in component '${component.id}'. Available slots: ${component.slots.join(', ')}.`,
            available_values: component.slots,
          });
        }
      }
    }

    // Step 4: Field existence check
    const componentFieldNames = Object.keys(component.fields);
    for (const fieldName of region.visible_fields) {
      if (!(fieldName in component.fields)) {
        const suggestion = findClosestMatch(fieldName, componentFieldNames);
        errors.push({
          code: ErrorCodes.FIELD_NOT_FOUND,
          component: component.id,
          field: fieldName,
          region: region.id,
          message: fieldNotFoundMessage(fieldName, component.id, componentFieldNames),
          suggestion: suggestion ? `Did you mean '${suggestion}'?` : undefined,
          available_values: componentFieldNames,
        });
      }
    }

    // Also check hidden_fields if present
    if (region.hidden_fields) {
      for (const fieldName of region.hidden_fields) {
        if (!(fieldName in component.fields)) {
          const suggestion = findClosestMatch(fieldName, componentFieldNames);
          errors.push({
            code: ErrorCodes.FIELD_NOT_FOUND,
            component: component.id,
            field: fieldName,
            region: region.id,
            message: fieldNotFoundMessage(fieldName, component.id, componentFieldNames),
            suggestion: suggestion ? `Did you mean '${suggestion}'?` : undefined,
            available_values: componentFieldNames,
          });
        }
      }
    }

    // Step 7: Data source check (basic — check source exists)
    if (!dataSourceIds.includes(component.data_source)) {
      errors.push({
        code: ErrorCodes.DATA_SOURCE_INVALID,
        component: component.id,
        region: region.id,
        message: `Data source '${component.data_source}' for component '${component.id}' is not available. Available data sources: ${dataSourceIds.join(', ')}.`,
        available_values: dataSourceIds,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  };
}
