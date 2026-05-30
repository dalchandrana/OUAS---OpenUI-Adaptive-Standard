/**
 * OUAS Sort Engine
 *
 * Applies sort instructions from a Layout Config region to data arrays.
 * Supports sorting by any field in ascending or descending order.
 */

import type { SortInstruction } from '@ouas/validator';

/**
 * Sorts a data array according to a sort instruction from a region config.
 * Returns a new sorted array — does not mutate the input.
 *
 * @param data - Array of data records to sort
 * @param sort - Sort instruction from the region config (field + direction)
 * @returns New sorted array
 */
export function sortData(
  data: Record<string, unknown>[],
  sort: SortInstruction | undefined,
): Record<string, unknown>[] {
  if (!sort) return [...data];

  const { field, direction } = sort;
  const multiplier = direction === 'desc' ? -1 : 1;

  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    // Handle undefined/null — push to end
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Enum priority ordering (high > normal > low)
    if (field === 'priority') {
      const priorityOrder: Record<string, number> = { high: 3, normal: 2, low: 1 };
      const aP = priorityOrder[aVal as string] ?? 0;
      const bP = priorityOrder[bVal as string] ?? 0;
      return (aP - bP) * multiplier;
    }

    // String comparison
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * multiplier;
    }

    // Number comparison
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * multiplier;
    }

    // Boolean comparison (true > false)
    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      return ((aVal ? 1 : 0) - (bVal ? 1 : 0)) * multiplier;
    }

    // Date string comparison
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const aDate = new Date(aVal).getTime();
      const bDate = new Date(bVal).getTime();
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return (aDate - bDate) * multiplier;
      }
    }

    return 0;
  });
}

/**
 * Applies a filter instruction to a data array.
 * Returns only items that match the filter criteria.
 */
export function filterData(
  data: Record<string, unknown>[],
  filter: { field: string; operator: string; value: unknown } | null | undefined,
): Record<string, unknown>[] {
  if (!filter) return data;

  const { field, operator, value } = filter;

  return data.filter((item) => {
    const itemValue = item[field];

    switch (operator) {
      case 'eq':
        return itemValue === value;
      case 'neq':
        return itemValue !== value;
      case 'gt':
        return typeof itemValue === 'number' && typeof value === 'number' && itemValue > value;
      case 'gte':
        return typeof itemValue === 'number' && typeof value === 'number' && itemValue >= value;
      case 'lt':
        return typeof itemValue === 'number' && typeof value === 'number' && itemValue < value;
      case 'lte':
        return typeof itemValue === 'number' && typeof value === 'number' && itemValue <= value;
      case 'contains':
        return (
          typeof itemValue === 'string' && typeof value === 'string' && itemValue.includes(value)
        );
      case 'not_contains':
        return (
          typeof itemValue === 'string' && typeof value === 'string' && !itemValue.includes(value)
        );
      case 'in':
        return Array.isArray(value) && value.includes(itemValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(itemValue);
      default:
        return true;
    }
  });
}
