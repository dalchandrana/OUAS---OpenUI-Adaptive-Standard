"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchIndex, SearchIndexItem } from "@/lib/search-index";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter logic
  const normalizedQuery = query.toLowerCase().trim();
  const results = normalizedQuery
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.content.toLowerCase().includes(normalizedQuery)
      )
    : [];

  // Highlighting function
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    // Find the first occurrence to create a snippet
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query.toLowerCase());
    
    if (index === -1) return text;

    // Extract a snippet (e.g., 40 chars before and 80 after)
    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 80);
    
    let snippet = text.slice(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";

    // Split by query for highlighting
    const parts = snippet.split(new RegExp(`(${query})`, 'gi'));

    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-accent-primary/20 text-accent-primary font-semibold rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/25 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex flex-col items-center pt-[15vh] px-4 pointer-events-none max-w-2xl mx-auto w-full">
            {/* Search Input Bar (Always a pill) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full overflow-hidden pointer-events-auto flex items-center px-6 py-4 gap-4"
            >
              <Search className="h-6 w-6 text-text-primary/70 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search Documentation"
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-text-primary placeholder:text-text-primary/45"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-primary/50 hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </motion.div>

            {/* Search Results (Standalone card below) */}
            <AnimatePresence>
              {query && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full mt-4 bg-white/85 dark:bg-[#0f1115]/85 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2rem] overflow-hidden pointer-events-auto flex flex-col max-h-[50vh]"
                >
                  <div className="overflow-y-auto flex-1 p-3">
                    {results.length === 0 ? (
                      <div className="py-14 text-center text-text-primary/60">
                        <Search className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p>No results found for "{query}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {results.map((result) => (
                          <button
                            key={result.href}
                            onClick={() => handleNavigate(result.href)}
                            className="group flex flex-col gap-1.5 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 text-left transition-all"
                          >
                            <div className="flex items-center gap-2 text-text-primary font-semibold">
                              <FileText className="h-4 w-4 text-text-primary/50 group-hover:text-accent-primary transition-colors" />
                              {result.title}
                            </div>
                            <div className="text-sm text-text-primary/70 pl-6 line-clamp-2">
                              {highlightText(result.content, normalizedQuery)}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
