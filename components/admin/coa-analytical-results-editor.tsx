"use client";

import type { CoaAnalyticalTestDraftRow } from "@/lib/coa-fixed-rows";

type CoaAnalyticalResultsEditorProps = {
  rows: CoaAnalyticalTestDraftRow[];
  methodOptions: readonly string[];
  specificationOptions: readonly string[];
  batchResultOptions: readonly string[];
  statusOptions: readonly string[];
  onChange: (
    rowKey: CoaAnalyticalTestDraftRow["row_key"],
    field: "method" | "specification" | "batch_result" | "status",
    value: string
  ) => void;
};

const cellInputClassName =
  "h-10 w-full rounded-lg border border-[#d5def0] bg-white px-3 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function CoaAnalyticalResultsEditor({
  rows,
  methodOptions,
  specificationOptions,
  batchResultOptions,
  statusOptions,
  onChange,
}: CoaAnalyticalResultsEditorProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#d9e1ec]">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
          <tr>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">
              Test / Attribute
            </th>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">Method</th>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">
              Specification
            </th>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">
              Batch Result
            </th>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.row_key} className="align-top">
              <td className="border-b border-[#d9e1ec] bg-slate-50 px-3 py-3 font-medium text-[var(--brand-navy)]">
                {row.test_attribute}
              </td>
              <td className="border-b border-[#d9e1ec] px-3 py-3">
                <input
                  className={cellInputClassName}
                  list="coa-analytical-method-options"
                  value={row.method}
                  onChange={(event) =>
                    onChange(row.row_key, "method", event.target.value)
                  }
                />
              </td>
              <td className="border-b border-[#d9e1ec] px-3 py-3">
                <input
                  className={cellInputClassName}
                  list="coa-analytical-specification-options"
                  value={row.specification}
                  onChange={(event) =>
                    onChange(row.row_key, "specification", event.target.value)
                  }
                />
              </td>
              <td className="border-b border-[#d9e1ec] px-3 py-3">
                <input
                  className={cellInputClassName}
                  list="coa-analytical-batch-result-options"
                  value={row.batch_result}
                  onChange={(event) =>
                    onChange(row.row_key, "batch_result", event.target.value)
                  }
                />
              </td>
              <td className="border-b border-[#d9e1ec] px-3 py-3">
                <input
                  className={cellInputClassName}
                  list="coa-analytical-status-options"
                  value={row.status}
                  onChange={(event) =>
                    onChange(row.row_key, "status", event.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <datalist id="coa-analytical-method-options">
        {methodOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <datalist id="coa-analytical-specification-options">
        {specificationOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <datalist id="coa-analytical-batch-result-options">
        {batchResultOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <datalist id="coa-analytical-status-options">
        {statusOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}
