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
  title: "MS/LC-MS Reports | Admin",
  description: "Manage mass spectrometry identity confirmation reports",
};

export default async function MsReportsPage() {
  const supabase = createServerSupabaseClient();

  const { data: reports, error } = await supabase
    .from("ms_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">MS/LC-MS Reports</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          Failed to load reports: {error.message}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MS/LC-MS Reports</h1>
          <p className="mt-2 text-muted-foreground">
            Manage mass spectrometry identity confirmation reports
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/quality/ms-reports/new">Create Report</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border/70">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Document Number</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Expected MW</TableHead>
              <TableHead>Observed Mass</TableHead>
              <TableHead>Pass/Fail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports && reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-sm">
                    {report.document_number}
                  </TableCell>
                  <TableCell className="text-sm">{report.product_id}</TableCell>
                  <TableCell className="text-sm">{report.method_name}</TableCell>
                  <TableCell className="text-sm">
                    {report.expected_molecular_weight}
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.observed_mass ? report.observed_mass.toFixed(4) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.pass_fail_decision === "pass"
                          ? "default"
                          : report.pass_fail_decision === "fail"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {report.pass_fail_decision}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/quality/ms-reports/${report.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No MS reports found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
