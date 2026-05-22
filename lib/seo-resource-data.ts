import { getBlogPostBySlug } from "@/lib/blog";
import type { BreadcrumbItem } from "@/lib/seo";
import type { CtaContent, ProductCategoryId } from "@/lib/site-content";
import { productCategories, products } from "@/lib/site-content";

export type SeoResourceLink = {
  title: string;
  href: string;
  description: string;
  eyebrow?: string;
};

export type SeoPageSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoPageTable = {
  columns: string[];
  rows: Array<{
    label: string;
    values: string[];
  }>;
};

export type StaticSeoPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  schemaType?: "WebPage" | "CollectionPage";
  sections: SeoPageSection[];
  comparisonTable?: SeoPageTable;
  complianceNote: string;
  relatedProductSlugs?: string[];
  relatedCategorySlugs?: ProductCategoryId[];
  relatedArticleSlugs?: string[];
  priorityLinkKeys?: PriorityInternalLinkKey[];
  customLinks?: SeoResourceLink[];
  cta?: CtaContent;
};

export type GlossaryEntry = {
  slug: string;
  term: string;
  title: string;
  description: string;
  definition: string;
  buyerWhyItMatters: string;
  documentationContext: string;
  commonBuyerQuestions: string[];
  relatedProductSlugs?: string[];
  relatedCategorySlugs?: ProductCategoryId[];
  relatedArticleSlugs?: string[];
};

export type DownloadGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  learnItems: string[];
  relatedProductSlugs?: string[];
  relatedCategorySlugs?: ProductCategoryId[];
  relatedArticleSlugs?: string[];
};

export type PriorityInternalLinkKey =
  | "shop"
  | "requestQuote"
  | "qualityAssurance"
  | "peptideDocumentation"
  | "wholesalePeptides"
  | "customPeptideSourcing"
  | "cosmeticPeptideSupplier"
  | "researchPeptideSupplier";

const defaultComplianceNote =
  "Atlas BioLabs provides commercial sourcing, documentation, research, and formulation context only. No medical, dosing, disease-treatment, prevention, or human-use claims are made.";

export const defaultQuoteCta: CtaContent = {
  eyebrow: "Commercial next step",
  title: "Move from research into quote-led sourcing support",
  description:
    "Share your target products, documentation expectations, pack sizes, and timing so Atlas BioLabs can guide the next commercial step clearly.",
  primaryLabel: "Request Quote",
  primaryHref: "/request-quote",
  secondaryLabel: "Browse Catalog",
  secondaryHref: "/shop",
};

export const priorityInternalLinks: Record<
  PriorityInternalLinkKey,
  SeoResourceLink
> = {
  shop: {
    title: "Peptide Catalog",
    href: "/shop",
    description:
      "Browse the full Atlas BioLabs catalog with product-level pricing references, MOQ visibility, pack sizes, and documentation support notes.",
    eyebrow: "Catalog",
  },
  requestQuote: {
    title: "Request Quote",
    href: "/request-quote",
    description:
      "Send a quote request with product targets, quantity, destination market, and documentation questions for direct commercial follow-up.",
    eyebrow: "Quote",
  },
  qualityAssurance: {
    title: "Quality Assurance",
    href: "/quality-assurance",
    description:
      "Review how Atlas Labs supports incoming lot review, documentation checks, and batch transparency inside the Atlas BioLabs supply workflow.",
    eyebrow: "Quality",
  },
  peptideDocumentation: {
    title: "Peptide Documentation",
    href: "/peptide-documentation",
    description:
      "Understand COA context, HPLC and MS references, batch numbers, packaging notes, and the documentation language buyers should request.",
    eyebrow: "Documentation",
  },
  wholesalePeptides: {
    title: "Wholesale Peptides",
    href: "/wholesale-peptides",
    description:
      "See how Atlas BioLabs supports MOQ planning, bulk supply structure, recurring procurement, and quote-led wholesale workflows.",
    eyebrow: "Wholesale",
  },
  customPeptideSourcing: {
    title: "Custom Peptide Sourcing",
    href: "/custom-peptide-sourcing",
    description:
      "Review the quote-led workflow for non-catalog peptide programs, custom sourcing requests, and documentation-first feasibility discussions.",
    eyebrow: "Custom",
  },
  cosmeticPeptideSupplier: {
    title: "Cosmetic Peptide Supplier",
    href: "/cosmetic-peptide-supplier",
    description:
      "Explore how Atlas BioLabs supports formulation teams, private-label buyers, and skincare ingredient sourcing conversations.",
    eyebrow: "Cosmetic",
  },
  researchPeptideSupplier: {
    title: "Research Peptide Supplier",
    href: "/research-peptide-supplier",
    description:
      "Read how Atlas BioLabs supports research supply buyers with documentation support, batch transparency, and quote-based procurement.",
    eyebrow: "Research",
  },
};

export const topLevelSeoPages: Record<string, StaticSeoPage> = {
  "peptide-supplier": {
    slug: "peptide-supplier",
    path: "/peptide-supplier",
    title: "Peptide Supplier for Commercial Sourcing",
    description:
      "Atlas BioLabs supports qualified B2B buyers with peptide supplier guidance, documentation support, MOQ visibility, and quote-led commercial sourcing.",
    h1: "Peptide Supplier for Commercial Sourcing",
    eyebrow: "Supplier Landing Page",
    intro:
      "Atlas BioLabs positions itself as a peptide supplier for commercial buyers who need clearer sourcing pathways, documentation support, MOQ visibility, and a practical route from catalog review into quote-led procurement.",
    schemaType: "CollectionPage",
    sections: [
      {
        title: "What serious buyers look for in a peptide supplier",
        paragraphs: [
          "Commercial teams usually want more than product names and generic pricing claims. They need catalog depth, documentation language, repeat-order logic, and a supplier that can discuss pack sizes, lead times, and commercial fit without creating compliance risk.",
          "Atlas BioLabs is built around that workflow. Buyers can review product pages, category pages, documentation resources, and related articles before asking for commercial support, which makes the eventual quote conversation more specific and more useful.",
        ],
        bullets: [
          "Product-level MOQ visibility",
          "Documentation and batch transparency support",
          "Quote-first commercial communication",
          "Clear internal links between categories, products, and buyer guides",
        ],
      },
      {
        title: "How Atlas BioLabs supports supplier evaluation",
        paragraphs: [
          "A reliable peptide supplier should help buyers compare product categories, understand documentation expectations, and prepare realistic sourcing questions. Atlas BioLabs supports that process through catalog structure, buyer guides, and Atlas Labs quality review language.",
          "That means buyers can move from top-level supplier research into specific product pages such as BPC-157, Retatrutide, and CJC-1295 (with DAC), then into quote review with more complete commercial context.",
        ],
      },
      {
        title: "Documentation, traceability, and commercial follow-up",
        paragraphs: [
          "Documentation matters because supplier evaluation often depends on how lot-specific records, COA language, analytical references, packaging notes, and batch numbering are communicated before supply begins.",
          "Atlas BioLabs uses Atlas Labs review language and documentation support notes so buyers know where documentation questions belong in the workflow and when to move from general product review into batch-specific requests.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["bpc-157", "retatrutide", "cjc-1295-with-dac"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
    relatedArticleSlugs: [
      "peptide-supplier-checklist",
      "compare-peptide-suppliers",
      "professional-peptide-supplier-before-shipment",
    ],
    priorityLinkKeys: [
      "shop",
      "requestQuote",
      "qualityAssurance",
      "peptideDocumentation",
      "wholesalePeptides",
    ],
  },
  "wholesale-peptides": {
    slug: "wholesale-peptides",
    path: "/wholesale-peptides",
    title: "Wholesale Peptides, MOQ & Bulk Supply Support",
    description:
      "Atlas BioLabs supports wholesale peptide buyers with MOQ planning, bulk-pack guidance, documentation support, and quote-led recurring supply workflows.",
    h1: "Wholesale Peptides, MOQ & Bulk Supply Support",
    eyebrow: "Wholesale Landing Page",
    intro:
      "This page is built for procurement teams, resellers, and recurring B2B buyers who need a clearer picture of how Atlas BioLabs handles wholesale peptides, MOQ planning, packaging coordination, and documentation-aware supply support.",
    schemaType: "CollectionPage",
    sections: [
      {
        title: "MOQ and bulk planning",
        paragraphs: [
          "Wholesale supply decisions usually start with MOQ alignment, volume pacing, and packaging expectations. Atlas BioLabs uses product pages and category pages to keep that information visible before the buyer ever opens a quote thread.",
          "That approach reduces wasted conversations because buyers can shortlist products, compare pack sizes, and understand which programs are better suited for pilot quantities versus broader recurring supply discussions.",
        ],
      },
      {
        title: "Documentation and recurring procurement",
        paragraphs: [
          "Recurring wholesale buyers often care just as much about documentation continuity as they do about price. They need a supplier that can speak clearly about batch transparency, COA workflows, storage notes, and repeat-order coordination.",
          "Atlas BioLabs keeps those themes visible through its quality assurance, documentation, and blog resources so a wholesale conversation can move beyond generic pricing requests.",
        ],
        bullets: [
          "Batch and lot context for repeat buying programs",
          "Pack-size and label planning before dispatch",
          "Documentation support during quote review",
          "Commercial guidance for multi-SKU ordering",
        ],
      },
      {
        title: "Who this page is for",
        paragraphs: [
          "This page is most useful for buyers preparing ingredient forecasts, recurring catalog replenishment, private-label planning, or wholesale product comparisons across multiple peptide categories.",
          "Use it together with the category pages, product pages, and documentation guides so your quote request includes destination market, expected quantity, product mix, and any quality-related questions that should be addressed early.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["tesamorelin", "tb-500-thymosin-beta-4-fragment", "retatrutide"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
    relatedArticleSlugs: [
      "bulk-peptide-supply-moq-lead-time",
      "source-peptides-wholesale",
      "peptide-moq-explained",
    ],
    priorityLinkKeys: [
      "shop",
      "requestQuote",
      "qualityAssurance",
      "peptideDocumentation",
      "customPeptideSourcing",
    ],
  },
  "custom-peptide-sourcing": {
    slug: "custom-peptide-sourcing",
    path: "/custom-peptide-sourcing",
    title: "Custom Peptide Sourcing & Quote Support",
    description:
      "Learn how Atlas BioLabs handles custom peptide sourcing, non-catalog requests, documentation planning, and quote-led feasibility review for qualified B2B buyers.",
    h1: "Custom Peptide Sourcing & Quote Support",
    eyebrow: "Custom Sourcing",
    intro:
      "Atlas BioLabs uses a quote-led custom sourcing workflow so buyers can move from non-catalog needs into a more structured feasibility, packaging, MOQ, and documentation conversation without forcing those requests into generic catalog templates.",
    sections: [
      {
        title: "When custom sourcing is the better path",
        paragraphs: [
          "Custom sourcing becomes useful when a buyer needs a non-catalog peptide, a different presentation, a tailored pack-size structure, or a commercial discussion that cannot be handled through a standard product listing alone.",
          "Instead of guessing, Atlas BioLabs encourages buyers to use custom requests when they already know the target sequence, intended commercial context, volume range, or documentation expectations that matter most.",
        ],
      },
      {
        title: "What buyers should prepare before requesting a quote",
        paragraphs: [
          "Clear custom requests tend to produce better commercial responses. The most useful quote requests explain the target material, expected quantity, target timeline, packaging assumptions, and whether the buyer expects supporting documentation review during the sourcing process.",
          "That preparation helps Atlas BioLabs align commercial terms and follow-up questions faster, while keeping documentation and feasibility discussions grounded in what the buyer actually needs.",
        ],
        bullets: [
          "Target peptide or composition",
          "Expected MOQ or forecast range",
          "Preferred pack size or format",
          "Documentation expectations and destination market",
        ],
      },
      {
        title: "Documentation-first custom sourcing conversations",
        paragraphs: [
          "A strong custom sourcing workflow should not separate product feasibility from documentation context. Atlas BioLabs keeps those topics together so buyers can understand what documentation language applies to the program before supply terms are finalized.",
          "That approach is especially useful for teams handling internal procurement reviews, formulation planning, or multiple decision-makers across supply, technical, and commercial roles.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["cjc-1295-with-dac", "ipamorelin", "mots-c"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
    relatedArticleSlugs: [
      "custom-peptide-sourcing-quote-led-supply",
      "quote-based-peptide-ordering",
      "research-peptide-supply-chain",
    ],
    priorityLinkKeys: [
      "requestQuote",
      "shop",
      "peptideDocumentation",
      "qualityAssurance",
      "researchPeptideSupplier",
    ],
    customLinks: [
      {
        title: "Custom Peptide Request Form",
        href: "/custom-requests",
        description:
          "Use the existing custom request workflow to send sequence details, volume planning notes, and documentation questions directly to Atlas BioLabs.",
        eyebrow: "Request",
      },
    ],
  },
  "peptide-documentation": {
    slug: "peptide-documentation",
    path: "/peptide-documentation",
    title: "Peptide Documentation, COA & Batch Transparency",
    description:
      "Understand how Atlas BioLabs approaches peptide documentation, COA context, HPLC and MS references, batch numbering, packaging notes, and buyer transparency.",
    h1: "Peptide Documentation, COA & Batch Transparency",
    eyebrow: "Documentation",
    intro:
      "This page explains how Atlas BioLabs approaches commercial peptide documentation so qualified buyers can understand what belongs on product pages, what belongs in the quote conversation, and what becomes batch-specific during final documentation review.",
    sections: [
      {
        title: "What documentation usually includes",
        paragraphs: [
          "Peptide documentation often includes batch or lot references, COA language, analytical references such as HPLC or MS where applicable, packaging descriptions, storage guidance, and product-identification notes that help a buyer review sourcing readiness.",
          "Atlas BioLabs uses that documentation context to support commercial clarity rather than to replace final batch-specific review. Product pages provide the commercial frame, while documentation review provides the supporting detail for qualified procurement decisions.",
        ],
      },
      {
        title: "How documentation fits inside the buyer workflow",
        paragraphs: [
          "The most useful documentation workflow starts with product and category review, then moves into questions around batch numbering, lot-specific records, appearance notes, storage conditions, and analytical references during quote follow-up.",
          "That sequence helps keep product education, commercial alignment, and batch-specific documentation in the right order, which is especially important for larger procurement teams and documentation-sensitive accounts.",
        ],
        bullets: [
          "Use product pages for category and supply context",
          "Use quote review for documentation expectations",
          "Use COA and analytical records for batch-specific follow-up",
        ],
      },
      {
        title: "Batch transparency and document discipline",
        paragraphs: [
          "Batch transparency matters because buyers often need to connect commercial communication with the records that support the final supply decision. Atlas BioLabs keeps batch and documentation language visible throughout the site so buyers can prepare better requests from the start.",
          "When documentation expectations are set early, procurement tends to move more smoothly across product review, quality review, and final quote confirmation.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["bpc-157", "ll-37", "copper-tripeptide-1-ghk-cu"],
    relatedCategorySlugs: ["growth-repair-peptides", "carrier-peptides"],
    relatedArticleSlugs: [
      "how-to-read-peptide-coa",
      "peptide-purity-hplc-ms-documentation",
      "batch-number-coa-verification",
    ],
    priorityLinkKeys: [
      "qualityAssurance",
      "requestQuote",
      "shop",
      "wholesalePeptides",
      "researchPeptideSupplier",
    ],
  },
  "coa-verification": {
    slug: "coa-verification",
    path: "/coa-verification",
    title: "COA Verification & Batch Documentation Support",
    description:
      "Learn how Atlas BioLabs handles COA verification, document-status review, batch documentation support, and documentation requests for qualified buyers.",
    h1: "COA Verification & Batch Documentation Support",
    eyebrow: "COA Verification",
    intro:
      "Atlas BioLabs makes document-status verification available so buyers can confirm whether a COA record is pending, released, revoked, or otherwise not verified before relying on it in a commercial review workflow.",
    sections: [
      {
        title: "What COA verification confirms",
        paragraphs: [
          "COA verification confirms document status. It helps buyers review whether a record is released, pending QA review, revoked, superseded, or otherwise not appropriate for final acceptance.",
          "That verification layer is useful for procurement, documentation teams, and commercial buyers who need confidence that the document they are reviewing matches the current record state.",
        ],
      },
      {
        title: "What COA verification does not replace",
        paragraphs: [
          "A public verification page does not replace supplier communication, quote review, or batch-specific documentation requests. Buyers still need to ask the right questions about the batch, pack size, destination, and supporting documentation package when a program moves toward supply.",
          "Atlas BioLabs keeps that distinction visible so verification remains a status check rather than a substitute for broader documentation review.",
        ],
      },
      {
        title: "How buyers can use verification in practice",
        paragraphs: [
          "Buyers can use verification codes to confirm whether a COA is still valid for review, then move into documentation follow-up if more detail is needed. This is especially useful when multiple stakeholders are reviewing the same record internally.",
          "If you need help understanding how verification, COA language, and batch support fit together, Atlas BioLabs can connect the verification step to the wider documentation workflow.",
        ],
      },
    ],
    complianceNote:
      "Atlas BioLabs verification confirms document status only. It does not provide dosage, treatment, medical, veterinary, diagnostic, or human-use guidance.",
    relatedProductSlugs: ["bpc-157", "semaglutide-demo-trending", "ll-37"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
    ],
    relatedArticleSlugs: [
      "how-to-read-peptide-coa",
      "batch-number-coa-verification",
      "lot-specific-peptide-documentation",
    ],
    priorityLinkKeys: [
      "peptideDocumentation",
      "qualityAssurance",
      "requestQuote",
      "shop",
    ],
    customLinks: [
      {
        title: "Public COA Verification Lookup",
        href: "/verify",
        description:
          "Enter a verification code to confirm document status and review the public COA verification summary.",
        eyebrow: "Verification",
      },
    ],
  },
  "bulk-peptide-supply": {
    slug: "bulk-peptide-supply",
    path: "/bulk-peptide-supply",
    title: "Bulk Peptide Supply for Qualified B2B Buyers",
    description:
      "Atlas BioLabs supports bulk peptide supply planning with MOQ visibility, packaging coordination, documentation support, and quote-led procurement workflows.",
    h1: "Bulk Peptide Supply for Qualified B2B Buyers",
    eyebrow: "Bulk Supply",
    intro:
      "Atlas BioLabs supports bulk peptide supply discussions for teams that need more than a single-SKU purchase. This page focuses on procurement readiness, packaging choices, documentation support, and quote-based commercial coordination.",
    schemaType: "CollectionPage",
    sections: [
      {
        title: "What bulk buyers usually need first",
        paragraphs: [
          "Bulk buyers typically begin with product shortlist work, then move into quantity planning, packaging expectations, shipping assumptions, and documentation questions. Atlas BioLabs structures the site so that journey starts with product pages and category pages instead of disconnected inquiries.",
          "That structure gives buyers a better starting point for discussing commercial fit and recurring supply expectations across several SKUs or a broader procurement cycle.",
        ],
      },
      {
        title: "Packaging, labels, and shipping coordination",
        paragraphs: [
          "Bulk supply conversations often depend on how material will be packed, labeled, documented, and shipped. Atlas BioLabs uses quote-led communication to align those details with the buyer's program rather than leaving them as afterthoughts.",
          "For qualified B2B buyers, that makes it easier to compare suppliers using the factors that actually affect procurement and internal approval.",
        ],
      },
      {
        title: "Why documentation still matters at scale",
        paragraphs: [
          "Larger order sizes do not reduce the importance of documentation. If anything, recurring and volume-focused accounts usually need stronger clarity around batch references, record consistency, and the documents that support internal review.",
          "Atlas BioLabs connects bulk supply planning to quality assurance, peptide documentation, and COA review resources so those questions can be handled early.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["retatrutide", "tesamorelin", "bremelanotide-pt-141"],
    relatedCategorySlugs: [
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
      "growth-repair-peptides",
    ],
    relatedArticleSlugs: [
      "bulk-peptide-supply-moq-lead-time",
      "source-peptides-wholesale",
      "quote-based-peptide-ordering",
    ],
    priorityLinkKeys: [
      "wholesalePeptides",
      "requestQuote",
      "qualityAssurance",
      "shop",
      "peptideDocumentation",
    ],
  },
  "cosmetic-peptide-supplier": {
    slug: "cosmetic-peptide-supplier",
    path: "/cosmetic-peptide-supplier",
    title: "Cosmetic Peptide Supplier for Formulation Teams",
    description:
      "Atlas BioLabs supports cosmetic peptide sourcing for formulation teams, skincare labs, and ingredient buyers with documentation-aware, quote-led supply workflows.",
    h1: "Cosmetic Peptide Supplier for Formulation Teams",
    eyebrow: "Cosmetic Sourcing",
    intro:
      "Atlas BioLabs supports cosmetic peptide sourcing for formulation teams that need category context, ingredient documentation support, pack-size planning, and supplier communication shaped around commercial skincare and formulation workflows.",
    schemaType: "CollectionPage",
    sections: [
      {
        title: "Formulation teams need more than ingredient names",
        paragraphs: [
          "Cosmetic buyers usually compare signal peptides, carrier peptides, neurotransmitter peptides, and other cosmetic-oriented peptide classes before they ever narrow down to a single SKU.",
          "Atlas BioLabs makes that comparison easier by linking category pages, product pages, documentation language, and buyer guides together in one crawlable system.",
        ],
      },
      {
        title: "What documentation means in cosmetic sourcing",
        paragraphs: [
          "Documentation helps formulation teams review identity context, batch references, appearance expectations, storage notes, and pack-size assumptions without confusing those records with end-use claims.",
          "That distinction is especially important when private-label buyers, ingredient distributors, and formulation labs are all reviewing the same supplier at different stages of the process.",
        ],
      },
      {
        title: "Commercial fit for cosmetic programs",
        paragraphs: [
          "Cosmetic buyers often need clarity on MOQ, repeat-order structure, label options, and the way Atlas BioLabs positions peptide ingredients for formulation-led purchasing rather than generic retail language.",
          "This page is intended to help those buyers move from category comparison into the right quote or follow-up channel quickly.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: [
      "copper-tripeptide-1-ghk-cu",
      "acetyl-hexapeptide-8-argireline",
      "palmitoyl-pentapeptide-4-matrixyl",
    ],
    relatedCategorySlugs: [
      "signal-peptides",
      "carrier-peptides",
      "neurotransmitter-peptides",
    ],
    relatedArticleSlugs: [
      "cosmetic-peptides-guide",
      "ghk-cu-copper-peptide-cosmetic-formulation",
      "argireline-peptide-cosmetic-formulation",
    ],
    priorityLinkKeys: [
      "shop",
      "requestQuote",
      "peptideDocumentation",
      "qualityAssurance",
      "wholesalePeptides",
    ],
  },
  "research-peptide-supplier": {
    slug: "research-peptide-supplier",
    path: "/research-peptide-supplier",
    title: "Research Peptide Supplier & Documentation Support",
    description:
      "Atlas BioLabs supports research peptide buyers with documentation-aware sourcing, category context, batch transparency, and quote-led procurement support.",
    h1: "Research Peptide Supplier & Documentation Support",
    eyebrow: "Research Supply",
    intro:
      "Atlas BioLabs supports research peptide supplier conversations by giving buyers a clearer path through category review, product evaluation, documentation context, and commercial quote preparation.",
    schemaType: "CollectionPage",
    sections: [
      {
        title: "What research supply buyers usually need",
        paragraphs: [
          "Research supply buyers often need product context, documentation language, and batch transparency support before they can move forward internally. Atlas BioLabs keeps those elements visible across product pages, categories, quality resources, and buyer guides.",
          "That structure helps keep commercial communication grounded in what the buyer is actually comparing instead of relying on vague catalog claims.",
        ],
      },
      {
        title: "Documentation-aware product evaluation",
        paragraphs: [
          "Atlas BioLabs treats documentation as part of the product evaluation process rather than a separate afterthought. Buyers can read product overviews, compare related articles, and use documentation resources to prepare better questions before submitting a quote request.",
          "This is particularly useful when a research supply conversation involves technical reviewers, procurement teams, and commercial stakeholders at the same time.",
        ],
      },
      {
        title: "How Atlas BioLabs supports quote-led follow-up",
        paragraphs: [
          "Once a buyer has compared products and categories, the next step is usually a structured quote request covering quantity, pack size, timeline, destination, and documentation expectations.",
          "Atlas BioLabs is set up to support that transition clearly, with internal links that carry buyers from educational content into commercial action without losing sourcing context.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["bpc-157", "cjc-1295-with-dac", "mots-c"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
    relatedArticleSlugs: [
      "research-peptide-supply-chain",
      "documentation-ready-peptide-sourcing",
      "peptide-testing-terms-commercial-buyers",
    ],
    priorityLinkKeys: [
      "shop",
      "requestQuote",
      "qualityAssurance",
      "peptideDocumentation",
      "customPeptideSourcing",
    ],
  },
  compliance: {
    slug: "compliance",
    path: "/compliance",
    title: "Peptide Compliance & Commercial Communication",
    description:
      "Read how Atlas BioLabs approaches compliance-safe product communication, documentation language, commercial sourcing workflows, and buyer support.",
    h1: "Compliance and Commercial Communication",
    eyebrow: "Compliance",
    intro:
      "Atlas BioLabs uses compliance-safe commercial language across the catalog, blog, and documentation resources so buyers can evaluate products, documentation, and supply support without human-use, dosing, or disease-treatment claims.",
    sections: [
      {
        title: "What Atlas BioLabs does claim",
        paragraphs: [
          "Atlas BioLabs discusses commercial sourcing, documentation support, MOQ planning, pack sizes, lead times, category fit, formulation context, and research-aware product positioning.",
          "Those are the areas buyers usually need to compare before moving into a quote or documentation conversation.",
        ],
      },
      {
        title: "What Atlas BioLabs does not claim",
        paragraphs: [
          "Atlas BioLabs does not use medical, dosing, treatment, disease, cure, prevention, or personal-use claims as part of its public product and editorial system.",
          "That boundary helps keep the catalog aligned with supplier evaluation, documentation, and B2B sourcing use cases.",
        ],
      },
      {
        title: "Why compliance-safe communication helps buyers",
        paragraphs: [
          "Clear compliance boundaries help procurement teams and technical reviewers focus on the parts of the workflow that matter commercially: product identity, category fit, documentation expectations, packaging, storage, lead time, and quote structure.",
          "It also makes internal review easier because teams can separate supplier communication from batch-specific documentation and final procurement decisions.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["ll-37", "bpc-157", "retatrutide"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "antimicrobial-peptides",
      "metabolic-advanced-peptides",
    ],
    relatedArticleSlugs: [
      "peptide-supplier-checklist",
      "peptide-testing-terms-commercial-buyers",
      "professional-peptide-supplier-before-shipment",
    ],
    priorityLinkKeys: [
      "qualityAssurance",
      "peptideDocumentation",
      "shop",
      "requestQuote",
    ],
  },
  "shipping-and-lead-times": {
    slug: "shipping-and-lead-times",
    path: "/shipping-and-lead-times",
    title: "Shipping, Lead Times & Supply Coordination",
    description:
      "Learn how Atlas BioLabs approaches shipping, lead times, packaging coordination, and quote-based supply timing for qualified B2B buyers.",
    h1: "Shipping, Lead Times, and Supply Coordination",
    eyebrow: "Operations",
    intro:
      "Atlas BioLabs uses quote-based supply coordination so buyers can align product selection, lead times, packaging, and shipping expectations before commercial supply moves forward.",
    sections: [
      {
        title: "Why lead time should be discussed early",
        paragraphs: [
          "Lead time depends on product type, pack size, quantity, documentation expectations, and whether the buyer is placing an initial order or working through a recurring supply plan.",
          "That is why Atlas BioLabs keeps lead-time guidance visible on product pages and encourages buyers to include timing requirements in their quote request.",
        ],
      },
      {
        title: "How packaging and destination affect planning",
        paragraphs: [
          "Shipping coordination is rarely just about dispatch speed. Packaging, temperature considerations, destination market, and documentation requirements can all affect how a commercial order should be structured.",
          "Atlas BioLabs uses quote review to align those details with the buyer's actual procurement needs instead of treating shipping as a generic afterthought.",
        ],
      },
      {
        title: "How buyers can prepare better timing requests",
        paragraphs: [
          "The clearest shipping requests usually mention product mix, quantity, destination, packaging expectations, and whether documentation review is likely to influence final timing.",
          "That helps Atlas BioLabs provide a more realistic response around commercial readiness and dispatch coordination.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["retatrutide", "tesamorelin", "acetyl-hexapeptide-8-argireline"],
    relatedCategorySlugs: [
      "trending-emerging-peptides",
      "growth-repair-peptides",
      "signal-peptides",
    ],
    relatedArticleSlugs: [
      "bulk-peptide-supply-moq-lead-time",
      "quote-based-peptide-ordering",
      "source-peptides-wholesale",
    ],
    priorityLinkKeys: [
      "wholesalePeptides",
      "requestQuote",
      "shop",
      "qualityAssurance",
    ],
  },
  faq: {
    slug: "faq",
    path: "/faq",
    title: "Peptide Sourcing FAQ for Qualified B2B Buyers",
    description:
      "Review common Atlas BioLabs questions covering peptide sourcing, documentation, MOQ, lead time, quote requests, and batch transparency.",
    h1: "Peptide Sourcing FAQ for Qualified B2B Buyers",
    eyebrow: "FAQ",
    intro:
      "This FAQ page is designed for commercial buyers who want quick answers about how Atlas BioLabs supports product sourcing, documentation, batch transparency, and quote-led supply planning.",
    sections: [
      {
        title: "Who does Atlas BioLabs serve?",
        paragraphs: [
          "Atlas BioLabs serves qualified B2B buyers, procurement teams, formulation groups, research supply buyers, and commercial accounts that need structured peptide sourcing support.",
        ],
      },
      {
        title: "How does Atlas BioLabs handle documentation?",
        paragraphs: [
          "Atlas BioLabs uses Atlas Labs documentation review language, quality assurance resources, and COA-related support pages so buyers can understand how documentation fits into the broader procurement workflow.",
        ],
      },
      {
        title: "How should buyers request quotes?",
        paragraphs: [
          "The strongest quote requests usually mention product targets, quantity, destination, timing, packaging expectations, and documentation questions. That level of detail helps Atlas BioLabs respond with more useful commercial guidance.",
        ],
      },
      {
        title: "What does Atlas BioLabs not claim?",
        paragraphs: [
          "Atlas BioLabs does not make public medical, human-use, dosing, disease-treatment, cure, or prevention claims. Public content focuses on supply, documentation, category context, and buyer decision support.",
        ],
      },
    ],
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["bpc-157", "retatrutide", "palmitoyl-pentapeptide-4-matrixyl"],
    relatedCategorySlugs: [
      "growth-repair-peptides",
      "trending-emerging-peptides",
      "signal-peptides",
    ],
    relatedArticleSlugs: [
      "peptide-supplier-checklist",
      "how-to-read-peptide-coa",
      "peptide-moq-explained",
    ],
    priorityLinkKeys: [
      "shop",
      "requestQuote",
      "peptideDocumentation",
      "qualityAssurance",
    ],
  },
};

export const comparisonPages: Record<string, StaticSeoPage> = {
  "bpc-157-vs-tb-500": {
    slug: "bpc-157-vs-tb-500",
    path: "/compare/bpc-157-vs-tb-500",
    title: "BPC-157 vs TB-500 for Commercial Sourcing",
    description:
      "Compare BPC-157 and TB-500 through sourcing context, category fit, documentation expectations, MOQ planning, and quote considerations.",
    h1: "BPC-157 vs TB-500: Commercial Sourcing and Documentation Comparison",
    eyebrow: "Comparison",
    intro:
      "BPC-157 and TB-500 are often reviewed together by buyers comparing growth-focused peptide catalog entries. This page keeps that comparison centered on supplier evaluation, documentation expectations, and quote planning.",
    sections: [
      {
        title: "Why buyers compare these two products",
        paragraphs: [
          "Both products sit inside growth-oriented sourcing conversations, so commercial buyers often compare them together when building shortlists or planning a broader category buy.",
          "Atlas BioLabs encourages that comparison to stay focused on product role, documentation, pack-size structure, and procurement fit rather than overstated claims.",
        ],
      },
    ],
    comparisonTable: {
      columns: ["BPC-157", "TB-500"],
      rows: [
        {
          label: "Category context",
          values: ["Growth / repair peptide listing", "Growth / repair peptide listing"],
        },
        {
          label: "Documentation focus",
          values: [
            "COA, lot context, packaging, storage, and batch references",
            "COA, lot context, packaging, storage, and batch references",
          ],
        },
        {
          label: "MOQ planning",
          values: ["Entry MOQ suitable for pilot-to-repeat review", "Entry MOQ suitable for pilot-to-repeat review"],
        },
        {
          label: "Buyer workflow",
          values: ["Common in direct SKU comparison during shortlist building", "Common in direct SKU comparison during shortlist building"],
        },
        {
          label: "Quote consideration",
          values: ["Clarify pack size and documentation needs early", "Clarify pack size and documentation needs early"],
        },
      ],
    },
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: ["bpc-157", "tb-500-thymosin-beta-4-fragment", "klow-glow-blend"],
    relatedCategorySlugs: ["growth-repair-peptides", "trending-emerging-peptides"],
    relatedArticleSlugs: [
      "bpc-157-and-tb-500-research-context",
      "growth-peptides-explained",
      "peptide-supplier-checklist",
    ],
    priorityLinkKeys: ["requestQuote", "peptideDocumentation", "qualityAssurance"],
  },
  "ghk-cu-vs-matrixyl": {
    slug: "ghk-cu-vs-matrixyl",
    path: "/compare/ghk-cu-vs-matrixyl",
    title: "GHK-Cu vs Matrixyl for Cosmetic Peptide Buyers",
    description:
      "Compare GHK-Cu and Matrixyl through cosmetic sourcing context, formulation positioning, documentation expectations, and quote planning.",
    h1: "GHK-Cu vs Matrixyl: Cosmetic Peptide Supply Comparison",
    eyebrow: "Comparison",
    intro:
      "Formulation teams often compare GHK-Cu and Matrixyl when reviewing carrier-peptide versus signal-peptide options. This comparison focuses on product-category fit, documentation support, and commercial buyer questions.",
    sections: [
      {
        title: "Carrier peptide versus signal peptide context",
        paragraphs: [
          "The two products usually enter a buyer workflow from different category angles. GHK-Cu often sits in carrier-peptide and copper-peptide discussions, while Matrixyl is usually compared inside signal-peptide and anti-aging formulation planning.",
        ],
      },
    ],
    comparisonTable: {
      columns: ["GHK-Cu", "Matrixyl"],
      rows: [
        {
          label: "Primary category",
          values: ["Carrier peptide / copper-peptide context", "Signal peptide context"],
        },
        {
          label: "Formulation review angle",
          values: ["Copper-peptide ingredient planning", "Signal-peptide and anti-aging planning"],
        },
        {
          label: "Documentation expectation",
          values: ["Appearance, batch context, and copper-complex notes", "Appearance, pack size, and batch-context notes"],
        },
        {
          label: "MOQ discussion",
          values: ["Often evaluated for specialty cosmetic ingredient programs", "Often evaluated for broader formulation programs"],
        },
        {
          label: "Quote consideration",
          values: ["Clarify format and packaging needs", "Clarify pack-size and volume assumptions"],
        },
      ],
    },
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: [
      "copper-tripeptide-1-ghk-cu",
      "palmitoyl-pentapeptide-4-matrixyl",
      "acetyl-hexapeptide-8-argireline",
    ],
    relatedCategorySlugs: ["carrier-peptides", "signal-peptides"],
    relatedArticleSlugs: [
      "ghk-cu-copper-peptide-cosmetic-formulation",
      "matrixyl-peptide-supplier-guide",
      "cosmetic-peptides-guide",
    ],
    priorityLinkKeys: ["cosmeticPeptideSupplier", "requestQuote", "shop"],
  },
  "retatrutide-vs-semaglutide-vs-tirzepatide": {
    slug: "retatrutide-vs-semaglutide-vs-tirzepatide",
    path: "/compare/retatrutide-vs-semaglutide-vs-tirzepatide",
    title: "Retatrutide vs Semaglutide vs Tirzepatide for Buyers",
    description:
      "Compare Retatrutide, Semaglutide, and Tirzepatide through sourcing context, documentation expectations, product status, and commercial quote considerations.",
    h1: "Retatrutide vs Semaglutide vs Tirzepatide: Supply and Documentation Comparison",
    eyebrow: "Comparison",
    intro:
      "These three products are often discussed in the same commercial research conversations. This page compares them through the lens Atlas BioLabs believes matters most to qualified buyers: category fit, status visibility, documentation support, and quote preparation.",
    sections: [
      {
        title: "Why three-way comparisons matter",
        paragraphs: [
          "Trend-sensitive buyers often review these products together because they sit near the same demand conversations and can shape catalog planning, stock prioritization, and documentation workflows.",
        ],
      },
    ],
    comparisonTable: {
      columns: ["Retatrutide", "Semaglutide", "Tirzepatide"],
      rows: [
        {
          label: "Catalog positioning",
          values: ["Emerging / current-interest listing", "Established trend-aware listing", "Emerging trend-aware listing"],
        },
        {
          label: "Documentation emphasis",
          values: ["Status visibility and current-demand review", "Batch context and repeat-order clarity", "Current-demand review with documentation support"],
        },
        {
          label: "Buyer type",
          values: ["Trend-responsive commercial buyers", "Commercial buyers comparing known demand SKUs", "Catalog teams reviewing adjacent demand pathways"],
        },
        {
          label: "MOQ planning",
          values: ["Pilot-to-repeat evaluation workflow", "Pilot-to-repeat evaluation workflow", "Pilot-to-repeat evaluation workflow"],
        },
        {
          label: "Quote consideration",
          values: ["Clarify intended quantity and timing", "Clarify pack-size and destination assumptions", "Clarify status, timing, and supply expectations"],
        },
      ],
    },
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: [
      "retatrutide",
      "semaglutide-demo-trending",
      "tirzepatide-demo-trending",
    ],
    relatedCategorySlugs: [
      "metabolic-advanced-peptides",
      "trending-emerging-peptides",
    ],
    relatedArticleSlugs: [
      "retatrutide-vs-semaglutide-vs-tirzepatide",
      "retatrutide-peptide-commercial-sourcing",
      "trending-emerging-peptides-2026",
    ],
    priorityLinkKeys: ["wholesalePeptides", "requestQuote", "peptideDocumentation"],
  },
  "argireline-vs-snap-8": {
    slug: "argireline-vs-snap-8",
    path: "/compare/argireline-vs-snap-8",
    title: "Argireline vs SNAP-8 for Cosmetic Buyers",
    description:
      "Compare Argireline and SNAP-8 through cosmetic formulation context, supplier expectations, documentation support, and MOQ planning.",
    h1: "Argireline vs SNAP-8: Cosmetic Peptide Comparison for Buyers",
    eyebrow: "Comparison",
    intro:
      "Argireline and SNAP-8 are often compared by formulation teams reviewing neurotransmitter-peptide options. This page keeps the comparison practical and centered on supplier-facing commercial questions.",
    sections: [
      {
        title: "How buyers typically frame this comparison",
        paragraphs: [
          "Most buyers compare these two products while deciding how to position a cosmetic peptide program, what documentation support they need, and how to structure MOQ and pack-size planning across similar SKUs.",
        ],
      },
    ],
    comparisonTable: {
      columns: ["Argireline", "SNAP-8"],
      rows: [
        {
          label: "Category position",
          values: ["Neurotransmitter peptide", "Neurotransmitter peptide"],
        },
        {
          label: "Formulation context",
          values: ["Cosmetic ingredient planning and private-label review", "Cosmetic ingredient planning and private-label review"],
        },
        {
          label: "Documentation focus",
          values: ["Pack-size, lot, and storage review", "Pack-size, lot, and storage review"],
        },
        {
          label: "MOQ considerations",
          values: ["Useful for specialty or recurring cosmetic ingredient programs", "Useful for specialty or recurring cosmetic ingredient programs"],
        },
        {
          label: "Quote note",
          values: ["Clarify cosmetic program scope and volume plan", "Clarify cosmetic program scope and volume plan"],
        },
      ],
    },
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: [
      "acetyl-hexapeptide-8-argireline",
      "acetyl-octapeptide-3-snap-8",
      "dipeptide-diaminobutyroyl-benzylamide-diacetate-syn-ake",
    ],
    relatedCategorySlugs: ["neurotransmitter-peptides"],
    relatedArticleSlugs: [
      "snap-8-vs-argireline",
      "argireline-peptide-cosmetic-formulation",
      "neurotransmitter-peptides-explained",
    ],
    priorityLinkKeys: ["cosmeticPeptideSupplier", "requestQuote", "shop"],
  },
  "copper-peptides-vs-signal-peptides": {
    slug: "copper-peptides-vs-signal-peptides",
    path: "/compare/copper-peptides-vs-signal-peptides",
    title: "Copper Peptides vs Signal Peptides for Buyers",
    description:
      "Compare copper peptides and signal peptides through category positioning, cosmetic sourcing context, documentation expectations, and quote planning.",
    h1: "Copper Peptides vs Signal Peptides: Commercial Category Comparison",
    eyebrow: "Comparison",
    intro:
      "This comparison page helps buyers evaluate two major cosmetic peptide pathways without turning the decision into a thin directory or a claim-driven landing page.",
    sections: [
      {
        title: "Category-level comparison first",
        paragraphs: [
          "Many buyers are not ready to choose a single SKU immediately. They first need to understand the difference between copper-peptide and signal-peptide sourcing workflows, documentation needs, and formulation planning assumptions.",
        ],
      },
    ],
    comparisonTable: {
      columns: ["Copper Peptides", "Signal Peptides"],
      rows: [
        {
          label: "Category example",
          values: ["Carrier-peptide and copper-complex ingredient workflows", "Signal-peptide formulation workflows"],
        },
        {
          label: "Documentation focus",
          values: ["Complex description, appearance, storage, and batch support", "Pack size, appearance, and category-fit support"],
        },
        {
          label: "Buyer questions",
          values: ["Often centered on ingredient positioning and packaging", "Often centered on category breadth and program fit"],
        },
        {
          label: "MOQ planning",
          values: ["Specialty ingredient program review", "Broader formulation or line-extension review"],
        },
        {
          label: "Quote note",
          values: ["Clarify ingredient role and documentation needs", "Clarify product shortlist and formulation direction"],
        },
      ],
    },
    complianceNote: defaultComplianceNote,
    relatedProductSlugs: [
      "copper-tripeptide-1-ghk-cu",
      "palmitoyl-pentapeptide-4-matrixyl",
      "palmitoyl-tripeptide-1",
    ],
    relatedCategorySlugs: ["carrier-peptides", "signal-peptides"],
    relatedArticleSlugs: [
      "copper-peptides-vs-signal-peptides",
      "carrier-peptides-explained",
      "signal-peptides-explained",
    ],
    priorityLinkKeys: ["cosmeticPeptideSupplier", "shop", "requestQuote"],
  },
};

export const glossaryEntries: Record<string, GlossaryEntry> = {
  coa: {
    slug: "coa",
    term: "COA",
    title: "COA Meaning for Peptide Buyers",
    description:
      "Learn what a COA means in Atlas BioLabs buyer workflows and why certificate review matters for documentation-sensitive B2B sourcing.",
    definition:
      "COA stands for Certificate of Analysis. In a B2B peptide sourcing workflow, it is a document used to summarize batch-specific analytical and release information for a referenced lot or batch.",
    buyerWhyItMatters:
      "Commercial buyers often need a COA to support internal procurement review, supplier comparison, or final batch acceptance discussions.",
    documentationContext:
      "A COA should be read together with lot references, product identity context, and any supporting analytical records requested during quote follow-up.",
    commonBuyerQuestions: [
      "Is the COA tied to the correct batch or lot number?",
      "Is the document current, pending, superseded, or revoked?",
      "Which supporting analytical references are available on request?",
    ],
    relatedProductSlugs: ["bpc-157", "retatrutide"],
    relatedCategorySlugs: ["growth-repair-peptides", "trending-emerging-peptides"],
    relatedArticleSlugs: ["how-to-read-peptide-coa", "batch-number-coa-verification"],
  },
  hplc: {
    slug: "hplc",
    term: "HPLC",
    title: "HPLC Meaning for Peptide Documentation",
    description:
      "Understand HPLC in peptide documentation and why buyers encounter it in quality, purity, and commercial review workflows.",
    definition:
      "HPLC refers to high-performance liquid chromatography, an analytical technique commonly referenced in peptide quality documentation.",
    buyerWhyItMatters:
      "Buyers often see HPLC referenced in purity discussions, documentation support, and COA review because it helps frame how a batch result is reported.",
    documentationContext:
      "Atlas BioLabs treats HPLC as documentation context, not as a substitute for broader supplier evaluation, packaging review, or lot-specific commercial communication.",
    commonBuyerQuestions: [
      "Is the HPLC result tied to the same lot on the COA?",
      "What specification was the batch reviewed against?",
      "Is the chromatogram or related record available on request?",
    ],
    relatedProductSlugs: ["bpc-157", "ll-37"],
    relatedCategorySlugs: ["growth-repair-peptides", "antimicrobial-peptides"],
    relatedArticleSlugs: [
      "peptide-purity-hplc-ms-documentation",
      "peptide-testing-terms-commercial-buyers",
    ],
  },
  "mass-spectrometry": {
    slug: "mass-spectrometry",
    term: "Mass Spectrometry",
    title: "Mass Spectrometry in Peptide Supplier Documentation",
    description:
      "Learn why mass spectrometry appears in peptide documentation and what B2B buyers should understand during supplier review.",
    definition:
      "Mass spectrometry is an analytical method often referenced in peptide identity review and supporting documentation workflows.",
    buyerWhyItMatters:
      "Buyers encounter mass-spectrometry references when reviewing how a supplier discusses identity, documentation support, and batch-specific record structure.",
    documentationContext:
      "Atlas BioLabs treats mass-spectrometry references as part of the documentation and verification conversation rather than a standalone purchasing decision.",
    commonBuyerQuestions: [
      "Does the identity record correspond to the batch being quoted?",
      "Is the method referenced in the documentation package?",
      "Should the buyer request supporting records during quote follow-up?",
    ],
    relatedProductSlugs: ["cjc-1295-with-dac", "mots-c"],
    relatedCategorySlugs: ["metabolic-advanced-peptides", "trending-emerging-peptides"],
    relatedArticleSlugs: [
      "peptide-purity-hplc-ms-documentation",
      "how-to-read-peptide-coa",
    ],
  },
  "lyophilized-powder": {
    slug: "lyophilized-powder",
    term: "Lyophilized Powder",
    title: "Lyophilized Powder Meaning for Commercial Buyers",
    description:
      "Understand what lyophilized powder means in peptide sourcing, storage, packaging, and documentation review.",
    definition:
      "Lyophilized powder refers to freeze-dried material presentation commonly referenced in peptide product, storage, and packaging discussions.",
    buyerWhyItMatters:
      "Buyers often need to understand physical form because it affects packaging, storage language, internal handling expectations, and quote requests.",
    documentationContext:
      "Physical-form language should align across the product page, COA, packaging notes, and any supporting records used in the sourcing workflow.",
    commonBuyerQuestions: [
      "Is the product listed as powder, cake, or another presentation?",
      "What storage notes should the buyer request with the batch?",
      "Does the packaging format match the intended procurement plan?",
    ],
    relatedProductSlugs: ["tesamorelin", "bpc-157"],
    relatedCategorySlugs: ["growth-repair-peptides", "metabolic-advanced-peptides"],
    relatedArticleSlugs: [
      "lyophilized-peptide-powder-packaging-documentation",
      "bulk-peptide-supply-moq-lead-time",
    ],
  },
  moq: {
    slug: "moq",
    term: "MOQ",
    title: "MOQ Meaning in Peptide Sourcing",
    description:
      "Learn what MOQ means for peptide buyers and how Atlas BioLabs uses MOQ visibility to support quote-led B2B supply planning.",
    definition:
      "MOQ stands for minimum order quantity. It is the minimum order size a supplier is willing to support for a given product or supply format.",
    buyerWhyItMatters:
      "MOQ affects budgeting, shortlist strategy, pilot ordering, and whether a buyer should request a standard quote or a broader bulk-supply discussion.",
    documentationContext:
      "MOQ should be reviewed alongside pack size, lead time, and documentation expectations so the buyer can prepare a realistic sourcing request.",
    commonBuyerQuestions: [
      "Is the MOQ different for bulk versus vial formats?",
      "Does the MOQ change for repeat orders or multi-SKU requests?",
      "Should documentation requests be included when MOQ is discussed?",
    ],
    relatedProductSlugs: ["retatrutide", "palmitoyl-pentapeptide-4-matrixyl"],
    relatedCategorySlugs: ["trending-emerging-peptides", "signal-peptides"],
    relatedArticleSlugs: ["peptide-moq-explained", "bulk-peptide-supply-moq-lead-time"],
  },
  "batch-number": {
    slug: "batch-number",
    term: "Batch Number",
    title: "Batch Numbers in Peptide Documentation",
    description:
      "Understand why batch numbers matter in peptide sourcing, COA review, and internal procurement documentation.",
    definition:
      "A batch number is a reference used to identify a specific production lot or grouped material record inside documentation and supplier workflows.",
    buyerWhyItMatters:
      "Batch numbers help buyers confirm that a quote, COA, or supporting record refers to the same material being reviewed internally.",
    documentationContext:
      "Batch numbers are especially important when COA verification, packaging notes, and analytical references need to stay aligned across several documents.",
    commonBuyerQuestions: [
      "Does the COA match the quoted batch number?",
      "Are packaging and shipping notes tied to the same batch?",
      "Is the batch number visible in verification or release discussions?",
    ],
    relatedProductSlugs: ["bpc-157", "ll-37"],
    relatedCategorySlugs: ["growth-repair-peptides", "antimicrobial-peptides"],
    relatedArticleSlugs: ["batch-number-coa-verification", "lot-specific-peptide-documentation"],
  },
  "peptide-purity": {
    slug: "peptide-purity",
    term: "Peptide Purity",
    title: "Peptide Purity in Commercial Documentation",
    description:
      "Learn how peptide purity is discussed in Atlas BioLabs documentation context and why it matters for supplier evaluation.",
    definition:
      "Peptide purity is a documentation and analytical concept used to describe how a batch result is reported relative to the supplier's stated specification.",
    buyerWhyItMatters:
      "Purity references often influence internal risk review, supplier comparison, and the buyer's decision to ask for more detailed documentation.",
    documentationContext:
      "Purity should be read with method references, lot identification, and broader documentation support rather than as an isolated marketing claim.",
    commonBuyerQuestions: [
      "What method was used for the purity reference?",
      "What specification is the result compared against?",
      "Is the result batch-specific or general product information?",
    ],
    relatedProductSlugs: ["retatrutide", "bpc-157"],
    relatedCategorySlugs: ["trending-emerging-peptides", "growth-repair-peptides"],
    relatedArticleSlugs: ["peptide-purity-hplc-ms-documentation", "how-to-read-peptide-coa"],
  },
  "lead-time": {
    slug: "lead-time",
    term: "Lead Time",
    title: "Lead Time Meaning for Peptide Buyers",
    description:
      "Understand how lead time fits into Atlas BioLabs quote workflows and why buyers should clarify timing early.",
    definition:
      "Lead time is the estimated time required to prepare and coordinate a commercial order before dispatch.",
    buyerWhyItMatters:
      "Lead time affects procurement planning, launch schedules, bulk orders, documentation review timing, and how buyers compare suppliers.",
    documentationContext:
      "Lead time should be reviewed alongside pack size, MOQ, shipping conditions, and any documentation steps that could influence commercial timing.",
    commonBuyerQuestions: [
      "Does lead time differ by product category or pack format?",
      "Will documentation review affect the timing estimate?",
      "Should recurring buyers discuss future demand windows in the quote?",
    ],
    relatedProductSlugs: ["retatrutide", "tesamorelin"],
    relatedCategorySlugs: ["trending-emerging-peptides", "metabolic-advanced-peptides"],
    relatedArticleSlugs: ["bulk-peptide-supply-moq-lead-time", "quote-based-peptide-ordering"],
  },
  "pack-size": {
    slug: "pack-size",
    term: "Pack Size",
    title: "Pack Size Meaning in Peptide Supply",
    description:
      "Learn how pack size affects commercial peptide sourcing, MOQ planning, documentation review, and quote preparation.",
    definition:
      "Pack size describes the presentation or quantity format in which a product is supplied for commercial review or procurement.",
    buyerWhyItMatters:
      "Pack size influences MOQ, shipping coordination, internal budgeting, and whether a buyer should request a standard or more tailored commercial quote.",
    documentationContext:
      "Pack-size assumptions should stay aligned across the product page, quote request, packaging notes, and documentation workflow.",
    commonBuyerQuestions: [
      "What pack-size options are listed on the main product page?",
      "Do bulk and vial formats change MOQ expectations?",
      "Should the preferred pack size be included in the first quote request?",
    ],
    relatedProductSlugs: ["bpc-157", "acetyl-hexapeptide-8-argireline"],
    relatedCategorySlugs: ["growth-repair-peptides", "neurotransmitter-peptides"],
    relatedArticleSlugs: ["bulk-peptide-supply-moq-lead-time", "peptide-moq-explained"],
  },
  "product-variation": {
    slug: "product-variation",
    term: "Product Variation",
    title: "Product Variations on Atlas BioLabs Product Pages",
    description:
      "Understand how Atlas BioLabs handles product variations like pack sizes without creating duplicate URLs or thin SEO pages.",
    definition:
      "A product variation is a supply-format difference such as pack size, vial size, or commercial presentation that still belongs under one main product page.",
    buyerWhyItMatters:
      "Keeping variations on one page helps buyers compare documentation, MOQ, and supply context without jumping between duplicate or thin URLs.",
    documentationContext:
      "Variations still need clear packaging, pricing-reference, and documentation language, but they should remain tied to one canonical product record whenever possible.",
    commonBuyerQuestions: [
      "Should each pack size have a separate product page?",
      "How does one product page support several supply formats?",
      "Where should variation-specific questions be raised during quote review?",
    ],
    relatedProductSlugs: ["retatrutide", "bpc-157"],
    relatedCategorySlugs: ["trending-emerging-peptides", "growth-repair-peptides"],
    relatedArticleSlugs: ["trustworthy-peptide-product-page", "atlas-biolabs-peptide-catalog-guide"],
  },
};

export const downloadGuides: Record<string, DownloadGuide> = {
  "peptide-supplier-checklist": {
    slug: "peptide-supplier-checklist",
    title: "Peptide Supplier Checklist Download",
    description:
      "Review the peptide supplier checklist landing page and request the resource through Atlas BioLabs if you are preparing a B2B supplier comparison.",
    h1: "Peptide Supplier Checklist for Qualified B2B Buyers",
    intro:
      "This resource is designed for buyers who need a cleaner way to compare peptide suppliers across documentation, MOQ, pack-size, and commercial communication factors.",
    learnItems: [
      "What to compare before asking for a quote",
      "How to review documentation language and batch transparency",
      "Questions to ask about MOQ, pack sizes, and lead time",
      "How to structure a stronger supplier shortlisting process",
    ],
    relatedArticleSlugs: ["peptide-supplier-checklist", "compare-peptide-suppliers"],
    relatedCategorySlugs: ["trending-emerging-peptides", "growth-repair-peptides"],
  },
  "coa-review-checklist": {
    slug: "coa-review-checklist",
    title: "COA Review Checklist Download",
    description:
      "Request the COA review checklist from Atlas BioLabs and prepare better documentation questions before moving into batch-specific review.",
    h1: "COA Review Checklist for Documentation-Sensitive Buyers",
    intro:
      "Use this resource to organize the questions procurement teams and technical reviewers usually ask when evaluating a COA, batch number, and supporting documentation package.",
    learnItems: [
      "How to match batch or lot numbers across documents",
      "What to look for in analytical references and release notes",
      "How to separate general product information from batch-specific records",
      "Which documentation questions belong in quote follow-up",
    ],
    relatedArticleSlugs: ["how-to-read-peptide-coa", "batch-number-coa-verification"],
    relatedCategorySlugs: ["growth-repair-peptides", "metabolic-advanced-peptides"],
  },
  "bulk-peptide-quote-preparation": {
    slug: "bulk-peptide-quote-preparation",
    title: "Bulk Peptide Quote Preparation Download",
    description:
      "Prepare for a bulk peptide quote request with a structured checklist covering MOQ, lead time, packaging, documentation, and supply timing.",
    h1: "Bulk Peptide Quote Preparation Guide",
    intro:
      "This guide helps commercial buyers prepare better bulk peptide quote requests by organizing the variables that most often shape the supplier response.",
    learnItems: [
      "How to define pack size, quantity, and destination clearly",
      "When to discuss documentation and QA expectations",
      "How to frame recurring supply and forecast questions",
      "What to compare across bulk-supply proposals",
    ],
    relatedArticleSlugs: ["bulk-peptide-supply-moq-lead-time", "quote-based-peptide-ordering"],
    relatedCategorySlugs: ["metabolic-advanced-peptides", "trending-emerging-peptides"],
  },
  "cosmetic-peptide-buyer-guide": {
    slug: "cosmetic-peptide-buyer-guide",
    title: "Cosmetic Peptide Buyer Guide Download",
    description:
      "Explore the cosmetic peptide buyer guide landing page and request the resource if your team is comparing ingredient suppliers for formulation work.",
    h1: "Cosmetic Peptide Buyer Guide for Formulation Teams",
    intro:
      "This resource helps formulation teams compare cosmetic peptide categories, documentation expectations, and quote-preparation questions before contacting a supplier.",
    learnItems: [
      "How to compare signal, carrier, and neurotransmitter peptide categories",
      "What documentation matters for ingredient sourcing review",
      "How MOQ and pack-size questions affect formulation planning",
      "What to include in a cosmetic peptide quote request",
    ],
    relatedArticleSlugs: ["cosmetic-peptides-guide", "ghk-cu-copper-peptide-cosmetic-formulation"],
    relatedCategorySlugs: ["signal-peptides", "carrier-peptides", "neurotransmitter-peptides"],
  },
};

export const blogStartHerePage: StaticSeoPage = {
  slug: "start-here",
  path: "/blog/start-here",
  title: "Start Here: Atlas BioLabs Buyer Guide",
  description:
    "Use the Atlas BioLabs start-here guide to browse the catalog, compare categories, understand documentation, and prepare a stronger quote request.",
  h1: "Start Here: How to Use Atlas BioLabs as a Buyer",
  eyebrow: "Blog Start Here",
  intro:
    "This page guides new buyers through the Atlas BioLabs catalog, product categories, documentation system, and quote workflow so the rest of the site becomes easier to use and more commercially useful.",
  sections: [
    {
      title: "1. Browse the catalog",
      paragraphs: [
        "Start with the shop page to see the full product index, compare visible product cards, and open the products most relevant to your category or sourcing objective.",
      ],
    },
    {
      title: "2. Understand the categories",
      paragraphs: [
        "Use category pages to compare products within one peptide class, read category-level buyer guidance, and move into the products that match your commercial context best.",
      ],
    },
    {
      title: "3. Read the documentation guides",
      paragraphs: [
        "Before requesting a quote, review the documentation, COA, HPLC, batch-number, and quality-related pages so your internal team is aligned on what needs to be discussed.",
      ],
    },
    {
      title: "4. Prepare the quote request",
      paragraphs: [
        "A strong quote request should explain the target products, quantity, destination market, desired pack sizes, and any documentation expectations that matter to your team.",
      ],
    },
    {
      title: "5. Compare MOQ, pack sizes, lead time, and documentation together",
      paragraphs: [
        "Those variables work best when reviewed together. Atlas BioLabs structures the catalog and resource pages so buyers can compare them without relying on filters or generic forms alone.",
      ],
    },
    {
      title: "6. Use Atlas BioLabs as a B2B workflow, not just a catalog",
      paragraphs: [
        "The goal is to help qualified B2B buyers move from product discovery into better internal review and clearer commercial follow-up.",
      ],
    },
  ],
  complianceNote: defaultComplianceNote,
  relatedProductSlugs: ["bpc-157", "retatrutide", "copper-tripeptide-1-ghk-cu"],
  relatedCategorySlugs: [
    "growth-repair-peptides",
    "trending-emerging-peptides",
    "carrier-peptides",
  ],
  relatedArticleSlugs: [
    "atlas-biolabs-peptide-catalog-guide",
    "peptide-supplier-checklist",
    "how-to-read-peptide-coa",
  ],
  priorityLinkKeys: [
    "shop",
    "requestQuote",
    "peptideDocumentation",
    "qualityAssurance",
  ],
};

export function getPriorityLinks(keys: PriorityInternalLinkKey[] = []) {
  return keys.map((key) => priorityInternalLinks[key]);
}

export function resolveProductLinks(slugs: string[] = []): SeoResourceLink[] {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => product !== undefined)
    .map((product) => ({
      title: product.name,
      href: `/shop/${product.slug}`,
      description: product.shortDescription,
      eyebrow: "Product",
    }));
}

export function resolveCategoryLinks(
  ids: ProductCategoryId[] = []
): SeoResourceLink[] {
  return ids
    .map((id) => productCategories.find((category) => category.id === id))
    .filter(
      (category): category is (typeof productCategories)[number] =>
        category !== undefined
    )
    .map((category) => ({
      title: category.label,
      href: `/categories/${category.id}`,
      description: `${category.description} product listings with buyer guidance, product comparisons, and direct links into related product pages.`,
      eyebrow: "Category",
    }));
}

export function resolveArticleLinks(slugs: string[] = []): SeoResourceLink[] {
  return slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is NonNullable<ReturnType<typeof getBlogPostBySlug>> => post !== undefined)
    .map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      description: post.excerpt ?? post.description,
      eyebrow: "Buyer Guide",
    }));
}

export function getComparisonBreadcrumbs(page: StaticSeoPage): BreadcrumbItem[] {
  return [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    { name: page.h1, path: page.path },
  ];
}

export function getGlossaryBreadcrumbs(entry: GlossaryEntry): BreadcrumbItem[] {
  return [
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
    { name: entry.term, path: `/glossary/${entry.slug}` },
  ];
}

export function getDownloadBreadcrumbs(guide: DownloadGuide): BreadcrumbItem[] {
  return [
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads" },
    { name: guide.h1, path: `/downloads/${guide.slug}` },
  ];
}

export function getTopLevelBreadcrumbs(page: StaticSeoPage): BreadcrumbItem[] {
  return [
    { name: "Home", path: "/" },
    { name: page.h1, path: page.path },
  ];
}

export function getStaticPageResourcePanels(page: StaticSeoPage) {
  const panels = [];

  const buyerLinks = [
    ...getPriorityLinks(page.priorityLinkKeys),
    ...(page.customLinks ?? []),
  ];

  if (buyerLinks.length > 0) {
    panels.push({
      eyebrow: "Buyer Resources",
      title: "Useful Next Steps for Commercial Review",
      description:
        "Use these pages to move from reading into product comparison, documentation review, and quote-led sourcing follow-up.",
      links: buyerLinks,
    });
  }

  const productLinks = resolveProductLinks(page.relatedProductSlugs);
  if (productLinks.length > 0) {
    panels.push({
      eyebrow: "Related Products",
      title: "Product Pages Connected to This Topic",
      description:
        "These product pages give the topic a direct catalog path with pricing references, MOQ visibility, and documentation support notes.",
      links: productLinks,
    });
  }

  const categoryLinks = resolveCategoryLinks(page.relatedCategorySlugs);
  if (categoryLinks.length > 0) {
    panels.push({
      eyebrow: "Related Categories",
      title: "Category Pages Worth Reviewing Next",
      description:
        "These category hubs help buyers compare adjacent products without relying on filter-only URLs or disconnected product mentions.",
      links: categoryLinks,
    });
  }

  const articleLinks = resolveArticleLinks(page.relatedArticleSlugs);
  if (articleLinks.length > 0) {
    panels.push({
      eyebrow: "Related Articles",
      title: "Buyer Guides That Add More Context",
      description:
        "These articles expand on documentation, supplier evaluation, MOQ planning, or category comparisons that support the same buying workflow.",
      links: articleLinks,
    });
  }

  return panels;
}

export function getProductSupportLinks(categoryId: ProductCategoryId) {
  const category = productCategories.find((entry) => entry.id === categoryId);
  const landingByCategory: Record<ProductCategoryId, PriorityInternalLinkKey[]> = {
    "signal-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "carrier-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "neurotransmitter-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "enzyme-inhibitor-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "antimicrobial-peptides": ["researchPeptideSupplier", "peptideDocumentation"],
    "growth-repair-peptides": ["researchPeptideSupplier", "wholesalePeptides"],
    "metabolic-advanced-peptides": ["wholesalePeptides", "researchPeptideSupplier"],
    "trending-emerging-peptides": ["wholesalePeptides", "customPeptideSourcing"],
  };

  const links = [
    category
      ? {
          title: category.label,
          href: `/categories/${category.id}`,
          description:
            "Return to the category hub for a broader comparison across related products in the same class.",
          eyebrow: "Category",
        }
      : null,
    ...getPriorityLinks(["requestQuote", "peptideDocumentation", "qualityAssurance"]),
    ...getPriorityLinks(landingByCategory[categoryId]),
  ].filter((link): link is SeoResourceLink => link !== null);

  return links.slice(0, 6);
}

export function getCategorySupportLinks(categoryId: ProductCategoryId) {
  const landingByCategory: Record<ProductCategoryId, PriorityInternalLinkKey[]> = {
    "signal-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "carrier-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "neurotransmitter-peptides": ["cosmeticPeptideSupplier", "peptideDocumentation"],
    "enzyme-inhibitor-peptides": ["cosmeticPeptideSupplier", "researchPeptideSupplier"],
    "antimicrobial-peptides": ["researchPeptideSupplier", "peptideDocumentation"],
    "growth-repair-peptides": ["researchPeptideSupplier", "wholesalePeptides"],
    "metabolic-advanced-peptides": ["wholesalePeptides", "peptideDocumentation"],
    "trending-emerging-peptides": ["wholesalePeptides", "customPeptideSourcing"],
  };

  return [
    ...getPriorityLinks(landingByCategory[categoryId]),
    priorityInternalLinks.requestQuote,
  ];
}

export function getBlogSupportLinks(
  categorySlug?: string | null
): SeoResourceLink[] {
  const landingByBlogCategory: Record<string, PriorityInternalLinkKey> = {
    "peptide-sourcing": "researchPeptideSupplier",
    "quality-documentation": "peptideDocumentation",
    "peptide-pricing": "wholesalePeptides",
    "cosmetic-peptides": "cosmeticPeptideSupplier",
    "trending-peptides": "wholesalePeptides",
    compliance: "peptideDocumentation",
    "wholesale-supply": "wholesalePeptides",
    "custom-peptides": "customPeptideSourcing",
  };

  const selected = categorySlug ? landingByBlogCategory[categorySlug] : undefined;

  return [
    priorityInternalLinks.shop,
    priorityInternalLinks.requestQuote,
    priorityInternalLinks.peptideDocumentation,
    ...(selected ? [priorityInternalLinks[selected]] : []),
  ];
}
