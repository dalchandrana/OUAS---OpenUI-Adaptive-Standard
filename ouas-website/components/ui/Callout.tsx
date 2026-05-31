import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const calloutVariants = cva(
  "relative w-full rounded-lg border border-border-color bg-surface p-4 border-l-4",
  {
    variants: {
      variant: {
        info: "border-l-accent-primary text-text-primary",
        warning: "border-l-warning text-text-primary",
        danger: "border-l-danger text-text-primary",
        success: "border-l-success text-text-primary",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ variant }), className)}
        {...props}
      >
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        <div className="text-sm text-text-secondary">
          {children}
        </div>
      </div>
    );
  }
);
Callout.displayName = "Callout";

export { Callout, calloutVariants };
