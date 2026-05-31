import { Metadata } from "next";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { Code2, ArrowRight, Package, Workflow, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "React SDK - OUAS",
  description:
    "Drop-in withOUAS() wrapper for React components. The official bindings for integrating the OpenUI Adaptive Standard into React and Next.js applications.",
};

const WITHOUAS_CODE = `import { withOUAS } from '@ouas/react';

const WeatherCardBase = ({ city, temperature, condition }) => {
  return (
    <div className="weather-card">
      <h3>{city}</h3>
      <p>{temperature}°C - {condition}</p>
    </div>
  );
};

export const WeatherCard = withOUAS(WeatherCardBase, {
  id: 'weather-card',
  schema: {
    city: { type: 'string', required: true },
    temperature: { type: 'number', required: true },
    condition: { 
      type: 'string', 
      required: true, 
      enum: ['sunny', 'cloudy', 'rainy', 'snowy'] 
    }
  }
});`;

const AUTO_REGISTER_CODE = `import { WeatherCard } from '@/components/WeatherCard';
// ✅ By importing WeatherCard, it is automatically
//    added to the OUAS Registry. No manual step needed.

export default function Page() {
  return (
    <main>
      <WeatherCard city="San Francisco" temperature={18} condition="sunny" />
    </main>
  );
}`;

const SCHEMA_CODE = `// Schema defines the EXACT contract the AI must follow
schema: {
  city: { 
    type: 'string', 
    required: true, 
    description: 'The name of the city' 
  },
  temperature: { 
    type: 'number', 
    required: true 
  },
  condition: { 
    type: 'string', 
    required: true, 
    enum: ['sunny', 'cloudy', 'rainy', 'snowy'] 
  }
}`;

export default function ReactSdkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* ─── Hero Section ──────────────────────────────────── */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-4 py-1.5 text-sm font-medium text-accent-primary mb-8 animate-fade-in-up">
              <Code2 className="h-4 w-4" />
              <span>Official React Bindings</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              React SDK
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              A drop-in <code className="text-accent-primary font-mono text-lg">withOUAS()</code> higher-order component that exposes your React components to AI agents — with strict schema typing and zero config.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link href="/docs/sdk-react">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  Read Full Reference
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/developers/getting-started">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Quick Start Guide
                </Button>
              </Link>
            </div>
          </section>

          {/* ─── Interactive SVG: Component Wrapping Visualizer ─ */}
          <section className="container mx-auto px-4 py-12">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 md:p-12 overflow-hidden shadow-2xl animate-fade-in-up [animation-delay:400ms]">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-accent-primary/8 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/8 blur-[80px] rounded-full pointer-events-none" />

              <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-4">How It Works</h2>
              <p className="text-text-secondary text-center max-w-xl mx-auto mb-12">
                Wrap any React component to expose it safely to the OUAS engine.
              </p>

              {/* SVG Flow Diagram */}
              <div className="flex items-center justify-center">
                <svg
                  viewBox="0 0 900 180"
                  className="w-full max-w-3xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Node 1 — React Component */}
                  <rect x="20" y="40" width="220" height="100" rx="16" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <text x="130" y="80" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)">React Component</text>
                  <text x="130" y="105" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontFamily="var(--font-sans)">&lt;WeatherCard /&gt;</text>

                  {/* Arrow 1 */}
                  <line x1="240" y1="90" x2="310" y2="90" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="6 4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                  </line>
                  <polygon points="310,84 324,90 310,96" fill="var(--accent-primary)" />

                  {/* Node 2 — withOUAS() */}
                  <rect x="330" y="30" width="240" height="120" rx="16" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" />
                  <rect x="330" y="30" width="240" height="120" rx="16" fill="var(--accent-primary)" fillOpacity="0.05" />
                  <text x="450" y="70" textAnchor="middle" fill="var(--accent-primary)" fontSize="15" fontWeight="700" fontFamily="var(--font-display)">withOUAS()</text>
                  <text x="450" y="95" textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontFamily="var(--font-sans)">Schema validation</text>
                  <text x="450" y="115" textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontFamily="var(--font-sans)">Auto-registration</text>

                  {/* Arrow 2 */}
                  <line x1="570" y1="90" x2="640" y2="90" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="6 4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                  </line>
                  <polygon points="640,84 654,90 640,96" fill="var(--accent-primary)" />

                  {/* Node 3 — OUAS Registry */}
                  <rect x="660" y="40" width="220" height="100" rx="16" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <text x="770" y="80" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)">OUAS Registry</text>
                  <text x="770" y="105" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontFamily="var(--font-sans)">manifest.json</text>

                  {/* Pulse on center node */}
                  <rect x="330" y="30" width="240" height="120" rx="16" fill="none" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.4">
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="strokeWidth" values="1;3;1" dur="2s" repeatCount="indefinite" />
                  </rect>
                </svg>
              </div>
            </div>
          </section>

          {/* ─── Bento Grid Features ──────────────────────────── */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 — withOUAS HOC */}
              <div className="md:col-span-2 relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">The withOUAS() HOC</h3>
                </div>
                <p className="text-text-secondary leading-relaxed max-w-md mb-6">
                  Wrap any React component to expose it to the AI. Define an explicit JSON schema that locks down exactly which properties the agent can manipulate.
                </p>
                <CodeBlock code={WITHOUAS_CODE} lang="tsx" filename="components/WeatherCard.tsx" />
              </div>

              {/* Card 2 — Auto Registration */}
              <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">Auto-Registration</h3>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  No manual registry management. Simply importing a wrapped component into your app automatically registers it in the OUAS engine.
                </p>
                <div className="mt-auto">
                  <CodeBlock code={AUTO_REGISTER_CODE} lang="tsx" filename="app/page.tsx" />
                </div>
              </div>

              {/* Card 3 — Strict Schema Typing (full width) */}
              <div className="md:col-span-3 relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
                <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary">Strict Schema Typing</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      The schema object is the firewall between your UI and the AI. It enforces types, required fields, and enum constraints — preventing hallucinated props from reaching the DOM.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Type-safe property injection",
                        "Enum constraints for categorical values",
                        "Required vs optional field enforcement",
                        "Semantic descriptions for LLM context",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <CodeBlock code={SCHEMA_CODE} lang="typescript" filename="schema-definition" />
                </div>
              </div>
            </div>
          </section>

          {/* ─── API Reference Summary ────────────────────────── */}
          <section className="container mx-auto px-4 py-16 pb-32">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 md:p-12 overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent pointer-events-none" />
              <h2 className="text-3xl font-bold text-text-primary mb-8 relative z-10">API Reference</h2>

              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="rounded-xl border border-border-color bg-bg-base/80 p-6 text-left">
                  <code className="text-accent-primary font-mono text-lg font-bold">
                    withOUAS(Component, config)
                  </code>
                  <p className="text-text-secondary mt-4 mb-6 text-sm leading-relaxed">
                    Wraps a standard React component and returns an OUAS-compliant component that is tracked by the engine.
                  </p>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <span className="text-accent-primary font-mono font-medium shrink-0">Component</span>
                      <span className="text-text-tertiary">—</span>
                      <span className="text-text-secondary">React.ComponentType — the React component to wrap.</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-accent-primary font-mono font-medium shrink-0">config.id</span>
                      <span className="text-text-tertiary">—</span>
                      <span className="text-text-secondary">string — unique kebab-case identifier for the component.</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-accent-primary font-mono font-medium shrink-0">config.schema</span>
                      <span className="text-text-tertiary">—</span>
                      <span className="text-text-secondary">Object — key-value map defining the properties the AI can inject.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/docs/sdk-react">
                    <Button variant="primary" size="lg" className="group">
                      Read Full API Reference
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
