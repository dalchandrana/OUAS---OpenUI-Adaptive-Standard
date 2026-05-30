/**
 * OUAS Constraint Checker
 *
 * Steps 5-6 of the validation pipeline:
 *   Step 5: Required field check — all required fields in visible_fields
 *   Step 6: Constraint check — min_fields_visible, required_fields_always_visible
 */

import type { LayoutConfig, Manifest, ValidationError, ValidationResult } from './types.js';
import {
  ErrorCodes,
  requiredFieldHiddenMessage,
  constraintViolationMessage,
} from './error-codes.js';

/**
 * Checks constraint rules for a Layout Config against a Manifest.
 * Runs Steps 5-6 of the 7-step validation pipeline.
 *
 * @param config - The Layout Config to validate
 * @param manifest - The app's Component Manifest
 * @returns ValidationResult with constraint violation errors
 */
export function checkConstraints(config: LayoutConfig, manifest: Manifest): ValidationResult {
  const errors: ValidationError[] = [];
  const componentMap = new Map(manifest.components.map((c) => [c.id, c]));

  for (const region of config.layout.regions) {
    const component = componentMap.get(region.component);
    if (!component) {
      // Component doesn't exist — this is caught by Step 3, skip constraint checks
      continue;
    }

    // Step 5: Required field check
    // All fields marked as required: true must appear in visible_fields
    for (const [fieldName, fieldDef] of Object.entries(component.fields)) {
      if (fieldDef.required && !region.visible_fields.includes(fieldName)) {
        errors.push({
          code: ErrorCodes.REQUIRED_FIELD_HIDDEN,
          component: component.id,
          field: fieldName,
          region: region.id,
          message: requiredFieldHiddenMessage(fieldName, component.id),
        });
      }
    }

    // Step 6: Component-level constraint checks
    if (component.constraints) {
      // 6a: min_fields_visible
      if (
        component.constraints.min_fields_visible !== undefined &&
        region.visible_fields.length < component.constraints.min_fields_visible
      ) {
        errors.push({
          code: ErrorCodes.CONSTRAINT_VIOLATION,
          component: component.id,
          region: region.id,
          message: constraintViolationMessage(
            component.id,
            'min_fields_visible',
            `at least ${component.constraints.min_fields_visible}`,
            region.visible_fields.length.toString(),
          ),
        });
      }

      // 6b: required_fields_always_visible
      if (component.constraints.required_fields_always_visible) {
        for (const requiredField of component.constraints.required_fields_always_visible) {
          if (!region.visible_fields.includes(requiredField)) {
            errors.push({
              code: ErrorCodes.CONSTRAINT_VIOLATION,
              component: component.id,
              field: requiredField,
              region: region.id,
              message: constraintViolationMessage(
                component.id,
                'required_fields_always_visible',
                `'${requiredField}' in visible_fields`,
                `'${requiredField}' missing from visible_fields`,
              ),
            });
          }
        }
      }
    }
  }

  // Global constraints check
  if (manifest.constraints?.max_components_per_layout) {
    if (config.layout.regions.length > manifest.constraints.max_components_per_layout) {
      errors.push({
        code: ErrorCodes.CONSTRAINT_VIOLATION,
        message: constraintViolationMessage(
          'layout',
          'max_components_per_layout',
          `at most ${manifest.constraints.max_components_per_layout}`,
          config.layout.regions.length.toString(),
        ),
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  };
}

export function checkAgentScope(
  config: LayoutConfig,
  manifest: Manifest
): ValidationError[] {
  const errors: ValidationError[] = [];
  const scope = manifest.agent_scope;

  for (const region of config.layout.regions) {
    // Check allowed_regions
    if (scope?.allowed_regions && scope.allowed_regions.length > 0) {
      if (!scope.allowed_regions.includes(region.id)) {
        errors.push({
          code: "REGION_NOT_IN_SCOPE",
          region: region.id,
          message: `Region '${region.id}' is not in the app's allowed_regions list.`,
          suggestion: `Allowed regions: ${scope.allowed_regions.join(", ")}.`
        });
      }
    }

    // Check locked_components at app level
    const appLocked = scope?.locked_components ?? [];

    // Check locked flag at component level
    const componentDef = manifest.components.find(c => c.id === region.component);
    const componentLocked = componentDef?.locked === true;

    if (appLocked.includes(region.component) || componentLocked) {
      errors.push({
        code: "COMPONENT_LOCKED",
        region: region.id,
        component: region.component,
        message: `Component '${region.component}' is locked and cannot be modified by an agent config.`,
        suggestion: `Remove this region from the Layout Config or ask the developer to unlock the component.`
      });
    }
  }

  return errors;
}
