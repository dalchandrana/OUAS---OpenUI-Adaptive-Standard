import * as React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface AlertProps {
  type: "info" | "warning" | "danger" | "success";
  title: string;
  content: string;
}

const config = {
  info: {
    icon: Info,
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20",
    textClass: "text-blue-500",
    titleClass: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20",
    textClass: "text-text-secondary",
    titleClass: "text-warning",
  },
  danger: {
    icon: AlertCircle,
    bgClass: "bg-danger/10",
    borderClass: "border-danger/20",
    textClass: "text-text-secondary",
    titleClass: "text-danger",
  },
  success: {
    icon: CheckCircle2,
    bgClass: "bg-success/10",
    borderClass: "border-success/20",
    textClass: "text-text-secondary",
    titleClass: "text-success",
  },
};

export function Alert({ type, title, content }: AlertProps) {
  const { icon: Icon, bgClass, borderClass, textClass, titleClass } = config[type] || config.info;

  return (
    <div className={`my-6 flex gap-4 rounded-xl border p-4 ${bgClass} ${borderClass}`}>
      <div className={`mt-0.5 shrink-0 ${titleClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h5 className={`m-0 mb-1 font-semibold ${titleClass}`}>{title}</h5>
        <div className={`m-0 text-sm leading-relaxed ${textClass}`}>
          {content}
        </div>
      </div>
    </div>
  );
}
