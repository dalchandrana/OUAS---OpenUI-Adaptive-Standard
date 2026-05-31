"use client";

import { cn } from "@/lib/utils";

interface DashedGridProps {
  children: React.ReactNode;
  className?: string;
  /** Number of columns at md breakpoint. Defaults to 3. */
  columns?: 2 | 3 | 4;
}

/**
 * A CSS Grid that draws 1px dashed borders between its children,
 * replicating the "blueprint / schematic" layout from Dodo Payments.
 */
export function DashedGrid({
  children,
  className,
  columns = 3,
}: DashedGridProps) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <div
      className={cn(
        "grid grid-cols-1 border border-dashed border-border-color rounded-xl overflow-hidden",
        colClass,
        className
      )}
    >
      {children}
    </div>
  );
}

interface DashedGridItemProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function DashedGridItem({
  children,
  className,
  icon,
  title,
  description,
}: DashedGridItemProps) {
  return (
    <div
      className={cn(
        "group relative border border-dashed border-border-color p-6 md:p-8",
        "transition-colors duration-300 hover:bg-surface/60",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700 dark:bg-accent-primary/10 dark:text-accent-primary transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="font-display text-lg font-semibold mb-2 text-text-primary">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
