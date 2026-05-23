import fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getActiveCoaBrandSettings, type CoaBrandSettings } from "@/lib/coa-brand-settings";
import { renderHtmlToPdfBuffer } from "@/lib/pdf-renderer";

export const runtime = "nodejs";

type DocumentType = "coa" | "hplc" | "ms" | "sds" | "bundle";

type DownloadRequest = {
  documentType?: DocumentType;
  documentId?: string;
  format?: "html" | "pdf" | "zip";
};

type DbRecord = Record<string, unknown>;

type BundleRecord = DbRecord & {
  id: string;
  product_id: string;
  batch_id: string;
  coa_id: string;
  hplc_report_id?: string | null;
  ms_report_id?: string | null;
  sds_id?: string | null;
  bundle_number?: string | null;
  status?: string | null;
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

  return "Document could not be generated.";
}

function text(value: unknown, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function htmlEscape(value: unknown) {
  return text(value, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fileSafe(value: unknown) {
  return text(value, "document")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let current = index;
    for (let bit = 0; bit < 8; bit += 1) {
      current = current & 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
    }
    table[index] = current >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate =
    ((date.getFullYear() - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  return { dosDate, dosTime };
}

function writeUInt16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function writeUInt32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function createZipBuffer(files: Array<{ name: string; content: string | Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  const { dosDate, dosTime } = dosDateTime();

  for (const file of files) {
    const safeName = file.name.replace(/^\/+/, "");
    const nameBuffer = Buffer.from(safeName, "utf8");
    const contentBuffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, "utf8");
    const checksum = crc32(contentBuffer);

    const localHeader = Buffer.concat([
      writeUInt32(0x04034b50),
      writeUInt16(20),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(dosTime),
      writeUInt16(dosDate),
      writeUInt32(checksum),
      writeUInt32(contentBuffer.length),
      writeUInt32(contentBuffer.length),
      writeUInt16(nameBuffer.length),
      writeUInt16(0),
      nameBuffer,
    ]);

    localParts.push(localHeader, contentBuffer);

    const centralHeader = Buffer.concat([
      writeUInt32(0x02014b50),
      writeUInt16(20),
      writeUInt16(20),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(dosTime),
      writeUInt16(dosDate),
      writeUInt32(checksum),
      writeUInt32(contentBuffer.length),
      writeUInt32(contentBuffer.length),
      writeUInt16(nameBuffer.length),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt16(0),
      writeUInt32(0),
      writeUInt32(offset),
      nameBuffer,
    ]);

    centralParts.push(centralHeader);
    offset += localHeader.length + contentBuffer.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = Buffer.concat([
    writeUInt32(0x06054b50),
    writeUInt16(0),
    writeUInt16(0),
    writeUInt16(files.length),
    writeUInt16(files.length),
    writeUInt32(centralDirectory.length),
    writeUInt32(offset),
    writeUInt16(0),
  ]);

  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

async function getById<T extends DbRecord>(
  supabase: SupabaseClient,
  tableName: string,
  id: string
) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`${tableName} record was not found.`);

  return data as T;
}

async function maybeById<T extends DbRecord>(
  supabase: SupabaseClient,
  tableName: string,
  id?: string | null
) {
  if (!id) return null;

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as T | null) || null;
}

function getBrandValue(brandSettings: CoaBrandSettings, key: keyof CoaBrandSettings, fallback: string) {
  const value = brandSettings[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";

  return "application/octet-stream";
}

function tryResolvePublicAssetAsDataUri(value: string) {
  if (!value.startsWith("/")) return "";

  const publicPath = path.join(process.cwd(), "public", value.replace(/^\/+/, ""));

  if (!fs.existsSync(publicPath)) return "";

  const data = fs.readFileSync(publicPath);
  return `data:${getMimeType(publicPath)};base64,${data.toString("base64")}`;
}

function resolveAssetUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(data:|blob:)/i.test(trimmed)) return trimmed;

  const embeddedPublicAsset = tryResolvePublicAssetAsDataUri(trimmed);
  if (embeddedPublicAsset) return embeddedPublicAsset;

  if (/^https?:/i.test(trimmed)) return trimmed;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000";

  if (trimmed.startsWith("/")) return `${baseUrl.replace(/\/$/, "")}${trimmed}`;
  return trimmed;
}

function baseHtml({
  title,
  subtitle,
  brandSettings,
  watermarkMode,
  body,
  autoPrint = false,
}: {
  title: string;
  subtitle?: string;
  brandSettings: CoaBrandSettings;
  watermarkMode?: string | null;
  body: string;
  autoPrint?: boolean;
}) {
  const companyName = getBrandValue(brandSettings, "company_name", "Atlas BioLabs");
  const qualityUnitName = getBrandValue(brandSettings, "quality_unit_name", "Quality Documentation Unit");
  const tagline = getBrandValue(brandSettings, "tagline", "Precision Research Compounds - Batch Documentation - Analytical Traceability");
  const logoUrl = resolveAssetUrl(getBrandValue(brandSettings, "logo_url", ""));
  const footerText = getBrandValue(
    brandSettings,
    "footer_text",
    "Atlas BioLabs documentation is provided for qualified commercial sourcing, research, documentation, and formulation context only. No medical, dosing, or human-use claims are made."
  );
  const watermarkText =
    watermarkMode === "sample"
      ? "SAMPLE / DEMO — NOT FOR RELEASE OR CUSTOMER USE"
      : watermarkMode === "draft"
        ? "DRAFT — DOCUMENT NOT YET APPROVED"
        : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${htmlEscape(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #f4f7fb; color: #0a1a2f; font-family: Arial, Helvetica, sans-serif; line-height: 1.45; }
    .toolbar { position: sticky; top: 0; z-index: 10; display: flex; gap: 10px; align-items: center; justify-content: flex-end; padding: 12px 18px; background: #0a1a2f; color: white; }
    .toolbar button { border: 1px solid rgba(255,255,255,.35); background: white; color: #0a1a2f; border-radius: 8px; padding: 8px 12px; font-weight: 700; cursor: pointer; }
    .page { width: min(8.5in, calc(100% - 28px)); min-height: 11in; margin: 18px auto; padding: .55in; background: white; border: 1px solid #d8e1ef; border-radius: 14px; box-shadow: 0 16px 40px rgba(10, 26, 47, .08); position: relative; overflow: hidden; }
    .page-break { page-break-before: always; }
    .header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; border-bottom: 3px solid #0a1a2f; padding-bottom: 16px; margin-bottom: 22px; }
    .brand-block { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
    .logo { max-height: 54px; max-width: 150px; object-fit: contain; display: block; }
    .logo-fallback { width: 54px; height: 54px; display:flex; align-items:center; justify-content:center; border:1px solid #d8e1ef; background:#f7faff; color:#0a1a2f; font-size:8px; line-height:1.1; text-align:center; font-weight:800; padding:4px; }
    .brand { letter-spacing: .18em; text-transform: uppercase; font-size: 11px; color: #2e6bff; font-weight: 800; }
    .quality-unit { margin-top: 3px; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #4d5d75; font-weight: 700; }
    .tagline { margin-top: 5px; max-width: 5in; color: #5c6b82; font-size: 10px; }
    h1 { margin: 6px 0 0; font-size: 24px; }
    h2 { margin: 24px 0 10px; font-size: 15px; letter-spacing: .08em; text-transform: uppercase; color: #2e6bff; border-bottom: 1px solid #d8e1ef; padding-bottom: 6px; }
    h3 { margin: 16px 0 8px; font-size: 13px; color: #0a1a2f; }
    .subtitle { margin-top: 4px; color: #5c6b82; font-size: 13px; }
    .meta { text-align: right; font-size: 11px; color: #4d5d75; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .item { border: 1px solid #d8e1ef; border-radius: 10px; padding: 9px 10px; background: #fbfdff; }
    .label { display: block; color: #62708a; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
    .value { font-size: 12px; font-weight: 700; color: #0a1a2f; white-space: pre-wrap; }
    .box { border: 1px solid #d8e1ef; border-radius: 12px; padding: 12px; background: #fbfdff; font-size: 12px; white-space: pre-wrap; }
    .result { border: 2px solid #2e6bff; background: #f4f8ff; border-radius: 12px; padding: 14px; margin: 12px 0; }
    .result strong { font-size: 20px; color: #2e6bff; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11px; }
    th, td { border: 1px solid #d8e1ef; text-align: left; padding: 8px; vertical-align: top; }
    th { background: #f4f7fb; color: #0a1a2f; }
    .footer { margin-top: 28px; border-top: 1px solid #d8e1ef; padding-top: 12px; font-size: 10px; color: #5c6b82; }
    .signature-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 24px; }
    .signature { text-align: center; font-size: 11px; }
    .line { height: 44px; border-bottom: 1px solid #0a1a2f; margin-bottom: 8px; }
    .watermark { position: fixed; top: 46%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); opacity: .08; font-size: 54px; font-weight: 900; letter-spacing: .06em; color: #0a1a2f; width: 130%; text-align: center; z-index: 0; pointer-events: none; }
    .content { position: relative; z-index: 1; }
    @media print {
      body { background: white; }
      .toolbar { display: none; }
      .page { width: 100%; min-height: auto; margin: 0; border: 0; border-radius: 0; box-shadow: none; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button><button onclick="window.close()">Close</button></div>
  <main class="page">
    ${watermarkText ? `<div class="watermark">${htmlEscape(watermarkText)}</div>` : ""}
    <div class="content">
      <div class="header">
        <div class="brand-block">
          ${logoUrl ? `<img class="logo" src="${htmlEscape(logoUrl)}" alt="${htmlEscape(companyName)} logo" />` : `<div class="logo-fallback">${htmlEscape(companyName)}</div>`}
          <div>
            <div class="brand">${htmlEscape(companyName)}</div>
            <div class="quality-unit">${htmlEscape(qualityUnitName)}</div>
            <div class="tagline">${htmlEscape(tagline)}</div>
            <h1>${htmlEscape(title)}</h1>
            ${subtitle ? `<p class="subtitle">${htmlEscape(subtitle)}</p>` : ""}
          </div>
        </div>
        <div class="meta">Generated ${htmlEscape(new Date().toISOString().split("T")[0])}<br/>${htmlEscape(getBrandValue(brandSettings, "verification_base_url", "https://www.atlasbiolabs.co/verify"))}</div>
      </div>
      ${body}
      <div class="footer">${htmlEscape(footerText)}</div>
    </div>
  </main>
  ${autoPrint ? "<script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>" : ""}
</body>
</html>`;
}

function kv(label: string, value: unknown) {
  return `<div class="item"><span class="label">${htmlEscape(label)}</span><div class="value">${htmlEscape(value)}</div></div>`;
}

function signatures(names: Array<{ label: string; name?: unknown }>) {
  return `<div class="signature-grid">${names
    .map(
      (entry) => `<div class="signature"><div class="line"></div><strong>${htmlEscape(entry.name)}</strong><br/><span>${htmlEscape(entry.label)}</span></div>`
    )
    .join("")}</div>`;
}


async function getLinkedCoaRecordForBundle(supabase: SupabaseClient, bundle: BundleRecord) {
  const { data, error } = await supabase
    .from("coa_verifications")
    .select("*")
    .or(
      [
        `document_bundle_id.eq.${bundle.id}`,
        `quality_coa_document_id.eq.${bundle.coa_id}`,
        bundle.hplc_report_id ? `hplc_report_id.eq.${bundle.hplc_report_id}` : "",
        bundle.ms_report_id ? `ms_report_id.eq.${bundle.ms_report_id}` : "",
        bundle.sds_id ? `sds_id.eq.${bundle.sds_id}` : "",
      ]
        .filter(Boolean)
        .join(",")
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as DbRecord | null) || null;
}

async function getLinkedCoaRecordForCoaDocument(
  supabase: SupabaseClient,
  coaDocumentId: string,
  coaDocument?: DbRecord | null
) {
  const { data: directRow, error: directError } = await supabase
    .from("coa_verifications")
    .select("*")
    .eq("id", coaDocumentId)
    .maybeSingle();

  if (directError) throw new Error(directError.message);
  if (directRow) return directRow as DbRecord;

  const conditions = [`quality_coa_document_id.eq.${coaDocumentId}`];

  if (coaDocument?.coa_number) {
    conditions.push(`coa_number.eq.${coaDocument.coa_number}`);
  }

  if (coaDocument?.verification_code) {
    conditions.push(`verification_code.eq.${coaDocument.verification_code}`);
  }

  const { data, error } = await supabase
    .from("coa_verifications")
    .select("*")
    .or(conditions.join(","))
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as DbRecord | null) || null;
}

async function getCoaAnalyticalRows(supabase: SupabaseClient, coaVerificationId?: unknown) {
  if (!coaVerificationId) {
    return { results: [] as DbRecord[], records: [] as DbRecord[] };
  }

  const [resultsResponse, recordsResponse] = await Promise.all([
    supabase
      .from("coa_analytical_test_results")
      .select("*")
      .eq("coa_verification_id", String(coaVerificationId))
      .order("position", { ascending: true }),
    supabase
      .from("coa_analytical_records")
      .select("*")
      .eq("coa_verification_id", String(coaVerificationId))
      .order("position", { ascending: true }),
  ]);

  if (resultsResponse.error) throw new Error(resultsResponse.error.message);
  if (recordsResponse.error) throw new Error(recordsResponse.error.message);

  return {
    results: (resultsResponse.data as DbRecord[] | null) || [],
    records: (recordsResponse.data as DbRecord[] | null) || [],
  };
}

function getRecordValue(record: DbRecord, keys: string[], fallback = "—") {
  for (const key of keys) {
    const value = record[key];
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }

  return fallback;
}


function formattedRevision(value: unknown) {
  const raw = text(value, "01");
  if (/^rev\.?\s*/i.test(raw)) return raw;
  const number = raw.replace(/\D/g, "") || raw;
  return /^\d+$/.test(number) ? `Rev. ${number.padStart(2, "0")}` : raw;
}

function getVerificationUrl(record: DbRecord, brandSettings: CoaBrandSettings) {
  const existing = text(record.verification_url || record.qr_code_value, "");
  if (existing) return existing;

  const code = text(record.verification_code, "");
  if (!code) return "";

  return `${getBrandValue(brandSettings, "verification_base_url", "https://atlasbiolabs.co/verify").replace(/\/$/, "")}/${code}`;
}

function sectionTitle(title: string) {
  return `<h2 class="coa-section-title">${htmlEscape(title)}</h2>`;
}

function simpleRows(rows: Array<[string, unknown]>) {
  return `<table class="coa-table"><tbody>${rows
    .map(([label, value]) => `<tr><th>${htmlEscape(label)}</th><td>${htmlEscape(value)}</td></tr>`)
    .join("")}</tbody></table>`;
}

function getLogoHtml(brandSettings: CoaBrandSettings) {
  const logoUrl = resolveAssetUrl(getBrandValue(brandSettings, "logo_url", ""));
  if (!logoUrl) return `<div class="coa-logo-fallback">Atlas</div>`;
  return `<img class="coa-logo" src="${htmlEscape(logoUrl)}" alt="${htmlEscape(getBrandValue(brandSettings, "company_name", "Atlas Labs"))} logo" />`;
}

function getSealHtml(brandSettings: CoaBrandSettings) {
  const sealUrl = resolveAssetUrl(getBrandValue(brandSettings, "seal_url", ""));
  if (!sealUrl) return `<div class="coa-seal-fallback">${htmlEscape(getBrandValue(brandSettings, "seal_text", "Atlas Labs Seal / Stamp"))}</div>`;
  return `<img class="coa-seal" src="${htmlEscape(sealUrl)}" alt="${htmlEscape(getBrandValue(brandSettings, "seal_text", "Atlas Labs Seal"))}" />`;
}

function getQrHtml(record: DbRecord, brandSettings: CoaBrandSettings) {
  const qrUrl = resolveAssetUrl(text(record.qr_code_url || record.qr_code_value, ""));
  if (qrUrl && /^(data:|https?:|\/)/i.test(qrUrl)) {
    return `<img class="coa-qr" src="${htmlEscape(qrUrl)}" alt="COA verification QR code" />`;
  }

  const verificationUrl = getVerificationUrl(record, brandSettings);
  if (!verificationUrl) return "";

  return `<div class="coa-qr-fallback">QR</div>`;
}

function coaDocumentHeader(coaRecord: DbRecord, brandSettings: CoaBrandSettings) {
  const companyName = getBrandValue(brandSettings, "company_name", "Atlas Labs");
  const qualityUnitName = getBrandValue(brandSettings, "quality_unit_name", "Quality Documentation Unit");
  const tagline = getBrandValue(
    brandSettings,
    "tagline",
    "Precision Research Compounds - Batch Documentation - Analytical Traceability"
  );

  return `<div class="coa-header">
    <div class="coa-brand-row">
      ${getLogoHtml(brandSettings)}
      <div>
        <div class="coa-brand-name">${htmlEscape(companyName)}</div>
        <div class="coa-quality-unit">${htmlEscape(qualityUnitName)}</div>
        <div class="coa-tagline">${htmlEscape(tagline)}</div>
      </div>
    </div>
    <div class="coa-control-box">
      <div class="coa-control-title">${htmlEscape(getBrandValue(brandSettings, "controlled_document_label", "Controlled Document"))}</div>
      <div class="coa-control-row"><span>COA Number</span><strong>${htmlEscape(coaRecord.coa_number)}</strong></div>
      <div class="coa-control-row"><span>Revision</span><strong>${htmlEscape(formattedRevision(coaRecord.revision))}</strong></div>
      <div class="coa-control-row"><span>Document Class</span><strong>${htmlEscape(getBrandValue(brandSettings, "document_class", "Batch QA record"))}</strong></div>
    </div>
  </div>`;
}

function coaPageShell(content: string, coaRecord: DbRecord, brandSettings: CoaBrandSettings, pageBreak = true) {
  return `<section class="coa-page${pageBreak ? " coa-page-break" : ""}">
    ${coaDocumentHeader(coaRecord, brandSettings)}
    ${content}
    <div class="coa-footer">${htmlEscape(getBrandValue(brandSettings, "footer_text", "Atlas BioLabs / Atlas Labs - Batch documentation. Final release requires authorized signature and batch-specific analytical records."))}</div>
  </section>`;
}

function linkedCoaHtml({
  coaRecord,
  analyticalResults,
  analyticalRecords,
  brandSettings,
}: {
  coaRecord: DbRecord;
  analyticalResults: DbRecord[];
  analyticalRecords: DbRecord[];
  brandSettings: CoaBrandSettings;
}) {
  const statusText = text(coaRecord.verification_status || coaRecord.release_decision, "Released / Verified");
  const verificationUrl = getVerificationUrl(coaRecord, brandSettings);

  const resultRows = analyticalResults.length
    ? analyticalResults
        .map(
          (row) => `<tr>
            <td>${htmlEscape(getRecordValue(row, ["test_name", "attribute", "name", "parameter", "record_type"]))}</td>
            <td>${htmlEscape(getRecordValue(row, ["method", "test_method", "method_name"]))}</td>
            <td>${htmlEscape(getRecordValue(row, ["specification", "acceptance_criteria"]))}</td>
            <td>${htmlEscape(getRecordValue(row, ["result", "batch_result", "value", "measured_value"]))}</td>
            <td>${htmlEscape(getRecordValue(row, ["status", "decision", "unit"]))}</td>
          </tr>`
        )
        .join("")
    : `<tr><td>Appearance</td><td>Visual inspection</td><td>White to off-white powder</td><td>${htmlEscape(coaRecord.appearance || "White to off-white powder")}</td><td>Requires review</td></tr>
       <tr><td>Identity</td><td>LC-MS / MS</td><td>Consistent with reference MW / sequence</td><td>${htmlEscape(coaRecord.identity_result || "Conforms to reference identity")}</td><td>Conforms</td></tr>
       <tr><td>Purity</td><td>RP-HPLC</td><td>≥ 98.0% by area normalization</td><td>${htmlEscape(coaRecord.hplc_purity || coaRecord.purity || "—")}</td><td>Requires review</td></tr>`;

  const referencedRows = analyticalRecords.length
    ? analyticalRecords
        .map(
          (row) => `<tr>
            <td>${htmlEscape(getRecordValue(row, ["record_type", "name", "document_type"]))}</td>
            <td>${htmlEscape(getRecordValue(row, ["reference_file_name", "file_name", "document_number", "reference"]))}</td>
            <td>${htmlEscape(getRecordValue(row, ["availability", "status", "notes"]))}</td>
          </tr>`
        )
        .join("")
    : `<tr><td>HPLC chromatogram</td><td>${htmlEscape(coaRecord.hplc_file_name)}</td><td>${htmlEscape(coaRecord.hplc_file_name ? "Draft generated / available for review" : "Pending upload")}</td></tr>
       <tr><td>LC-MS identity report</td><td>${htmlEscape(coaRecord.lcms_file_name)}</td><td>${htmlEscape(coaRecord.lcms_file_name ? "Draft generated / available for review" : "Pending upload")}</td></tr>
       <tr><td>SDS / Safety Data Sheet</td><td>${htmlEscape(coaRecord.sds_file_name)}</td><td>${htmlEscape(coaRecord.sds_file_name ? "Draft generated / available for review" : "On request")}</td></tr>
       <tr><td>Raw data archive</td><td>${htmlEscape(coaRecord.raw_data_archive_ref || "Controlled access / internal QA record folder")}</td><td>Controlled access</td></tr>`;

  const firstPage = coaPageShell(`
    <div class="coa-title-row">
      <div>
        <h1>${htmlEscape(getBrandValue(brandSettings, "certificate_title", "CERTIFICATE OF ANALYSIS"))}</h1>
        <p>${htmlEscape(getBrandValue(brandSettings, "certificate_subtitle", "Batch-specific quality documentation for qualified B2B sourcing review"))}</p>
      </div>
      <div class="coa-status-box"><span>Status</span><strong>${htmlEscape(statusText)}</strong></div>
    </div>
    <div class="coa-note">${htmlEscape(getBrandValue(brandSettings, "document_note", "This COA record is prepared for buyer review and must be matched to the final batch-specific HPLC, MS/LC-MS and QA release records before commercial shipment."))}</div>

    ${sectionTitle("Document Summary")}
    ${simpleRows([
      ["COA Number", coaRecord.coa_number],
      ["Issue Date", coaRecord.issue_date],
      ["Client / Recipient", coaRecord.client_recipient || "Qualified B2B Buyer"],
      ["Prepared By", coaRecord.prepared_by || coaRecord.created_by || "Atlas Labs QA Documentation Officer"],
      ["Document Type", coaRecord.document_type || getBrandValue(brandSettings, "document_type", "Certificate of Analysis")],
      ["Revision", formattedRevision(coaRecord.revision)],
    ])}

    ${sectionTitle("Product Identification")}
    ${simpleRows([
      ["Product Name", coaRecord.product_name],
      ["Catalog Code", coaRecord.catalog_code],
      ["Peptide Sequence", coaRecord.peptide_sequence],
      ["Batch / Lot No.", coaRecord.batch_lot_no],
      ["Molecular Weight", coaRecord.molecular_weight],
      ["Molecular Formula", coaRecord.molecular_formula],
      ["Physical Form", coaRecord.physical_form],
      ["Appearance Spec", coaRecord.appearance],
      ["Grade / Scope", coaRecord.grade_scope || "Research compound / B2B supply documentation"],
      ["Pack Size", coaRecord.pack_size || "Bulk or private-label pack as ordered"],
      ["Storage", coaRecord.storage_condition],
      ["Retest Period", coaRecord.retest_period || coaRecord.retest_expiry_date],
    ])}

    ${sectionTitle("Batch Summary")}
    ${simpleRows([
      ["Manufacture Date", coaRecord.manufacture_date],
      ["Retest / Expiry", coaRecord.retest_expiry_date || coaRecord.retest_period],
      ["Batch Quantity", coaRecord.batch_quantity || "100 g"],
      ["Manufacturing Site", coaRecord.manufacturing_site || "Qualified partner production facility"],
      ["Country of Origin", coaRecord.country_of_origin],
      ["Release Site", coaRecord.release_site || "Atlas Labs QA Documentation"],
      ["Packaging", coaRecord.packaging || "Amber vial / sealed pouch / bulk container"],
      ["Label Option", coaRecord.label_option || "Neutral label or private label"],
      ["Shipping Conditions", coaRecord.shipping_conditions || "Ambient or cold-chain as applicable"],
      ["Document Pack", coaRecord.document_pack || "COA, HPLC, MS/LC-MS, SDS"],
    ])}

    ${sectionTitle("Release Snapshot")}
    ${simpleRows([
      ["Identity", coaRecord.identity_result || "Conforms to reference identity"],
      ["HPLC Purity", coaRecord.hplc_purity || coaRecord.purity],
      ["Water Content", coaRecord.water_content || "—"],
      ["Release Decision", coaRecord.release_decision],
    ])}

    ${sectionTitle("Intended Use & Documentation Scope")}
    <div class="coa-box">${htmlEscape(coaRecord.intended_use_scope || "This COA supports qualified B2B sourcing, documentation review, MOQ/bulk supply conversations, and private-label planning. No medical, therapeutic, diagnostic, veterinary, or human-use claims are made. Final release documentation must match the tested batch and analytical records referenced in this document.")}</div>
  `, coaRecord, brandSettings, true);

  const secondPage = coaPageShell(`
    <div class="coa-review-box">
      ${sectionTitle("Analytical Results & Quality Review")}
      <strong>Analytical Results & Quality Review</strong>
    </div>

    ${sectionTitle("Analytical Test Results")}
    <table class="coa-table analytical"><thead><tr><th>Test / Attribute</th><th>Method</th><th>Specification</th><th>Batch Result</th><th>Status</th></tr></thead><tbody>${resultRows}</tbody></table>

    ${sectionTitle("Analytical Records Referenced")}
    <table class="coa-table"><thead><tr><th>Record Type</th><th>Reference / File Name</th><th>Availability</th></tr></thead><tbody>${referencedRows}</tbody></table>

    ${sectionTitle("Certification Statement")}
    <div class="coa-box">${htmlEscape(getBrandValue(brandSettings, "certification_statement", "Atlas Labs confirms that the product identity, specifications and release status listed in this document apply only to the batch/lot number referenced above. Final certification requires completed batch-specific analytical records and authorized signature. This document does not provide dosage, treatment, medical, diagnostic, veterinary or human-use instructions."))}</div>

    ${sectionTitle("Authorization")}
    <div class="coa-auth-grid">
      ${simpleRows([
        ["Prepared By", coaRecord.prepared_by || coaRecord.created_by || "Atlas Labs QA Documentation Officer"],
        ["Prepared Date", coaRecord.prepared_date || coaRecord.created_at],
        ["Reviewed By", coaRecord.reviewed_by],
        ["Review Date", coaRecord.review_date],
        ["Approved By", coaRecord.approved_by],
        ["Approved Date", coaRecord.approved_at || coaRecord.approved_date],
        ["Authorized Signature", coaRecord.authorized_signature || getBrandValue(brandSettings, "authorized_signature_text", "Authorized QA release signature required")],
        ["Company Seal", getBrandValue(brandSettings, "seal_text", "See seal image")],
      ])}
      <div class="coa-verification-panel">
        ${getSealHtml(brandSettings)}
        <div class="coa-verification-title">Verification URL</div>
        <div class="coa-verification-url">${htmlEscape(verificationUrl)}</div>
        ${getQrHtml(coaRecord, brandSettings)}
      </div>
    </div>
  `, coaRecord, brandSettings, false);

  const watermark = String(coaRecord.release_decision || coaRecord.verification_status || "")
    .toLowerCase()
    .includes("released")
    ? ""
    : `<div class="coa-watermark">DRAFT — DOCUMENT NOT YET APPROVED</div>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${htmlEscape(coaRecord.coa_number || "Certificate of Analysis")}</title>
  <style>
    @page { size: Letter; margin: 0.25in; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #eaf0f7; color: #0a1a2f; font-family: Arial, Helvetica, sans-serif; line-height: 1.35; }
    .coa-toolbar { position: sticky; top: 0; z-index: 20; display: flex; justify-content: flex-end; gap: 8px; padding: 10px 16px; background: #0a1a2f; }
    .coa-toolbar button { border: 1px solid rgba(255,255,255,.35); background: white; color: #0a1a2f; border-radius: 8px; padding: 8px 12px; font-weight: 800; cursor: pointer; }
    .coa-page { width: 8.5in; min-height: 11in; margin: 0.16in auto; padding: 0.42in; background: #fff; position: relative; overflow: hidden; }
    .coa-page-break { page-break-after: always; }
    .coa-header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #0a1a2f; padding-bottom: 0.16in; margin-bottom: 0.16in; }
    .coa-brand-row { display:flex; gap: 0.12in; align-items:flex-start; }
    .coa-logo { width: 0.42in; max-height: 0.42in; object-fit: contain; }
    .coa-logo-fallback { width: 0.42in; height:0.42in; display:flex; align-items:center; justify-content:center; color:#62708a; font-size:8px; border:1px solid #d8e1ef; }
    .coa-brand-name { font-weight: 900; font-size: 15px; }
    .coa-quality-unit { margin-top: 4px; color:#2e6bff; text-transform:uppercase; letter-spacing:.24em; font-size:9px; font-weight:900; }
    .coa-tagline { margin-top: 3px; color:#56657c; font-size:8.5px; }
    .coa-control-box { width: 2.05in; border: 1px solid #c9d6e8; padding: 0.12in; font-size:8.5px; }
    .coa-control-title { color:#2e6bff; text-transform:uppercase; letter-spacing:.16em; font-weight:900; margin-bottom: 0.08in; }
    .coa-control-row { display:flex; justify-content:space-between; gap:8px; margin: 3px 0; }
    .coa-control-row span { color:#5d6c83; }
    .coa-title-row { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin: 0.12in 0 0.16in; }
    h1 { font-size: 19px; margin: 0; text-transform:uppercase; letter-spacing:.02em; }
    .coa-title-row p { margin: 6px 0 0; font-size: 9px; color:#56657c; }
    .coa-status-box { border: 1px solid #80dfc3; min-width: 1.6in; padding: 0.12in; text-align:center; text-transform:uppercase; color:#06815e; font-weight:900; }
    .coa-status-box span { display:block; color:#268e72; font-size:8px; letter-spacing:.16em; margin-bottom:5px; }
    .coa-note, .coa-box { border: 1px solid #d8e1ef; background:#fbfdff; padding: 0.1in; font-size:9px; margin: 0.08in 0; }
    .coa-section-title { margin: 0.16in 0 0.07in; color:#2e6bff; text-transform:uppercase; letter-spacing:.18em; font-size:10px; font-weight:900; border:0; padding:0; }
    .coa-table { width:100%; border-collapse:collapse; font-size:8.8px; margin: 0 0 0.1in; }
    .coa-table th, .coa-table td { border:1px solid #cfd9e8; padding: 5px 7px; vertical-align:top; text-align:left; }
    .coa-table th { width: 28%; color:#0a1a2f; background:#fbfdff; font-weight:900; }
    .coa-table.analytical th { width:auto; background:#0a1a2f; color:#fff; }
    .coa-table.analytical td { font-size:8px; }
    .coa-review-box { border:1px solid #d8e1ef; padding:0.1in; margin:0.12in 0; }
    .coa-auth-grid { display:grid; grid-template-columns: 1.35fr .95fr; gap:0.14in; align-items:stretch; }
    .coa-verification-panel { border:1px solid #cfd9e8; padding:0.12in; min-height: 2.2in; }
    .coa-seal { width:1.05in; height:1.05in; object-fit:contain; display:block; margin: 0 auto 0.1in; }
    .coa-seal-fallback { width:1.05in; height:1.05in; border:1px solid #cfd9e8; border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center; font-size:8px; margin:0 auto 0.1in; color:#5d6c83; }
    .coa-verification-title { color:#2e6bff; text-transform:uppercase; letter-spacing:.14em; font-weight:900; font-size:9px; margin-top:0.08in; }
    .coa-verification-url { font-size:8px; word-break:break-all; margin:0.05in 0; }
    .coa-qr { width:1.25in; height:1.25in; object-fit:contain; display:block; margin:0.08in auto 0; }
    .coa-qr-fallback { width:1.25in; height:1.25in; margin:0.08in auto 0; border:1px solid #cfd9e8; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; }
    .coa-footer { position:absolute; left:0.42in; right:0.42in; bottom:0.26in; border-top:1px solid #d8e1ef; padding-top:0.08in; color:#56657c; font-size:8px; }
    .coa-watermark { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-35deg); font-size:48px; font-weight:900; color:#0a1a2f; opacity:.08; z-index:0; pointer-events:none; }
    @media print {
      body { background:white; }
      .coa-toolbar { display:none; }
      .coa-page { margin:0; box-shadow:none; }
    }
  </style>
</head>
<body>
  <div class="coa-toolbar"><button onclick="window.print()">Print / Save as PDF</button><button onclick="window.close()">Close</button></div>
  ${watermark}
  ${firstPage}
  ${secondPage}
</body>
</html>`;
}

function coaHtml(coa: DbRecord, batch: DbRecord | null, brandSettings: CoaBrandSettings) {
  const body = `
    <h2>Document Information</h2>
    <div class="grid">
      ${kv("COA Number", coa.coa_number)}
      ${kv("Issue Date", coa.issue_date)}
      ${kv("Revision", coa.revision)}
      ${kv("Document Status", coa.document_status)}
      ${kv("Release Decision", coa.release_decision)}
      ${kv("Verification Code", coa.verification_code)}
    </div>
    <h2>Product and Batch</h2>
    <div class="grid">
      ${kv("Product ID", coa.product_id)}
      ${kv("Batch Number", batch?.batch_number)}
      ${kv("Lot Number", batch?.lot_number)}
      ${kv("Manufacturing Date", batch?.manufacturing_date)}
      ${kv("Expiry / Retest Date", batch?.expiry_date)}
      ${kv("Country of Origin", batch?.country_of_origin)}
    </div>
    <h2>Supporting Documentation</h2>
    <div class="grid">
      ${kv("HPLC Report ID", coa.hplc_report_id)}
      ${kv("MS / LC-MS Report ID", coa.ms_report_id)}
      ${kv("SDS ID", coa.sds_id)}
      ${kv("Client / Recipient", coa.client_recipient)}
    </div>
    <h2>Notes</h2>
    <div class="box">${htmlEscape(coa.notes)}</div>
    ${signatures([
      { label: "Prepared By", name: coa.prepared_by },
      { label: "Reviewed By", name: coa.reviewed_by },
      { label: "Approved By", name: coa.approved_by },
    ])}`;

  return baseHtml({
    title: "Certificate of Analysis",
    subtitle: text(coa.coa_number),
    brandSettings,
    watermarkMode: text(coa.watermark_mode, "none"),
    body,
  });
}

function hplcHtml(hplc: DbRecord, batch: DbRecord | null, brandSettings: CoaBrandSettings) {
  const purity = Number(hplc.purity_percent ?? 0).toFixed(2);
  const body = `
    <h2>Product and Batch Information</h2>
    <div class="grid">
      ${kv("Product ID", hplc.product_id)}
      ${kv("Batch Number", batch?.batch_number || hplc.batch_id)}
      ${kv("Document Number", hplc.document_number)}
      ${kv("Issue Date", hplc.issue_date)}
      ${kv("Revision", hplc.revision)}
      ${kv("Status", hplc.status)}
    </div>
    <h2>Method Summary</h2>
    <div class="grid">
      ${kv("Method", hplc.method_name)}
      ${kv("Method Code", hplc.method_code)}
      ${kv("Instrument", hplc.instrument_name)}
      ${kv("Column", hplc.column_type)}
      ${kv("Mobile Phase", hplc.mobile_phase)}
      ${kv("Flow Rate", `${text(hplc.flow_rate)} mL/min`)}
      ${kv("Detection Wavelength", `${text(hplc.detection_wavelength)} nm`)}
      ${kv("Injection Volume", `${text(hplc.injection_volume)} µL`)}
      ${kv("Run Time", `${text(hplc.run_time)} min`)}
      ${kv("Retention Time", hplc.retention_time)}
    </div>
    <h2>Results</h2>
    <div class="result"><span class="label">Purity Result</span><strong>${htmlEscape(purity)}%</strong><br/><span>${htmlEscape(hplc.acceptance_criteria)}</span></div>
    <div class="grid">
      ${kv("Main Peak Area", hplc.main_peak_area)}
      ${kv("Total Peak Area", hplc.total_peak_area)}
      ${kv("Decision", hplc.pass_fail_decision)}
    </div>
    <h3>Result Summary</h3><div class="box">${htmlEscape(hplc.result_summary)}</div>
    ${signatures([
      { label: "Analyst", name: hplc.analyst_name },
      { label: "Reviewer", name: hplc.reviewer_name },
    ])}`;

  return baseHtml({
    title: "HPLC Purity Report",
    subtitle: text(hplc.document_number),
    brandSettings,
    watermarkMode: text(hplc.watermark_mode, "draft"),
    body,
  });
}

function msHtml(ms: DbRecord, batch: DbRecord | null, brandSettings: CoaBrandSettings) {
  const body = `
    <h2>Product and Batch Information</h2>
    <div class="grid">
      ${kv("Product ID", ms.product_id)}
      ${kv("Batch Number", batch?.batch_number || ms.batch_id)}
      ${kv("Document Number", ms.document_number)}
      ${kv("Issue Date", ms.issue_date)}
      ${kv("Revision", ms.revision)}
      ${kv("Status", ms.status)}
    </div>
    <h2>Method Summary</h2>
    <div class="grid">
      ${kv("Method", ms.method_name)}
      ${kv("Method Code", ms.method_code)}
      ${kv("Instrument", ms.instrument_name)}
      ${kv("Ionization Mode", ms.ionization_mode)}
      ${kv("Charge State", ms.charge_state)}
    </div>
    <h2>Identity Results</h2>
    <div class="grid">
      ${kv("Expected Molecular Weight", ms.expected_molecular_weight)}
      ${kv("Observed Mass", ms.observed_mass)}
      ${kv("Mass Error", ms.mass_error)}
      ${kv("Mass Error PPM", ms.mass_error_ppm)}
      ${kv("Decision", ms.pass_fail_decision)}
      ${kv("Acceptance Criteria", ms.acceptance_criteria)}
    </div>
    <h3>Identity Conclusion</h3><div class="box">${htmlEscape(ms.identity_conclusion)}</div>
    ${signatures([
      { label: "Analyst", name: ms.analyst_name },
      { label: "Reviewer", name: ms.reviewer_name },
    ])}`;

  return baseHtml({
    title: "MS / LC-MS Identity Report",
    subtitle: text(ms.document_number),
    brandSettings,
    watermarkMode: text(ms.watermark_mode, "draft"),
    body,
  });
}

function sdsHtml(sds: DbRecord, brandSettings: CoaBrandSettings) {
  const sections = [
    ["1. Identification", sds.section_1_identification],
    ["2. Hazard(s) Identification", sds.section_2_hazard_identification],
    ["3. Composition / Information on Ingredients", sds.section_3_composition],
    ["4. First-Aid Measures", sds.section_4_first_aid],
    ["5. Fire-Fighting Measures", sds.section_5_fire_fighting],
    ["6. Accidental Release Measures", sds.section_6_accidental_release],
    ["7. Handling and Storage", sds.section_7_handling_storage],
    ["8. Exposure Controls / Personal Protection", sds.section_8_exposure_controls],
    ["9. Physical and Chemical Properties", sds.section_9_physical_chemical],
    ["10. Stability and Reactivity", sds.section_10_stability_reactivity],
    ["11. Toxicological Information", sds.section_11_toxicological],
    ["12. Ecological Information", sds.section_12_ecological],
    ["13. Disposal Considerations", sds.section_13_disposal],
    ["14. Transport Information", sds.section_14_transport],
    ["15. Regulatory Information", sds.section_15_regulatory],
    ["16. Other Information", sds.section_16_other],
  ];

  const body = `
    <h2>Document Information</h2>
    <div class="grid">
      ${kv("Product ID", sds.product_id)}
      ${kv("Document Number", sds.document_number)}
      ${kv("Revision", sds.revision)}
      ${kv("Issue Date", sds.issue_date)}
      ${kv("Revision Date", sds.revision_date)}
      ${kv("Status", sds.status)}
      ${kv("Language", sds.language)}
      ${kv("Jurisdiction", sds.jurisdiction)}
      ${kv("Signal Word", sds.signal_word)}
    </div>
    ${sections.map(([title, value]) => `<h2>${htmlEscape(title)}</h2><div class="box">${htmlEscape(value)}</div>`).join("")}
    ${signatures([
      { label: "Prepared By", name: sds.prepared_by },
      { label: "Reviewed By", name: sds.reviewed_by },
      { label: "Approved By", name: sds.approved_by },
    ])}`;

  return baseHtml({
    title: "Safety Data Sheet / SDS",
    subtitle: text(sds.document_number),
    brandSettings,
    watermarkMode: sds.status === "active" ? "none" : "draft",
    body,
  });
}


async function bundleZip(supabase: SupabaseClient, bundle: BundleRecord, brandSettings: CoaBrandSettings) {
  const [batch, hplc, ms, sds, linkedCoaRecord] = await Promise.all([
    maybeById<DbRecord>(supabase, "batches", bundle.batch_id),
    maybeById<DbRecord>(supabase, "hplc_reports", bundle.hplc_report_id),
    maybeById<DbRecord>(supabase, "ms_reports", bundle.ms_report_id),
    maybeById<DbRecord>(supabase, "sds_documents", bundle.sds_id),
    getLinkedCoaRecordForBundle(supabase, bundle),
  ]);

  const missingDocuments = [
    linkedCoaRecord ? "" : "Linked COA record",
    hplc ? "" : "HPLC report",
    ms ? "" : "MS / LC-MS report",
    sds ? "" : "SDS document",
  ].filter(Boolean);

  if (missingDocuments.length > 0) {
    throw new Error(`The full pack cannot be prepared because these documents are missing: ${missingDocuments.join(", ")}.`);
  }

  const { results, records } = await getCoaAnalyticalRows(supabase, linkedCoaRecord?.id);
  const linkedCoaDocument = linkedCoaHtml({
    coaRecord: linkedCoaRecord as DbRecord,
    analyticalResults: results,
    analyticalRecords: records,
    brandSettings,
  });

  const [coaPdf, hplcPdf, msPdf, sdsPdf] = await Promise.all([
    renderHtmlToPdfBuffer(linkedCoaDocument),
    renderHtmlToPdfBuffer(hplcHtml(hplc as DbRecord, batch, brandSettings)),
    renderHtmlToPdfBuffer(msHtml(ms as DbRecord, batch, brandSettings)),
    renderHtmlToPdfBuffer(sdsHtml(sds as DbRecord, brandSettings)),
  ]);

  return createZipBuffer([
    {
      name: `01-Linked-COA-${fileSafe(linkedCoaRecord?.coa_number || linkedCoaRecord?.id)}.pdf`,
      content: coaPdf,
    },
    {
      name: `02-HPLC-${fileSafe(hplc?.document_number || hplc?.id)}.pdf`,
      content: hplcPdf,
    },
    {
      name: `03-MS-LCMS-${fileSafe(ms?.document_number || ms?.id)}.pdf`,
      content: msPdf,
    },
    {
      name: `04-SDS-${fileSafe(sds?.document_number || sds?.id)}.pdf`,
      content: sdsPdf,
    },
  ]);
}

async function bundleHtml(supabase: SupabaseClient, bundle: BundleRecord, brandSettings: CoaBrandSettings) {
  const [coa, batch, hplc, ms, sds] = await Promise.all([
    maybeById<DbRecord>(supabase, "coa_documents", bundle.coa_id),
    maybeById<DbRecord>(supabase, "batches", bundle.batch_id),
    maybeById<DbRecord>(supabase, "hplc_reports", bundle.hplc_report_id),
    maybeById<DbRecord>(supabase, "ms_reports", bundle.ms_report_id),
    maybeById<DbRecord>(supabase, "sds_documents", bundle.sds_id),
  ]);

  const summary = `
    <h2>Bundle Summary</h2>
    <div class="grid">
      ${kv("Bundle Number", bundle.bundle_number)}
      ${kv("Status", bundle.status)}
      ${kv("Product ID", bundle.product_id)}
      ${kv("Batch Number", batch?.batch_number || bundle.batch_id)}
      ${kv("COA", coa?.coa_number || bundle.coa_id)}
      ${kv("HPLC", hplc?.document_number || bundle.hplc_report_id)}
      ${kv("MS / LC-MS", ms?.document_number || bundle.ms_report_id)}
      ${kv("SDS", sds?.document_number || bundle.sds_id)}
    </div>
  `;

  const documents = [
    summary,
    coa ? coaHtml(coa, batch, brandSettings).match(/<main class="page">([\s\S]*)<\/main>/)?.[1] : "",
    hplc ? hplcHtml(hplc, batch, brandSettings).match(/<main class="page">([\s\S]*)<\/main>/)?.[1] : "",
    ms ? msHtml(ms, batch, brandSettings).match(/<main class="page">([\s\S]*)<\/main>/)?.[1] : "",
    sds ? sdsHtml(sds, brandSettings).match(/<main class="page">([\s\S]*)<\/main>/)?.[1] : "",
  ].filter(Boolean);

  const body = documents
    .map((doc, index) => `<section class="${index === 0 ? "" : "page-break"}">${doc}</section>`)
    .join("\n");

  return baseHtml({
    title: "Quality Documentation Bundle",
    subtitle: text(bundle.bundle_number),
    brandSettings,
    watermarkMode: bundle.status === "released" ? "none" : "draft",
    body,
  });
}

async function createResponse({
  supabase,
  documentType,
  documentId,
  brandSettings,
  format,
}: {
  supabase: SupabaseClient;
  documentType: DocumentType;
  documentId: string;
  brandSettings: CoaBrandSettings;
  format?: "html" | "pdf" | "zip";
}) {
  let html = "";
  let filename = "quality-document.html";

  if (documentType === "bundle") {
    const bundle = await getById<BundleRecord>(supabase, "document_bundles", documentId);

    if (format === "zip") {
      const zipBuffer = await bundleZip(supabase, bundle, brandSettings);
      filename = `Atlas-Documentation-Bundle-${fileSafe(bundle.bundle_number || bundle.id)}.zip`;

      return new Response(zipBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "X-Document-Filename": filename,
        },
      });
    }

    html = await bundleHtml(supabase, bundle, brandSettings);
    filename = `Atlas-Documentation-Bundle-${fileSafe(bundle.bundle_number || bundle.id)}.html`;
  } else if (documentType === "coa") {
    const coaDocument = await maybeById<DbRecord>(supabase, "coa_documents", documentId);
    const linkedCoaRecord = await getLinkedCoaRecordForCoaDocument(
      supabase,
      documentId,
      coaDocument
    );

    if (linkedCoaRecord) {
      const { results, records } = await getCoaAnalyticalRows(supabase, linkedCoaRecord.id);
      html = linkedCoaHtml({
        coaRecord: linkedCoaRecord,
        analyticalResults: results,
        analyticalRecords: records,
        brandSettings,
      });
      filename = `COA-${fileSafe(linkedCoaRecord.coa_number || linkedCoaRecord.id)}.html`;
    } else if (coaDocument) {
      const batch = await maybeById<DbRecord>(supabase, "batches", text(coaDocument.batch_id, ""));
      html = coaHtml(coaDocument, batch, brandSettings);
      filename = `COA-${fileSafe(coaDocument.coa_number || coaDocument.id)}.html`;
    } else {
      throw new Error("Linked COA record was not found.");
    }
  } else if (documentType === "hplc") {
    const hplc = await getById<DbRecord>(supabase, "hplc_reports", documentId);
    const batch = await maybeById<DbRecord>(supabase, "batches", text(hplc.batch_id, ""));
    html = hplcHtml(hplc, batch, brandSettings);
    filename = `HPLC-${fileSafe(hplc.document_number || hplc.id)}.html`;
  } else if (documentType === "ms") {
    const ms = await getById<DbRecord>(supabase, "ms_reports", documentId);
    const batch = await maybeById<DbRecord>(supabase, "batches", text(ms.batch_id, ""));
    html = msHtml(ms, batch, brandSettings);
    filename = `MS-LCMS-${fileSafe(ms.document_number || ms.id)}.html`;
  } else if (documentType === "sds") {
    const sds = await getById<DbRecord>(supabase, "sds_documents", documentId);
    html = sdsHtml(sds, brandSettings);
    filename = `SDS-${fileSafe(sds.document_number || sds.id)}.html`;
  }

  const pdfFilename = filename.replace(/\.html$/i, ".pdf");
  const pdfBuffer = await renderHtmlToPdfBuffer(html);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFilename}"`,
      "X-Document-Filename": pdfFilename,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Admin session is required to download quality documents." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as DownloadRequest;
    const { documentType, documentId, format } = body;

    if (!documentType || !["coa", "hplc", "ms", "sds", "bundle"].includes(documentType)) {
      return NextResponse.json({ error: "Unsupported or missing document type." }, { status: 400 });
    }

    if (!documentId) {
      return NextResponse.json({ error: "documentId is required." }, { status: 400 });
    }

    const supabase = createAuthenticatedSupabaseClient(accessToken);
    const brandSettings = await getActiveCoaBrandSettings(supabase);

    return await createResponse({ supabase, documentType, documentId, brandSettings, format });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Document download error:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
