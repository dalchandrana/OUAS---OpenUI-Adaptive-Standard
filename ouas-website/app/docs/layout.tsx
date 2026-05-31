"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MegaMenuNavBar } from "@/components/ui/MegaMenuNavBar";
import { DOCS_NAVIGATION } from "@/lib/navigation";
import { Search, ChevronRight } from "lucide-react";
import { SearchModal } from "@/components/ui/SearchModal";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <MegaMenuNavBar />

      <div className="container mx-auto flex flex-1 px-4 md:px-6">
        {/* Left Sidebar */}
        <aside
          className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-border-color py-8 pr-6 md:flex sticky top-16"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="mb-6 relative w-full group text-left"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary group-hover:text-accent-primary transition-colors" />
            <div className="w-full bg-surface border border-border-color rounded-lg pl-9 pr-4 py-2 text-sm text-text-tertiary group-hover:border-accent-primary transition-colors flex items-center justify-between">
              <span>Search docs…</span>
              <kbd className="hidden md:inline-flex items-center gap-1 font-sans text-[10px] font-medium text-text-tertiary bg-bg-elevated px-1.5 py-0.5 rounded border border-border-color">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </button>

          <nav className="flex flex-col gap-8">
            {DOCS_NAVIGATION.map((group) => (
              <div key={group.group}>
                <h4 className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
                  {group.group}
                </h4>
                <ul className="flex flex-col gap-0.5 border-l border-border-color">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block -ml-[1px] border-l-2 pl-4 py-1.5 text-sm transition-colors ${
                            isActive
                              ? "border-accent-primary font-medium text-accent-primary"
                              : "border-transparent text-text-secondary hover:border-border-bright hover:text-text-primary"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 py-8 md:pl-10 lg:pl-12">
          <div className="prose dark:prose-invert max-w-5xl prose-p:text-text-secondary prose-headings:text-text-primary prose-strong:text-text-primary prose-li:text-text-secondary prose-pre:bg-[#1c2128] prose-headings:font-display prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline prose-code:text-accent-primary prose-code:before:content-none prose-code:after:content-none">
            {children}
          </div>

          {/* Page feedback */}
          <div className="mt-16 border-t border-border-color pt-8 max-w-5xl flex justify-between items-center text-sm text-text-secondary">
            <p>Was this helpful?</p>
            <div className="flex gap-2">
              <button className="border border-border-color rounded-md px-3 py-1.5 hover:bg-surface hover:text-text-primary transition-colors text-xs font-medium">
                Yes
              </button>
              <button className="border border-border-color rounded-md px-3 py-1.5 hover:bg-surface hover:text-text-primary transition-colors text-xs font-medium">
                No
              </button>
            </div>
          </div>
        </main>
      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
}
