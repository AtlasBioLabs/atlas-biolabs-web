import { aboutTeam, contactDetails, founderProfile } from "@/lib/site-content";

export type ProofFact = {
  label: string;
  value: string;
  detail: string;
};

export type OperationsEvidenceItem = {
  title: string;
  status: "Leadership" | "Operations" | "Laboratory" | "Client Support";
  description: string;
  detail: string;
  image?: string;
  initials?: string;
};

export type DocumentPreview = {
  title: string;
  status: "Documentation Snapshot";
  summary: string;
  fields: Array<{
    label: string;
    value: string;
    tone?: "default" | "accent" | "redacted";
  }>;
};

export const companyProofFacts: ProofFact[] = [
  {
    label: "Founded",
    value: "2024",
    detail: "We launched in 2024 to build a cleaner commercial sourcing experience.",
  },
  {
    label: "Founder",
    value: founderProfile.name,
    detail: "Dedicates his time and expertise to helping men and women improve their general health and quality of life",
  },
  {
    label: "Team",
    value: `${aboutTeam.length} dedicated `,
    detail: "We have a robust and active team to help you every step of the way.",
  },
  {
    label: "Contact",
    value: contactDetails.recipientEmail,
    detail: "You can use our sales inbox for direct commercial contact.",
  },
  {
    label: "Catalog",
    value: "28 SKUs / 7 categories",
    detail: "We keep our product depth, categories, and inquiry options easy to review.",
  },
  {
    label: "Response Time",
    value: "< 1 business day",
    detail: "We set a clear expectation for quote response speed.",
  },
];

export const proofSystemNote =
  "We keep our team structure, workflow views, and documentation format current so you can understand how we work before you reach out.";

export const operationsEvidenceItems: OperationsEvidenceItem[] = [
  {
    title: "Dr. Guy Citrin",
    status: "Leadership",
    image: "/images/guy-citrin-founder-portrait.png",
    description:
      "Driven and warmhearted naturopathic doctor Guy Citrin, ND, dedicates his time and expertise to helping men and women improve their general health and quality of life.",
    detail:
      "Naturopathic doctor Guy Citrin, ND",
  },
  {
    title: "Operating Team",
    status: "Operations",
    image: "/images/about-team.jpg",
    description:
      "Our operating team covers commercial coordination, documentation review, supply chain, catalog maintenance, and account support.",
    detail:
      "We stay close to the work across sourcing, documentation, and customer communication every day.",
  },
  {
    title: "Laboratory Handling",
    status: "Laboratory",
    image: "/images/quality-medical.jpg",
    description:
      "Our quality and research work centers on real bench work, sample handling, and controlled laboratory procedure.",
    detail:
      "That laboratory discipline carries through our quality, documentation, and release workflow.",
  },
  {
    title: "Microscopy and Analysis",
    status: "Laboratory",
    image: "/images/research-microscope.jpg",
    description:
      "Microscopy and analytical review reflect the way Atlas Labs approaches incoming material.",
    detail:
      "That scientific approach guides classification, documentation checks, and review consistency.",
  },
  {
    title: "Client Support Workflow",
    status: "Client Support",
    image: "/images/sales-support.jpg",
    description:
      "We stay available from the first inquiry through documentation follow-up, quote handling, and account support.",
    detail:
      "We keep the people side of the business as visible as the laboratory side.",
  },
];

export const qualityDocumentPreviews: DocumentPreview[] = [
  {
    title: "COA Review Packet",
    status: "Documentation Snapshot",
    summary:
      "We review these fields before we move a documentation packet forward.",
    fields: [
      { label: "Product", value: "Commercial peptide SKU" },
      { label: "Lot / Batch", value: "REDACTED FOR PUBLIC PREVIEW", tone: "redacted" },
      { label: "Review stage", value: "Atlas Labs documentation check", tone: "accent" },
      { label: "Buyer release", value: "Shared on approved inquiry" },
    ],
  },
  {
    title: "Batch Traceability Sheet",
    status: "Documentation Snapshot",
    summary:
      "We keep lot matching, storage handling, and dispatch references organized for recurring procurement.",
    fields: [
      { label: "Lot match", value: "COA to batch record" },
      { label: "Storage notes", value: "Validated before handoff" },
      { label: "Internal refs", value: "REDACTED FOR PUBLIC PREVIEW", tone: "redacted" },
      { label: "Escalation path", value: "Clarification or hold status" },
    ],
  },
  {
    title: "Release Checklist",
    status: "Documentation Snapshot",
    summary:
      "We use a release checklist structure so handoff into commercial support stays consistent.",
    fields: [
      { label: "Identity fields", value: "Confirmed" },
      { label: "Documentation packet", value: "Reviewed" },
      { label: "Dispatch notes", value: "Matched" },
      { label: "Final approval", value: "Buyer-facing packet" },
    ],
  },
];

export const researchDocumentPreviews: DocumentPreview[] = [
  {
    title: "Classification Worksheet",
    status: "Documentation Snapshot",
    summary:
      "We use this kind of worksheet to map incoming material into the right commercial category.",
    fields: [
      { label: "Sample class", value: "Commercial group verified", tone: "accent" },
      { label: "Reference fields", value: "REDACTED FOR PUBLIC PREVIEW", tone: "redacted" },
      { label: "Handoff result", value: "Catalog and sales handoff" },
      { label: "Review owner", value: "Atlas Labs review team" },
    ],
  },
  {
    title: "Documentation Controls",
    status: "Documentation Snapshot",
    summary:
      "We use record-level checks to keep commercial movement clean and consistent.",
    fields: [
      { label: "COA mapping", value: "Matched to lot data" },
      { label: "Traceability fields", value: "Validated" },
      { label: "Storage instructions", value: "Cross-checked" },
      { label: "Mismatch log", value: "Escalated when needed" },
    ],
  },
  {
    title: "Exception Log Preview",
    status: "Documentation Snapshot",
    summary:
      "We track clarifications and holds in a structured way when records need follow-up.",
    fields: [
      { label: "Issue type", value: "REDACTED FOR PUBLIC PREVIEW", tone: "redacted" },
      { label: "Resolution", value: "Open / cleared / hold" },
      { label: "Commercial impact", value: "Review paused when needed" },
      { label: "Follow-up owner", value: "Documentation review team" },
    ],
  },
];
