# OUAS Skill: Security (v1.0)

> This skill teaches you about locked components, agent scope, and config limits.

## Rules
1. Sensitive components (e.g., checkout buttons, critical navigation, legal text) MUST be marked with `locked: true` in their `withOUAS` annotation to prevent AI tampering.
2. The backend MUST validate all incoming Layout Configs from the Agent against a strict JSON schema before applying them.

## Code patterns

### Locked Component Example
```tsx
import { withOUAS } from '@ouas/react';

function CheckoutButton({ total }: { total: number }) {
  return <button>Pay ${total}</button>;
}

/**
 * Initiates the checkout process.
 */
export default withOUAS(CheckoutButton, {
  name: 'CheckoutButton',
  locked: true, // Prevents the AI from moving, hiding, or modifying props
  props: {
    total: { type: 'number', required: true }
  }
});
```

## Validation checklist
- [ ] Sensitive components cannot be moved or hidden via Layout Configs.
- [ ] The agent backend validates generated configs against the OUAS schema.
