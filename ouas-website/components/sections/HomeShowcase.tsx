import { TabbedShowcase, type ShowcaseTab } from "@/components/ui/TabbedShowcase";
import { Code2, Users, Bot } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";

const SHOWCASE_TABS: ShowcaseTab[] = [
  {
    id: "developers",
    label: "For Developers",
    tag: "SDK",
    content: (
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-primary">
              <Code2 className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl font-bold">
              Standardized Annotations
            </h3>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Wrap your existing React components with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-accent-primary text-sm font-mono">
              withOUAS()
            </code>{" "}
            to instantly expose them to AI agents. No rewrite required — just
            annotate what's adaptable.
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
              Type-safe schema definitions via Zod
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
              Automatic manifest generation
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
              Zero runtime overhead in production
            </li>
          </ul>
        </div>
        <div className="w-full relative group z-0">
          {/* Glowing Ambient Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[400px] max-h-[300px] bg-accent-primary/20 blur-[100px] rounded-full pointer-events-none -z-10 transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
          
          <CodeBlock
            code={`// 1. Import the wrapper
import { withOUAS } from '@ouas/react';

// 2. Annotate your component
export const Sidebar = withOUAS(
  BaseSidebar,
  {
    id: 'main-sidebar',
    schema: {
      collapsed: { type: 'boolean' },
      items: { type: 'array' }
    }
  }
);`}
            lang="tsx"
            filename="Sidebar.tsx"
          />
        </div>
      </div>
    ),
  },
  {
    id: "users",
    label: "For Users",
    content: (
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-secondary/10 text-accent-secondary">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl font-bold">
              Infinite Personalization
            </h3>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Interfaces that adapt to the task at hand. Turn a generic list into
            a Kanban board, calendar, or data table — all driven by natural
            language conversation with an AI agent.
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-secondary shrink-0" />
              Tell the AI what you need, see the UI reshape
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-secondary shrink-0" />
              Persistent layout preferences
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-secondary shrink-0" />
              Safe — AI can't access raw data, only reshape the interface
            </li>
          </ul>
        </div>
        <div className="w-full relative group z-0 h-full flex flex-col justify-center">
          {/* Glowing Ambient Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[400px] max-h-[300px] bg-accent-secondary/20 blur-[100px] rounded-full pointer-events-none -z-10 transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
          
          <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-6 overflow-hidden flex items-center justify-center min-h-[260px] shadow-xl">
             <svg viewBox="0 0 400 240" className="w-full max-w-[360px] h-auto" xmlns="http://www.w3.org/2000/svg">
                {/* User Prompt */}
                <rect x="20" y="20" width="220" height="48" rx="24" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                <circle cx="44" cy="44" r="14" fill="var(--accent-secondary)" fillOpacity="0.15" />
                <text x="44" y="48" textAnchor="middle" fill="var(--accent-secondary)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">U</text>
                <text x="70" y="48" fill="var(--text-secondary)" fontSize="11.5" fontFamily="var(--font-sans)">&quot;Group my emails by priority&quot;</text>

                {/* Animated Line 1 */}
                <path d="M 240 44 C 280 44, 280 100, 320 100" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeDasharray="6 4">
                   <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                </path>

                {/* AI Agent Node */}
                <rect x="240" y="100" width="140" height="60" rx="12" fill="var(--accent-primary)" fillOpacity="0.05" stroke="var(--accent-primary)" strokeWidth="2" />
                {/* AI Pulse */}
                <rect x="240" y="100" width="140" height="60" rx="12" fill="none" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.4">
                   <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
                </rect>
                <circle cx="265" cy="130" r="10" fill="var(--accent-primary)" fillOpacity="0.2" />
                <text x="265" y="134" textAnchor="middle" fill="var(--accent-primary)" fontSize="10" fontWeight="700" fontFamily="var(--font-sans)">AI</text>
                <text x="285" y="126" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Processing</text>
                <text x="285" y="142" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-sans)">Generating Layout</text>

                {/* Animated Line 2 */}
                <path d="M 240 130 C 200 130, 200 185, 160 185" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="6 4">
                   <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                </path>

                {/* UI Update Layout */}
                <rect x="20" y="150" width="140" height="75" rx="12" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="1.5" />
                <rect x="20" y="150" width="140" height="75" rx="12" fill="var(--accent-primary)" fillOpacity="0.05" />
                <text x="90" y="172" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">Kanban Layout</text>
                
                {/* Kanban columns */}
                <rect x="35" y="185" width="30" height="28" rx="4" fill="var(--accent-primary)" fillOpacity="0.2" />
                <rect x="75" y="185" width="30" height="20" rx="4" fill="var(--accent-primary)" fillOpacity="0.2" />
                <rect x="115" y="185" width="30" height="24" rx="4" fill="var(--accent-primary)" fillOpacity="0.2" />
             </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "agents",
    label: "For AI Agents",
    tag: "API",
    content: (
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-primary">
              <Bot className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl font-bold">
              Deterministic Control
            </h3>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Agents interact with a strictly validated JSON layout manifest.
            Every mutation is schema-checked before it reaches the renderer —
            ensuring zero runtime layout crashes or hallucinations.
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
              JSON-only API — no DOM access
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
              Schema validation on every mutation
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
              Audit trail for every layout change
            </li>
          </ul>
        </div>
        <div className="w-full relative group z-0">
          {/* Glowing Ambient Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[400px] max-h-[300px] bg-accent-primary/20 blur-[100px] rounded-full pointer-events-none -z-10 transition-opacity duration-700 opacity-60 group-hover:opacity-100" />

          <CodeBlock
            code={`// Agent sends a layout mutation
{
  "action": "UPDATE_LAYOUT",
  "target": "main-sidebar",
  "payload": {
    "collapsed": false,
    "items": [
      { "id": "inbox", "visible": true },
      { "id": "sent",  "visible": false },
      { "id": "tasks", "visible": true }
    ]
  }
}
// ✓ Validated → Rendered instantly`}
            lang="json"
            filename="mutation.json"
          />
        </div>
      </div>
    ),
  },
];

export function HomeShowcase() {
  return <TabbedShowcase tabs={SHOWCASE_TABS} interval={6000} />;
}
