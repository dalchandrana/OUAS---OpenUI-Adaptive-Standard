import { Metadata } from "next";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { Shield, ShieldAlert, ShieldCheck, Lock, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Validation Pipeline - OUAS",
  description: "Strict schema guards against hallucinations.",
};

const ZOD_EXAMPLE = `import { z } from "zod";

// The Strict Contract
export const layoutSchema = z.object({
  type: z.literal("layout_update"),
  components: z.array(z.object({
    id: z.string(),
    variant: z.enum(["default", "compact", "expanded"]),
    props: z.record(z.unknown())
  })).min(1)
});

// Any hallucinated fields or invalid types
// are blocked before reaching the UI layer.`;

export default function ValidationPipelinePage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-sm font-medium text-green-500 mb-8 animate-fade-in-up">
              <Lock className="h-4 w-4" />
              <span>Zero-Trust Architecture</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              Validation Pipeline
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              Strict schema guards against AI hallucinations. Guarantee type-safety, structural integrity, and deterministic rendering for every agent response.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link href="/docs/validation">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Bento Grid Features */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-2 relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
                <ShieldCheck className="h-10 w-10 text-green-500 mb-6" />
                <h3 className="text-2xl font-bold text-text-primary mb-3">Zod Schema Enforcement</h3>
                <p className="text-text-secondary leading-relaxed max-w-md mb-8">
                  Every JSON payload emitted by the agent is validated against strict Zod schemas before interacting with your React components.
                </p>
                <div className="relative rounded-xl overflow-hidden border border-border-color bg-bg-base/80 p-2 shadow-lg">
                  <CodeBlock code={ZOD_EXAMPLE} lang="typescript" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 flex flex-col">
                <div className="flex-1">
                  <Activity className="h-10 w-10 text-accent-primary mb-6" />
                  <h3 className="text-xl font-bold text-text-primary mb-3">Runtime Integrity</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Real-time error boundary catching prevents rogue attributes from breaking the DOM structure or bypassing sanitization.
                  </p>
                </div>
                
                {/* Abstract Visual */}
                <div className="mt-8 relative h-32 w-full rounded-xl bg-bg-base/50 border border-border-color overflow-hidden flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="h-0.5 w-12 bg-border-color relative overflow-hidden">
                       <div className="absolute top-0 left-0 h-full w-full bg-accent-primary transform -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="md:col-span-3 relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-green-500/5 pointer-events-none" />
                <Shield className="h-12 w-12 text-text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-text-primary mb-4">Fail-Safe Fallbacks</h3>
                <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
                  If the AI deviates from the schema or produces hallucinated parameters, OUAS gracefully intercepts the error and falls back to a deterministic, safe state without disrupting the user experience.
                </p>
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
