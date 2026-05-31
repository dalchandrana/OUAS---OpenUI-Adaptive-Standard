"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  className?: string;
}

export function TabGroup({ tabs, className }: TabGroupProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);

  return (
    <div className={cn("flex flex-col space-y-6", className)}>
      {/* Tab Headers */}
      <div className="flex space-x-2 border-b border-border-color">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-text-primary",
                isActive ? "text-text-primary" : "text-text-secondary"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative overflow-hidden">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3 }}
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
}
