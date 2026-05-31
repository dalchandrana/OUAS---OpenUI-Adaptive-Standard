"use client";

import React from "react";
import { motion } from "framer-motion";
import { CopyPageCTA } from "@/components/docs/CopyPageCTA";

interface DocHeroProps {
  title: string;
  subtitle: string;
}

export function DocHero({ title, subtitle }: DocHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-color bg-surface/50 p-8 md:p-12 mb-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] h-[300px] bg-accent-primary/10 dark:bg-accent-primary/20 blur-[80px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[250px] h-[250px] bg-accent-primary/5 dark:bg-accent-primary/10 blur-[60px] rounded-full pointer-events-none z-0" />

      {/* CTA at the top right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <CopyPageCTA title={title} />
      </div>

      <div className="relative z-10 flex flex-col gap-4 pr-32">
        <motion.h1
          className="m-0 font-display text-3xl md:text-5xl font-bold tracking-tight text-text-primary"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="m-0 text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
