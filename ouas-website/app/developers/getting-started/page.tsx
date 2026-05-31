import { Metadata } from "next";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { Rocket, ArrowRight, ArrowDown, Download, Code2, Terminal, Layers } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Getting Started - OUAS",
  description:
    "Set up OUAS in your project in under 5 minutes. Zero-dependency, lightweight drop-in for React and Next.js.",
};

const INSTALL_CODE = `npm install @ouas/react @ouas/renderer`;

const ANNOTATE_CODE = `import { withOUAS } from '@ouas/react';
import { Card } from './components/Card';

export const AdaptiveCard = withOUAS(Card, {
  id: 'adaptive-card',
  schema: {
    title: { type: 'string', required: true },
    variant: { type: 'string', enum: ['default', 'compact'] }
  }
});`;

const GENERATE_CODE = `npx ouas generate`;

const MOUNT_CODE = `import { OUASProvider } from '@ouas/react';
import manifest from './ouas-manifest.json';
import { AdaptiveCard } from './components/AdaptiveCard';

export default function App() {
  return (
    <OUASProvider manifest={manifest}>
      <AdaptiveCard title="Hello Agent!" />
    </OUASProvider>
  );
}`;

const STEPS = [
  {
    number: 1,
    icon: <Download className="h-5 w-5" />,
    title: "Install Dependencies",
    description:
      "Install the core SDK and the renderer. The SDK has zero external dependencies and is designed to be a lightweight drop-in.",
    code: INSTALL_CODE,
    lang: "bash" as const,
    filename: "terminal",
  },
  {
    number: 2,
    icon: <Code2 className="h-5 w-5" />,
    title: "Annotate Components",
    description:
      "Wrap your existing React components with the withOUAS() HOC. This defines the exact schema the AI agent is allowed to manipulate — nothing more, nothing less.",
    code: ANNOTATE_CODE,
    lang: "tsx" as const,
    filename: "AdaptiveCard.tsx",
  },
  {
    number: 3,
    icon: <Terminal className="h-5 w-5" />,
    title: "Generate Manifest",
    description:
      "Run the CLI to statically analyze your codebase, generate the Component Manifest, and validate your schemas against the OUAS specification.",
    code: GENERATE_CODE,
    lang: "bash" as const,
    filename: "terminal",
  },
  {
    number: 4,
    icon: <Layers className="h-5 w-5" />,
    title: "Mount the Renderer",
    description:
      "Wrap your adaptive section in OUASProvider. It parses incoming layout configurations and deterministically renders the annotated components.",
    code: MOUNT_CODE,
    lang: "tsx" as const,
    filename: "App.tsx",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* ─── Hero Section ──────────────────────────────────── */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-4 py-1.5 text-sm font-medium text-accent-primary mb-8 animate-fade-in-up">
              <Rocket className="h-4 w-4" />
              <span>5-Minute Setup</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              Getting Started
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              Add AI-adaptive layouts to your existing React or Next.js app in four simple steps. Our SDK is zero-dependency and designed for instant integration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <a href="#step-1">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  Jump to Step 1
                  <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </Button>
              </a>
              <Link href="/docs/getting-started">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Full Documentation
                </Button>
              </Link>
            </div>
          </section>

          {/* ─── Interactive SVG: Setup Flow Diagram ──────────── */}
          <section className="container mx-auto px-4 py-8">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-6 md:p-10 overflow-hidden shadow-2xl animate-fade-in-up [animation-delay:400ms]">
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-accent-primary/8 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/6 blur-[80px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-center overflow-x-auto">
                <svg
                  viewBox="0 0 920 120"
                  className="w-full max-w-4xl min-w-[600px]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Step 1 Node */}
                  <rect x="10" y="20" width="180" height="80" rx="14" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" />
                  <rect x="10" y="20" width="180" height="80" rx="14" fill="var(--accent-primary)" fillOpacity="0.05" />
                  <circle cx="40" cy="44" r="10" fill="var(--accent-primary)" fillOpacity="0.15" />
                  <text x="40" y="48" textAnchor="middle" fill="var(--accent-primary)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">1</text>
                  <text x="110" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Install</text>
                  <text x="110" y="72" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-sans)">npm install @ouas/*</text>

                  {/* Arrow 1→2 */}
                  <line x1="190" y1="60" x2="240" y2="60" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="6 4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                  </line>
                  <polygon points="240,54 252,60 240,66" fill="var(--accent-primary)" />

                  {/* Step 2 Node */}
                  <rect x="255" y="20" width="180" height="80" rx="14" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <circle cx="285" cy="44" r="10" fill="var(--accent-primary)" fillOpacity="0.15" />
                  <text x="285" y="48" textAnchor="middle" fill="var(--accent-primary)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">2</text>
                  <text x="355" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Annotate</text>
                  <text x="355" y="72" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-sans)">withOUAS(Component)</text>

                  {/* Arrow 2→3 */}
                  <line x1="435" y1="60" x2="485" y2="60" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="6 4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                  </line>
                  <polygon points="485,54 497,60 485,66" fill="var(--accent-primary)" />

                  {/* Step 3 Node */}
                  <rect x="500" y="20" width="180" height="80" rx="14" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <circle cx="530" cy="44" r="10" fill="var(--accent-primary)" fillOpacity="0.15" />
                  <text x="530" y="48" textAnchor="middle" fill="var(--accent-primary)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">3</text>
                  <text x="600" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Generate</text>
                  <text x="600" y="72" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-sans)">npx ouas generate</text>

                  {/* Arrow 3→4 */}
                  <line x1="680" y1="60" x2="730" y2="60" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="6 4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                  </line>
                  <polygon points="730,54 742,60 730,66" fill="var(--accent-primary)" />

                  {/* Step 4 Node */}
                  <rect x="745" y="20" width="165" height="80" rx="14" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" />
                  <rect x="745" y="20" width="165" height="80" rx="14" fill="var(--accent-primary)" fillOpacity="0.05" />
                  <circle cx="775" cy="44" r="10" fill="var(--accent-primary)" fillOpacity="0.15" />
                  <text x="775" y="48" textAnchor="middle" fill="var(--accent-primary)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">4</text>
                  <text x="838" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Mount</text>
                  <text x="838" y="72" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-sans)">&lt;OUASProvider /&gt;</text>
                </svg>
              </div>
            </div>
          </section>

          {/* ─── Step-by-Step Walkthrough ──────────────────────── */}
          <section className="container mx-auto px-4 py-16">
            <div className="space-y-8 max-w-4xl mx-auto">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  id={`step-${step.number}`}
                  className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 overflow-hidden group scroll-mt-24"
                >
                  {/* Ambient hover glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-primary bg-bg-base text-sm font-bold text-accent-primary ring-4 ring-bg-base shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                        {step.number}
                      </div>
                      <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
                      {step.description}
                    </p>
                    <CodeBlock code={step.code} lang={step.lang} filename={step.filename} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Bottom CTA Banner ────────────────────────────── */}
          <section className="container mx-auto px-4 py-16 pb-32">
            <div className="relative rounded-2xl border border-accent-primary/20 bg-surface/50 backdrop-blur-xl p-10 md:p-14 overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-primary/5 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-accent-primary/10 blur-[100px] rounded-full pointer-events-none" />

              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 relative z-10">
                Ready to go deeper?
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 relative z-10">
                Explore the complete documentation, advanced patterns, and the full API reference for the OUAS ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Link href="/docs">
                  <Button variant="primary" size="lg" className="group">
                    Explore Full Documentation
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/developers/react-sdk">
                  <Button variant="ghost" size="lg">
                    React SDK Reference
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
