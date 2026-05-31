"use client";

import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import { Brain, FileCode, Terminal, Users, ArrowRight, Zap, Code2, Cpu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SkillsFeaturePage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-bg-base">
      <GridBackground className="flex-1 relative">
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-4 py-1.5 text-sm font-medium text-accent-primary mb-8 animate-fade-in-up">
              <Brain className="h-4 w-4" />
              <span>Context Injection Layer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 animate-fade-in-up [animation-delay:100ms]">
              OUAS Skills
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
              Teach any AI agent the OUAS programming model instantly. No pre-training required. Inject rules, anti-patterns, and checklists directly into their context window.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link href="/docs/skills">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                  See Full Details
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Interactive SVG Animation Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="relative rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-12 overflow-hidden flex flex-col items-center justify-center group cursor-crosshair"
                whileHover="hover"
                initial="initial"
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="text-2xl font-bold text-text-primary mb-12 relative z-10">Hover to Inject Skills</h3>

                <div className="relative flex items-center justify-between w-full max-w-lg z-10">
                  {/* The Document (Skill File) */}
                  <motion.div
                    variants={{
                      initial: { x: 0, scale: 1, opacity: 1 },
                      hover: { x: 150, scale: 0.5, opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }
                    }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="h-20 w-16 bg-surface border border-border-color rounded flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-accent-primary/10" />
                      <FileCode className="h-8 w-8 text-accent-primary" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">.cursorrules</span>
                  </motion.div>

                  {/* Connecting Beam */}
                  <div className="absolute left-1/2 top-10 -translate-x-1/2 w-64 h-0.5 bg-border-color/50 -z-10">
                    <motion.div 
                      variants={{
                        initial: { width: "0%", opacity: 0 },
                        hover: { width: "100%", opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
                      }}
                      className="h-full bg-accent-primary shadow-[0_0_10px_rgba(var(--color-accent-primary),0.8)]"
                    />
                  </div>

                  {/* The AI Agent (Brain) */}
                  <motion.div
                    variants={{
                      initial: { scale: 1, filter: "drop-shadow(0 0 0px rgba(var(--color-accent-primary), 0))" },
                      hover: { 
                        scale: 1.1, 
                        filter: "drop-shadow(0 0 20px rgba(255,255,255, 0.2))",
                        transition: { delay: 0.6, duration: 0.4 }
                      }
                    }}
                    className="flex flex-col items-center gap-3 relative"
                  >
                    <div className="h-24 w-24 rounded-full bg-bg-base border border-border-color flex items-center justify-center relative overflow-hidden z-10">
                      <motion.div 
                        variants={{
                          initial: { opacity: 0 },
                          hover: { opacity: 1, transition: { delay: 0.6, duration: 0.4 } }
                        }}
                        className="absolute inset-0 bg-accent-primary/20 animate-pulse"
                      />
                      <Cpu className="h-10 w-10 text-text-primary z-10" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">AI Agent</span>
                    
                    {/* Knowledge sparks after injection */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, scale: 0 },
                        hover: { opacity: 1, scale: 1, transition: { delay: 0.8, duration: 0.3 } }
                      }}
                      className="absolute -top-4 -right-4"
                    >
                      <Zap className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  </motion.div>
                </div>

                <motion.p 
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    hover: { opacity: 1, y: 0, transition: { delay: 1, duration: 0.4 } }
                  }}
                  className="mt-12 text-center text-accent-primary font-medium"
                >
                  Agent successfully loaded OUAS Rules & Patterns
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Bento Grid Features */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 hover:bg-surface/80 transition-colors">
                <FileCode className="h-8 w-8 text-accent-primary mb-6" />
                <h3 className="text-xl font-bold text-text-primary mb-3">Master Skills File</h3>
                <p className="text-text-secondary leading-relaxed">
                  The core `ouas.skill.md` teaches the agent the entire OUAS programming model. It includes strict rules, anti-patterns to avoid, and exact code templates to copy.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 hover:bg-surface/80 transition-colors">
                <Code2 className="h-8 w-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-text-primary mb-3">Task-Specific Skills</h3>
                <p className="text-text-secondary leading-relaxed">
                  Smaller, scoped files for specific development tasks. Whether you are annotating components, writing manifests, or implementing the Agent API, there is a dedicated skill.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 hover:bg-surface/80 transition-colors">
                <Terminal className="h-8 w-8 text-green-400 mb-6" />
                <h3 className="text-xl font-bold text-text-primary mb-3">CLI Integration</h3>
                <p className="text-text-secondary leading-relaxed">
                  Run `npx ouas init --skills` to automatically detect your agent (Cursor, Copilot, Windsurf) and write the perfectly formatted context file directly into your workspace.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-border-color bg-surface/50 backdrop-blur-xl p-8 hover:bg-surface/80 transition-colors">
                <Users className="h-8 w-8 text-purple-400 mb-6" />
                <h3 className="text-xl font-bold text-text-primary mb-3">Community Skills</h3>
                <p className="text-text-secondary leading-relaxed">
                  Third-party library authors can publish their own OUAS skills. The CLI will automatically discover and merge them, allowing the ecosystem to grow organically.
                </p>
              </div>
            </div>
          </section>
        </main>
      </GridBackground>
    </div>
  );
}
