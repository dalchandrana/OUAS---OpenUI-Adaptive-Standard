import * as React from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
}

export async function CodeBlock({ code, lang = "typescript", filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark-dimmed",
  });

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#1c2128] dark:bg-[#0a0a0a]/60 dark:backdrop-blur-2xl text-sm shadow-none dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
      {/* Glossy top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 dark:via-white/20 to-transparent" />
      
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* macOS window controls */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-[11px] font-medium text-white/50 tracking-wider">
            {filename || lang}
          </span>
        </div>
        <CopyButton content={code} />
      </div>
      <div 
        className="overflow-x-auto p-4 font-mono text-[13px] leading-6 [&>pre]:!bg-transparent [&>pre]:!p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
