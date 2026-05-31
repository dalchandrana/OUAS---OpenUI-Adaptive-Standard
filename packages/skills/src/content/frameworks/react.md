# OUAS Framework: React (v1.0)

> Framework-specific integration rules for React 18+.

## Rules
1. Use the `useOUAS()` hook to access the current layout state or trigger layout updates manually if needed.
2. Ensure components are memoized (`React.memo`) if they perform expensive renders, as layout config updates at the root may trigger deep tree renders if not optimized.

## Code patterns

### Using useOUAS()
```tsx
import { useOUAS } from '@ouas/react';

export function ThemeToggle() {
  const { currentConfig, updateLayout } = useOUAS();

  const toggleTheme = () => {
    // This is just an example of interacting with the config
    // Usually the AI agent handles layout updates, but manual overrides are possible
    console.log("Current Layout Tree:", currentConfig.layout);
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```
