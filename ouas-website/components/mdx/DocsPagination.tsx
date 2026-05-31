import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationLink {
  title: string;
  href: string;
  description?: string;
}

interface DocsPaginationProps {
  prev?: PaginationLink;
  next?: PaginationLink;
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  return (
    <div className="mt-12 pt-8 border-t border-border-color grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col justify-center rounded-xl border border-border-color bg-surface/50 p-5 hover:bg-surface hover:border-accent-primary transition-all duration-300 !no-underline hover:!no-underline"
        >
          <div className="flex items-center gap-2 text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 group-hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Previous
          </div>
          <h4 className="m-0 font-display font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
            {prev.title}
          </h4>
          {prev.description && (
            <p className="m-0 mt-1 text-sm text-text-secondary line-clamp-1">
              {prev.description}
            </p>
          )}
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col justify-center items-end text-right rounded-xl border border-border-color bg-surface/50 p-5 hover:bg-surface hover:border-accent-primary transition-all duration-300 !no-underline hover:!no-underline"
        >
          <div className="flex items-center gap-2 text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 group-hover:text-accent-primary transition-colors">
            Next
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
          <h4 className="m-0 font-display font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
            {next.title}
          </h4>
          {next.description && (
            <p className="m-0 mt-1 text-sm text-text-secondary line-clamp-1">
              {next.description}
            </p>
          )}
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
