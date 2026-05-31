# OUAS Framework: Next.js (v1.0)

> Framework-specific integration rules for Next.js (App Router).

## Rules
1. `OUASProvider` must be placed in `app/layout.tsx` and wrapped in a client component.
2. Agent API implementation uses Next.js Route Handlers (`app/api/agent/[...route]/route.ts`).
3. OUAS components MUST have `"use client"` at the top of the file, as they interact with the client-side layout engine.

## Code patterns

### Root Layout Client Wrapper
Because `OUASProvider` uses context, you must create a Client Component wrapper for it in Next.js App Router.

```tsx
// components/OUASWrapper.tsx
"use client"
import { OUASProvider } from '@ouas/react';

export function OUASWrapper({ children }: { children: React.ReactNode }) {
  return (
    <OUASProvider agentEndpoint="/api/agent">
      {children}
    </OUASProvider>
  );
}
```

```tsx
// app/layout.tsx
import { OUASWrapper } from '@/components/OUASWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OUASWrapper>{children}</OUASWrapper>
      </body>
    </html>
  );
}
```
