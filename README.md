# OpenUI Adaptive Standard (OUAS)

The OpenUI Adaptive Standard (OUAS) is an open specification and robust toolkit for building config-driven, AI-transformable, polymorphic user interfaces. 

It provides the schema, validation, React rendering engine, and tooling to allow AI agents to securely transform an application's layout at runtime without shipping code.

## Why OUAS?

Modern interfaces often need to dynamically adapt to user intent—whether it's an executive needing a dense task list, a student requiring a calendar view, or a researcher exploring a node graph. Hardcoding every view is brittle and expensive.

With OUAS:
1. **Developers define components** and register them in a Manifest.
2. **AI Agents generate configurations** mapping data to those components based on user prompts.
3. **The Renderer securely validates and mounts** the layout at runtime.

## Packages in this Monorepo

| Package | Description |
|---|---|
| [`@ouas/spec`](./packages/spec) | The core JSON Schemas and design documents defining Manifests and Layout Configs. |
| [`@ouas/validator`](./packages/validator) | A robust 7-step pipeline to validate configs against the schema and app constraints. |
| [`@ouas/renderer`](./packages/renderer) | The UI layout engine and context provider that transforms JSON into React components. |
| [`@ouas/react`](./packages/react) | The `withOUAS()` HOC and `useOUAS()` hook for integrating components safely. |
| [`@ouas/cli`](./packages/cli) | A tool to statically extract `withOUAS()` definitions and generate manifest files. |

## Quick Start

### 1. Annotate your Components
Wrap your React components in `withOUAS` to expose their configurable properties and variants.

```tsx
import { withOUAS } from '@ouas/react';

export const EmailRow = withOUAS(EmailRowComponent, {
  id: 'email-row',
  category: 'list-item',
  data_source: 'emails',
  variants: ['comfortable', 'compact'],
  fields: {
    sender: { type: 'string', required: true },
    subject: { type: 'string', required: false }
  }
});
```

### 2. Generate your Manifest
Run the CLI to scan your source code and generate `manifest.ouas.json`.

```bash
npx ouas generate --dir src --output manifest.ouas.json --app-id com.example.app --app-name MyApp
```

### 3. Mount the Provider
Wrap your React tree to initialize the engine.

```tsx
import { OUASProvider } from '@ouas/renderer';

<OUASProvider
  manifest={manifest}
  components={{ 'email-row': EmailRow }}
  dataSources={{ emails: myData }}
  agentApiBase="/api/agent"
  userId={user.id}
>
  <LayoutRenderer />
</OUASProvider>
```

## MailFlow Demo

Check out the [`apps/mailflow`](./apps/mailflow) directory to see OUAS in action. MailFlow is an adaptive email client that shifts entirely from a list view to a calendar or node graph based on user prompts via Claude 3.5 Sonnet.

## License

MIT © OUAS Team
