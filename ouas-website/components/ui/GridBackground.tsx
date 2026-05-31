"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  /** Show a radial fade-out mask so the grid dissolves at the edges */
  fadeMask?: boolean;
  /** Grid cell size in px — defaults to 32 */
  gridSize?: number;
  /** Legacy prop - no longer used as we moved to cleaner minimal aesthetic */
  showOrbs?: boolean;
}

export function GridBackground({
  children,
  className,
  fadeMask = true,
  gridSize = 32,
}: GridBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Subtle Dotted Pattern layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(var(--grid-line-color) 1.5px, transparent 1.5px)",
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: "-1px -1px",
          ...(fadeMask
            ? {
                maskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
              }
            : {}),
        }}
        aria-hidden="true"
      />

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
