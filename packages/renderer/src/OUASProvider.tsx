/**
 * OUAS Provider
 *
 * The root React context provider for OUAS. Developers mount this at the app root
 * with their manifest, component map, and Agent API base URL.
 *
 * Usage:
 *   <OUASProvider
 *     manifest={manifest}
 *     agentApiBase="/ouas"
 *     userId={currentUser.id}
 *     components={{ 'email-row': EmailRow, 'compose-button': ComposeButton }}
 *     fallback={<DefaultLayout />}
 *   >
 *     <YourAppRoutes />
 *   </OUASProvider>
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  createElement,
} from 'react';
import type { ReactNode } from 'react';
import type { LayoutConfig, ValidationResult, MigrationWarning } from '@ouas/validator';
import { validate, migrateConfig, needsMigration } from '@ouas/validator';
import type { OUASProviderProps, OUASContextValue, OUASEvent } from './types.js';
import { createRegistry } from './component-registry.js';
import { renderLayout, getLayoutClassName } from './layout-engine.js';
import { fetchConfig } from './config-fetcher.js';
import { checkFallback, renderWithFallback } from './fallback-handler.js';
import { wrapWithTransition, getConfigKey } from './transition-manager.js';

// ─── Events ──────────────────────────────────────────────────────────────────

function emitEvent(onEvent: OUASProviderProps["onEvent"], event: OUASEvent) {
  if (onEvent) {
    try {
      onEvent(event);
    } catch {
      // Never let logging crash the renderer
    }
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const OUASContext = createContext<OUASContextValue | null>(null);

/**
 * Hook to access the OUAS context.
 * Must be used within an OUASProvider.
 */
export function useOUASContext(): OUASContextValue {
  const context = useContext(OUASContext);
  if (!context) {
    throw new Error('useOUASContext must be used within an OUASProvider');
  }
  return context;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function OUASProvider(props: OUASProviderProps): ReactNode {
  const {
    manifest,
    agentApiBase,
    userId,
    fallback,
    components,
    dataSources = {},
    onEvent,
    children,
  } = props;

  // Create and seal the component registry once on mount
  const registry = useMemo(() => {
    const reg = createRegistry(manifest, components);
    emitEvent(onEvent, {
      type: "registry.sealed",
      timestamp: new Date().toISOString(),
      userId,
      details: { componentCount: reg.size }
    });
    return reg;
  }, [manifest, components, userId, onEvent]);

  // State
  const [activeConfig, setActiveConfig] = useState<LayoutConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);
  const [migrationWarnings, setMigrationWarnings] = useState<MigrationWarning[]>([]);

  // Fetch user's config on mount
  useEffect(() => {
    const abortController = new AbortController();

    async function loadConfig() {
      setIsLoading(true);
      try {
        const result = await fetchConfig({
          agentApiBase,
          userId,
          signal: abortController.signal,
        });

        if (result.config) {
          // Check for migration
          if (needsMigration(result.config, manifest)) {
            const migration = migrateConfig(result.config, manifest);
            if (migration.unrecoverable) {
              setActiveConfig(null);
              setMigrationWarnings(migration.warnings);
              emitEvent(onEvent, {
                type: "config.fallback",
                timestamp: new Date().toISOString(),
                userId,
                details: { reason: "Migration unrecoverable", warnings: migration.warnings }
              });
            } else {
              setActiveConfig(migration.config);
              setMigrationWarnings(migration.warnings);
              emitEvent(onEvent, {
                type: "config.migrated",
                timestamp: new Date().toISOString(),
                userId,
                configId: migration.config.config_id,
                manifestVersion: migration.config.manifest_version,
                details: { warnings: migration.warnings }
              });
            }
          } else {
            setActiveConfig(result.config);
            emitEvent(onEvent, {
              type: "config.applied",
              timestamp: new Date().toISOString(),
              userId,
              configId: result.config.config_id,
              manifestVersion: result.config.manifest_version,
            });
          }
        }
      } catch {
        // Fetch failed — use default layout
        setActiveConfig(null);
        emitEvent(onEvent, {
          type: "config.fallback",
          timestamp: new Date().toISOString(),
          userId,
          details: { reason: "Fetch failed" }
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
    return () => abortController.abort();
  }, [agentApiBase, userId, manifest]);

  // Apply a new config
  const applyConfig = useCallback(
    async (config: LayoutConfig): Promise<ValidationResult> => {
      const result = validate(config, manifest);
      setLastValidation(result);

      if (result.valid) {
        setActiveConfig(config);
        setMigrationWarnings(result.migration_warnings ?? []);
        emitEvent(onEvent, {
          type: "config.applied",
          timestamp: new Date().toISOString(),
          userId,
          configId: config.config_id,
          manifestVersion: config.manifest_version,
        });
      } else {
        emitEvent(onEvent, {
          type: "config.rejected",
          timestamp: new Date().toISOString(),
          userId,
          details: { reason: "Validation failed", errors: result.errors }
        });
      }

      return result;
    },
    [manifest, onEvent, userId],
  );

  // Reset to default
  const resetConfig = useCallback(async () => {
    setActiveConfig(null);
    setLastValidation(null);
    setMigrationWarnings([]);
    emitEvent(onEvent, {
      type: "config.restored",
      timestamp: new Date().toISOString(),
      userId,
      details: { to: "default" }
    });
  }, [onEvent, userId]);

  // Render the current layout
  const renderCurrentLayout = useCallback((): ReactNode => {
    const fallbackState = checkFallback(activeConfig, lastValidation);

    const normalContent = activeConfig
      ? createElement(
          'div',
          { className: getLayoutClassName(activeConfig.layout.type) },
          ...renderLayout({
            config: activeConfig,
            manifest,
            registry,
            dataSources,
          }),
        )
      : null;

    const content = renderWithFallback(fallbackState, fallback, normalContent);

    return wrapWithTransition(content, getConfigKey(activeConfig?.config_id ?? null));
  }, [activeConfig, lastValidation, manifest, registry, dataSources, fallback]);

  // Build context value
  const contextValue: OUASContextValue = useMemo(
    () => ({
      manifest,
      registry,
      activeConfig,
      isLoading,
      lastValidation,
      migrationWarnings,
      userId,
      agentApiBase,
      dataSources,
      applyConfig,
      resetConfig,
      renderLayout: renderCurrentLayout,
    }),
    [
      manifest,
      registry,
      activeConfig,
      isLoading,
      lastValidation,
      migrationWarnings,
      userId,
      agentApiBase,
      dataSources,
      applyConfig,
      resetConfig,
      renderCurrentLayout,
    ],
  );

  return createElement(OUASContext.Provider, { value: contextValue }, children);
}
