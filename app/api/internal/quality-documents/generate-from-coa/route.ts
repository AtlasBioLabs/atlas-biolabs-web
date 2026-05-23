import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateSupportingDocumentsFromCoaVerification } from "@/lib/quality-coa-bridge";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
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
    });
  } catch (error) {
    console.error("Generate supporting documents error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate supporting documents",
      },
      { status: 500 }
    );
  }
}
