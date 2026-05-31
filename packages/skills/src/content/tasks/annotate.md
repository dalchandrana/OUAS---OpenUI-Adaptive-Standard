# OUAS Skill: Annotating Components (v1.0)

> This skill teaches you how to retrofit existing React components to make them OUAS-compatible.

## Context
When retrofitting an existing application, you must expose visual components to the OUAS layout engine so the agent can move them around. You do this by wrapping them with `withOUAS()`.

## Rules
1. Identify props that change visual appearance (color, variant, size) and expose them to OUAS via the `props` config.
2. Do NOT expose internal state props or callbacks (like `onClick`) to the OUAS config.
3. Do not change the underlying component implementation; only wrap its export.
4. Remove any hardcoded layout classes (e.g. Tailwind `absolute`, `m-4`, `flex-col`) from the component's outermost element.

## Code patterns

### Before: Standard React Component
```tsx
export function Alert({ type = 'info', message, onClose }: AlertProps) {
  // Notice the hardcoded layout classes that must be removed
  return (
    <div className="absolute top-0 right-0 m-4 p-4 border rounded">
      <span className={`text-${type}`}>{message}</span>
      <button onClick={onClose}>X</button>
    </div>
  );
}
```

### After: OUAS-Annotated Component
```tsx
import { withOUAS } from '@ouas/react';

function Alert({ type = 'info', message, onClose }: AlertProps) {
  // Layout classes removed, only visual classes remain
  return (
    <div className="p-4 border rounded">
      <span className={`text-${type}`}>{message}</span>
      <button onClick={onClose}>X</button>
    </div>
  );
}

/**
 * An alert banner used to display system messages or notifications to the user.
 */
export default withOUAS(Alert, {
  name: 'Alert',
  props: {
    type: { type: 'string', default: 'info', options: ['info', 'warning', 'error'] },
    message: { type: 'string', required: true }
  }
});
```

## Validation checklist
- [ ] The component still works normally when used without OUAS.
- [ ] All visual-altering props are exposed in the `withOUAS` configuration.
- [ ] All hardcoded layout positioning has been removed from the component.
