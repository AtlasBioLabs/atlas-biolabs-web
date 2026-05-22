/**
 * PDF Template Generators for Quality Documents
 * Creates PDF-friendly HTML templates for COA, HPLC, MS, and SDS documents
 */

import type {
  CoaDocument,
  HplcReport,
} from "@/lib/quality-types";
import type { CoaBrandSettings } from "@/lib/coa-brand-settings";

interface PdfGenerationOptions {
  brandSettings: CoaBrandSettings;
  watermarkMode?: "none" | "draft" | "sample";
  includeQrCode?: boolean;
  includeCharts?: boolean;
}

/**
 * Generates HTML for COA PDF
 */
export function generateCoaPdfHtml(
  coa: CoaDocument,
  productName: string,
  batchInfo: { batchNumber: string; manufacturingDate: string; expiryDate: string },
  options: PdfGenerationOptions
): string {
  const watermarkText =
    options.watermarkMode === "sample"
      ? "SAMPLE / DEMO — NOT FOR RELEASE OR CUSTOMER USE"
      : "DRAFT — DOCUMENT NOT YET APPROVED";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate of Analysis - ${coa.coaNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .page {
          width: 8.5in;
          height: 11in;
          margin: 0.5in;
          padding: 0.5in;
          background: white;
          position: relative;
        }
        
        ${
          options.watermarkMode !== "none"
            ? `
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            opacity: 0.08;
            font-size: 72px;
            font-weight: bold;
            color: #999;
            width: 150%;
            text-align: center;
            z-index: 0;
            pointer-events: none;
          }
          
          .content {
            position: relative;
            z-index: 1;
          }
        `
            : ""
        }
        
        .header {
          border-bottom: 3px solid #003366;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .company-info {
          flex: 1;
        }
        
        .company-info h1 {
          font-size: 24px;
          color: #003366;
          margin-bottom: 4px;
        }
        
        .company-info .document-type {
          font-size: 14px;
          color: #666;
          font-weight: 600;
        }
        
        .document-number {
          text-align: right;
          font-size: 12px;
        }
        
        .document-number .label {
          color: #666;
          font-size: 10px;
          margin-bottom: 2px;
        }
        
        .document-number .value {
          font-size: 14px;
          font-weight: 600;
          font-family: monospace;
          color: #003366;
        }
        
        .section {
          margin-bottom: 16px;
        }
        
        .section-title {
          font-size: 12px;
          font-weight: 700;
          color: #003366;
          text-transform: uppercase;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #ddd;
        }
        
        .section-content {
          font-size: 11px;
          line-height: 1.5;
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .grid-item {
          font-size: 11px;
        }
        
        .grid-item .label {
          color: #666;
          font-size: 10px;
          margin-bottom: 2px;
        }
        
        .grid-item .value {
          font-weight: 600;
          color: #333;
        }
        
        .results-box {
          border: 2px solid #4CAF50;
          background-color: #f0f8f5;
          padding: 8px;
          margin: 8px 0;
          border-radius: 4px;
        }
        
        .results-box.failed {
          border-color: #f44336;
          background-color: #fff3f1;
        }
        
        .results-box.conditional {
          border-color: #ff9800;
          background-color: #fff8f0;
        }
        
        .footer {
          margin-top: 24px;
          padding-top: 12px;
          border-top: 1px solid #ddd;
          font-size: 9px;
          color: #666;
          line-height: 1.4;
        }
        
        .footer-section {
          display: inline-block;
          margin-right: 24px;
          margin-bottom: 8px;
        }
        
        .footer-label {
          font-weight: 600;
          color: #333;
        }
        
        .approval-signatures {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        
        .signature-block {
          text-align: center;
          font-size: 10px;
        }
        
        .signature-line {
          height: 40px;
          border-bottom: 1px solid #333;
          margin-bottom: 4px;
        }
        
        .signature-name {
          font-weight: 600;
          margin-top: 4px;
        }
        
        .signature-title {
          font-size: 9px;
          color: #666;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin: 8px 0;
        }
        
        table th {
          background-color: #f0f0f0;
          color: #333;
          padding: 6px;
          text-align: left;
          font-weight: 600;
          border: 1px solid #ddd;
        }
        
        table td {
          padding: 6px;
          border: 1px solid #ddd;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .page {
            margin: 0;
            padding: 0.5in;
            width: 8.5in;
            height: 11in;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        ${
          options.watermarkMode !== "none"
            ? `<div class="watermark">${watermarkText}</div>`
            : ""
        }
        
        <div class="content">
          <!-- Header -->
          <div class="header">
            <div class="company-info">
              <h1>${options.brandSettings.company_name}</h1>
              <div class="document-type">Certificate of Analysis</div>
            </div>
            <div class="document-number">
              <div class="label">COA Number</div>
              <div class="value">${coa.coaNumber}</div>
            </div>
          </div>
          
          <!-- Document Information -->
          <div class="section">
            <div class="section-title">Document Information</div>
            <div class="grid-2">
              <div class="grid-item">
                <div class="label">Issue Date</div>
                <div class="value">${coa.issueDate}</div>
              </div>
              <div class="grid-item">
                <div class="label">Revision</div>
                <div class="value">${coa.revision}</div>
              </div>
            </div>
          </div>
          
          <!-- Product Information -->
          <div class="section">
            <div class="section-title">Product Information</div>
            <div class="grid-2">
              <div class="grid-item">
                <div class="label">Product Name</div>
                <div class="value">${productName}</div>
              </div>
              <div class="grid-item">
                <div class="label">Client Recipient</div>
                <div class="value">${coa.clientRecipient || "—"}</div>
              </div>
            </div>
          </div>
          
          <!-- Batch Information -->
          <div class="section">
            <div class="section-title">Batch Information</div>
            <div class="grid-2">
              <div class="grid-item">
                <div class="label">Batch Number</div>
                <div class="value">${batchInfo.batchNumber}</div>
              </div>
              <div class="grid-item">
                <div class="label">Manufacturing Date</div>
                <div class="value">${batchInfo.manufacturingDate}</div>
              </div>
              <div class="grid-item">
                <div class="label">Expiry Date</div>
                <div class="value">${batchInfo.expiryDate}</div>
              </div>
            </div>
          </div>
          
          <!-- Release Decision -->
          <div class="section">
            <div class="section-title">Release Decision</div>
            <div class="grid-item">
              <div class="label">Status</div>
              <div class="value">${coa.releaseDecision.toUpperCase()}</div>
            </div>
          </div>
          
          <!-- Supporting Documents -->
          <div class="section">
            <div class="section-title">Supporting Documentation</div>
            <div class="section-content">
              <div style="margin-bottom: 6px;">
                ${coa.hplcReportId ? "✓" : "—"} HPLC Purity Report
              </div>
              <div style="margin-bottom: 6px;">
                ${coa.msReportId ? "✓" : "—"} MS/LC-MS Identity Report
              </div>
              <div>
                ${coa.sdsId ? "✓" : "—"} Safety Data Sheet
              </div>
            </div>
          </div>
          
          <!-- Verification -->
          ${
            coa.verificationCode
              ? `
            <div class="section">
              <div class="section-title">Verification</div>
              <div class="grid-item">
                <div class="label">Verification Code</div>
                <div class="value" style="font-family: monospace;">${coa.verificationCode}</div>
              </div>
              ${
                coa.verificationUrl
                  ? `
                <div class="grid-item" style="margin-top: 6px;">
                  <div class="label">Verification URL</div>
                  <div class="value" style="word-break: break-all; font-size: 10px;">${coa.verificationUrl}</div>
                </div>
              `
                  : ""
              }
            </div>
          `
              : ""
          }
          
          <!-- Approvals -->
          <div class="approval-signatures">
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">${coa.preparedBy}</div>
              <div class="signature-title">Prepared By</div>
            </div>
            
            ${
              coa.reviewedBy
                ? `
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">${coa.reviewedBy}</div>
              <div class="signature-title">Reviewed By</div>
            </div>
            `
                : `<div></div>`
            }
            
            ${
              coa.approvedBy
                ? `
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">${coa.approvedBy}</div>
              <div class="signature-title">Approved By</div>
            </div>
            `
                : `<div></div>`
            }
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-section">
              <span class="footer-label">Company:</span> ${options.brandSettings.company_name}
            </div>
            <div class="footer-section">
              <span class="footer-label">Phone:</span> ${options.brandSettings.phone}
            </div>
            <div class="footer-section">
              <span class="footer-label">Email:</span> ${options.brandSettings.email}
            </div>
            <div style="width: 100%; margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd;">
              <p style="font-size: 9px; color: #666;">
                ${options.brandSettings.footer_text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates HTML for HPLC Report PDF
 */
export function generateHplcPdfHtml(
  hplc: HplcReport,
  productName: string,
  options: PdfGenerationOptions
): string {
  const watermarkText =
    options.watermarkMode === "sample"
      ? "SAMPLE / DEMO — NOT FOR RELEASE OR CUSTOMER USE"
      : "DRAFT — DOCUMENT NOT YET APPROVED";

  const resultColor =
    hplc.pass_fail_decision === "pass"
      ? "#4CAF50"
      : hplc.pass_fail_decision === "fail"
        ? "#f44336"
        : "#ff9800";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HPLC Purity Report - ${hplc.document_number}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0.5in;
        }
        
        .page {
          max-width: 8.5in;
          margin: 0 auto;
          background: white;
          position: relative;
        }
        
        ${
          options.watermarkMode !== "none"
            ? `
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            opacity: 0.08;
            font-size: 72px;
            font-weight: bold;
            color: #999;
            width: 150%;
            text-align: center;
            z-index: 0;
            pointer-events: none;
          }
        `
            : ""
        }
        
        .content {
          position: relative;
          z-index: 1;
        }
        
        h1 { font-size: 20px; color: #003366; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #003366; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
        h3 { font-size: 12px; color: #333; margin-top: 12px; margin-bottom: 6px; }
        
        .header-section {
          border-bottom: 3px solid #003366;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 11px;
          margin-bottom: 12px;
        }
        
        .info-item {
          padding: 6px;
          background-color: #f9f9f9;
          border-left: 3px solid #003366;
        }
        
        .info-label {
          font-size: 10px;
          color: #666;
          margin-bottom: 2px;
        }
        
        .info-value {
          font-weight: 600;
          color: #333;
        }
        
        .result-box {
          border: 2px solid ${resultColor};
          background-color: ${resultColor}15;
          padding: 12px;
          margin: 12px 0;
          border-radius: 4px;
        }
        
        .result-value {
          font-size: 16px;
          font-weight: 700;
          color: ${resultColor};
          margin-top: 8px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin: 10px 0;
        }
        
        table th {
          background-color: #f0f0f0;
          padding: 6px;
          text-align: left;
          border: 1px solid #ddd;
          font-weight: 600;
        }
        
        table td {
          padding: 6px;
          border: 1px solid #ddd;
        }
        
        .signature-block {
          margin-top: 20px;
          text-align: center;
          font-size: 10px;
        }
        
        .signature-line {
          height: 40px;
          border-bottom: 1px solid #333;
          margin-bottom: 4px;
        }
        
        .footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #ddd;
          font-size: 8px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="page">
        ${
          options.watermarkMode !== "none"
            ? `<div class="watermark">${watermarkText}</div>`
            : ""
        }
        
        <div class="content">
          <div class="header-section">
            <h1>${options.brandSettings.company_name}</h1>
            <h2 style="margin-top: 0;">HPLC Purity Analysis Report</h2>
            <div style="text-align: right; font-size: 11px;">
              <strong>Document #:</strong> ${hplc.document_number}
            </div>
          </div>
          
          <h2>Product & Batch Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Product</div>
              <div class="info-value">${productName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Batch ID</div>
              <div class="info-value">${String(hplc.batch_id).slice(0, 8)}...</div>
            </div>
            <div class="info-item">
              <div class="info-label">Issue Date</div>
              <div class="info-value">${hplc.issue_date}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Revision</div>
              <div class="info-value">${hplc.revision}</div>
            </div>
          </div>
          
          <h2>Method Summary</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Method Name</div>
              <div class="info-value">${hplc.method_name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Instrument</div>
              <div class="info-value">${hplc.instrument_name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Column Type</div>
              <div class="info-value">${hplc.column_type}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Detection Wavelength</div>
              <div class="info-value">${hplc.detection_wavelength} nm</div>
            </div>
            <div class="info-item">
              <div class="info-label">Mobile Phase</div>
              <div class="info-value">${hplc.mobile_phase}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Flow Rate</div>
              <div class="info-value">${hplc.flow_rate} mL/min</div>
            </div>
          </div>
          
          <h2>Results</h2>
          <div class="result-box">
            <div style="font-size: 12px; color: #333;">Purity Result</div>
            <div class="result-value">${hplc.purity_percent.toFixed(2)}%</div>
            <div style="font-size: 10px; color: #666; margin-top: 6px;">
              Acceptance Criteria: ${hplc.acceptance_criteria}
            </div>
          </div>
          
          <h3>Result Summary</h3>
          <p style="font-size: 11px; line-height: 1.5; background-color: #f9f9f9; padding: 8px; border-radius: 4px;">
            ${hplc.result_summary}
          </p>
          
          <h3>Analyst Information</h3>
          <p style="font-size: 10px;">
            <strong>Analyst:</strong> ${hplc.analyst_name}<br/>
            ${hplc.reviewer_name ? `<strong>Reviewer:</strong> ${hplc.reviewer_name}` : ""}
          </p>
          
          <div class="signature-block">
            <div class="signature-line"></div>
            <div><strong>${hplc.analyst_name}</strong></div>
            <div style="color: #666;">Analyst</div>
          </div>
          
          <div class="footer">
            <p>${options.brandSettings.footer_text}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
