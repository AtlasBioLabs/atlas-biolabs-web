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
  title: "Safety Data Sheets | Admin",
  description: "Manage product Safety Data Sheets (SDS)",
};

export default async function SdsDocumentsPage() {
  const supabase = createServerSupabaseClient();

  const { data: sdsList, error } = await supabase
    .from("sds_documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Safety Data Sheets</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          Failed to load documents: {error.message}
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
      case "under_review":
        return "secondary";
      case "active":
        return "default";
      case "superseded":
        return "outline";
      case "void":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Safety Data Sheets</h1>
          <p className="mt-2 text-muted-foreground">
            Manage product Safety Data Sheets (SDS) documents
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/quality/safety-data-sheets/new">Create SDS</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border/70">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Document Number</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Revision</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sdsList && sdsList.length > 0 ? (
              sdsList.map((sds) => (
                <TableRow key={sds.id}>
                  <TableCell className="font-mono text-sm">
                    {sds.document_number}
                  </TableCell>
                  <TableCell className="text-sm">{sds.product_id}</TableCell>
                  <TableCell className="text-sm">{sds.revision}</TableCell>
                  <TableCell className="text-sm">{sds.language}</TableCell>
                  <TableCell className="text-sm">{sds.jurisdiction}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeColor(sds.status)}>
                      {sds.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/quality/safety-data-sheets/${sds.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No SDS documents found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">SDS Management Guide</p>
        <ul className="mt-2 space-y-1 text-xs">
          <li>• Each product should have an active SDS</li>
          <li>• Mark old SDS as "superseded" when creating a new revision</li>
          <li>• Only one "active" SDS per product is allowed</li>
          <li>• COA documents reference the active SDS for the product</li>
        </ul>
      </div>
    </div>
  );
}
