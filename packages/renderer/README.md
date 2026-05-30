# `@ouas/renderer`

> The OpenUI Adaptive Standard (OUAS) React Layout Renderer.

This package provides the UI rendering engine for OUAS. It securely transforms a validated, declarative JSON Layout Config into high-fidelity, interactive React components at runtime, driving smooth structural transition animations using Framer Motion.

---

## Installation

```bash
pnpm add @ouas/renderer
# or
npm install @ouas/renderer
```

---

## Core Features

### 1. Dynamic Layout Mounts
Transforms Layout Config regions into React component blocks securely using a **sealed Component Registry**. The renderer guarantees that no dynamic script evaluation (`eval`) ever runs, preventing code injection attacks.

### 2. Built-in Layout Containers
Provides premium, animated layouts out-of-the-box:
* `single-column`: Classic stacked list view.
* `two-column`: Side-by-side dashboard layout.
* `three-column`: Triple split screen layout.
* `grid`: Fluid responsive dashboard cards.
* `calendar`: Month/week scheduling blocks.
* `node-graph`: Visual force-directed node diagrams.

### 3. Transition Animators
Integrates beautiful layout shifts. The `TransitionManager` animates position, size, opacity, and custom badge parameters smoothly when a layout transforms, delivering a premium "app-alive" feel without screen flash.

---

## API & Usage Guide

To use the renderer, wrap your application in the `<OUASProvider />` and mount the `<LayoutRenderer />`.

### Provider & Renderer Setup

```tsx
import React from 'react';
import { OUASProvider, LayoutRenderer } from '@ouas/renderer';
import { EmailRow } from './components/EmailRow';
import { CalendarView } from './components/CalendarView';

const manifest = {
  ouas_version: "1.0.0",
  app_id: "com.mail.flow",
  app_name: "MailFlow",
  components: [
    { id: "email-row", display_name: "Email Row", category: "list", data_source: "emails" }
  ],
  data_sources: [{ id: "emails", type: "collection" }]
};

// Map component IDs from the Manifest to actual React component references
const componentRegistry = {
  'email-row': EmailRow,
  'calendar-view': CalendarView
};

const dataSources = {
  emails: [
    { id: '1', sender: 'Alice', subject: 'Adaptive UI rules!', date: new Date() },
    { id: '2', sender: 'Bob', subject: 'Checking in', date: new Date() }
  ]
};

export default function App() {
  return (
    <OUASProvider
      manifest={manifest}
      components={componentRegistry}
      dataSources={dataSources}
      userId="user_exec_101"
      agentApiBase="/api/ouas"
    >
      <div className="app-container">
        <header>
          <h1>My Adaptive App</h1>
        </header>
        
        {/* Mount the renderer — it will read the layout from the provider context */}
        <LayoutRenderer fallback={<div>Loading layouts...</div>} />
      </div>
    </OUASProvider>
  );
}
```

---

## Custom Layout Transitions

Layout changes automatically trigger custom animations between containers. All children components nested inside a layout region use the Framer Motion `layoutId` mechanism to morph seamlessly.

---

## License

MIT © OUAS Team
