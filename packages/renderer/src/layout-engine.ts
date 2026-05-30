/**
 * OUAS Layout Engine
 *
 * The core rendering engine. Reads a Layout Config and assembles the
 * component tree from the registry, applying field filtering, sorting,
 * and slot resolution for each region.
 *
 * This is the most critical piece of infrastructure — it must be fast,
 * safe, and produce correct output from any valid config.
 */

import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { Region, LayoutConfig, Manifest } from '@ouas/validator';
import type { ComponentMap } from './component-registry.js';
import { lookupComponent } from './component-registry.js';
import { filterFieldsArray } from './field-filter.js';
import { sortData, filterData } from './sort-engine.js';

export interface LayoutEngineOptions {
  config: LayoutConfig;
  manifest: Manifest;
  registry: ComponentMap;
  dataSources: Record<string, unknown[]>;
}

/**
 * Renders a full layout from a Layout Config.
 * Assembles all regions into a component tree.
 *
 * @returns Array of rendered React elements, one per region
 */
export function renderLayout(options: LayoutEngineOptions): ReactNode[] {
  const { config, registry, dataSources, manifest } = options;
  const renderedRegions: ReactNode[] = [];

  for (const region of config.layout.regions) {
    const rendered = renderRegion(region, registry, dataSources, manifest);
    if (rendered !== null) {
      renderedRegions.push(rendered);
    }
  }

  return renderedRegions;
}

/**
 * Renders a single region from a Layout Config.
 *
 * Steps:
 * 1. Look up the component from the registry
 * 2. Get the data from the appropriate data source
 * 3. Apply sort and filter instructions
 * 4. Filter fields to only visible_fields
 * 5. Resolve slots
 * 6. Create the React element
 */
function renderRegion(
  region: Region,
  registry: ComponentMap,
  dataSources: Record<string, unknown[]>,
  manifest: Manifest,
): ReactNode {
  // Step 1: Look up component
  const Component = lookupComponent(registry, region.component);
  if (!Component) {
    console.warn(
      `[OUAS Engine] Component '${region.component}' not found in registry. Skipping region '${region.id}'.`,
    );
    return null;
  }

  // Step 2: Get data source
  // Find which data source this component uses by checking the manifest
  // For simplicity, we pass all available data
  const dataSourceId = Object.keys(dataSources)[0]; // Default to first data source
  const rawData = dataSourceId ? dataSources[dataSourceId] : [];

  if (!rawData || rawData.length === 0) {
    // No data — render component with just the visible fields as empty props
    const emptyProps = Object.fromEntries(region.visible_fields.map((f) => [f, undefined]));
    return createElement(Component, {
      key: region.id,
      ...emptyProps,
      _ouas_region: region.id,
      _ouas_variant: region.variant,
    });
  }

  // Step 3: Apply sort and filter
  let processedData = rawData as Record<string, unknown>[];
  if (region.filter) {
    processedData = filterData(processedData, region.filter);
  }
  if (region.sort) {
    processedData = sortData(processedData, region.sort);
  }

  // Step 4: Filter fields to visible_fields only
  const filteredData = filterFieldsArray(processedData, region);

  // Step 5: Resolve slots
  const slotProps: Record<string, unknown> = {};
  if (region.slots) {
    for (const [slotName, slotComponentId] of Object.entries(region.slots)) {
      if (typeof slotComponentId === 'string') {
        const SlotComponent = lookupComponent(registry, slotComponentId);
        if (SlotComponent) {
          slotProps[`slot_${slotName}`] = SlotComponent;
        }
      }
    }
  }

  // Step 6: Create the React element
  // For list-type components, render one per data item
  // For single components, pass the first item's data
  const manifestComp = manifest.components.find((c) => c.id === region.component);
  const isListItem = manifestComp?.category === 'list-item';

  if (isListItem && filteredData.length > 1) {
    // List rendering — create a wrapper with multiple children
    const children = filteredData.map((item, index) =>
      createElement(Component, {
        key: `${region.id}-${index}`,
        ...item,
        ...slotProps,
        _ouas_region: region.id,
        _ouas_variant: region.variant,
      }),
    );
    return createElement(
      'div',
      {
        key: region.id,
        'data-ouas-region': region.id,
        'data-ouas-component': region.component,
        'data-ouas-variant': region.variant,
      },
      ...children,
    );
  }

  // Single item
  const item = filteredData[0] ?? {};
  return createElement(Component, {
    key: region.id,
    ...item,
    ...slotProps,
    _ouas_region: region.id,
    _ouas_variant: region.variant,
  });
}

/**
 * Creates a CSS class name for a layout type.
 * Used to apply layout-specific styles (single-column, two-column, grid, etc.)
 */
export function getLayoutClassName(layoutType: string): string {
  return `ouas-layout ouas-layout--${layoutType}`;
}
