/**
 * OUAS useOUAS() Hook
 *
 * Provides access to the OUAS context from any component within an OUASProvider.
 * Allows components to:
 *   - Read the current layout config
 *   - Apply a new config
 *   - Reset to default layout
 *   - Check validation state
 */

import { useContext, createContext, useMemo } from 'react';
import type { ReactNode } from 'react';

// ─── Minimal context type for SDK (doesn't depend on renderer) ──────────────

interface OUASHookContextValue {
  /** Current active config ID, or null for default */
  activeConfigId: string | null;
  /** Whether OUAS is currently loading a config */
  isLoading: boolean;
  /** Current user ID */
  userId: string;
  /** Whether there are migration warnings */
  hasMigrationWarnings: boolean;
  /** Apply a new config by submitting to the agent API */
  applyConfig: (config: unknown) => Promise<unknown>;
  /** Reset to default layout */
  resetConfig: () => Promise<void>;
}

/**
 * Context for the OUAS hook. This is set by OUASProvider from @ouas/renderer.
 * The SDK provides the hook interface; the renderer provides the implementation.
 */
export const OUASHookContext = createContext<OUASHookContextValue | null>(null);

/**
 * Hook to access OUAS state and actions from any component.
 *
 * @returns OUAS context value with config state and actions
 * @throws Error if used outside OUASProvider
 */
export function useOUAS(): OUASHookContextValue {
  const context = useContext(OUASHookContext);
  if (!context) {
    throw new Error(
      'useOUAS() must be used within an <OUASProvider>. ' +
        'Make sure you have mounted <OUASProvider> at your app root.',
    );
  }
  return context;
}

/**
 * Hook that returns true if the current layout is the default (no custom config).
 */
export function useIsDefaultLayout(): boolean {
  const { activeConfigId } = useOUAS();
  return activeConfigId === null;
}

/**
 * Hook that provides a render function for the current OUAS layout.
 * This is a convenience wrapper for components that want to render
 * the OUAS-driven layout inline.
 */
export function useOUASLayout(): {
  isLoading: boolean;
  isDefault: boolean;
  renderLayout: (() => ReactNode) | null;
} {
  const context = useOUAS();

  return useMemo(
    () => ({
      isLoading: context.isLoading,
      isDefault: context.activeConfigId === null,
      renderLayout: null, // Will be populated by the renderer's context
    }),
    [context.isLoading, context.activeConfigId],
  );
}
