/**
 * @ouas/react
 *
 * OUAS React SDK — annotate components with withOUAS() and auto-generate manifests.
 *
 * Usage:
 *   import { withOUAS, useOUAS } from '@ouas/react';
 *
 *   // Annotate a component
 *   export default withOUAS(MyComponent, {
 *     id: "my-component",
 *     display_name: "My Component",
 *     description: "Renders user profile with name and avatar",
 *     category: "display",
 *     data_source: "users",
 *     fields: { name: { type: "string", required: true } },
 *   });
 *
 *   // Access OUAS state
 *   function StatusBar() {
 *     const { isLoading, activeConfigId } = useOUAS();
 *     return <div>{isLoading ? 'Loading...' : activeConfigId ?? 'Default'}</div>;
 *   }
 */

export { withOUAS } from './withOUAS.js';
export { useOUAS, useIsDefaultLayout, useOUASLayout, OUASHookContext } from './useOUAS.js';
export { OUAS_METADATA_KEY, isOUASAnnotated } from './types.js';
export type {
  OUASComponentDefinition,
  OUASAnnotatedComponent,
  OUASFieldDefinition,
  OUASFieldType,
  OUASCategory,
} from './types.js';
