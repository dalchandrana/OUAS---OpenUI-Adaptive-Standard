/**
 * OUAS Renderer Types
 *
 * Types specific to the renderer package — component registry, provider, and engine types.
 * Core data types (Manifest, LayoutConfig, etc.) are imported from @ouas/validator.
 */

import type { ComponentType, ReactNode } from 'react';
import type {
  Manifest,
  LayoutConfig,
  Region,
  ValidationResult,
  MigrationWarning,
} from '@ouas/validator';

// ─── Component Registry Types ────────────────────────────────────────────────

/** A registered OUAS component with its React implementation */
export interface RegisteredComponent {
  id: string;
  component: ComponentType<Record<string, unknown>>;
}

/** The sealed component registry — maps component IDs to React components */
export type ComponentRegistry = ReadonlyMap<string, ComponentType<Record<string, unknown>>>;

// ─── Events ──────────────────────────────────────────────────────────────────

export type OUASEventType =
  | "config.applied"
  | "config.fallback"
  | "config.migrated"
  | "config.rejected"
  | "config.restored"
  | "registry.sealed";

export interface OUASEvent {
  type: OUASEventType;
  timestamp: string;         // ISO 8601
  userId?: string;
  configId?: string;
  manifestVersion?: string;
  details?: Record<string, unknown>;
}

// ─── Provider Types ──────────────────────────────────────────────────────────

export interface OUASProviderProps {
  /** The app's Component Manifest */
  manifest: Manifest;
  /** Base URL for the OUAS Agent API (e.g. "/ouas") */
  agentApiBase: string;
  /** Current user ID */
  userId: string;
  /** Fallback UI when no config is available or config is invalid */
  fallback: ReactNode;
  /** Map of component IDs to React component implementations */
  components: Record<string, ComponentType<Record<string, unknown>>>;
  /** Data sources — maps data source IDs to their data arrays */
  dataSources?: Record<string, unknown[]>;
  /** Children */
  children: ReactNode;
  /** Optional callback for logging events */
  onEvent?: (event: OUASEvent) => void;
}

export interface OUASContextValue {
  /** The app's manifest */
  manifest: Manifest;
  /** The sealed component registry */
  registry: ComponentRegistry;
  /** The current active Layout Config (null if using default) */
  activeConfig: LayoutConfig | null;
  /** Whether the renderer is loading a config */
  isLoading: boolean;
  /** Last validation result */
  lastValidation: ValidationResult | null;
  /** Migration warnings from last config load */
  migrationWarnings: MigrationWarning[];
  /** Current user ID */
  userId: string;
  /** Base URL for agent API */
  agentApiBase: string;
  /** Data sources */
  dataSources: Record<string, unknown[]>;
  /** Apply a new Layout Config */
  applyConfig: (config: LayoutConfig) => Promise<ValidationResult>;
  /** Reset to default layout */
  resetConfig: () => Promise<void>;
  /** Render the current layout */
  renderLayout: () => ReactNode;
}

// ─── Engine Types ────────────────────────────────────────────────────────────

export interface RenderRegionResult {
  regionId: string;
  element: ReactNode;
  error?: string;
}

export interface LayoutRenderResult {
  regions: RenderRegionResult[];
  layoutType: string;
  hasErrors: boolean;
}

// ─── Config Fetcher Types ────────────────────────────────────────────────────

export interface ConfigFetchOptions {
  agentApiBase: string;
  userId: string;
  signal?: AbortSignal;
}

export interface ConfigFetchResult {
  config: LayoutConfig | null;
  source: 'custom' | 'default';
  error?: string;
}

// ─── Transition Types ────────────────────────────────────────────────────────

export type TransitionState = 'idle' | 'entering' | 'active' | 'exiting';

export interface TransitionConfig {
  duration?: number;
  easing?: string;
  type?: 'fade' | 'slide' | 'morph';
}

// Re-export common types from validator for convenience
export type { Manifest, LayoutConfig, Region, ValidationResult, MigrationWarning };
