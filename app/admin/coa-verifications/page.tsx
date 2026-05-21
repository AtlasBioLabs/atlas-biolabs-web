"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CopyIcon,
  ExternalLinkIcon,
  PlusIcon,
  PrinterIcon,
  SearchIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminGuard } from "@/components/admin/admin-guard";
import { CoaStatusBadge } from "@/components/admin/coa-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listCoaVerificationRows, verificationStatusOptions } from "@/lib/coa-verification-admin";
import type { CoaVerificationRow, CoaVerificationStatus } from "@/lib/coa-verification";
import type { BreadcrumbItem } from "@/lib/seo";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "COA Admin", path: "/admin/coa-verifications" },
];

function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.valueOf())
    ? value
    : parsedDate.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default function AdminCoaVerificationsPage() {
  return (
    <AdminGuard
      title="COA verification records"
      description="Manage Atlas Labs QA verification records, verification status changes, and public COA lookup outputs."
      breadcrumbs={breadcrumbItems}
    >
      {({ supabase }) => <AdminCoaVerificationIndex supabase={supabase} />}
    </AdminGuard>
  );
}

function AdminCoaVerificationIndex({
  supabase,
}: {
  supabase: SupabaseClient;
}) {
  const [rows, setRows] = useState<CoaVerificationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<CoaVerificationStatus | "All">("All");

  useEffect(() => {
    let isMounted = true;

    async function loadRows() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextRows = await listCoaVerificationRows(supabase);

        if (!isMounted) {
          return;
        }

        setRows(nextRows);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "The COA verification records could not be loaded."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRows();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === "All" || row.verification_status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.product_name.toLowerCase().includes(normalizedSearch) ||
        row.coa_number.toLowerCase().includes(normalizedSearch) ||
        row.batch_lot_no.toLowerCase().includes(normalizedSearch) ||
        row.verification_code.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [rows, searchValue, statusFilter]);

  async function handleCopyVerificationUrl(row: CoaVerificationRow) {
    const verificationUrl =
      row.verification_url ||
      `${window.location.origin}/verify/${encodeURIComponent(row.verification_code)}`;
    await navigator.clipboard.writeText(verificationUrl);
    setCopyMessage(`Verification URL copied for ${row.coa_number}.`);
    window.setTimeout(() => setCopyMessage(null), 2500);
  }

  return (
    <div className="space-y-6">
      <Card className="surface-card border p-0">
        <CardContent className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 md:grid-cols-[1fr_220px] lg:w-[760px]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search product, COA number, batch lot, or verification code"
                className="h-11 border-[#d5def0] bg-white pr-4 pl-10 text-[var(--brand-navy)]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as CoaVerificationStatus | "All")
              }
              className="h-11 rounded-lg border border-[#d5def0] bg-white px-4 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <option value="All">All statuses</option>
              {verificationStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
            >
              <Link href="/admin/settings/coa-branding">
                <Settings2Icon className="mr-1 size-4" />
                COA Branding
              </Link>
            </Button>
            <Button asChild className="h-11 bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-blue)]">
              <Link href="/admin/coa-verifications/new">
                <PlusIcon className="mr-1 size-4" />
                Create COA Record
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {errorMessage ? (
        <Card className="surface-card border border-rose-200 bg-rose-50/60 p-0">
          <CardContent className="py-5 text-sm text-rose-800">{errorMessage}</CardContent>
        </Card>
      ) : null}

      {copyMessage ? (
        <Card className="surface-card border border-emerald-200 bg-emerald-50/60 p-0">
          <CardContent className="py-4 text-sm text-emerald-800">{copyMessage}</CardContent>
        </Card>
      ) : null}

      <Card className="surface-card border p-0">
        <CardContent className="overflow-x-auto py-0">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading COA verification records...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No COA records matched the current search or filter.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border/70 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-4 py-4 font-semibold">COA Number</th>
                  <th className="px-4 py-4 font-semibold">Verification Code</th>
                  <th className="px-4 py-4 font-semibold">Product Name</th>
                  <th className="px-4 py-4 font-semibold">Catalog Code</th>
                  <th className="px-4 py-4 font-semibold">Batch / Lot No.</th>
                  <th className="px-4 py-4 font-semibold">Verification Status</th>
                  <th className="px-4 py-4 font-semibold">Release Decision</th>
                  <th className="px-4 py-4 font-semibold">Issue Date</th>
                  <th className="px-4 py-4 font-semibold">Updated At</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-4 font-medium text-[var(--brand-navy)]">
                      {row.coa_number}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[var(--brand-navy)]">
                      {row.verification_code}
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.product_name}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.catalog_code}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.batch_lot_no}</td>
                    <td className="px-4 py-4">
                      <CoaStatusBadge status={row.verification_status} />
                    </td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.release_decision}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">{row.issue_date}</td>
                    <td className="px-4 py-4 text-[var(--brand-navy)]">
                      {formatDateTime(row.updated_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                          <Link href={`/admin/coa-verifications/${row.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                          <Link href={`/admin/coa-verifications/${row.id}/print`}>
                            <PrinterIcon className="mr-1 size-3.5" />
                            Print COA
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                          <Link
                            href={`/verify/${encodeURIComponent(row.verification_code)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLinkIcon className="mr-1 size-3.5" />
                            View Public Verification
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyVerificationUrl(row)}
                          className="border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        >
                          <CopyIcon className="mr-1 size-3.5" />
                          Copy Verification URL
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
