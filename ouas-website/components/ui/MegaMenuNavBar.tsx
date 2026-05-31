"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Layers,
  Cpu,
  Shield,
  Rocket,
  Code2,
  FileText,
  ExternalLink,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

/* ─── Mega-menu Data ────────────────────────────────────────── */

type MegaMenuItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  isNew?: boolean;
};

type MegaMenuGroup = {
  label: string;
  items: MegaMenuItem[];
};

const MEGA_MENUS: Record<string, MegaMenuGroup[]> = {
  Features: [
    {
      label: "Core",
      items: [
        {
          icon: <Brain className="h-5 w-5" />,
          title: "Skills",
          description: "Teach any AI agent the OUAS programming model instantly.",
          href: "/features/skills",
          isNew: true,
        },
        {
          icon: <Layers className="h-5 w-5" />,
          title: "Adaptive Layouts",
          description: "AI-driven UI reconfigurations at runtime.",
          href: "/features/adaptive-layouts",
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: "Validation Pipeline",
          description: "Strict schema guards against hallucinations.",
          href: "/features/validation-pipeline",
        },
        {
          icon: <Cpu className="h-5 w-5" />,
          title: "Agent API",
          description: "JSON protocol for AI agents to reshape UIs.",
          href: "/features/agent-api",
        },
      ],
    },
  ],
  Developers: [
    {
      label: "SDK & Tools",
      items: [
        {
          icon: <Code2 className="h-5 w-5" />,
          title: "React SDK",
          description: "Drop-in withOUAS() wrapper for React components.",
          href: "/developers/react-sdk",
        },
        {
          icon: <Rocket className="h-5 w-5" />,
          title: "Getting Started",
          description: "Set up OUAS in your project in under 5 minutes.",
          href: "/developers/getting-started",
        },
        {
          icon: <FileText className="h-5 w-5" />,
          title: "Manifest Spec",
          description: "The JSON contract that describes your UI surface.",
          href: "/developers/manifest-spec",
        },
      ],
    },
  ],
};

const SIMPLE_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Demo", href: "/demo" },
];

/* ─── Animations ────────────────────────────────────────────── */

const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring" as const, bounce: 0, duration: 0.4 } },
  exit: { x: "100%", transition: { type: "spring" as const, bounce: 0, duration: 0.3 } },
};

/* ─── Component ─────────────────────────────────────────────── */

export function MegaMenuNavBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll detection */
  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Mouse helpers — small delay to prevent flicker */
  const handleEnter = (key: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(key);
  };
  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border-color bg-bg-base/70 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* ── Logo ─────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent-primary">
            OUAS
          </span>
        </Link>

        {/* ── Desktop Nav ──────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Mega-menu triggers */}
          {Object.keys(MEGA_MENUS).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => handleEnter(key)}
              onMouseLeave={handleLeave}
            >
              <button
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeMenu === key
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {key}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeMenu === key && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {activeMenu === key && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                  >
                    <div className="w-[380px] rounded-xl border border-border-color bg-bg-base/95 backdrop-blur-xl p-4 shadow-xl shadow-black/10 dark:shadow-black/30">
                      {MEGA_MENUS[key].map((group) => (
                        <div key={group.label}>
                          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                            {group.label}
                          </p>
                          <div className="space-y-0.5">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "group/item flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                                  "hover:bg-surface"
                                )}
                                onClick={() => setActiveMenu(null)}
                              >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary transition-colors group-hover/item:bg-accent-primary/20">
                                  {item.icon}
                                </span>
                                <div>
                                  <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                    {item.title}
                                    {item.isNew && (
                                      <span className="rounded-full border border-accent-primary/20 bg-accent-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-primary shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                                        New
                                      </span>
                                    )}
                                  </span>
                                  <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Simple links */}
          {SIMPLE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Actions ──────────────────── */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://github.com/dalchandrana/OUAS---OpenUI-Adaptive-Standard.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-text-primary hover:bg-surface"
            aria-label="GitHub"
          >
            <svg className="h-[1.15rem] w-[1.15rem]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <Link href="/docs/getting-started">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* ── Mobile Hamburger ─────────────────── */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 z-50 flex h-full w-[min(320px,85vw)] flex-col bg-bg-base border-l border-border-color px-5 py-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl font-bold tracking-tight">
                  OUAS
                </span>
                <button
                  className="p-2 text-text-secondary hover:text-text-primary"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 overflow-y-auto flex-1">
                {/* Mega-menu sections collapsed into lists */}
                {Object.entries(MEGA_MENUS).map(([key, groups]) => (
                  <div key={key} className="mb-4">
                    <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                      {key}
                    </p>
                    {groups.map((group) =>
                      group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary hover:bg-surface"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary text-xs">
                            {item.icon}
                          </span>
                          <span className="flex items-center gap-2">
                            {item.title}
                            {item.isNew && (
                              <span className="rounded-full border border-accent-primary/20 bg-accent-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-primary">
                                New
                              </span>
                            )}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                ))}

                {/* Simple links */}
                {SIMPLE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-2 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-auto pt-4 border-t border-border-color">
                  <Link
                    href="/docs/getting-started"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
