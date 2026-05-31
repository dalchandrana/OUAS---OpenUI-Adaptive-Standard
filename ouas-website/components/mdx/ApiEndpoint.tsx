import * as React from "react";
import { Badge } from "../ui/Badge";
import { CodeBlock } from "../ui/CodeBlock";

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  response?: string;
}

export async function ApiEndpoint({ method, path, description, response }: ApiEndpointProps) {
  const methodColor = 
    method === "GET" ? "bg-accent-primary/20 text-accent-primary" :
    method === "POST" ? "bg-success/20 text-success" :
    method === "DELETE" ? "bg-danger/20 text-danger" :
    "bg-warning/20 text-warning";

  return (
    <div className="my-8 rounded-xl border border-border-color bg-surface overflow-hidden shadow-sm">
      <div className="flex items-center gap-4 border-b border-border-color bg-bg-elevated px-4 py-3">
        <span className={`rounded px-2 py-1 text-xs font-bold ${methodColor}`}>{method}</span>
        <code className="font-mono text-sm text-text-primary">{path}</code>
      </div>
      <div className="p-4">
        <p className="text-sm text-text-secondary mb-4">{description}</p>
        {response && (
          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">Response Shape</h4>
            <div className="-mx-4 md:-mx-0">
              <CodeBlock code={response} lang="json" filename="Response" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
