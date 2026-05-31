"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, FileText, ChevronDown, Check } from "lucide-react";
import { usePathname } from "next/navigation";

interface CopyPageCTAProps {
  title: string;
}

export function CopyPageCTA({ title }: CopyPageCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [markdownContext, setMarkdownContext] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMarkdown = async () => {
    if (markdownContext) return markdownContext;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/docs/raw?path=${pathname}`);
      if (!res.ok) throw new Error("Failed to fetch markdown");
      const text = await res.text();
      setMarkdownContext(text);
      return text;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPrompt = (md: string) => {
    return `I am reading the OpenUI Adaptive Standard (OUAS) documentation.
Here is the raw Markdown content for the "${title}" page:

\`\`\`markdown
${md}
\`\`\`

Based on this documentation context, I have the following question:
`;
  };

  const handleCopyMarkdown = async () => {
    const md = await fetchMarkdown();
    if (md) {
      navigator.clipboard.writeText(md);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
    setIsOpen(false);
  };

  const handleOpenMarkdown = async () => {
    window.open(`/api/docs/raw?path=${pathname}`, '_blank');
    setIsOpen(false);
  };

  const handleChatClaude = async () => {
    const md = await fetchMarkdown();
    if (md) {
      const prompt = getPrompt(md);
      window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank');
    }
    setIsOpen(false);
  };

  const handleChatChatGPT = async () => {
    const md = await fetchMarkdown();
    if (md) {
      const prompt = getPrompt(md);
      window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative text-left z-50 flex items-center" ref={dropdownRef}>
      {/* Animated CTA Container */}
      <div className="group relative inline-flex items-center justify-center rounded-full p-[1px] overflow-hidden shadow-sm">
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-success)_0%,transparent_50%,transparent_100%)] opacity-70" />
        
        <div className="relative flex items-center rounded-full bg-bg-base transition-colors group-hover:bg-surface w-full h-full">
          <button
            onClick={handleCopyMarkdown}
            disabled={isLoading}
            className="relative flex items-center justify-center pl-3 pr-2 py-1.5 font-medium text-xs text-text-primary rounded-l-full hover:text-accent-primary transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 absolute"
                >
                  <Check className="h-3.5 w-3.5 text-accent-primary" />
                  <span className="hidden sm:inline text-accent-primary">Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 absolute"
                >
                  <Copy className="h-3.5 w-3.5 text-text-secondary group-hover:text-accent-primary transition-colors" />
                  <span className="hidden sm:inline">Copy page</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Invisible placeholder to maintain consistent width */}
            <div className="flex items-center gap-1.5 opacity-0 pointer-events-none">
              <Copy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Copy page</span>
            </div>
          </button>

          <div className="w-[1px] h-3.5 bg-border-color" />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center pr-3 pl-2 py-1.5 rounded-r-full hover:bg-bg-elevated transition-colors"
          >
            <ChevronDown className={`h-3 w-3 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 origin-top-right rounded-xl bg-surface border border-border-color shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={handleCopyMarkdown}
              disabled={isLoading}
              className="flex w-full items-center px-4 py-2 text-xs font-medium text-text-primary hover:bg-bg-elevated transition-colors disabled:opacity-50 group"
            >
              <Copy className="mr-3 h-4 w-4 text-text-tertiary group-hover:text-accent-primary transition-colors" />
              Copy page as Markdown
            </button>
            <button
              onClick={handleOpenMarkdown}
              className="flex w-full items-center px-4 py-2 text-xs font-medium text-text-primary hover:bg-bg-elevated transition-colors group"
            >
              <FileText className="mr-3 h-4 w-4 text-text-tertiary group-hover:text-accent-primary transition-colors" />
              Open Markdown
            </button>
            <div className="border-t border-border-color/50 my-1"></div>
            <button
              onClick={handleChatClaude}
              disabled={isLoading}
              className="flex w-full items-center px-4 py-2 text-xs font-medium text-text-primary hover:bg-bg-elevated transition-colors disabled:opacity-50 group"
            >
              <ClaudeIcon className="mr-3 h-4 w-4 text-text-tertiary group-hover:text-[#D97757] transition-colors" />
              Chat in Claude.ai
            </button>
            <button
              onClick={handleChatChatGPT}
              disabled={isLoading}
              className="flex w-full items-center px-4 py-2 text-xs font-medium text-text-primary hover:bg-bg-elevated transition-colors disabled:opacity-50 group"
            >
              <OpenAIIcon className="mr-3 h-4 w-4 text-text-tertiary group-hover:text-[#10A37F] transition-colors" />
              Chat in ChatGPT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 48 48" 
    className={className}
  >
    <path fill="currentColor" d="M12.1118 30.513L19.7147 26.1583L19.8425 25.7801L19.7147 25.5697H19.3442L18.0736 25.4898L13.7294 25.3699L9.96195 25.2101L6.31186 25.0104L5.39347 24.8106L4.53247 23.652L4.62118 23.074L5.39347 22.544L6.49971 22.6426L8.94441 22.813L12.6128 23.0714L15.274 23.2312L19.2163 23.6493H19.8425L19.9312 23.391L19.7173 23.2312L19.5503 23.0714L15.7541 20.4452L11.6448 17.6699L9.49232 16.0719L8.32867 15.2622L7.74163 14.5031L7.48855 12.8465L8.54522 11.6586L9.96456 11.7571L10.3272 11.8557L11.7648 12.985L14.8357 15.4114L18.8458 18.4264L19.4329 18.9244L19.6677 18.754L19.6964 18.6341L19.4329 18.184L17.2517 14.1596L14.9244 10.0659L13.8886 8.36925L13.6146 7.35183C13.5181 6.93367 13.4477 6.5821 13.4477 6.15329L14.6505 4.48598L15.3158 4.26758L16.9203 4.48598L17.5961 5.08525L18.5928 7.41309L20.2078 11.078L22.7125 16.0612L23.4456 17.5394L23.837 18.9084L23.9831 19.3266H24.2362V19.0869L24.4423 16.2796L24.8232 12.8332L25.1937 8.39855L25.3216 7.14941L25.9269 5.65256L27.1296 4.84288L28.0689 5.30099L28.8412 6.43028L28.7342 7.16006L28.275 10.207L27.3749 14.9799L26.7879 18.176H27.1296L27.521 17.7765L29.1047 15.6298L31.766 12.2339L32.94 10.8862L34.3098 9.39734L35.1891 8.68887H36.851L38.0747 10.5453L37.5268 12.4629L35.8152 14.6789L34.3959 16.5566L32.3608 19.3532L31.0902 21.5905L31.2076 21.769L31.5103 21.7397L36.1075 20.7409L38.5913 20.2828L41.5552 19.7634L42.8963 20.4026L43.0424 21.0525L42.5153 22.3816L39.3453 23.1806L35.6274 23.9397L30.0909 25.2767L30.0231 25.3273L30.1014 25.4258L32.5956 25.6656L33.6628 25.7242H36.2744L41.1377 26.0944L42.4084 26.952L43.1702 28.0014L43.0424 28.8004L41.0856 29.8178L38.4452 29.1786L32.2826 27.6818L30.1692 27.1438H29.877V27.3222L31.6381 29.0801L34.8655 32.0551L38.907 35.8905L39.1131 36.8386L38.5939 37.5871L38.046 37.5072L34.4951 34.7798L33.1253 33.552L30.0231 30.8859H29.817V31.1655L30.5319 32.2336L34.3072 38.0265L34.5029 39.803L34.2289 40.381L33.2505 40.7299L32.1756 40.5301L29.9657 37.3633L27.6854 33.797L25.846 30.6009L25.6216 30.7314L24.5362 42.6662L24.0275 43.2761L22.8534 43.7342L21.875 42.9752L21.3558 41.7473L21.875 39.321L22.5011 36.1541L23.0099 33.6372L23.4691 30.5103L23.7431 29.4716L23.7248 29.4023L23.5004 29.4316L21.1914 32.6677L17.6796 37.5125L14.9009 40.5488L14.2356 40.8178L13.0824 40.2079L13.1894 39.1185L13.8338 38.149L17.6796 33.1551L19.999 30.0602L21.4967 28.2731L21.4862 28.0147H21.3975L11.183 34.7851L9.36447 35.0248L8.58175 34.2764L8.67829 33.0486L9.04877 32.6491L12.1197 30.4917L12.1092 30.5023L12.1118 30.513Z" />
  </svg>
);

const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
  </svg>
);
