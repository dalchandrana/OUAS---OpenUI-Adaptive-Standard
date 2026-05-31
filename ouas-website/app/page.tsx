import { MegaMenuNavBar } from "@/components/ui/MegaMenuNavBar";
import { GridBackground } from "@/components/ui/GridBackground";
import { DashedGrid, DashedGridItem } from "@/components/ui/DashedGrid";
import { Button } from "@/components/ui/Button";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { HomeShowcase } from "@/components/sections/HomeShowcase";
import Link from "next/link";
import {
  Layers,
  Shield,
  Cpu,
  Zap,
  Code2,
  Puzzle,
  ArrowRight,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Adaptive Layouts",
    description:
      "Define component surfaces once; let AI agents reconfigure them at runtime across any framework.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Validated Mutations",
    description:
      "Every layout change passes a strict JSON Schema pipeline — zero hallucinations, zero runtime crashes.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Agent Protocol",
    description:
      "A deterministic JSON API that any LLM agent can call to reshape interfaces without fragile screen-scraping.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Real-Time Updates",
    description:
      "Layout configs stream over WebSocket for instant, flicker-free UI transitions as context changes.",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "React SDK",
    description:
      "Drop-in withOUAS() wrapper. Keep your component library — just annotate what's adaptable.",
  },
  {
    icon: <Puzzle className="h-5 w-5" />,
    title: "Framework Agnostic",
    description:
      "The spec is pure JSON. Renderers exist for React today, with Vue, Svelte, and native on the roadmap.",
  },
];

const MARQUEE_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "JSON Schema",
  "WebSocket",
  "LLM Agents",
  "Zod",
  "Manifest",
];

/* ─── Page ──────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <MegaMenuNavBar />

      <main className="flex-1">
        {/* ═══════════════ HERO ═══════════════ */}
        <GridBackground className="pt-16 pb-24 md:pt-28 md:pb-40" showOrbs>
          <section className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* Badge CTA */}
              <Link
                href="/docs"
                className="group relative inline-flex items-center justify-center rounded-full p-[1px] mb-8 overflow-hidden font-medium text-sm text-text-primary shadow-sm"
              >
                {/* Animated spinning gradient border */}
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-success)_0%,transparent_50%,transparent_100%)] opacity-70" />

                {/* Inner pill background */}
                <div className="relative inline-flex items-center gap-2 rounded-full bg-bg-base px-4 py-1.5 transition-colors group-hover:bg-surface w-full h-full">
                  Ship Dynamic SaaS
                  <ArrowRight className="h-3.5 w-3.5 text-text-secondary transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>

              {/* Headline */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.2rem] !leading-[1.06]">
                The open standard
                <br />
                for Adaptive Frontend
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl">
                Build interfaces that AI agents can dynamically reconfigure in
                real-time safely, deterministically, and beautifully.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/docs/getting-started">
                  <Button variant="primary" size="lg" className="group px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="ghost" size="lg" className="px-8 bg-surface">
                    See Demo
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </GridBackground>

        {/* ═══════════════ MARQUEE ═══════════════ */}
        <section className="w-full py-10 overflow-hidden">
          <div className="container mx-auto mb-6 px-4 text-center">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.2em]">
              Powered by modern standards
            </p>
          </div>
          <div
            className="relative"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <MarqueeStrip
              direction="left"
              speed="slow"
              className="border-0 bg-transparent"
            >
              {MARQUEE_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className="mx-6 whitespace-nowrap font-display text-lg font-semibold text-text-tertiary/60 select-none"
                >
                  {item}
                </span>
              ))}
            </MarqueeStrip>
          </div>
        </section>

        {/* ═══════════════ PROBLEM STATEMENT ═══════════════ */}
        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-2xl text-center mb-16">

            <h2 className="font-display text-3xl font-bold md:text-5xl !leading-tight">
              Software today looks the same for everyone.
            </h2>
            <p className="mt-4 text-text-secondary md:text-lg">
              That's a problem when every user has a different goal.
            </p>
          </div>

          <DashedGrid columns={3}>
            <DashedGridItem
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="9" x2="9" y2="21" />
                </svg>
              }
              title="Rigid Layouts"
              description="Hardcoded interfaces force users into one-size-fits-all workflows that ignore context and intent."
            >
              <></>
            </DashedGridItem>
            <DashedGridItem
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              }
              title="Feature Bloat"
              description="Adding options for everyone means cluttering the UI for anyone. Complexity grows, but value doesn't."
            >
              <></>
            </DashedGridItem>
            <DashedGridItem
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              }
              title="Agent Blindness"
              description="AI tools can read data, but they can't natively reshape your application's UI in a safe, deterministic way."
            >
              <></>
            </DashedGridItem>
          </DashedGrid>
        </section>

        {/* ═══════════════ FEATURES GRID ═══════════════ */}
        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-xs font-semibold text-lime-700 dark:text-accent-primary uppercase tracking-[0.2em] mb-4">
              Capabilities
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl !leading-tight">
              Everything you need for adaptive interfaces.
            </h2>
            <p className="mt-4 text-text-secondary md:text-lg">
              A complete specification — from schema definitions to real-time
              rendering.
            </p>
          </div>

          <DashedGrid columns={3}>
            {FEATURES.map((feature) => (
              <DashedGridItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              >
                <></>
              </DashedGridItem>
            ))}
          </DashedGrid>
        </section>

        {/* ═══════════════ TABBED SHOWCASE ═══════════════ */}
        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-xs font-semibold text-lime-700 dark:text-accent-primary uppercase tracking-[0.2em] mb-4">
              How it Works
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl !leading-tight">
              From annotation to adaptation.
            </h2>
            <p className="mt-4 text-text-secondary md:text-lg">
              Three perspectives on the same powerful standard.
            </p>
          </div>
          <HomeShowcase />
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="relative overflow-hidden rounded-2xl border border-border-color bg-surface p-8 md:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-2xl font-bold md:text-3xl">
                  Ready to build adaptive UIs?
                </h3>
                <p className="mt-2 text-text-secondary max-w-md">
                  Get started with the OUAS spec and React SDK in under 5
                  minutes. Or paste context into your favorite AI agent.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/docs/getting-started">
                  <Button variant="primary" size="lg" className="group">
                    Read the Docs
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-border-color bg-surface/50 py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4 md:col-span-2 md:max-w-xs">
              <span className="font-display text-xl font-bold">OUAS</span>
              <p className="text-sm text-text-secondary leading-relaxed">
                The open, deterministic specification for AI-driven user
                interfaces. Build once, adapt everywhere.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li>
                  <Link
                    href="/docs"
                    className="transition-colors hover:text-text-primary"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo"
                    className="transition-colors hover:text-text-primary"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-text-primary"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Community
              </h4>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-text-primary"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-text-primary"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border-color pt-6 text-center text-xs text-text-tertiary">
            © {new Date().getFullYear()} OpenUI Adaptive Standard. Open-source
            under MIT.
          </div>
        </div>
      </footer>
    </div>
  );
}
