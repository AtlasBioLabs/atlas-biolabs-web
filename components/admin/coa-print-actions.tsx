"use client";

import { useState } from "react";
import { CopyIcon, ExternalLinkIcon, PrinterIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type CoaPrintActionsProps = {
  editHref: string;
  backHref: string;
  publicVerificationHref: string;
  verificationUrl: string;
  warnings?: string[];
};

export function CoaPrintActions({
  editHref,
  backHref,
  publicVerificationHref,
  verificationUrl,
  warnings = [],
}: CoaPrintActionsProps) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(verificationUrl);
    setCopyMessage("Verification URL copied.");
    window.setTimeout(() => setCopyMessage(null), 2500);
  }

  return (
    <div data-admin-print-actions className="coa-print-actions space-y-4 print:hidden">
      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-semibold">Review before issuing</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {copyMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {copyMessage}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
        >
          <Link href={backHref}>Back to Records</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
        >
          <Link href={editHref}>Edit Record</Link>
        </Button>
        <Button
          type="button"
          className="bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]"
          onClick={() => window.print()}
        >
          <PrinterIcon className="mr-1 size-4" />
          Print / Save as PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
          onClick={handleCopy}
        >
          <CopyIcon className="mr-1 size-4" />
          Copy Verification URL
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
        >
          <Link href={publicVerificationHref} target="_blank" rel="noreferrer">
            <ExternalLinkIcon className="mr-1 size-4" />
            View Public Verification
          </Link>
        </Button>
      </div>
    </div>
  );
}
