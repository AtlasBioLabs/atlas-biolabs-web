import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Document Bundle Details | Admin",
  description: "View and manage document bundle",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DocumentBundleDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  // Fetch bundle with all related documents
  const { data: bundle, error: bundleError } = await supabase
    .from("document_bundles")
    .select("*")
    .eq("id", id)
    .single();

  if (bundleError || !bundle) {
    return notFound();
  }

  // Fetch related documents
  const [
    { data: coa },
    { data: batch },
    { data: hplc },
    { data: ms },
    { data: sds },
  ] = await Promise.all([
    supabase.from("coa_documents").select("*").eq("id", bundle.coa_id).single(),
    supabase.from("batches").select("*").eq("id", bundle.batch_id).single(),
    bundle.hplc_report_id
      ? supabase
          .from("hplc_reports")
          .select("*")
          .eq("id", bundle.hplc_report_id)
          .single()
      : Promise.resolve({ data: null }),
    bundle.ms_report_id
      ? supabase
          .from("ms_reports")
          .select("*")
          .eq("id", bundle.ms_report_id)
          .single()
      : Promise.resolve({ data: null }),
    bundle.sds_id
      ? supabase
          .from("sds_documents")
          .select("*")
          .eq("id", bundle.sds_id)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  const getBadgeColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "draft":
        return "secondary";
      case "under_review":
        return "secondary";
      case "approved":
        return "default";
      case "released":
        return "default";
      case "correction_required":
        return "destructive";
      case "void":
        return "destructive";
      default:
        return "outline";
    }
  };

  const documentStatusContent = (
    docName: string,
    status: string,
    docId?: string,
    number?: string
  ) => (
    <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
      <div>
        <p className="font-semibold">{docName}</p>
        {number && <p className="text-xs text-muted-foreground">{number}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={getBadgeColor(status)}>{status}</Badge>
        {docId && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/quality/${docName.toLowerCase()}-reports/${docId}/edit`}>
              Edit
            </Link>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{bundle.bundle_number}</h1>
          <p className="mt-2 text-muted-foreground">
            Product: {bundle.product_id} | Batch: {String(bundle.batch_id).slice(0, 8)}...
          </p>
        </div>
        <Badge variant={getBadgeColor(bundle.status)} className="text-lg">
          {bundle.status}
        </Badge>
      </div>

      {/* Batch Summary */}
      {batch && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Batch Number</p>
                <p className="font-semibold">{batch.batch_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lot Number</p>
                <p className="font-semibold">{batch.lot_number || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                <p className="font-semibold">{batch.manufacturing_date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-semibold">{batch.expiry_date}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getBadgeColor(batch.status)}>{batch.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* COA Summary */}
      {coa && (
        <Card>
          <CardHeader>
            <CardTitle>Certificate of Analysis</CardTitle>
            <CardDescription>{coa.coa_number}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="font-semibold">{coa.issue_date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revision</p>
                <p className="font-semibold">{coa.revision}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Document Status</p>
                <Badge variant={getBadgeColor(coa.document_status)}>
                  {coa.document_status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Release Decision</p>
                <Badge variant={coa.release_decision === "released" ? "default" : "secondary"}>
                  {coa.release_decision}
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/admin/coa-verifications/${coa.id}/edit`}>
                Edit COA
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Supporting Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
          <CardDescription>
            View and manage HPLC, MS/LC-MS, and SDS documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {hplc
            ? documentStatusContent("HPLC Report", hplc.status, hplc.id, hplc.document_number)
            : documentStatusContent("HPLC Report", "missing")}

          {ms
            ? documentStatusContent("MS Report", ms.status, ms.id, ms.document_number)
            : documentStatusContent("MS Report", "missing")}

          {sds
            ? documentStatusContent("SDS", sds.status, sds.id, sds.document_number)
            : documentStatusContent("SDS", "missing")}
        </CardContent>
      </Card>

      {/* Document Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Created</span>
              <span className="font-semibold">{bundle.created_at?.split("T")[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-semibold">{bundle.updated_at?.split("T")[0]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/admin/quality/document-bundles">Back to Bundles</Link>
        </Button>
        {bundle.status !== "released" && bundle.status !== "void" && (
          <>
            <Button asChild variant="outline">
              <Link href={`/admin/quality/document-bundles/${id}/edit`}>
                Edit Bundle
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
