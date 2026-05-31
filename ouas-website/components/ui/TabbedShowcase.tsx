"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────── */

export interface ShowcaseTab {
  id: string;
  label: string;
  /** A short tag shown beside the label */
  tag?: string;
  content: React.ReactNode;
}

interface TabbedShowcaseProps {
  tabs: ShowcaseTab[];
  className?: string;
  /** Auto-advance interval in ms. Pass 0 to disable. Default 5000. */
  interval?: number;
}

/* ─── Component ─────────────────────────────────────────────── */

export function TabbedShowcase({
  tabs,
  className,
  interval = 5000,
}: TabbedShowcaseProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const animRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number>(0);

  const activeTab = tabs[activeIdx];

  /* ── Auto-progress logic ─────────────────────────────────── */
  React.useEffect(() => {
    if (interval <= 0 || isPaused) {
      setProgress(0);
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / interval, 1);
      setProgress(pct);

      if (pct >= 1) {
        setActiveIdx((prev) => (prev + 1) % tabs.length);
        startRef.current = now;
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeIdx, interval, isPaused, tabs.length]);

  const selectTab = (idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
    startRef.current = performance.now();
  };

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        startRef.current = performance.now();
        setProgress(0);
      }}
    >
      {/* ── Tab bar ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 border-b border-border-color mb-8">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={tab.id}
              onClick={() => selectTab(idx)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-3 text-sm transition-colors rounded-t-xl z-10",
                isActive
                  ? "text-text-primary font-bold"
                  : "text-text-secondary font-medium hover:text-text-primary"
              )}
            >
              {/* Sliding Background */}
              {isActive && (
                <motion.div
                  layoutId="tab-background"
                  className="absolute inset-0 bg-surface rounded-t-xl -z-10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}

              <span className="relative z-10">{tab.label}</span>
              {tab.tag && (
                <span 
                  className={cn(
                    "relative z-10 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    isActive
                      ? "bg-lime-600/10 text-lime-700 dark:bg-accent-primary/10 dark:text-accent-primary"
                      : "bg-bg-elevated text-text-tertiary border border-border-color"
                  )}
                >
                  {tab.tag}
                </span>
              )}

              {/* Progress bar indicator */}
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 h-[2px] bg-accent-primary z-20"
                  style={{
                    width: interval > 0 ? `${progress * 100}%` : "100%",
                  }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content panel ─────────────────────────────────── */}
      <div className="relative min-h-[600px] md:min-h-[450px] lg:min-h-[400px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
