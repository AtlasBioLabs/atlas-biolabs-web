"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminGuard } from "@/components/admin/admin-guard";
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
import { Card, CardContent } from "@/components/ui/card";
import type { BreadcrumbItem } from "@/lib/seo";

type BundleRow = {
  id: string;
  bundle_number: string;
  product_id: string;
  batch_id: string;
  status: string;
  coa_id: string | null;
  hplc_report_id: string | null;
  ms_report_id: string | null;
  sds_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
  { name: "Document Bundles", path: "/admin/quality/document-bundles" },
];

function getBadgeColor(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "draft":
    case "under_review":
      return "secondary";
    case "incomplete":
      return "outline";
    case "approved":
    case "released":
      return "default";
    case "void":
      return "destructive";
    default:
      return "outline";
  }
}

function getDocStatus(hasId: boolean): string {
  return hasId ? "✓" : "—";
}

function DocumentBundlesContent({ supabase }: { supabase: SupabaseClient }) {
  const [bundles, setBundles] = useState<BundleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingBundleId, setDeletingBundleId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBundles() {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
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

      if (!isMounted) return;

      if (error) {
        setErrorMessage(error.message);
        setBundles([]);
      } else {
        setBundles((data || []) as BundleRow[]);
      }

      setIsLoading(false);
    }

    loadBundles();

    return () => {
      isMounted = false;
    };
  }, [supabase]);


  async function handleDeleteBundle(bundle: BundleRow) {
    if (!window.confirm(`Delete document bundle ${bundle.bundle_number}? This cannot be undone.`)) {
      return;
    }

    setDeletingBundleId(bundle.id);
    setErrorMessage(null);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (sessionError || !accessToken) {
        throw new Error("Admin session expired. Log in again and retry.");
      }

      const response = await fetch("/api/internal/quality-documents/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ recordType: "bundle", ids: [bundle.id] }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Bundle could not be deleted.");
      }

      setBundles((currentBundles) =>
        currentBundles.filter((currentBundle) => currentBundle.id !== bundle.id)
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Bundle could not be deleted."
      );
    } finally {
      setDeletingBundleId(null);
    }
  }

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
          <Link href="/admin/coa-verifications">Create from COA records</Link>
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 text-red-800">
            Failed to load bundles: {errorMessage}
          </CardContent>
        </Card>
      ) : null}

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  Loading bundles...
                </TableCell>
              </TableRow>
            ) : bundles.length > 0 ? (
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
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/quality/document-bundles/${bundle.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingBundleId === bundle.id}
                        onClick={() => handleDeleteBundle(bundle)}
                        className="text-rose-700 hover:text-rose-800"
                      >
                        <Trash2Icon className="mr-1 size-3.5" />
                        {deletingBundleId === bundle.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No bundles found. Generate one from a COA record.
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
          <li>• Bundles are generated from COA records so document references are prefilled</li>
          <li>• Status &quot;incomplete&quot; means some supporting documents are missing</li>
          <li>• Released bundles cannot be edited; create a new revision instead</li>
        </ul>
      </div>
    </div>
  );
}

export default function DocumentBundlesPage() {
  return (
    <AdminGuard
      title="Document Bundles"
      description="View COA-linked HPLC, MS / LC-MS, SDS, and supporting document bundles."
      breadcrumbs={breadcrumbs}
    >
      {({ supabase }) => <DocumentBundlesContent supabase={supabase} />}
    </AdminGuard>
  );
}
