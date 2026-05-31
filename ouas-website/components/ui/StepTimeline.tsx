"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Step {
  number: number;
  title: string;
  description: React.ReactNode;
  code?: React.ReactNode;
}

import { HTMLMotionProps } from "framer-motion";

interface StepTimelineProps extends HTMLMotionProps<"div"> {
  steps: Step[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function StepTimeline({ steps, className, ...props }: StepTimelineProps) {
  return (
    <motion.div
      className={cn(
        "relative space-y-12 before:absolute before:inset-0 before:ml-[19px] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-accent-primary/50 before:via-border-color before:to-transparent my-12",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      {...props}
    >
      {steps.map((step, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="relative flex flex-col md:flex-row items-start md:justify-center group"
        >
          {/* Step Number Circle */}
          <div className="absolute left-0 ml-[6px] md:relative md:left-auto md:ml-0 md:mr-8 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent-primary bg-bg-base text-xs font-bold text-accent-primary ring-4 ring-bg-base z-10 shadow-[0_0_15px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform duration-300">
            {step.number}
          </div>

          {/* Step Card */}
          <div className="ml-12 md:ml-0 md:w-1/2 w-full relative">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
            
            <div className="relative rounded-2xl border border-border-color bg-surface/60 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:border-accent-primary hover:bg-surface w-full">
              <h4 className="font-display mb-2 text-xl font-bold text-text-primary flex items-center gap-2">
                {step.title}
              </h4>
              <div className="text-sm text-text-secondary leading-relaxed">{step.description}</div>
              
              {/* Code Container */}
              {step.code && (
                <div className="mt-6 -mx-2 sm:mx-0 w-[calc(100%+16px)] sm:w-full overflow-hidden">
                  {step.code}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
