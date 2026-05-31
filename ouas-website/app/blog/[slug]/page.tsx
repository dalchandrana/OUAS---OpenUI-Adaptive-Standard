import { NavBar } from "@/components/ui/NavBar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // In a real app, we'd fetch the MDX post based on the slug.
  // For the mockup, we'll display a generic template.
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-8 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to blog
        </Link>
        
        <article>
          <header className="mb-10 text-center md:text-left border-b border-border-color pb-10">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6 text-sm text-text-secondary">
              <span className="font-semibold text-accent-primary uppercase tracking-wider">Spec Updates</span>
              <span>•</span>
              <span>Oct 24, 2026</span>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl mb-6">
              Introducing OUAS: The OpenUI Adaptive Standard
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-8">
              <div className="h-10 w-10 rounded-full bg-surface border border-border-color flex items-center justify-center font-bold text-sm">OU</div>
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary">OUAS Core Team</p>
                <p className="text-xs text-text-secondary">@ouas_standard</p>
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none prose-pre:bg-[#1c2128] prose-pre:border-border-color prose-headings:font-display">
            <p className="lead text-xl text-text-secondary mb-8">
              Today we are open-sourcing the first draft of the OpenUI Adaptive Standard (OUAS) — a deterministic, strictly validated specification that allows AI agents to interface directly with your React component tree.
            </p>
            
            <h2>The Problem with "AI-Generated UI"</h2>
            <p>
              Until now, AI UI generation has mostly meant "AI writes code for you." This is great for scaffolding, but terrible for runtime personalization. You can't safely eval arbitrary code that an LLM returns directly in a production application. The risk of breaking layouts, injecting XSS, or hallucinating props is too high.
            </p>

            <h2>Enter the Component Manifest</h2>
            <p>
              Instead of generating code, OUAS asks agents to generate a strictly typed JSON <strong>Layout Config</strong> based on an application's <strong>Component Manifest</strong>.
            </p>
            
            <blockquote>
              <p>OUAS moves AI out of the codebase and into the layout config.</p>
            </blockquote>

            <p>
              We'll be publishing more deep dives in the coming weeks. For now, check out the <Link href="/docs/getting-started" className="text-accent-primary no-underline hover:underline">Getting Started guide</Link> to try it out.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
