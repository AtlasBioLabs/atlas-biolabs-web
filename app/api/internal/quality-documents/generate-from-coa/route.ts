import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSupportingDocumentsFromCoaVerification } from "@/lib/quality-coa-bridge";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Failed to generate supporting documents";
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Admin session is required to generate supporting documents." },
        { status: 401 }
      );
    }

    const supabase = createAuthenticatedSupabaseClient(accessToken);
    const body = await request.json();

    const { coaVerificationId, generatedBy } = body as {
      coaVerificationId?: string;
      generatedBy?: string;
    };

    if (!coaVerificationId) {
      return NextResponse.json(
        { error: "coaVerificationId is required" },
        { status: 400 }
      );
    }

    const result = await generateSupportingDocumentsFromCoaVerification(
      supabase,
      coaVerificationId,
      generatedBy || "Atlas Labs QA Documentation Officer"
    );

    return NextResponse.json({
      batchId: result.batchId,
      coaDocumentId: result.coaDocumentId,
      hplcReportId: result.hplcReportId,
      msReportId: result.msReportId,
      sdsId: result.sdsId,
      bundleId: result.bundleId,
      hplcDocumentNumber: result.hplcDocumentNumber,
      msDocumentNumber: result.msDocumentNumber,
      sdsDocumentNumber: result.sdsDocumentNumber,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Generate supporting documents error:", error);

    return NextResponse.json(
      { error: message || "Failed to generate supporting documents" },
      { status: 500 }
    );
  }
}
