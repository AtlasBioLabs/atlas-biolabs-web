# COA Field Coverage Checklist

This checklist compares the printable COA, the admin entry points, Supabase persistence, and the current print template.

Legend:
- `Editable: Yes` means editable in the admin COA form or branding settings.
- `Editable: No` means intentionally locked template structure such as fixed row labels or column headers.

## Document Header / Branding

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Company logo | `Admin > Settings > COA Branding > Logo URL` | `public.coa_brand_settings.logo_url` | `components/admin/coa-document-template.tsx` `CoaHeader` | Yes | Falls back to company name text if empty. |
| Company name | `Admin > Settings > COA Branding > Company Name` | `public.coa_brand_settings.company_name` | `CoaHeader` | Yes | Also used as fallback header identity. |
| Quality unit name | `Admin > Settings > COA Branding > Quality Unit Name` | `public.coa_brand_settings.quality_unit_name` | `CoaHeader` | Yes | Visible below company name. |
| Tagline | `Admin > Settings > COA Branding > Tagline` | `public.coa_brand_settings.tagline` | `CoaHeader` | Yes | |
| Controlled document label | `Admin > Settings > COA Branding > Controlled Document Label` | `public.coa_brand_settings.controlled_document_label` | `CoaHeader` controlled-document box | Yes | Added to remove hardcoded label. |
| COA Number | `Admin > COA Form > Header / Document Control > COA Number` | `public.coa_verifications.coa_number` | `CoaHeader`, `Document Summary` | Yes | |
| Revision | `Admin > COA Form > Header / Document Control > Revision` | `public.coa_verifications.revision` | `CoaHeader`, `Document Summary` | Yes | |
| Document class | `Admin > Settings > COA Branding > Document Class` | `public.coa_brand_settings.document_class` | `CoaHeader` controlled-document box | Yes | |
| Footer text | `Admin > Settings > COA Branding > Footer Text` | `public.coa_brand_settings.footer_text` | Page 1 and page 2 footer | Yes | |

## COA Header

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| COA Number | `Header / Document Control` | `public.coa_verifications.coa_number` | `Document Summary` | Yes | |
| Issue Date | `Header / Document Control` | `public.coa_verifications.issue_date` | `Document Summary` | Yes | |
| Client / Recipient | `Product Identification` | `public.coa_verifications.client_recipient` | `Document Summary` | Yes | |
| Prepared By | `Authorization > Prepared / Created By` | `public.coa_verifications.created_by` | `Document Summary`, `Authorization` | Yes | |
| Document Type | `Admin > Settings > COA Branding > Document Type` | `public.coa_brand_settings.document_type` | `Document Summary` | Yes | Managed as branding-level template text. |
| Revision | `Header / Document Control` | `public.coa_verifications.revision` | `Document Summary` | Yes | |

## Product Identification

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Product Name | `Product Identification` | `public.coa_verifications.product_name` | `Product Identification` table | Yes | |
| Catalog Code | `Product Identification` | `public.coa_verifications.catalog_code` | `Product Identification` table | Yes | |
| Peptide Sequence | `Product Identification` | `public.coa_verifications.peptide_sequence` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Batch / Lot No. | `Batch Summary > Batch / Lot No.` | `public.coa_verifications.batch_lot_no` | `Product Identification` table | Yes | |
| Molecular Weight | `Product Identification` | `public.coa_verifications.molecular_weight` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Molecular Formula | `Product Identification` | `public.coa_verifications.molecular_formula` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Physical Form | `Product Identification` | `public.coa_verifications.physical_form` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Appearance Spec | `Product Identification` | `public.coa_verifications.appearance_spec` | `Product Identification` table and analytical defaults | Yes | Requires migration `202605210002`. |
| Grade / Scope | `Product Identification` | `public.coa_verifications.grade_scope` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Pack Size | `Product Identification` | `public.coa_verifications.pack_size` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Storage | `Product Identification` | `public.coa_verifications.storage` | `Product Identification` table | Yes | Requires migration `202605210002`. |
| Retest Period | `Product Identification` | `public.coa_verifications.retest_period` | `Product Identification` table | Yes | Requires migration `202605210002`. |

## Batch Summary

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Manufacture Date | `Batch Summary` | `public.coa_verifications.manufacture_date` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Retest / Expiry | `Batch Summary` | `public.coa_verifications.retest_expiry_date` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Batch Quantity | `Batch Summary` | `public.coa_verifications.batch_quantity` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Manufacturing Site | `Batch Summary` | `public.coa_verifications.manufacturing_site` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Country of Origin | `Batch Summary` | `public.coa_verifications.country_of_origin` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Release Site | `Batch Summary` | `public.coa_verifications.release_site` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Packaging | `Batch Summary` | `public.coa_verifications.packaging` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Label Option | `Batch Summary` | `public.coa_verifications.label_option` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Shipping Conditions | `Batch Summary` | `public.coa_verifications.shipping_conditions` | `Batch Summary` table | Yes | Requires migration `202605210002`. |
| Document Pack | `Batch Summary` | `public.coa_verifications.document_pack` | `Batch Summary` table | Yes | |

## Release Snapshot

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Identity | `Analytical Test Results > Identity > Batch Result` | `public.coa_analytical_test_results.batch_result` and synced `public.coa_verifications.identity_result` | `Release Snapshot`, page 2 analytical table | Yes | Summary field is auto-synced from fixed rows. |
| HPLC Purity | `Analytical Test Results > Purity > Batch Result` | `public.coa_analytical_test_results.batch_result` and synced `public.coa_verifications.hplc_purity` | `Release Snapshot`, page 2 analytical table | Yes | Summary field is auto-synced from fixed rows. |
| Water Content | `Analytical Test Results > Water content > Batch Result` | `public.coa_analytical_test_results.batch_result` and synced `public.coa_verifications.water_content` | `Release Snapshot`, page 2 analytical table | Yes | Summary field is auto-synced from fixed rows. |
| Release Decision | `Header / Document Control > Release Decision` | `public.coa_verifications.release_decision` | `Release Snapshot` | Yes | |

## Intended Use

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Intended Use & Documentation Scope | `Batch Summary > Intended Use & Documentation Scope` | `public.coa_verifications.intended_use_scope` | `Intended Use & Documentation Scope` box | Yes | Requires migration `202605210002`. |

## Analytical Test Results

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Appearance row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Identity row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Purity row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Peptide content row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Water content row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Counter-ion row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Residual solvents row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Heavy metals row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Microbial limits row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Endotoxin / Sterility row label | `Analytical Test Results` fixed row | `public.coa_analytical_test_results.test_attribute` | Page 2 analytical table | No | Locked template row label. |
| Method | `Analytical Test Results` table column | `public.coa_analytical_test_results.method` | Page 2 analytical table | Yes | Preset + custom datalist input. |
| Specification | `Analytical Test Results` table column | `public.coa_analytical_test_results.specification` | Page 2 analytical table | Yes | Preset + custom datalist input. |
| Batch Result | `Analytical Test Results` table column | `public.coa_analytical_test_results.batch_result` | Page 2 analytical table | Yes | Also syncs summary fields on main COA record. |
| Status | `Analytical Test Results` table column | `public.coa_analytical_test_results.status` | Page 2 analytical table | Yes | Preset + custom datalist input. |
| Column headers | Fixed table headers | Template constant | Page 2 analytical table header | No | Locked print structure. |

## Analytical Records Referenced

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| HPLC chromatogram row label | `Analytical Records Referenced` fixed row | `public.coa_analytical_records.record_type` | Page 2 records table | No | Locked template row label. |
| LC-MS identity report row label | `Analytical Records Referenced` fixed row | `public.coa_analytical_records.record_type` | Page 2 records table | No | Locked template row label. |
| SDS / Safety Data Sheet row label | `Analytical Records Referenced` fixed row | `public.coa_analytical_records.record_type` | Page 2 records table | No | Locked template row label. |
| Raw data archive row label | `Analytical Records Referenced` fixed row | `public.coa_analytical_records.record_type` | Page 2 records table | No | Locked template row label. |
| Reference / File Name | `Analytical Records Referenced` table column | `public.coa_analytical_records.reference_file_name` | Page 2 records table | Yes | Also syncs `hplc_file_name`, `lcms_file_name`, `sds_file_name`, and `raw_data_archive_ref` on the main COA record. |
| Availability | `Analytical Records Referenced` table column | `public.coa_analytical_records.availability` | Page 2 records table | Yes | Preset + custom datalist input. |
| Column headers | Fixed table headers | Template constant | Page 2 records table header | No | Locked print structure. |

## Certification

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Certification statement text | `Admin > Settings > COA Branding > Certification Statement` | `public.coa_brand_settings.certification_statement` | `Certification Statement` block | Yes | Added to remove hardcoded statement. |

## Authorization

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Prepared By | `Authorization > Prepared / Created By` | `public.coa_verifications.created_by` | `Authorization` table | Yes | |
| Reviewed By | `Authorization > Reviewed By` | `public.coa_verifications.reviewed_by` | `Authorization` table | Yes | |
| Prepared Date | `Authorization > Prepared Date` | `public.coa_verifications.prepared_at` | `Authorization` table | Yes | Added in migration `202605210005`. |
| Review Date | `Authorization > Review Date` | `public.coa_verifications.reviewed_at` | `Authorization` table | Yes | Added in migration `202605210005`. |
| Authorized Signature | `Admin > Settings > COA Branding > Authorized Signature Text` | `public.coa_brand_settings.authorized_signature_text` | `Authorization` table | Yes | Keeps signature note editable without implying a live signature image. |
| Company Seal | `Admin > Settings > COA Branding > Seal URL` and `Company Seal Text` | `public.coa_brand_settings.seal_url`, `public.coa_brand_settings.seal_text` | `Authorization` table and seal box | Yes | URL renders image when present; text fallback prints otherwise. |
| Verification URL | `Header / Document Control > Verification URL` | `public.coa_verifications.verification_url` | `Authorization` verification URL block | Yes | Auto-generated from verification code. |
| QR Code | Derived from verification URL | `public.coa_verifications.verification_url` and optional `public.coa_verifications.qr_code_url` | `Authorization` QR block | Derived | Printed from the public verification URL, not an admin route. |

## Additional template-controlled text now covered by branding

| COA field | Form location | Supabase table/column | Print template location | Editable | Notes |
| --- | --- | --- | --- | --- | --- |
| Certificate title | `Admin > Settings > COA Branding > Certificate Title` | `public.coa_brand_settings.certificate_title` | Page 1 title block | Yes | Added for full template coverage. |
| Certificate subtitle | `Admin > Settings > COA Branding > Certificate Subtitle` | `public.coa_brand_settings.certificate_subtitle` | Page 1 title block | Yes | Added for full template coverage. |
| Document note | `Admin > Settings > COA Branding > Document Note` | `public.coa_brand_settings.document_note` | Page 1 note box | Yes | Added for full template coverage. |

## Coverage summary

- All visible variable COA fields are now represented either in the admin COA form or COA branding settings.
- All fixed analytical rows and fixed analytical record rows are locked structurally but editable inside the allowed columns.
- The printable COA reads child-table analytical data when available and falls back to legacy summary fields for backward compatibility.
- To persist the newest coverage fields, apply these migrations:
  - `202605210002_extend_coa_verifications_for_print_template.sql`
  - `202605210004_create_coa_fixed_result_tables.sql`
  - `202605210005_extend_coa_field_coverage.sql`
