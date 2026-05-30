import type { LayoutConfig } from '@ouas/validator';

// Config history store — last 5 configs per user
// In production: replace with database (Postgres, Redis, etc.)
export const configHistory = new Map<string, LayoutConfig[]>();

const MAX_HISTORY = 5;

export function saveConfig(userId: string, config: LayoutConfig): void {
  const history = configHistory.get(userId) ?? [];
  // Prepend new config, keep last MAX_HISTORY entries
  const updated = [config, ...history].slice(0, MAX_HISTORY);
  configHistory.set(userId, updated);
}

export function getCurrentConfig(userId: string): LayoutConfig | null {
  const history = configHistory.get(userId);
  return history?.[0] ?? null;
}

export function restorePreviousConfig(userId: string): LayoutConfig | null {
  const history = configHistory.get(userId);
  if (!history || history.length < 2) return null;
  // Remove current (index 0), return what was previous (now index 0)
  const updated = history.slice(1);
  configHistory.set(userId, updated);
  return updated[0] ?? null;
}

export function clearConfigHistory(userId: string): void {
  configHistory.delete(userId);
}
