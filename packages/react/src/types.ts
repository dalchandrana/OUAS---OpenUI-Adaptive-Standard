/**
 * OUAS React SDK Types
 *
 * Type definitions for the withOUAS() higher-order component
 * and the component annotation system.
 */

import type { ComponentType } from 'react';

// ─── Field Types (mirrors @ouas/validator types for SDK standalone use) ──────

export type OUASFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'datetime'
  | 'enum'
  | 'array'
  | 'object';

export interface OUASFieldDefinition {
  type: OUASFieldType;
  required: boolean;
  label?: string;
  values?: string[];
}

// ─── Component Category ─────────────────────────────────────────────────────

export type OUASCategory =
  | 'list-item'
  | 'detail'
  | 'action'
  | 'navigation'
  | 'container'
  | 'badge'
  | 'input'
  | 'display';

// ─── Component Definition (what developers pass to withOUAS) ────────────────

export interface OUASComponentDefinition {
  /** Unique kebab-case component ID (e.g. "email-row") */
  id: string;
  /** Human-readable display name */
  display_name: string;
  /** Machine-read description for AI agents. Must be precise and unambiguous. Min 20 chars. */
  description: string;
  /** Semantic category */
  category: OUASCategory;
  /** Data source this component renders */
  data_source: string;
  /** Map of field names to field definitions */
  fields: Record<string, OUASFieldDefinition>;
  /** Available visual variants */
  variants?: string[];
  /** Named insertion points for child components */
  slots?: string[];
  /** Component-level constraints */
  constraints?: {
    min_fields_visible?: number;
    required_fields_always_visible?: string[];
  };
  locked?: boolean;
}

// ─── Annotated Component ────────────────────────────────────────────────────

/** Symbol used to attach OUAS metadata to components */
export const OUAS_METADATA_KEY = '__ouas_metadata__';

/** A React component with OUAS metadata attached */
export type OUASAnnotatedComponent<P = Record<string, unknown>> = ComponentType<P> & {
  [OUAS_METADATA_KEY]: OUASComponentDefinition;
};

/** Type guard to check if a component has OUAS metadata */
export function isOUASAnnotated(
  component: ComponentType<unknown>,
): component is OUASAnnotatedComponent<unknown> {
  return OUAS_METADATA_KEY in component;
}
