"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HoverLinkProps {
  href: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function HoverLink({ href, title, description, children }: HoverLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsHovered(true), 150);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Add a slight delay before hiding so it doesn't flicker if moving mouse off slightly
    timeoutRef.current = setTimeout(() => setIsHovered(false), 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span 
      className="relative inline-block whitespace-nowrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        href={href}
        className="font-semibold italic text-accent-primary transition-colors"
        style={{ textDecoration: 'underline', textDecorationColor: 'var(--accent-primary)', textUnderlineOffset: '4px' }}
      >
        {children}
      </Link>
      
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-4 z-[999] rounded-xl border border-border-color bg-bg-elevated/95 backdrop-blur-md shadow-xl pointer-events-none text-left whitespace-normal block"
          >
            <span className="block m-0 mb-1.5 font-display font-bold text-[13px] text-text-primary leading-tight tracking-wide uppercase">
              {title}
            </span>
            <span className="block m-0 text-xs text-text-secondary leading-relaxed font-sans normal-case">
              {description}
            </span>
            {/* Tooltip Arrow */}
            <span className="block absolute left-1/2 -translate-x-1/2 top-full -mt-px border-4 border-transparent border-t-border-color" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
