# OUAS Skill: Agent API Implementation (v1.0)

> This skill teaches you how to implement the 4 Agent API endpoints correctly.

## Context
The Agent API allows the frontend `OUASProvider` to securely communicate with the backend AI agent to fetch layouts, trigger actions, and report status.

## Rules
1. You must implement all four endpoints: `/discover`, `/config`, `/action`, and `/status`.
2. Endpoints MUST require authentication (e.g., verifying Bearer tokens or Session IDs).
3. Endpoints MUST have rate limiting applied to prevent abuse.

## Code patterns

### Next.js Route Handler Example (app/api/agent/[...route]/route.ts)
```ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Authenticate
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return new NextResponse('Unauthorized', { status: 401 });

  // 2. Route based on URL
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/agent/', '');

  const body = await req.json();

  switch (path) {
    case 'discover':
      // Return the manifest + current state
      return NextResponse.json({ ... });
    case 'config':
      // Return the new requested layout config
      return NextResponse.json({ ... });
    case 'action':
      // Process a user action
      return NextResponse.json({ status: 'success' });
    case 'status':
      // Process status reporting
      return NextResponse.json({ status: 'acknowledged' });
    default:
      return new NextResponse('Not found', { status: 404 });
  }
}
```

## Validation checklist
- [ ] All 4 endpoints return valid 200 responses for authenticated requests.
- [ ] Unauthorized requests return 401.
- [ ] Rate limiting is implemented.
