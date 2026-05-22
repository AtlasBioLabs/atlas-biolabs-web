/**
 * Document Download API
 * Handles PDF generation and downloads for all quality documents
 */

import { createServerSupabaseClient } from "@/lib/supabase";
import { generateCoaPdfHtml, generateHplcPdfHtml } from "@/lib/quality-pdf-templates";
import { getActiveCoaBrandSettings } from "@/lib/coa-brand-settings";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

interface DownloadRequest {
  documentType: "coa" | "hplc" | "ms" | "sds";
  documentId: string;
  format?: "html" | "pdf";
}

/**
 * POST /api/internal/quality-documents/download
 * Generate and return document in requested format
 */
export async function POST(request: Request) {
  try {
    const body: DownloadRequest = await request.json();
    const { documentType, documentId, format = "html" } = body;

    const supabase = createServerSupabaseClient();
    const brandSettings = await getActiveCoaBrandSettings(supabase);

    if (documentType === "coa") {
      const { data: coa } = await supabase
        .from("coa_documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (!coa) return notFound();

      const { data: batch } = await supabase
        .from("batches")
        .select("*")
        .eq("id", coa.batch_id)
        .single();

      if (!batch) return notFound();

      // Generate HTML
      const html = generateCoaPdfHtml(coa, coa.product_id, batch, {
        brandSettings,
        watermarkMode: coa.watermark_mode,
        includeQrCode: true,
      });

      if (format === "html") {
        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Disposition": `attachment; filename="COA-${coa.coa_number}.html"`,
          },
        });
      }

      // For PDF, return HTML and let browser handle printing
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    if (documentType === "hplc") {
      const { data: hplc } = await supabase
        .from("hplc_reports")
        .select("*")
        .eq("id", documentId)
        .single();

      if (!hplc) return notFound();

      const html = generateHplcPdfHtml(hplc, hplc.product_id, {
        brandSettings,
        watermarkMode: hplc.watermark_mode,
        includeCharts: true,
      });

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="HPLC-${hplc.document_number}.html"`,
        },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported document type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Document download error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
