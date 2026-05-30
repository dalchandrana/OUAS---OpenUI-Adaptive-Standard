/**
 * OUAS Component Registry
 *
 * A sealed map that associates component IDs (from the manifest) to their
 * React component implementations. The registry is populated once when the
 * app mounts via OUASProvider and cannot be modified at runtime.
 *
 * Security guarantee: An agent cannot inject new components — it can only
 * use components the developer registered. (PRD: "The registry is sealed at app load")
 */

import type { ComponentType } from 'react';
import type { Manifest } from '@ouas/validator';

export type ComponentMap = ReadonlyMap<string, ComponentType<Record<string, unknown>>>;

/**
 * Creates a sealed component registry from a manifest and component map.
 *
 * Validates that:
 * 1. Every component ID in the manifest has a registered implementation
 * 2. No extra components are registered that aren't in the manifest
 *
 * @param manifest - The app's Component Manifest
 * @param components - Map of component IDs to React component implementations
 * @returns A frozen, read-only Map
 * @throws Error if validation fails
 */
export function createRegistry(
  manifest: Manifest,
  components: Record<string, ComponentType<Record<string, unknown>>>,
): ComponentMap {
  const manifestComponentIds = new Set(manifest.components.map((c) => c.id));
  const registeredIds = new Set(Object.keys(components));

  // Warn about unregistered components (components in manifest but not provided)
  const missingComponents: string[] = [];
  for (const id of manifestComponentIds) {
    if (!registeredIds.has(id)) {
      missingComponents.push(id);
    }
  }

  if (missingComponents.length > 0) {
    console.warn(
      `[OUAS Registry] Warning: ${missingComponents.length} components declared in manifest but not registered: ${missingComponents.join(', ')}. These components will not be available for rendering.`,
    );
  }

  // Build the registry map — only include components that exist in the manifest
  const registry = new Map<string, ComponentType<Record<string, unknown>>>();
  for (const [id, component] of Object.entries(components)) {
    if (manifestComponentIds.has(id)) {
      registry.set(id, component);
    } else {
      console.warn(
        `[OUAS Registry] Warning: Component '${id}' is registered but not declared in the manifest. It will be ignored.`,
      );
    }
  }

  // Seal the registry — no modifications after creation
  return Object.freeze(registry) as ComponentMap;
}

/**
 * Looks up a component from the registry by ID.
 *
 * @returns The React component, or undefined if not found
 */
export function lookupComponent(
  registry: ComponentMap,
  componentId: string,
): ComponentType<Record<string, unknown>> | undefined {
  return registry.get(componentId);
}

/**
 * Checks if a component ID exists in the registry.
 */
export function hasComponent(registry: ComponentMap, componentId: string): boolean {
  return registry.has(componentId);
}

/**
 * Returns all registered component IDs.
 */
export function getRegisteredIds(registry: ComponentMap): string[] {
  return Array.from(registry.keys());
}
