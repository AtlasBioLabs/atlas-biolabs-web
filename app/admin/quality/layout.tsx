import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QualityAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/quality/document-bundles">Bundles</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/quality/hplc-reports">HPLC Reports</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/quality/ms-reports">MS Reports</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/quality/safety-data-sheets">SDS</Link>
        </Button>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
