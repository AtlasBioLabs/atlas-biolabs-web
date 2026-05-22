# Quality Documentation System Implementation Guide

## Overview

The Atlas BioLabs Quality Documentation System is a comprehensive solution for managing Certificates of Analysis (COA) and supporting analytical documents. The system automatically generates and links HPLC purity reports, MS/LC-MS identity confirmation documents, Safety Data Sheets (SDS), and creates organized document bundles for complete traceability.

## Key Features

### 1. **Automatic Document Generation**
- When a COA is created for a batch, the system automatically:
  - Creates a draft HPLC Purity Report
  - Creates a draft MS/LC-MS Identity Report  
  - Creates or links to an active SDS document
  - Links all documents in a Document Bundle

### 2. **Release Rules & Validation**
- COAs cannot be released until:
  - Batch status is "released" or "approved"
  - HPLC report is "approved" or "released"
  - MS report is "approved" or "released"
  - SDS is "active"
  - Release decision is set to "released"
  - An approver signature is provided
  - Issue date exists
  - Verification code exists

### 3. **Watermark & Sample Marking**
- Demo/sample documents are marked with: **"SAMPLE / DEMO — NOT FOR RELEASE OR CUSTOMER USE"**
- Draft documents show: **"DRAFT — DOCUMENT NOT YET APPROVED"**
- All documents share consistent brand settings (logo, colors, footer, compliance text)

### 4. **Unified Brand Settings**
- All documents (COA, HPLC, MS, SDS) use the same branding from `lib/coa-brand-settings.ts`:
  - Company logo
  - Brand colors (Navy, Blue)
  - Company name and contact info
  - Office addresses (US & China)
  - Footer compliance text
  - Signature blocks
  - QR code styling

## Database Schema

### Batch / Lot Table
```sql
CREATE TABLE batches (
  id uuid PRIMARY KEY,
  product_id text NOT NULL,
  batch_number text NOT NULL,
  lot_number text,
  manufacturing_date text NOT NULL,
  expiry_date text NOT NULL,
  retest_date text,
  country_of_origin text NOT NULL,
  supplier_name text,
  manufacturer_name text,
  status text (draft|under_review|released|rejected|void),
  release_decision text (pending|released|rejected|conditional),
  created_by text, reviewed_by text, approved_by text,
  notes text,
  created_at, updated_at
);
```

### COA Document Table
```sql
CREATE TABLE coa_documents (
  id uuid PRIMARY KEY,
  product_id text NOT NULL,
  batch_id uuid NOT NULL,
  coa_number text NOT NULL UNIQUE,
  issue_date text,
  revision integer,
  document_status text (draft|under_review|correction_required|approved|released|superseded|void),
  client_recipient text,
  prepared_by text, reviewed_by text, approved_by text,
  release_decision text (pending|released|rejected|conditional),
  verification_code text NOT NULL UNIQUE,
  verification_url text,
  qr_code_value text,
  hplc_report_id uuid (FOREIGN KEY),
  ms_report_id uuid (FOREIGN KEY),
  sds_id uuid (FOREIGN KEY),
  watermark_mode text (none|draft|sample),
  notes text,
  created_at, updated_at
);
```

### HPLC Report Table
```sql
CREATE TABLE hplc_reports (
  id uuid PRIMARY KEY,
  product_id text, batch_id uuid, coa_id uuid,
  document_number text NOT NULL UNIQUE,
  issue_date text, revision integer,
  status text (draft|under_review|correction_required|approved|released|superseded|void),
  method_name text, method_code text, instrument_name text,
  column_type text, mobile_phase text,
  flow_rate numeric, detection_wavelength numeric,
  injection_volume numeric, run_time numeric,
  sample_concentration text, retention_time numeric,
  purity_percent numeric, main_peak_area numeric, total_peak_area numeric,
  impurities_json jsonb, peak_table_json jsonb,
  chromatogram_file_url text, raw_data_file_url text,
  analyst_name text, reviewer_name text,
  result_summary text, pass_fail_decision text (pass|fail|conditional),
  acceptance_criteria text,
  watermark_mode text (none|draft|sample),
  notes text,
  created_at, updated_at
);
```

### MS / LC-MS Report Table
```sql
CREATE TABLE ms_reports (
  id uuid PRIMARY KEY,
  product_id text, batch_id uuid, coa_id uuid,
  document_number text NOT NULL UNIQUE,
  issue_date text, revision integer,
  status text (draft|under_review|correction_required|approved|released|superseded|void),
  method_name text, method_code text, instrument_name text,
  ionization_mode text,
  expected_molecular_weight numeric, observed_mass numeric,
  mass_error numeric, mass_error_ppm numeric, charge_state integer,
  spectrum_file_url text, raw_data_file_url text,
  identity_conclusion text,
  pass_fail_decision text (pass|fail|conditional),
  acceptance_criteria text,
  analyst_name text, reviewer_name text,
  watermark_mode text (none|draft|sample),
  notes text,
  created_at, updated_at
);
```

### Safety Data Sheet (SDS) Table
```sql
CREATE TABLE sds_documents (
  id uuid PRIMARY KEY,
  product_id text NOT NULL,
  document_number text NOT NULL,
  revision integer,
  issue_date text, revision_date text,
  status text (draft|under_review|active|superseded|void),
  language text, jurisdiction text,
  ghs_classification jsonb, signal_word text,
  pictograms_json jsonb, hazard_statements_json jsonb,
  precautionary_statements_json jsonb,
  section_1_identification text NOT NULL,
  section_2_hazard_identification text NOT NULL,
  section_3_composition text NOT NULL,
  [sections 4-16 for SDS content],
  prepared_by text, reviewed_by text, approved_by text,
  created_at, updated_at,
  CONSTRAINT unique_active_sds_per_product UNIQUE (product_id, status) WHERE status = 'active'
);
```

### Document Bundle Table
```sql
CREATE TABLE document_bundles (
  id uuid PRIMARY KEY,
  product_id text,
  batch_id uuid NOT NULL,
  coa_id uuid NOT NULL,
  hplc_report_id uuid,
  ms_report_id uuid,
  sds_id uuid,
  bundle_number text NOT NULL UNIQUE,
  status text (draft|incomplete|under_review|approved|released|void),
  created_by text, approved_by text,
  released_at timestamptz,
  created_at, updated_at
);
```

### Audit Log Table
```sql
CREATE TABLE quality_audit_logs (
  id uuid PRIMARY KEY,
  entity_type text (batch|coa_document|hplc_report|ms_report|sds|document_bundle),
  entity_id uuid NOT NULL,
  action text (created|updated|approved|released|superseded|voided|rejected|reviewed),
  old_value_json jsonb, new_value_json jsonb,
  performed_by text, performed_at timestamptz,
  ip_address text, details text,
  created_at timestamptz
);
```

## Type Definitions

All types are defined in `lib/quality-types.ts`:

```typescript
// Batch & Release Decision
type BatchStatus = "draft" | "under_review" | "released" | "rejected" | "void";
type ReleaseDecision = "pending" | "released" | "rejected" | "conditional";

// Document Status
type DocumentStatus = "draft" | "under_review" | "correction_required" | "approved" | "released" | "superseded" | "void";

// Watermark Mode
type WatermarkMode = "none" | "draft" | "sample";

// Watermark usage
WatermarkMode = "none"      // No watermark
WatermarkMode = "draft"     // Yellow watermark "DRAFT — DOCUMENT NOT YET APPROVED"
WatermarkMode = "sample"    // Red watermark "SAMPLE / DEMO — NOT FOR RELEASE OR CUSTOMER USE"
```

## Service Functions

### Quality Service (`lib/quality-service.ts`)

**Document Number Generation**
```typescript
generateCoaNumber(productId, timestamp?) -> string
  // Returns: "COA-PRODUCTID-20250301-1234"

generateVerificationCode() -> string
  // Returns: 12-character alphanumeric code "ABC123XYZ456"

generateDocumentNumber(prefix, timestamp?) -> string
  // prefix: "HPLC" | "MS" | "SDS"
  // Returns: "HPLC-202503-12345"

generateBundleNumber(timestamp?) -> string
  // Returns: "BUNDLE-25060-123"
```

**Validation Functions**
```typescript
validateCoaForRelease(coa) -> DocumentValidationResult
validateHplcForRelease(hplc) -> DocumentValidationResult
validateMsForRelease(ms) -> DocumentValidationResult
validateSdsForActivation(sds) -> DocumentValidationResult

validateBundleForRelease(
  supabase, bundle, batch, coa, hplc, ms, sds
) -> DocumentValidationResult
```

**Audit Logging**
```typescript
createAuditLog(
  supabase,
  entityType,    // "batch" | "coa_document" | "hplc_report" | "ms_report" | "sds" | "document_bundle"
  entityId,
  action,        // "created" | "updated" | "approved" | "released" | "superseded" | "voided" | "rejected" | "reviewed"
  performedBy,
  oldValue?,
  newValue?,
  details?
) -> Promise<void>
```

### Document Generator (`lib/quality-document-generator.ts`)

**Main Entry Point**
```typescript
generateSupportingDocuments(
  supabase,
  product,      // Product from site-content
  batch,        // Batch record
  coaDocument,  // COA being created
  createdBy     // User creating the documents
) -> Promise<{
  hplc: HplcReport;
  ms: MsReport;
  sds: SDS;
  bundle: DocumentBundle;
}>
```

**Individual Generators**
```typescript
createHplcReportDraft(supabase, product, batch, coa, createdBy) -> Promise<HplcReport>
createMsReportDraft(supabase, product, batch, coa, mw, createdBy) -> Promise<MsReport>
createSdsDraft(supabase, product, createdBy) -> Promise<SDS>
getOrCreateActiveSds(supabase, product, createdBy) -> Promise<SDS>
```

## Admin Pages

### Document Bundles
- **List**: `/admin/quality/document-bundles`
  - Shows: Bundle #, Product, Batch, COA #, HPLC status, MS status, SDS status, Bundle status
  - Actions: View, Create

- **Detail**: `/admin/quality/document-bundles/[id]`
  - Shows: Full product/batch summary
  - Shows: COA card with metadata
  - Shows: HPLC, MS, SDS status cards
  - Shows: Timeline and audit log
  - Actions: Edit, generate missing docs, download PDFs

### HPLC Reports
- **List**: `/admin/quality/hplc-reports`
  - Filters by status, product, purity result
  - Shows: Document #, Product, Method, Purity %, Pass/Fail, Status

- **Edit**: `/admin/quality/hplc-reports/[id]/edit`
  - Form with all method/result fields
  - Chromatogram image/PDF upload
  - Raw data file upload
  - Preview
  - Validation before approval

### MS Reports  
- **List**: `/admin/quality/ms-reports`
  - Shows: Document #, Product, Method, Expected MW, Observed Mass, Pass/Fail, Status

- **Edit**: `/admin/quality/ms-reports/[id]/edit`
  - Form with all method/result fields
  - Spectrum image/PDF upload
  - Raw data file upload
  - Preview
  - Validation before approval

### SDS Documents
- **List**: `/admin/quality/safety-data-sheets`
  - Shows: Document #, Product, Revision, Language, Jurisdiction, Status

- **Edit**: `/admin/quality/safety-data-sheets/[id]/edit`
  - Full 16-section form
  - Pre-fill from product data
  - Revision tracking
  - Status management (draft → under_review → active)

## PDF Templates

### Available Templates (`lib/quality-pdf-templates.ts`)

```typescript
generateCoaPdfHtml(coa, productName, batchInfo, options) -> string
generateHplcPdfHtml(hplc, productName, options) -> string
generateMsPdfHtml(ms, productName, options) -> string
generateSdsPdfHtml(sds, options) -> string
```

**Options:**
```typescript
interface PdfGenerationOptions {
  brandSettings: CoaBrandSettings;  // From coa-brand-settings
  watermarkMode?: "none" | "draft" | "sample";
  includeQrCode?: boolean;
  includeCharts?: boolean;  // For chromatograms, spectra
}
```

**Features:**
- Consistent 8.5×11" page layout
- Watermark based on document status
- Brand colors and typography
- All company contact information in footer
- Signature blocks (Analyst, Reviewer, Approver)
- QR code with verification reference
- Tables for peak data, analytical results
- Print-optimized CSS

## Public Verification Page

### Updated `/verify/[verificationCode]`

Shows released COA with:
- Document status
- Product name, catalog code
- Batch/lot number, manufacturing date, expiry
- HPLC purity result with reference
- MS/LC-MS identity conclusion with reference
- SDS document number, revision, status
- Document bundle number
- Verification code
- QR code linking to verification URL

**Visibility Options:**
- `private`: Document listed but no details exposed
- `visible_reference_only`: Document title/number shown, no download
- `downloadable`: Full PDF download available
- `available_on_request`: Shows link to request document

## Workflow Example

### Step 1: Create Batch
```typescript
const batch = await supabase.from("batches").insert({
  product_id: "bpc-157",
  batch_number: "BPC157-20250301-001",
  manufacturing_date: "2025-03-01",
  expiry_date: "2027-03-01",
  country_of_origin: "China",
  status: "draft",
  release_decision: "pending",
  created_by: "admin@example.com"
}).select().single();
```

### Step 2: Create COA
```typescript
const coaNumber = generateCoaNumber("bpc-157");
const verificationCode = generateVerificationCode();

const coa = await supabase.from("coa_documents").insert({
  product_id: "bpc-157",
  batch_id: batch.id,
  coa_number: coaNumber,
  verification_code: verificationCode,
  issue_date: "2025-03-01",
  revision: 1,
  document_status: "draft",
  prepared_by: "analyst@example.com",
  release_decision: "pending",
  watermark_mode: "sample"  // Mark as sample
}).select().single();
```

### Step 3: Auto-generate Supporting Docs
```typescript
const { hplc, ms, sds, bundle } = await generateSupportingDocuments(
  supabase,
  productData,
  batch,
  coa,
  "analyst@example.com"
);

// System now has:
// - COA draft
// - HPLC report draft (watermark="draft")
// - MS report draft (watermark="draft")  
// - SDS draft or linked active SDS
// - Document bundle (status="incomplete" since all need approval)
```

### Step 4: Fill in Analytical Data
```typescript
// Admin fills HPLC form
await supabase.from("hplc_reports").update({
  purity_percent: 96.5,
  main_peak_area: 95000000,
  total_peak_area: 98500000,
  result_summary: "Purity determination by HPLC confirmed...",
  pass_fail_decision: "pass",
  status: "under_review",
  reviewed_by: "qc@example.com"
}).eq("id", hplc.id);

// Admin fills MS form
await supabase.from("ms_reports").update({
  observed_mass: 456.2345,
  mass_error: 0.0015,
  identity_conclusion: "MS/LC-MS identity confirmed...",
  pass_fail_decision: "pass",
  status: "under_review",
  reviewed_by: "qc@example.com"
}).eq("id", ms.id);
```

### Step 5: Approve Documents
```typescript
// QA Manager approves
await supabase.from("hplc_reports").update({
  status: "approved",
  approved_by: "qamgr@example.com"
}).eq("id", hplc.id);

await supabase.from("ms_reports").update({
  status: "approved",
  approved_by: "qamgr@example.com"
}).eq("id", ms.id);

// Activate SDS if not already active
await supabase.from("sds_documents").update({
  status: "active",
  approved_by: "qamgr@example.com"
}).eq("id", sds.id);
```

### Step 6: Release COA
```typescript
const validation = await validateBundleForRelease(
  supabase, bundle, batch, coa, hplc, ms, sds
);

if (validation.canRelease) {
  await supabase.from("coa_documents").update({
    document_status: "released",
    release_decision: "released",
    approved_by: "qamgr@example.com",
    verification_url: `https://atlasbiolabs.co/verify/${coa.verification_code}`,
    watermark_mode: "none"  // Remove watermark for release
  }).eq("id", coa.id);

  await supabase.from("document_bundles").update({
    status: "released",
    approved_by: "qamgr@example.com",
    released_at: new Date()
  }).eq("id", bundle.id);

  // Create audit log
  await createAuditLog(
    supabase,
    "coa_document",
    coa.id,
    "released",
    "qamgr@example.com",
    { document_status: "draft" },
    { document_status: "released" },
    "Released by QA Manager"
  );
}
```

### Step 7: Customer Verification
Customer visits `/verify/ABCD1234EFGH5678`

See:
- ✓ Released and verified badge
- COA Number, Product, Batch, Manufacturing Date, Expiry
- Purity result: 96.5%
- HPLC Report reference: HPLC-202503-12345
- MS Report reference: MS-202503-54321
- SDS reference: SDS-20250301, Revision 1
- Bundle Number: BUNDLE-25060-456
- QR code links to verification page

## Security & Permissions

- **Admin/QA only**: Edit analytical data, approve documents, release COA
- **Analyst**: Fill in test data, create drafts
- **Super Admin**: Full audit log access, void/reject decisions
- **Public**: View released COA only (no sensitive data)
- **Audit trail**: Every change logged with user, timestamp, old/new values

## Testing Checklist

- [ ] Create batch
- [ ] Generate COA
- [ ] Verify HPLC draft created with watermark="draft"
- [ ] Verify MS draft created with watermark="draft"
- [ ] Verify SDS linked or created
- [ ] Fill HPLC data
- [ ] Fill MS data
- [ ] Try releasing COA before docs approved → blocked with error message
- [ ] Approve HPLC
- [ ] Approve MS
- [ ] Activate SDS
- [ ] Release COA → watermark removed, status=released
- [ ] Download COA PDF → brand settings applied
- [ ] Download HPLC PDF → method/results visible, no watermark
- [ ] Download MS PDF → identity/mass data visible, no watermark
- [ ] Download SDS PDF → all 16 sections visible
- [ ] Verify public page shows all references
- [ ] Check audit log for all changes
- [ ] Create new revision → old superseded, new draft

## Performance Considerations

- Document generation is async (no blocking UI)
- PDFs generated on-demand (not pre-rendered)
- Indexes on: product_id, batch_id, coa_id, status, created_at
- Audit logs kept for compliance (consider archiving after N years)
- Watermarks applied at PDF render time (not stored)

## Future Enhancements

1. **Batch PDF/ZIP download** of entire document bundle
2. **Email notifications** when documents reach certain status
3. **Document templates** (custom per product/region)
4. **Analytics dashboard** showing release/approval metrics
5. **Document retention policy** (auto-archive after expiry)
6. **Integration with ERP** for batch data sync
7. **Digital signatures** using certificates
8. **Multi-language SDS** support
