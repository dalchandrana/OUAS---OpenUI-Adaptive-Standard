import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeStripProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}

export function MarqueeStrip({
  children,
  direction = "left",
  speed = "normal",
  className,
  ...props
}: MarqueeStripProps) {
  const speedClass = 
    speed === "fast" ? "duration-[15s]" : 
    speed === "slow" ? "duration-[45s]" : 
    "duration-[30s]";

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden border-y border-border-color bg-surface py-4",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 animate-marquee items-center justify-around gap-8 px-4",
          direction === "right" && "animate-marquee-reverse",
          speedClass
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex min-w-full shrink-0 animate-marquee items-center justify-around gap-8 px-4",
          direction === "right" && "animate-marquee-reverse",
          speedClass
        )}
      >
        {children}
      </div>
    </div>
  );
}
