import { Metadata } from "next";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { Layers, Zap, Sparkles, Cpu } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Adaptive Layouts - OUAS",
  description: "AI-driven UI reconfigurations at runtime.",
};

const CODE_EXAMPLE = `// The Agent responds with a new layout intention
{
  "type": "layout_update",
  "priority": "high",
  "components": [
    {
      "id": "hero-section",
      "variant": "compact",
      "props": {
        "title": "Welcome back, User",
        "actionPrimary": "View Dashboard"
      }
    }
  ]
}`;

export default function AdaptiveLayoutsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-4 py-1.5 text-sm font-medium text-accent-primary mb-8 animate-fade-in-up">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen UI Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              Adaptive Layouts
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              Interfaces that evolve in real-time. OUAS empowers AI agents to intelligently restructure your UI based on context, intent, and user behavior.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link href="/docs/layout-config-spec">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  View Specification
                  <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Feature Visual/SVG Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 overflow-hidden shadow-2xl">
              {/* Custom SVG Illustration for Morphing UI */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                 <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <circle cx="200" cy="150" r="100" fill="url(#grad1)" filter="blur(40px)" />
                    <circle cx="600" cy="250" r="120" fill="url(#grad1)" filter="blur(60px)" />
                 </svg>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-xl font-semibold text-text-primary">
                    <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                      <Layers className="h-6 w-6" />
                    </div>
                    Runtime Reconfiguration
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Say goodbye to static, rigid views. By interpreting JSON manifests from AI agents, the layout dynamically swaps components, alters hierarchies, and injects context-aware data without a full page reload.
                  </p>
                  <ul className="space-y-3">
                    {['Zero-latency morphing', 'Context-aware component swapping', 'Deterministic fallback states'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-secondary">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-border-color bg-bg-base/80 p-2 shadow-lg">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border-color mb-2">
                    <Cpu className="h-4 w-4 text-text-tertiary" />
                    <span className="text-xs font-medium text-text-tertiary">agent-response.json</span>
                  </div>
                  <CodeBlock code={CODE_EXAMPLE} lang="json" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
