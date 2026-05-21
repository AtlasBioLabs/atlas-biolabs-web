"use client";

import { useParams } from "next/navigation";

import { AdminGuard } from "@/components/admin/admin-guard";
import { CoaVerificationForm } from "@/components/admin/coa-verification-form";
import type { BreadcrumbItem } from "@/lib/seo";

export default function EditCoaVerificationPage() {
  const params = useParams<{ id: string }>();
  const recordId = Array.isArray(params.id) ? params.id[0] : params.id;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
    {
      name: "Edit Record",
      path: `/admin/coa-verifications/${recordId}/edit`,
    },
  ];

  return (
    <AdminGuard
      title="Edit COA verification record"
      description="Update the release state, analytical summary, and public verification routing for an existing Atlas Labs COA record."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => (
        <CoaVerificationForm
          supabase={supabase}
          mode="edit"
          recordId={recordId}
        />
      )}
    </AdminGuard>
  );
}
