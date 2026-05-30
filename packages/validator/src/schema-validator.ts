/**
 * OUAS Schema Validator
 *
 * Step 1 of the validation pipeline: structural JSON Schema validation.
 * Uses Ajv to validate Layout Configs and Manifests against their JSON Schemas.
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { ValidationError, ValidationResult } from './types.js';
import { ErrorCodes } from './error-codes.js';

// Import schemas — these will be resolved at build time
import manifestSchema from '@ouas/spec/schemas/manifest.schema.json';
import layoutConfigSchema from '@ouas/spec/schemas/layout-config.schema.json';
import validationResponseSchema from '@ouas/spec/schemas/validation-response.schema.json';

const ajv = new Ajv({
  allErrors: true, // Collect all errors, not just the first
  verbose: true,
  strict: false,
});
addFormats(ajv);

// Compile schemas once
const validateManifest = ajv.compile(manifestSchema);
const validateLayoutConfig = ajv.compile(layoutConfigSchema);
const validateValidationResponse = ajv.compile(validationResponseSchema);

const OUAS_LIMITS = {
  MAX_CONFIG_BYTES: 4096,          // 4KB hard cap on entire config
  MAX_REGIONS: 20,                  // max regions in one layout
  MAX_FIELD_NAME_LENGTH: 64,        // max chars in any field name string
  MAX_FREE_TEXT_LENGTH: 512,        // max chars in description/label strings
  MAX_COMPONENT_ID_LENGTH: 128,     // max chars in a component ID
} as const;

export function checkConfigSizeLimits(rawConfigJson: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1. Total size check
  const bytes = new TextEncoder().encode(rawConfigJson).length;
  if (bytes > OUAS_LIMITS.MAX_CONFIG_BYTES) {
    errors.push({
      code: "CONFIG_TOO_LARGE" as any,
      message: `Config size is ${bytes} bytes. Maximum allowed is ${OUAS_LIMITS.MAX_CONFIG_BYTES} bytes (4KB).`,
      suggestion: "Reduce the number of regions or shorten field name lists."
    });
    return errors; // don't parse further if too large
  }

  let config: any;
  try {
    config = JSON.parse(rawConfigJson);
  } catch {
    errors.push({ code: "SCHEMA_INVALID" as any, message: "Config is not valid JSON." });
    return errors;
  }

  // 2. Region count check
  const regions = config?.layout?.regions ?? [];
  if (regions.length > OUAS_LIMITS.MAX_REGIONS) {
    errors.push({
      code: "TOO_MANY_REGIONS" as any,
      message: `Config has ${regions.length} regions. Maximum allowed is ${OUAS_LIMITS.MAX_REGIONS}.`,
      suggestion: "Split complex layouts into multiple views instead of one large config."
    });
  }

  // 3. String length checks — walk every string value in the config
  function checkStrings(obj: any, path: string) {
    if (typeof obj === "string") {
      if (obj.length > OUAS_LIMITS.MAX_FREE_TEXT_LENGTH) {
        errors.push({
          code: "STRING_TOO_LONG" as any,
          field: path,
          message: `Value at '${path}' is ${obj.length} chars. Maximum is ${OUAS_LIMITS.MAX_FREE_TEXT_LENGTH}.`,
          suggestion: "Shorten this value."
        });
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => checkStrings(item, `${path}[${i}]`));
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj)) {
        checkStrings(obj[key], `${path}.${key}`);
      }
    }
  }
  checkStrings(config, "config");

  return errors;
}

/**
 * Validates a Layout Config against the OUAS JSON Schema.
 * This is Step 1 of the 7-step validation pipeline.
 *
 * @returns ValidationResult with schema-level errors if invalid
 */
export function validateLayoutConfigSchema(config: unknown): ValidationResult {
  const valid = validateLayoutConfig(config);

  if (valid) {
    return { valid: true, errors: [], warnings: [] };
  }

  const errors: ValidationError[] = (validateLayoutConfig.errors ?? []).map((error) => ({
    code: ErrorCodes.SCHEMA_INVALID,
    message: `Schema validation failed at '${error.instancePath || '/'}': ${error.message ?? 'unknown error'}`,
    field: error.instancePath?.split('/').pop() || undefined,
  }));

  return { valid: false, errors, warnings: [] };
}

/**
 * Validates a Manifest against the OUAS JSON Schema.
 *
 * @returns ValidationResult with schema-level errors if invalid
 */
export function validateManifestSchema(manifest: unknown): ValidationResult {
  const valid = validateManifest(manifest);

  if (valid) {
    return { valid: true, errors: [], warnings: [] };
  }

  const errors: ValidationError[] = (validateManifest.errors ?? []).map((error) => ({
    code: ErrorCodes.SCHEMA_INVALID,
    message: `Manifest schema validation failed at '${error.instancePath || '/'}': ${error.message ?? 'unknown error'}`,
    field: error.instancePath?.split('/').pop() || undefined,
  }));

  return { valid: false, errors, warnings: [] };
}

/**
 * Validates a validation response against its own schema.
 * Meta-validation for ensuring our own outputs are well-formed.
 */
export function validateResponseSchema(response: unknown): boolean {
  return validateValidationResponse(response) as boolean;
}

export { validateManifest, validateLayoutConfig, validateValidationResponse };
