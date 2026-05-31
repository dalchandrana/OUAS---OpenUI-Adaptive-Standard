"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = React.useCallback(() => {
    if (isTransitioning) return;

    const nextTheme = theme === "dark" ? "light" : "dark";
    const overlay = document.getElementById("theme-overlay");

    if (!overlay) {
      setTheme(nextTheme);
      return;
    }

    setIsTransitioning(true);

    // Set overlay to the TARGET theme's background color
    overlay.style.backgroundColor =
      nextTheme === "dark" ? "#0d0d0d" : "#FDFBFC";

    // Phase 1: Fill up from bottom
    overlay.className = "filling";

    // After fill animation completes, switch theme + reveal
    const fillDuration = 450;
    const revealDelay = 60; // tiny pause at full coverage

    setTimeout(() => {
      // Switch the actual theme while overlay is covering everything
      setTheme(nextTheme);

      setTimeout(() => {
        // Phase 2: Reveal — slide overlay up and away
        overlay.className = "revealing";

        setTimeout(() => {
          // Clean up
          overlay.className = "";
          overlay.style.backgroundColor = "";
          setIsTransitioning(false);
        }, 450);
      }, revealDelay);
    }, fillDuration);
  }, [theme, setTheme, isTransitioning]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 px-0 opacity-0"
        aria-label="Toggle theme"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 px-0 relative flex items-center justify-center text-text-secondary hover:text-text-primary overflow-hidden"
      onClick={handleToggle}
      aria-label="Toggle theme"
      disabled={isTransitioning}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
