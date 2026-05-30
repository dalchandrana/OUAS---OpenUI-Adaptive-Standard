/**
 * OUAS Field Filter
 *
 * For each region in a Layout Config, the field filter ensures that only
 * the fields listed in `visible_fields` are passed as props to the component.
 * This is how OUAS controls what data is shown — by filtering props, not by
 * modifying the component.
 */

import type { Region } from '@ouas/validator';

/**
 * Filters a data record to only include fields listed in the region's visible_fields.
 *
 * @param data - The full data record for a single item
 * @param region - The region config specifying which fields are visible
 * @returns A new object containing only visible fields
 */
export function filterFields(
  data: Record<string, unknown>,
  region: Region,
): Record<string, unknown> {
  const visibleSet = new Set(region.visible_fields);
  const filtered: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (visibleSet.has(key)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Filters an array of data records, applying field filtering to each item.
 *
 * @param dataArray - Array of data records
 * @param region - The region config specifying which fields are visible
 * @returns Array of filtered records
 */
export function filterFieldsArray(
  dataArray: Record<string, unknown>[],
  region: Region,
): Record<string, unknown>[] {
  return dataArray.map((item) => filterFields(item, region));
}
