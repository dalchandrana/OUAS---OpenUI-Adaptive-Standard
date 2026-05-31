import * as React from "react";

export function SchemaTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-border-color bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border-color bg-bg-elevated text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-semibold">Field</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Required</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color text-text-primary">
          {children}
        </tbody>
      </table>
    </div>
  );
}
