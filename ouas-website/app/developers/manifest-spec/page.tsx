import { Metadata } from "next";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { FileText, ArrowRight, Braces, GitBranch, Box, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Manifest Spec - OUAS",
  description:
    "The strict JSON schema defining the UI capabilities exposed to your AI agents.",
};

const MANIFEST_EXAMPLE = `{
  "ouas_version": "1.0.0",
  "app_id": "mailflow-dashboard",
  "components": [
    {
      "id": "KanbanColumn",
      "description": "A vertically scrollable column that holds Task cards.",
      "props": {
        "title": {
          "type": "string",
          "required": true,
          "description": "The header title of the column."
        },
        "priority": {
          "type": "enum",
          "values": ["high", "medium", "low"],
          "required": false
        }
      },
      "slots": {
        "children": {
          "allowed_components": ["TaskCard"],
          "max_items": 50
        }
      }
    }
  ]
}`;

const COMPONENT_SCHEMA_CODE = `{
  "id": "TaskCard",
  "description": "A draggable card representing a single task.",
  "props": {
    "title": { "type": "string", "required": true },
    "assignee": { "type": "string", "required": false },
    "status": {
      "type": "enum",
      "values": ["todo", "in-progress", "done"],
      "required": true
    },
    "dueDate": { "type": "string", "required": false }
  }
}`;

export default function ManifestSpecPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* ─── Hero Section ──────────────────────────────────── */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-4 py-1.5 text-sm font-medium text-accent-primary mb-8 animate-fade-in-up">
              <FileText className="h-4 w-4" />
              <span>The UI Contract</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              Manifest Spec
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              The strict JSON schema that acts as an &ldquo;API Reference&rdquo; for the AI Agent — defining exactly which UI components exist, what properties they accept, and what constraints they have.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link href="/docs/manifest-spec">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  View Full Spec
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/developers/getting-started">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Getting Started
                </Button>
              </Link>
            </div>
          </section>

          {/* ─── Interactive SVG: Schema Tree Visualizer ──────── */}
          <section className="container mx-auto px-4 py-8">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 md:p-12 overflow-hidden shadow-2xl animate-fade-in-up [animation-delay:400ms]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/8 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/6 blur-[80px] rounded-full pointer-events-none" />

              <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-4">Schema Structure</h2>
              <p className="text-text-secondary text-center max-w-xl mx-auto mb-10">
                A manifest is a tree describing your entire adaptable UI surface.
              </p>

              <div className="flex items-center justify-center overflow-x-auto py-4">
                <svg
                  viewBox="0 0 840 420"
                  className="w-full max-w-3xl min-w-[580px]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* ── LEVEL 0: Root ─────────────────────────── */}
                  <rect x="280" y="16" width="200" height="48" rx="14" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" />
                  <rect x="280" y="16" width="200" height="48" rx="14" fill="var(--accent-primary)" fillOpacity="0.06" />
                  {/* Glow pulse */}
                  <rect x="280" y="16" width="200" height="48" rx="14" fill="none" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.3">
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                  </rect>
                  <text x="380" y="46" textAnchor="middle" fill="var(--accent-primary)" fontSize="15" fontWeight="700" fontFamily="var(--font-display)">manifest.json</text>

                  {/* ── Vertical trunk line from root ────────── */}
                  <line x1="380" y1="64" x2="380" y2="90" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* ── Horizontal rail at L1 ─────────────────── */}
                  <line x1="110" y1="90" x2="650" y2="90" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* ── Drop lines to L1 nodes ───────────────── */}
                  <line x1="110" y1="90" x2="110" y2="110" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="380" y1="90" x2="380" y2="110" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="650" y1="90" x2="650" y2="110" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* ── LEVEL 1: Three children ──────────────── */}

                  {/* L1: ouas_version */}
                  <rect x="20" y="110" width="180" height="44" rx="10" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <text x="95" y="137" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">ouas_version</text>
                  <rect x="162" y="119" width="32" height="18" rx="5" fill="var(--accent-primary)" fillOpacity="0.12" />
                  <text x="178" y="132" textAnchor="middle" fill="var(--accent-primary)" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)">STR</text>

                  {/* L1: app_id */}
                  <rect x="290" y="110" width="180" height="44" rx="10" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <text x="370" y="137" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">app_id</text>
                  <rect x="432" y="119" width="32" height="18" rx="5" fill="var(--accent-primary)" fillOpacity="0.12" />
                  <text x="448" y="132" textAnchor="middle" fill="var(--accent-primary)" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)">STR</text>

                  {/* L1: components[] — highlighted */}
                  <rect x="560" y="110" width="180" height="44" rx="10" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="1.5" />
                  <rect x="560" y="110" width="180" height="44" rx="10" fill="var(--accent-primary)" fillOpacity="0.04" />
                  <text x="636" y="137" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">components[]</text>
                  <rect x="704" y="119" width="30" height="18" rx="5" fill="var(--accent-primary)" fillOpacity="0.15" />
                  <text x="719" y="132" textAnchor="middle" fill="var(--accent-primary)" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)">ARR</text>

                  {/* ── Vertical trunk from components[] ─────── */}
                  <line x1="650" y1="154" x2="650" y2="185" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* ── Horizontal rail at L2 ─────────────────── */}
                  <line x1="460" y1="185" x2="770" y2="185" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* ── Drop lines to L2 nodes ───────────────── */}
                  <line x1="460" y1="185" x2="460" y2="205" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="610" y1="185" x2="610" y2="205" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="770" y1="185" x2="770" y2="205" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* ── LEVEL 2: Component children ──────────── */}

                  {/* L2: id */}
                  <rect x="400" y="205" width="120" height="40" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="448" y="230" textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="500" fontFamily="var(--font-sans)">id</text>
                  <rect x="484" y="213" width="30" height="16" rx="4" fill="var(--accent-primary)" fillOpacity="0.1" />
                  <text x="499" y="225" textAnchor="middle" fill="var(--accent-primary)" fontSize="8" fontWeight="700" fontFamily="var(--font-sans)">STR</text>

                  {/* L2: props */}
                  <rect x="550" y="205" width="120" height="40" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="598" y="230" textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="500" fontFamily="var(--font-sans)">props</text>
                  <rect x="634" y="213" width="30" height="16" rx="4" fill="var(--accent-primary)" fillOpacity="0.1" />
                  <text x="649" y="225" textAnchor="middle" fill="var(--accent-primary)" fontSize="8" fontWeight="700" fontFamily="var(--font-sans)">OBJ</text>

                  {/* L2: slots */}
                  <rect x="710" y="205" width="110" height="40" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="753" y="230" textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="500" fontFamily="var(--font-sans)">slots</text>
                  <rect x="788" y="213" width="28" height="16" rx="4" fill="var(--accent-primary)" fillOpacity="0.1" />
                  <text x="802" y="225" textAnchor="middle" fill="var(--accent-primary)" fontSize="8" fontWeight="700" fontFamily="var(--font-sans)">OBJ</text>

                  {/* ── LEVEL 3: props children ──────────────── */}

                  {/* Vertical trunk from props */}
                  <line x1="610" y1="245" x2="610" y2="275" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* Horizontal rail at L3 */}
                  <line x1="480" y1="275" x2="740" y2="275" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* Drop lines to L3 */}
                  <line x1="480" y1="275" x2="480" y2="295" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="610" y1="275" x2="610" y2="295" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="740" y1="275" x2="740" y2="295" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* L3: type */}
                  <rect x="420" y="295" width="120" height="36" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="468" y="318" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontWeight="500" fontFamily="var(--font-sans)">type</text>
                  <rect x="504" y="302" width="30" height="14" rx="4" fill="var(--accent-primary)" fillOpacity="0.1" />
                  <text x="519" y="313" textAnchor="middle" fill="var(--accent-primary)" fontSize="7" fontWeight="700" fontFamily="var(--font-sans)">STR</text>

                  {/* L3: required */}
                  <rect x="550" y="295" width="120" height="36" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="598" y="318" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontWeight="500" fontFamily="var(--font-sans)">required</text>
                  <rect x="634" y="302" width="30" height="14" rx="4" fill="var(--accent-primary)" fillOpacity="0.1" />
                  <text x="649" y="313" textAnchor="middle" fill="var(--accent-primary)" fontSize="7" fontWeight="700" fontFamily="var(--font-sans)">BOOL</text>

                  {/* L3: enum */}
                  <rect x="680" y="295" width="110" height="36" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="723" y="318" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontWeight="500" fontFamily="var(--font-sans)">enum</text>
                  <rect x="757" y="302" width="28" height="14" rx="4" fill="var(--accent-primary)" fillOpacity="0.1" />
                  <text x="771" y="313" textAnchor="middle" fill="var(--accent-primary)" fontSize="7" fontWeight="700" fontFamily="var(--font-sans)">ARR</text>

                  {/* ── LEVEL 3: slots children ──────────────── */}

                  {/* Vertical trunk from slots */}
                  <line x1="765" y1="245" x2="765" y2="365" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* Horizontal connector to allowed_components */}
                  <line x1="700" y1="383" x2="765" y2="383" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>

                  {/* L3: allowed_components */}
                  <rect x="630" y="365" width="170" height="36" rx="8" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="703" y="388" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontWeight="500" fontFamily="var(--font-sans)">allowed_components</text>

                  {/* Horizontal line from trunk to node */}
                  <line x1="715" y1="383" x2="760" y2="383" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="5 3">
                    <animate attributeName="stroke-dashoffset" values="16;0" dur="2s" repeatCount="indefinite" />
                  </line>
                </svg>
              </div>
            </div>
          </section>

          {/* ─── Two-Column Deep Dive ──────────────────────────── */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left — Full manifest code */}
              <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                    <Braces className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">Complete Manifest Example</h3>
                </div>
                <CodeBlock code={MANIFEST_EXAMPLE} lang="json" filename="ouas-manifest.json" />
              </div>

              {/* Right — Annotated field cards */}
              <div className="space-y-5">
                {[
                  {
                    field: "ouas_version",
                    type: "String",
                    desc: "The version of the OUAS specification this manifest adheres to. Ensures compatibility between the SDK, CLI, and renderer.",
                    example: '"1.0.0"',
                  },
                  {
                    field: "app_id",
                    type: "String",
                    desc: "A unique identifier for the host application or specific view context. Allows multiple OUAS surfaces to coexist.",
                    example: '"mailflow-dashboard"',
                  },
                  {
                    field: "components[]",
                    type: "Array",
                    desc: "An array of ComponentSchema objects detailing every adaptable UI component. Each entry maps to a withOUAS()-wrapped React component.",
                    example: "[ { id, props, slots } ]",
                  },
                  {
                    field: "props",
                    type: "Object",
                    desc: "A standard JSON schema subset defining properties the component accepts. Supported types: string, number, boolean, array, enum.",
                    example: '{ type, required, enum }',
                  },
                  {
                    field: "slots",
                    type: "Object",
                    desc: "Defines where nested components can be placed. allowed_components restricts which IDs can render inside this slot, and max_items prevents infinite loops.",
                    example: '{ children: { allowed_components, max_items } }',
                  },
                ].map((item) => (
                  <div
                    key={item.field}
                    className="rounded-xl border border-border-color bg-surface/50 backdrop-blur-xl p-5 transition-colors hover:border-accent-primary/30 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-accent-primary font-mono font-bold text-sm">{item.field}</code>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary bg-accent-primary/10 rounded-full px-2 py-0.5">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-2">{item.desc}</p>
                    <code className="text-xs text-text-tertiary font-mono">{item.example}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Component Schema Card ─────────────────────────── */}
          <section className="container mx-auto px-4 py-16 pb-32">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
              <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                      <Box className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary">Component Schema</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    Each object inside the <code className="text-accent-primary font-mono">components</code> array strictly defines a single UI element. The AI Agent uses the <code className="text-accent-primary font-mono">id</code> to reference components and must respect the <code className="text-accent-primary font-mono">props</code> and <code className="text-accent-primary font-mono">slots</code> constraints.
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "Strict Typing" },
                      { icon: <GitBranch className="h-3.5 w-3.5" />, label: "Slot Constraints" },
                      { icon: <FileText className="h-3.5 w-3.5" />, label: "Semantic Descriptions" },
                    ].map((pill) => (
                      <div
                        key={pill.label}
                        className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-3 py-1.5 text-xs font-medium text-accent-primary"
                      >
                        {pill.icon}
                        {pill.label}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link href="/docs/manifest-spec">
                      <Button variant="primary" size="lg" className="group">
                        Read Full Specification
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <CodeBlock code={COMPONENT_SCHEMA_CODE} lang="json" filename="ComponentSchema" />
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
