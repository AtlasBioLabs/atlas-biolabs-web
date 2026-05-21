"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { CoaVerificationForm } from "@/components/admin/coa-verification-form";
import type { BreadcrumbItem } from "@/lib/seo";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
  { name: "Create Record", path: "/admin/coa-verifications/new" },
];

export default function NewCoaVerificationPage() {
  return (
    <AdminGuard
      title="Create COA verification record"
      description="Add a new Atlas Labs verification record with controlled release status, traceability details, and public verification URL output."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => <CoaVerificationForm supabase={supabase} mode="create" />}
    </AdminGuard>
  );
}
