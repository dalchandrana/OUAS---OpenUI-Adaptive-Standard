"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Code2, MonitorPlay, Bot } from "lucide-react";

const PACKAGES = [
  {
    name: "@ouas/cli",
    description: "Build-time validation and manifest generation. Scans your project for OUAS annotations and builds strict schemas.",
    icon: Terminal,
  },
  {
    name: "@ouas/react",
    description: "The React SDK containing the withOUAS() HOC. Use it to cleanly annotate and expose components to agents.",
    icon: Code2,
  },
  {
    name: "@ouas/renderer",
    description: "The secure UI engine. Takes validated JSON payloads from agents and safely renders the corresponding component tree.",
    icon: MonitorPlay,
  },
  {
    name: "@ouas/agent",
    description: "Helper library for AI agents. Provides tooling to easily construct, validate, and send valid layout configs.",
    icon: Bot,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function PackageGrid() {
  return (
    <motion.div
      className="grid sm:grid-cols-2 gap-4 my-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {PACKAGES.map((pkg) => {
        const Icon = pkg.icon;
        return (
          <motion.div
            key={pkg.name}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-xl border border-border-color bg-surface/50 p-6 hover:bg-surface hover:border-accent-primary transition-all duration-300"
          >
            {/* Subtle Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 via-transparent to-accent-primary/0 group-hover:to-accent-primary/5 transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-base border border-border-color text-text-secondary group-hover:text-accent-primary group-hover:border-accent-primary/30 transition-colors">
                  <Icon className="w-5 h-5" />
                </span>
                <h4 className="m-0 font-display font-semibold text-text-primary text-base">
                  {pkg.name}
                </h4>
              </div>
              <p className="m-0 text-sm text-text-secondary leading-relaxed">
                {pkg.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
