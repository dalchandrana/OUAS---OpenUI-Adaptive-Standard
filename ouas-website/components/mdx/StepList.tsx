"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Crosshair, Sparkles } from "lucide-react";

const PHILOSOPHIES = [
  {
    title: "Safety First",
    description: "AI agents cannot inject arbitrary code. They can only return structured JSON constrained by the Manifest, guaranteeing zero malicious scripts or XSS vulnerabilities.",
    icon: ShieldCheck,
  },
  {
    title: "Deterministic UI",
    description: "A given layout config will always produce the exact same UI structure. No more broken layouts, hallucinated class names, or missing tags.",
    icon: Crosshair,
  },
  {
    title: "Developer Ergonomics",
    description: "Developers don't need to learn a massive new framework or language. They just annotate their existing components using simple HOCs.",
    icon: Sparkles,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function StepList() {
  return (
    <motion.div
      className="space-y-6 my-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {PHILOSOPHIES.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="flex gap-4 group"
          >
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface border border-border-color text-text-secondary group-hover:bg-accent-primary group-hover:text-bg-base group-hover:border-accent-primary transition-all duration-300 font-display font-bold text-sm">
                {index + 1}
              </span>
              {index !== PHILOSOPHIES.length - 1 && (
                <div className="w-px h-full bg-border-color my-2 group-hover:bg-accent-primary/50 transition-colors" />
              )}
            </div>
            <div className="pb-8">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-accent-primary" />
                <h4 className="m-0 font-display text-lg font-semibold text-text-primary">
                  {item.title}
                </h4>
              </div>
              <p className="m-0 text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
