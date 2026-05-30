/**
 * OUAS withOUAS() Higher-Order Component
 *
 * Wraps a React component with OUAS metadata without modifying its render logic.
 * The metadata is attached as a static property (__ouas_metadata__) that the
 * CLI scanner reads to auto-generate the manifest.
 *
 * Design principle: withOUAS() NEVER modifies the component's render logic.
 * It attaches a static metadata object to the component. The component renders
 * exactly as it did before — OUAS only adds the ability for the renderer to
 * compose it differently.
 *
 * Usage:
 *   import { withOUAS } from '@ouas/react';
 *
 *   function EmailRow({ sender, subject }) {
 *     return <div>{sender}: {subject}</div>;
 *   }
 *
 *   export default withOUAS(EmailRow, {
 *     id: "email-row",
 *     display_name: "Email Row",
 *     description: "A single email item in a list showing sender and subject",
 *     category: "list-item",
 *     data_source: "emails",
 *     fields: {
 *       sender: { type: "string", required: true },
 *       subject: { type: "string", required: false },
 *     },
 *     variants: ["compact", "comfortable"],
 *   });
 */

import type { ComponentType } from 'react';
import type { OUASComponentDefinition, OUASAnnotatedComponent } from './types.js';
import { OUAS_METADATA_KEY } from './types.js';

/**
 * Wraps a React component with OUAS metadata.
 * Does NOT modify the component's behavior — only attaches metadata.
 *
 * @param WrappedComponent - The React component to annotate
 * @param definition - The OUAS component definition (id, fields, variants, etc.)
 * @returns The same component with __ouas_metadata__ attached
 */
export function withOUAS<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>,
  definition: OUASComponentDefinition,
): OUASAnnotatedComponent<P> {
  // Validate the definition at development time
  if (process.env.NODE_ENV !== 'production') {
    validateDefinition(definition);
  }

  // Attach metadata as a static property — do NOT wrap the component
  const annotated = WrappedComponent as unknown as OUASAnnotatedComponent<P>;
  annotated[OUAS_METADATA_KEY] = Object.freeze(definition);

  // Preserve display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  annotated.displayName = `withOUAS(${displayName})`;

  return annotated;
}

/**
 * Validates a component definition at development time.
 * Throws descriptive errors for malformed definitions.
 */
function validateDefinition(definition: OUASComponentDefinition): void {
  if (!definition.id || !/^[a-z][a-z0-9-]*$/.test(definition.id)) {
    throw new Error(
      `[OUAS] Invalid component id '${definition.id}'. Must be kebab-case starting with a letter.`,
    );
  }

  if (!definition.display_name) {
    throw new Error(`[OUAS] Component '${definition.id}' is missing display_name.`);
  }

  if (!definition.description || definition.description.length < 20) {
    throw new Error(
      `[OUAS] Component '${definition.id}' has a description shorter than 20 characters. ` +
        `Descriptions are machine-read by AI agents and must be precise and unambiguous.`,
    );
  }

  if (!definition.fields || Object.keys(definition.fields).length === 0) {
    throw new Error(`[OUAS] Component '${definition.id}' must declare at least one field.`);
  }

  if (!definition.data_source) {
    throw new Error(`[OUAS] Component '${definition.id}' must declare a data_source.`);
  }
}
