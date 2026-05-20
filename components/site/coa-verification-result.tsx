import { AlertTriangleIcon, CheckCircle2Icon, Clock3Icon, ShieldXIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type CoaVerificationRecord,
  type CoaVerificationStatus,
} from "@/lib/coa-verification";
import { cn } from "@/lib/utils";

type CoaVerificationResultProps = {
  record: CoaVerificationRecord | null;
  verificationCode?: string;
};

type VerificationTone = "success" | "pending" | "warning" | "invalid";

function getVerificationTone(
  status: CoaVerificationStatus | undefined
): VerificationTone {
  if (status === "Released / Verified") {
    return "success";
  }

  if (status === "Draft" || status === "Pending QA Review") {
    return "pending";
  }

  if (
    status === "Revoked" ||
    status === "Rejected / Non-Conforming" ||
    status === "Expired" ||
    status === "Superseded"
  ) {
    return "warning";
  }

  return "invalid";
}

const toneMap: Record<
  VerificationTone,
  {
    cardClassName: string;
    badgeClassName: string;
    summaryTitle: string;
    summaryText: string;
    icon: typeof CheckCircle2Icon;
    iconClassName: string;
  }
> = {
  success: {
    cardClassName: "border-emerald-200 bg-emerald-50/60",
    badgeClassName: "border-emerald-200 bg-emerald-100 text-emerald-800",
    summaryTitle: "Released and verified",
    summaryText:
      "This certificate record matches the current Atlas Labs verification register.",
    icon: CheckCircle2Icon,
    iconClassName: "text-emerald-600",
  },
  pending: {
    cardClassName: "border-amber-200 bg-amber-50/70",
    badgeClassName: "border-amber-200 bg-amber-100 text-amber-800",
    summaryTitle: "Pending review",
    summaryText:
      "This record exists, but it has not been released as a verified customer-facing COA.",
    icon: Clock3Icon,
    iconClassName: "text-amber-600",
  },
  warning: {
    cardClassName: "border-rose-200 bg-rose-50/70",
    badgeClassName: "border-rose-200 bg-rose-100 text-rose-800",
    summaryTitle: "Do not accept this document",
    summaryText:
      "This verification record is not in a released and verified state and should be treated as non-valid for acceptance.",
    icon: ShieldXIcon,
    iconClassName: "text-rose-600",
  },
  invalid: {
    cardClassName: "border-rose-200 bg-rose-50/70",
    badgeClassName: "border-rose-200 bg-rose-100 text-rose-800",
    summaryTitle: "Not verified",
    summaryText:
      "The submitted verification code does not match any record in the current Atlas Labs verification register.",
    icon: AlertTriangleIcon,
    iconClassName: "text-rose-600",
  },
};

export function CoaVerificationResult({
  record,
  verificationCode,
}: CoaVerificationResultProps) {
  const tone = getVerificationTone(record?.verificationStatus);
  const toneConfig = toneMap[tone];
  const StatusIcon = toneConfig.icon;
  const displayStatus = record?.verificationStatus ?? "Not Verified";

  const fields = record
    ? [
        ["Verification Status", record.verificationStatus],
        ["COA Number", record.coaNumber],
        ["Product Name", record.productName],
        ["Catalog Code", record.catalogCode],
        ["Batch / Lot No.", record.batchLotNo],
        ["Issue Date", record.issueDate],
        ["Revision", record.revision],
        ["Client / Recipient", record.clientRecipient],
        ["Identity Result", record.identityResult],
        ["HPLC Purity", record.hplcPurity],
        ["Water Content", record.waterContent],
        ["Release Decision", record.releaseDecision],
        ["Document Pack", record.documentPack],
        ["Verification Message", record.verificationMessage],
      ]
    : [
        ["Verification Status", "Not Verified"],
        ["Submitted Code", verificationCode?.trim() || "No code provided"],
        ["Verification Message", "No matching COA verification record was found."],
      ];

  return (
    <Card className={cn("surface-card border p-0", toneConfig.cardClassName)}>
      <CardHeader className="gap-3 border-b border-border/60 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-white/80 p-2 shadow-sm ring-1 ring-black/5">
              <StatusIcon className={cn("size-5", toneConfig.iconClassName)} />
            </div>
            <div>
              <CardTitle className="text-xl text-[var(--brand-navy)]">
                {toneConfig.summaryTitle}
              </CardTitle>
              <CardDescription className="mt-1 max-w-2xl text-sm leading-relaxed">
                {toneConfig.summaryText}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={cn("h-7 px-3 text-xs", toneConfig.badgeClassName)}>
            {displayStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="grid gap-3 md:grid-cols-2">
          {fields.map(([label, value]) => (
            <article
              key={label}
              className="rounded-xl border border-border/70 bg-white/90 p-4 shadow-[0_1px_0_rgba(10,26,47,0.03)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-blue)]">
                {label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-navy)]">{value}</p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
