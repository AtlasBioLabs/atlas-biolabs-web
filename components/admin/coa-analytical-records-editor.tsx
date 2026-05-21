"use client";

import type { CoaAnalyticalRecordDraftRow } from "@/lib/coa-fixed-rows";

type CoaAnalyticalRecordsEditorProps = {
  rows: CoaAnalyticalRecordDraftRow[];
  availabilityOptions: readonly string[];
  onChange: (
    rowKey: CoaAnalyticalRecordDraftRow["row_key"],
    field: "reference_file_name" | "availability",
    value: string
  ) => void;
};

const cellInputClassName =
  "h-10 w-full rounded-lg border border-[#d5def0] bg-white px-3 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function CoaAnalyticalRecordsEditor({
  rows,
  availabilityOptions,
  onChange,
}: CoaAnalyticalRecordsEditorProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#d9e1ec]">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm">
        <thead className="bg-[#f8fbff] text-[var(--brand-navy)]">
          <tr>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">
              Record Type
            </th>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">
              Reference / File Name
            </th>
            <th className="border-b border-[#d9e1ec] px-3 py-3 font-semibold">
              Availability
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.row_key} className="align-top">
              <td className="border-b border-[#d9e1ec] bg-slate-50 px-3 py-3 font-medium text-[var(--brand-navy)]">
                {row.record_type}
              </td>
              <td className="border-b border-[#d9e1ec] px-3 py-3">
                <input
                  className={cellInputClassName}
                  value={row.reference_file_name}
                  onChange={(event) =>
                    onChange(row.row_key, "reference_file_name", event.target.value)
                  }
                />
              </td>
              <td className="border-b border-[#d9e1ec] px-3 py-3">
                <input
                  className={cellInputClassName}
                  list="coa-analytical-record-availability-options"
                  value={row.availability}
                  onChange={(event) =>
                    onChange(row.row_key, "availability", event.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <datalist id="coa-analytical-record-availability-options">
        {availabilityOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}
