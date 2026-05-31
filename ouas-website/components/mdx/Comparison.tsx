import * as React from "react";

interface ComparisonProps {
  leftTitle: string;
  rightTitle: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export function Comparison({ leftTitle, rightTitle, leftContent, rightContent }: ComparisonProps) {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left side (Danger) */}
      <div className="rounded-xl border border-danger/20 bg-danger/5 overflow-hidden">
        <div className="border-b border-danger/20 bg-danger/10 px-4 py-2 font-semibold text-danger text-sm uppercase tracking-wider flex items-center justify-center">
          {leftTitle}
        </div>
        <div className="p-4">
          {leftContent}
        </div>
      </div>
      
      {/* Right side (Success) */}
      <div className="rounded-xl border border-success/20 bg-success/5 overflow-hidden">
        <div className="border-b border-success/20 bg-success/10 px-4 py-2 font-semibold text-success text-sm uppercase tracking-wider flex items-center justify-center">
          {rightTitle}
        </div>
        <div className="p-4">
          {rightContent}
        </div>
      </div>
    </div>
  );
}
