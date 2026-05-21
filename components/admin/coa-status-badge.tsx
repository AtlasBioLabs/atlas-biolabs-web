"use client";

import { AlertTriangleIcon, CheckCircle2Icon, Clock3Icon, ShieldXIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CoaVerificationStatus } from "@/lib/coa-verification";
import { cn } from "@/lib/utils";

type CoaStatusBadgeProps = {
  status: CoaVerificationStatus | "Not Verified";
  className?: string;
};

function getStatusVariant(status: CoaStatusBadgeProps["status"]) {
  if (status === "Released / Verified") {
    return {
      icon: CheckCircle2Icon,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    };
  }

  if (status === "Draft" || status === "Pending QA Review") {
    return {
      icon: Clock3Icon,
      className: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
    };
  }

  if (
    status === "Revoked" ||
    status === "Expired" ||
    status === "Superseded" ||
    status === "Rejected / Non-Conforming" ||
    status === "Not Verified"
  ) {
    return {
      icon: status === "Not Verified" ? ShieldXIcon : AlertTriangleIcon,
      className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50",
    };
  }

  return {
    icon: AlertTriangleIcon,
    className: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50",
  };
}

export function CoaStatusBadge({ status, className }: CoaStatusBadgeProps) {
  const tone = getStatusVariant(status);
  const Icon = tone.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 rounded-full px-2.5 py-1 text-[11px]", tone.className, className)}
    >
      <Icon className="size-3.5" />
      {status}
    </Badge>
  );
}
