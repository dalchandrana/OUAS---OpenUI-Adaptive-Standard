/**
 * OUAS Config Fetcher
 *
 * Fetches Layout Configs from the Agent API.
 * Handles caching, error states, and the config source header.
 */

import type { LayoutConfig } from '@ouas/validator';
import type { ConfigFetchOptions, ConfigFetchResult } from './types.js';

/**
 * Fetches the active Layout Config for a user from the Agent API.
 *
 * @param options - Fetch options (API base URL, user ID, abort signal)
 * @returns The config, its source (custom/default), and any error
 */
export async function fetchConfig(options: ConfigFetchOptions): Promise<ConfigFetchResult> {
  const { agentApiBase, userId, signal } = options;

  try {
    const response = await fetch(`${agentApiBase}/config/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { config: null, source: 'default' };
      }
      return {
        config: null,
        source: 'default',
        error: `Failed to fetch config: ${response.status} ${response.statusText}`,
      };
    }

    const config = (await response.json()) as LayoutConfig;
    const source =
      (response.headers.get('X-OUAS-Config-Source') as 'custom' | 'default') ?? 'custom';

    return { config, source };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { config: null, source: 'default', error: 'Request aborted' };
    }
    return {
      config: null,
      source: 'default',
      error: `Failed to fetch config: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Submits a new Layout Config to the Agent API.
 *
 * @returns The API response with validation result
 */
export async function submitConfig(
  agentApiBase: string,
  userId: string,
  config: LayoutConfig,
): Promise<{
  applied: boolean;
  validation: { valid: boolean; errors: unknown[]; warnings: unknown[] };
}> {
  const response = await fetch(`${agentApiBase}/config/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  return response.json();
}

/**
 * Resets a user's config to the default layout via the Agent API.
 */
export async function resetConfig(agentApiBase: string, userId: string): Promise<void> {
  await fetch(`${agentApiBase}/config/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}
