import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type DeleteRecordType =
  | "coa_verification"
  | "bundle"
  | "coa_document"
  | "hplc"
  | "ms"
  | "sds";

type DeleteRequest = {
  recordType?: DeleteRecordType;
  ids?: string[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function createAuthenticatedSupabaseClient(accessToken: string) {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      fetch,
    },
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return "Delete request could not be completed.";
}

function normalizeIds(ids: unknown) {
  if (!Array.isArray(ids)) return [];

  return Array.from(
    new Set(
      ids
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean)
    )
  );
}

async function assertAdminSession(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Admin session is required. Log in again and retry.");
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id, is_active")
    .eq("auth_user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (adminError) {
    throw new Error(adminError.message);
  }

  if (!adminUser) {
    throw new Error("This user is not an active admin.");
  }
}

async function deleteFromTable(
  supabase: SupabaseClient,
  tableName: string,
  ids: string[]
) {
  const { error } = await supabase.from(tableName).delete().in("id", ids);
  if (error) throw new Error(error.message);
}

async function clearHplcLinks(supabase: SupabaseClient, ids: string[]) {
  await supabase.from("document_bundles").update({ hplc_report_id: null }).in("hplc_report_id", ids);
  await supabase.from("coa_documents").update({ hplc_report_id: null }).in("hplc_report_id", ids);
  await supabase
    .from("coa_verifications")
    .update({ hplc_report_id: null, hplc_file_name: null, supporting_documents_status: "incomplete" })
    .in("hplc_report_id", ids);
}

async function clearMsLinks(supabase: SupabaseClient, ids: string[]) {
  await supabase.from("document_bundles").update({ ms_report_id: null }).in("ms_report_id", ids);
  await supabase.from("coa_documents").update({ ms_report_id: null }).in("ms_report_id", ids);
  await supabase
    .from("coa_verifications")
    .update({ ms_report_id: null, lcms_file_name: null, supporting_documents_status: "incomplete" })
    .in("ms_report_id", ids);
}

async function clearSdsLinks(supabase: SupabaseClient, ids: string[]) {
  await supabase.from("document_bundles").update({ sds_id: null }).in("sds_id", ids);
  await supabase.from("coa_documents").update({ sds_id: null }).in("sds_id", ids);
  await supabase
    .from("coa_verifications")
    .update({ sds_id: null, sds_file_name: null, supporting_documents_status: "incomplete" })
    .in("sds_id", ids);
}

async function deleteQualityRecords(
  supabase: SupabaseClient,
  recordType: DeleteRecordType,
  ids: string[]
) {
  if (recordType === "coa_verification") {
    await supabase.from("coa_analytical_test_results").delete().in("coa_verification_id", ids);
    await supabase.from("coa_analytical_records").delete().in("coa_verification_id", ids);
    await deleteFromTable(supabase, "coa_verifications", ids);
    return;
  }

  if (recordType === "bundle") {
    await supabase
      .from("coa_verifications")
      .update({
        document_bundle_id: null,
        supporting_documents_status: "not_generated",
        supporting_documents_generated_at: null,
        supporting_documents_generated_by: null,
      })
      .in("document_bundle_id", ids);
    await deleteFromTable(supabase, "document_bundles", ids);
    return;
  }

  if (recordType === "coa_document") {
    await supabase.from("document_bundles").delete().in("coa_id", ids);
    await supabase
      .from("coa_verifications")
      .update({ quality_coa_document_id: null, document_bundle_id: null })
      .in("quality_coa_document_id", ids);
    await deleteFromTable(supabase, "coa_documents", ids);
    return;
  }

  if (recordType === "hplc") {
    await clearHplcLinks(supabase, ids);
    await deleteFromTable(supabase, "hplc_reports", ids);
    return;
  }

  if (recordType === "ms") {
    await clearMsLinks(supabase, ids);
    await deleteFromTable(supabase, "ms_reports", ids);
    return;
  }

  if (recordType === "sds") {
    await clearSdsLinks(supabase, ids);
    await deleteFromTable(supabase, "sds_documents", ids);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Admin session is required to delete quality records." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as DeleteRequest;
    const { recordType } = body;
    const ids = normalizeIds(body.ids);

    if (!recordType || !["coa_verification", "bundle", "coa_document", "hplc", "ms", "sds"].includes(recordType)) {
      return NextResponse.json({ error: "Unsupported or missing record type." }, { status: 400 });
    }

    if (ids.length === 0) {
      return NextResponse.json({ error: "At least one id is required." }, { status: 400 });
    }

    const supabase = createAuthenticatedSupabaseClient(accessToken);
    await assertAdminSession(supabase);
    await deleteQualityRecords(supabase, recordType, ids);

    return NextResponse.json({ ok: true, deletedCount: ids.length });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Quality delete error:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
