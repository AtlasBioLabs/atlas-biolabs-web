import { createServerSupabaseClient } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Document Bundles | Admin",
  description: "Manage COA and supporting document bundles",
};

export default async function DocumentBundlesPage() {
  const supabase = createServerSupabaseClient();

  const { data: bundles, error } = await supabase
    .from("document_bundles")
    .select(
      `
      id,
      bundle_number,
      product_id,
      batch_id,
      status,
      coa_id,
      hplc_report_id,
      ms_report_id,
      sds_id,
      created_at,
      updated_at
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Document Bundles</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          Failed to load bundles: {error.message}
        </div>
      </div>
    );
  }

  const getBadgeColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "draft":
        return "secondary";
      case "incomplete":
        return "outline";
      case "under_review":
        return "secondary";
      case "approved":
        return "default";
      case "released":
        return "default";
      case "void":
        return "destructive";
      default:
        return "default";
    }
  };

  const getDocStatus = (hasId: boolean): string => {
    return hasId ? "✓" : "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Bundles</h1>
          <p className="mt-2 text-muted-foreground">
            Manage COA and supporting document bundles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/quality/document-bundles/new">
            Create Bundle
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border/70">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Bundle Number</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Batch ID</TableHead>
              <TableHead className="text-center">COA</TableHead>
              <TableHead className="text-center">HPLC</TableHead>
              <TableHead className="text-center">MS</TableHead>
              <TableHead className="text-center">SDS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles && bundles.length > 0 ? (
              bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell className="font-mono text-sm">
                    {bundle.bundle_number}
                  </TableCell>
                  <TableCell className="text-sm">{bundle.product_id}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {String(bundle.batch_id).slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {getDocStatus(!!bundle.coa_id)}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {getDocStatus(!!bundle.hplc_report_id)}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {getDocStatus(!!bundle.ms_report_id)}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {getDocStatus(!!bundle.sds_id)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeColor(bundle.status)}>
                      {bundle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/quality/document-bundles/${bundle.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No bundles found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Documentation Bundle Guide</p>
        <ul className="mt-2 space-y-1 text-xs">
          <li>• A bundle links a COA with supporting HPLC, MS, and SDS documents</li>
          <li>• Status "incomplete" means some supporting documents are missing</li>
          <li>• All documents must be approved before releasing the bundle</li>
          <li>• Released bundles cannot be edited; create a new revision instead</li>
        </ul>
      </div>
    </div>
  );
}
