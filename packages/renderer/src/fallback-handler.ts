/**
 * OUAS Fallback Handler
 *
 * Ensures the renderer never crashes, regardless of config state.
 * Invalid config → default layout. Missing config → default layout.
 * Null config → default layout. Always recoverable.
 */

import type { ReactNode } from 'react';
import type { LayoutConfig, ValidationResult } from '@ouas/validator';

export type FallbackReason =
  | 'no_config'
  | 'invalid_config'
  | 'unrecoverable_migration'
  | 'render_error'
  | 'loading';

export interface FallbackState {
  shouldFallback: boolean;
  reason?: FallbackReason;
  validationResult?: ValidationResult;
  originalConfig?: LayoutConfig;
}

/**
 * Determines whether the renderer should fall back to the default layout.
 *
 * @param config - The Layout Config to check (or null if none)
 * @param validationResult - The result of validating the config (or null if not validated)
 * @returns FallbackState indicating whether to use fallback and why
 */
export function checkFallback(
  config: LayoutConfig | null | undefined,
  validationResult: ValidationResult | null | undefined,
): FallbackState {
  // No config at all → use default
  if (!config) {
    return { shouldFallback: true, reason: 'no_config' };
  }

  // Config exists but validation failed
  if (validationResult && !validationResult.valid) {
    return {
      shouldFallback: true,
      reason: 'invalid_config',
      validationResult,
      originalConfig: config,
    };
  }

  // Config exists and is valid (or not yet validated)
  return { shouldFallback: false };
}

/**
 * Renders the fallback content or the normal content based on fallback state.
 *
 * @param fallbackState - Whether to use fallback
 * @param fallbackContent - The fallback React element (developer's default layout)
 * @param normalContent - The OUAS-rendered content
 * @returns The appropriate content to render
 */
export function renderWithFallback(
  fallbackState: FallbackState,
  fallbackContent: ReactNode,
  normalContent: ReactNode,
): ReactNode {
  if (fallbackState.shouldFallback) {
    return fallbackContent;
  }
  return normalContent;
}
