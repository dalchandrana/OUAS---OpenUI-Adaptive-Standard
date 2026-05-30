/**
 * OUAS Error Codes
 *
 * Machine-readable error codes used by the validation pipeline.
 * Error messages are written for AI agents — specific, with alternatives, never vague.
 */

import type { ValidationErrorCode } from './types.js';

/** All OUAS validation error codes */
export const ErrorCodes = {
  SCHEMA_INVALID: 'SCHEMA_INVALID' as ValidationErrorCode,
  APP_ID_MISMATCH: 'APP_ID_MISMATCH' as ValidationErrorCode,
  COMPONENT_NOT_FOUND: 'COMPONENT_NOT_FOUND' as ValidationErrorCode,
  FIELD_NOT_FOUND: 'FIELD_NOT_FOUND' as ValidationErrorCode,
  REQUIRED_FIELD_HIDDEN: 'REQUIRED_FIELD_HIDDEN' as ValidationErrorCode,
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION' as ValidationErrorCode,
  DATA_SOURCE_INVALID: 'DATA_SOURCE_INVALID' as ValidationErrorCode,
  VARIANT_NOT_FOUND: 'VARIANT_NOT_FOUND' as ValidationErrorCode,
  SLOT_NOT_FOUND: 'SLOT_NOT_FOUND' as ValidationErrorCode,
  MANIFEST_VERSION_MISMATCH: 'MANIFEST_VERSION_MISMATCH' as ValidationErrorCode,
  CONFIG_UNRECOVERABLE: 'CONFIG_UNRECOVERABLE' as ValidationErrorCode,
  
  // Agent scope violations
  COMPONENT_LOCKED: 'COMPONENT_LOCKED' as ValidationErrorCode,
  REGION_NOT_IN_SCOPE: 'REGION_NOT_IN_SCOPE' as ValidationErrorCode,

  // Config limits
  CONFIG_TOO_LARGE: 'CONFIG_TOO_LARGE' as ValidationErrorCode,
  TOO_MANY_REGIONS: 'TOO_MANY_REGIONS' as ValidationErrorCode,
  STRING_TOO_LONG: 'STRING_TOO_LONG' as ValidationErrorCode,
} as const;

/**
 * Creates an agent-readable error message for a missing component.
 * Includes list of available component IDs.
 */
export function componentNotFoundMessage(
  componentId: string,
  availableComponents: string[],
): string {
  return `Component '${componentId}' does not exist in the manifest. Available components: ${availableComponents.join(', ')}.`;
}

/**
 * Creates an agent-readable error message for a missing field.
 * Includes list of available fields and a suggestion if a close match exists.
 */
export function fieldNotFoundMessage(
  fieldName: string,
  componentId: string,
  availableFields: string[],
): string {
  return `Field '${fieldName}' does not exist in component '${componentId}'. Available fields: ${availableFields.join(', ')}.`;
}

/**
 * Creates an agent-readable error message for a hidden required field.
 */
export function requiredFieldHiddenMessage(fieldName: string, componentId: string): string {
  return `Field '${fieldName}' is required in component '${componentId}' and must appear in visible_fields. Required fields cannot be hidden.`;
}

/**
 * Creates an agent-readable error message for constraint violations.
 */
export function constraintViolationMessage(
  componentId: string,
  constraintName: string,
  expected: number | string,
  actual: number | string,
): string {
  return `Component '${componentId}' violates constraint '${constraintName}': expected ${expected}, got ${actual}.`;
}

/**
 * Creates an agent-readable error message for a missing variant.
 */
export function variantNotFoundMessage(
  variant: string,
  componentId: string,
  availableVariants: string[],
): string {
  return `Variant '${variant}' does not exist in component '${componentId}'. Available variants: ${availableVariants.join(', ')}.`;
}

/**
 * Creates an agent-readable error message for app_id mismatch.
 */
export function appIdMismatchMessage(configAppId: string, manifestAppId: string): string {
  return `Config app_id '${configAppId}' does not match manifest app_id '${manifestAppId}'. Ensure the config targets the correct application.`;
}

/**
 * Creates an agent-readable error for invalid data sources.
 */
export function dataSourceInvalidMessage(
  dataSource: string,
  componentId: string,
  availableDataSources: string[],
): string {
  return `Data source '${dataSource}' for component '${componentId}' is not available. Available data sources: ${availableDataSources.join(', ')}.`;
}

/**
 * Finds the closest string match from a list of candidates.
 * Uses simple Levenshtein-based similarity for "Did you mean?" suggestions.
 */
export function findClosestMatch(target: string, candidates: string[]): string | undefined {
  if (candidates.length === 0) return undefined;

  let bestMatch: string | undefined;
  let bestDistance = Infinity;

  for (const candidate of candidates) {
    const distance = levenshteinDistance(target.toLowerCase(), candidate.toLowerCase());
    if (distance < bestDistance && distance <= Math.max(target.length, candidate.length) * 0.6) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

/**
 * Simple Levenshtein distance implementation for string similarity.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1, // substitution
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j]! + 1, // deletion
        );
      }
    }
  }

  return matrix[b.length]![a.length]!;
}
