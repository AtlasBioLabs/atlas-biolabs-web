"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { CoaBrandingForm } from "@/components/admin/coa-branding-form";
import type { BreadcrumbItem } from "@/lib/seo";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
  { name: "COA Branding", path: "/admin/settings/coa-branding" },
];

export default function CoaBrandingSettingsPage() {
  return (
    <AdminGuard
      title="COA branding settings"
      description="Manage the reusable Atlas Labs branding layer used across printable COA output."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => <CoaBrandingForm supabase={supabase} />}
    </AdminGuard>
  );
}
