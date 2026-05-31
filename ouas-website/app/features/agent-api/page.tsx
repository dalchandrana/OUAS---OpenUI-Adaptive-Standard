import { Metadata } from "next";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { Cpu, Terminal, Braces, ArrowRight, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Agent API - OUAS",
  description: "JSON protocol for AI agents to reshape UIs.",
};

const REQUEST_PAYLOAD = `{
  "agent_id": "ux-optimizer-01",
  "intent": "emphasize_call_to_action",
  "context": {
    "user_tier": "free",
    "device": "mobile"
  }
}`;

const RESPONSE_PROTOCOL = `{
  "type": "layout_update",
  "components": [
    {
      "id": "pricing-cta",
      "variant": "highlighted",
      "props": {
        "buttonText": "Upgrade Now",
        "badgeText": "Most Popular"
      }
    }
  ]
}`;

export default function AgentApiPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-500 mb-8 animate-fade-in-up">
              <Terminal className="h-4 w-4" />
              <span>Developer First</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              Agent API
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              A standardized JSON protocol enabling any LLM or AI Agent to orchestrate frontend views natively without writing code.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link href="/docs/agent-api">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  Read API Reference
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Communication Visual Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-4">Bi-Directional Context</h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  Agents consume application context and emit deterministic layout instructions. The API abstracts away the React rendering tree.
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 relative">
                {/* Context Provider */}
                <div className="flex-1 relative rounded-xl border border-border-color bg-bg-base p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-surface">
                      <Braces className="h-5 w-5 text-text-secondary" />
                    </div>
                    <h3 className="font-semibold text-text-primary">1. Context Injection</h3>
                  </div>
                  <CodeBlock code={REQUEST_PAYLOAD} lang="json" />
                </div>
                
                {/* Connector (hidden on mobile, visible on desktop) */}
                <div className="hidden lg:flex items-center justify-center relative w-16">
                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-color -translate-y-1/2" />
                   <div className="relative z-10 w-10 h-10 rounded-full bg-surface border border-border-color flex items-center justify-center shadow-md">
                     <ArrowRightLeft className="h-4 w-4 text-accent-primary" />
                   </div>
                </div>
                
                {/* Agent Response */}
                <div className="flex-1 relative rounded-xl border border-blue-500/30 bg-bg-base p-6 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-text-primary">2. Agent Orchestration</h3>
                  </div>
                  <CodeBlock code={RESPONSE_PROTOCOL} lang="json" />
                </div>
              </div>
              
              {/* SVG Background decoration */}
              <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden opacity-30 pointer-events-none rounded-b-2xl">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 100 Q 250 0 500 100 T 1000 100 L 1000 200 L 0 200 Z" fill="url(#blue-gradient)" />
                  <defs>
                    <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
