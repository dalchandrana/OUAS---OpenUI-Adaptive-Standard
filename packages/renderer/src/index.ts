/**
 * @ouas/renderer
 *
 * OUAS Layout Renderer — config-driven UI assembly engine for React applications.
 *
 * Usage:
 *   import { OUASProvider, useOUASContext } from '@ouas/renderer';
 *
 *   function App() {
 *     return (
 *       <OUASProvider
 *         manifest={manifest}
 *         agentApiBase="/ouas"
 *         userId={currentUser.id}
 *         components={{ 'email-row': EmailRow }}
 *         fallback={<DefaultLayout />}
 *       >
 *         <YourAppRoutes />
 *       </OUASProvider>
 *     );
 *   }
 */

// Provider & context
export { OUASProvider, useOUASContext } from './OUASProvider.js';

// Registry
export {
  createRegistry,
  lookupComponent,
  hasComponent,
  getRegisteredIds,
} from './component-registry.js';
export type { ComponentMap } from './component-registry.js';

// Engine
export { renderLayout, getLayoutClassName } from './layout-engine.js';

// Field filter
export { filterFields, filterFieldsArray } from './field-filter.js';

// Sort & filter
export { sortData, filterData } from './sort-engine.js';

// Fallback
export { checkFallback, renderWithFallback } from './fallback-handler.js';
export type { FallbackReason, FallbackState } from './fallback-handler.js';

// Config fetcher
export { fetchConfig, submitConfig, resetConfig } from './config-fetcher.js';

// Transitions
export { wrapWithTransition, getConfigKey } from './transition-manager.js';

// Types
export type {
  OUASProviderProps,
  OUASContextValue,
  RegisteredComponent,
  ComponentRegistry,
  RenderRegionResult,
  LayoutRenderResult,
  ConfigFetchOptions,
  ConfigFetchResult,
  TransitionState,
  TransitionConfig,
} from './types.js';
