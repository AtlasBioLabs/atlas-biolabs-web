import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = "https://www.atlasbiolabs.co";
const outputDir = join(process.cwd(), "content", "blog");

const products = {
  argireline: ["Acetyl Hexapeptide-8 (Argireline)", "acetyl-hexapeptide-8-argireline"],
  bpc157: ["BPC-157", "bpc-157"],
  cagrilintide: ["Cagrilintide", "cagrilintide"],
  cagrisema: ["CagriSema", "cagrisema"],
  copperPeptide: ["Copper Peptide GHK", "copper-peptide-ghk"],
  ghkCu: ["Copper Tripeptide-1 (GHK-Cu)", "copper-tripeptide-1-ghk-cu"],
  klow: ["KLOW / Glow Blend", "klow-glow-blend"],
  ll37: ["LL-37", "ll-37"],
  matrixyl: ["Palmitoyl Pentapeptide-4 (Matrixyl)", "palmitoyl-pentapeptide-4-matrixyl"],
  motsc: ["MOTS-c", "mots-c"],
  nonapeptide: ["Nonapeptide-1", "nonapeptide-1-melanostatine"],
  palmitoylTripeptide1: ["Palmitoyl Tripeptide-1", "palmitoyl-tripeptide-1"],
  palmitoylTetrapeptide7: ["Palmitoyl Tetrapeptide-7", "palmitoyl-tetrapeptide-7"],
  retatrutide: ["Retatrutide", "retatrutide"],
  semaglutide: ["Semaglutide", "semaglutide-demo-trending"],
  snap8: ["Acetyl Octapeptide-3 (SNAP-8)", "acetyl-octapeptide-3-snap-8"],
  synAke: [
    "Dipeptide Diaminobutyroyl Benzylamide Diacetate (Syn-Ake)",
    "dipeptide-diaminobutyroyl-benzylamide-diacetate-syn-ake",
  ],
  tb500: ["TB-500", "tb-500-thymosin-beta-4-fragment"],
  tesamorelin: ["Tesamorelin", "tesamorelin"],
  tirzepatide: ["Tirzepatide", "tirzepatide-demo-trending"],
};

const categories = {
  antimicrobial: ["Antimicrobial Peptides", "antimicrobial-peptides"],
  carrier: ["Carrier Peptides", "carrier-peptides"],
  enzyme: ["Enzyme Inhibitor Peptides", "enzyme-inhibitor-peptides"],
  growth: ["Growth and Repair Peptides", "growth-repair-peptides"],
  metabolic: ["Metabolic and Advanced Peptides", "metabolic-advanced-peptides"],
  neurotransmitter: ["Neurotransmitter Peptides", "neurotransmitter-peptides"],
  signal: ["Signal Peptides", "signal-peptides"],
  trending: ["Trending and Emerging Peptides", "trending-emerging-peptides"],
};

const imageByCategory = {
  "peptide-sourcing": "/blog/peptide-supplier-guide.svg",
  "quality-documentation": "/blog/peptide-quality.svg",
  "peptide-pricing": "/blog/peptide-pricing.svg",
  "cosmetic-peptides": "/blog/types-of-peptides.svg",
  "trending-peptides": "/blog/top-peptides.svg",
  compliance: "/blog/peptide-regulation.svg",
  "wholesale-supply": "/blog/supply-chain.svg",
  "custom-peptides": "/blog/custom-peptides.svg",
};

const categoryLabel = {
  "peptide-sourcing": "Peptide Sourcing",
  "quality-documentation": "Quality Documentation",
  "peptide-pricing": "Peptide Pricing",
  "cosmetic-peptides": "Cosmetic Peptides",
  "trending-peptides": "Trending Peptides",
  compliance: "Compliance",
  "wholesale-supply": "Wholesale Supply",
  "custom-peptides": "Custom Peptides",
};

const posts = [
  {
    title: "Retatrutide Peptide: Commercial Sourcing, Documentation, and Market Interest Explained",
    slug: "retatrutide-peptide-commercial-sourcing",
    category: "trending-peptides",
    products: ["retatrutide", "semaglutide", "tirzepatide"],
    categories: ["trending", "metabolic"],
    guide: "retatrutide-quote-buyer-guide",
    angle: "how buyers evaluate a newer metabolic research peptide before requesting price, MOQ, and documentation support",
  },
  {
    title: "Why Retatrutide Is One of the Most Watched Research Peptides in 2026",
    slug: "why-retatrutide-is-watched-in-2026",
    category: "trending-peptides",
    products: ["retatrutide", "cagrilintide", "cagrisema"],
    categories: ["trending", "metabolic"],
    guide: "trending-emerging-peptides-2026",
    angle: "why commercial catalog teams are watching triple-agonist research conversations while keeping claims and supply language disciplined",
  },
  {
    title: "Retatrutide vs Semaglutide vs Tirzepatide: Research and Supply Context for Buyers",
    slug: "retatrutide-vs-semaglutide-vs-tirzepatide",
    category: "trending-peptides",
    products: ["retatrutide", "semaglutide", "tirzepatide"],
    categories: ["metabolic", "trending"],
    guide: "triple-agonist-peptides-explained",
    angle: "how buyers compare GLP-1, dual-agonist, and triple-agonist sourcing conversations without creating duplicate product URLs",
  },
  {
    title: "Triple Agonist Peptides Explained: GIP, GLP-1, and Glucagon Research Context",
    slug: "triple-agonist-peptides-explained",
    category: "trending-peptides",
    products: ["retatrutide", "survodutide", "mazdutide"],
    categories: ["metabolic", "trending"],
    guide: "metabolic-peptides-glp1-triple-agonist",
    angle: "how multi-receptor peptide discussions affect quote planning, documentation review, and catalog positioning",
  },
  {
    title: "What Buyers Should Know Before Requesting a Retatrutide Quote",
    slug: "retatrutide-quote-buyer-guide",
    category: "peptide-sourcing",
    products: ["retatrutide", "semaglutide", "tirzepatide"],
    categories: ["trending", "metabolic"],
    guide: "quote-based-peptide-ordering",
    angle: "the product, quantity, documentation, and destination details that make a quote request easier to price and support",
  },
  {
    title: "KLOW Peptide Blend Explained: BPC-157, TB-500, GHK-Cu, and KPV Sourcing Context",
    slug: "klow-peptide-blend-sourcing-context",
    category: "trending-peptides",
    products: ["klow", "bpc157", "ghkCu", "tb500"],
    categories: ["trending", "growth"],
    guide: "klow-vs-glow-peptide-blends",
    angle: "how blend-led sourcing should connect component records, batch documentation, and formulation review",
  },
  {
    title: "Glow Peptide Blend Explained: BPC-157, TB-500, and GHK-Cu in Research Supply",
    slug: "glow-peptide-blend-sourcing-context",
    category: "trending-peptides",
    products: ["klow", "bpc157", "tb500", "ghkCu"],
    categories: ["trending", "carrier"],
    guide: "klow-vs-glow-peptide-blends",
    angle: "why buyers ask for component-level transparency before building a blend-oriented sourcing plan",
  },
  {
    title: "KLOW vs Glow Peptide Blends: Commercial Formulation and Documentation Differences",
    slug: "klow-vs-glow-peptide-blends",
    category: "trending-peptides",
    products: ["klow", "bpc157", "ghkCu", "tb500"],
    categories: ["trending", "growth"],
    guide: "bpc-157-and-tb-500-research-context",
    angle: "how naming, component ratios, and documentation expectations shape blend conversations for qualified buyers",
  },
  {
    title: "GHK-Cu Peptide: Why Copper Peptides Are Trending in Cosmetic Formulation",
    slug: "ghk-cu-copper-peptide-cosmetic-formulation",
    category: "cosmetic-peptides",
    products: ["ghkCu", "copperPeptide", "matrixyl"],
    categories: ["carrier", "signal"],
    guide: "carrier-peptides-ghk-cu-supply-context",
    angle: "why copper peptide sourcing is often discussed with cosmetic formulation, ingredient documentation, and color/appearance expectations",
  },
  {
    title: "BPC-157 and TB-500: Why These Peptides Are Often Discussed Together",
    slug: "bpc-157-and-tb-500-research-context",
    category: "trending-peptides",
    products: ["bpc157", "tb500", "kpv"],
    categories: ["growth", "trending"],
    guide: "growth-peptides-explained",
    angle: "how repair-focused research conversations turn into practical sourcing and documentation questions",
  },
  {
    title: "Cosmetic Peptides Guide: Matrixyl, Argireline, GHK-Cu, Snap-8, and Syn-Ake",
    slug: "cosmetic-peptides-guide",
    category: "cosmetic-peptides",
    products: ["matrixyl", "argireline", "ghkCu", "snap8"],
    categories: ["signal", "carrier"],
    guide: "signal-peptides-explained",
    angle: "how formulation teams compare major cosmetic peptide families before requesting samples, bulk packs, or private-label support",
  },
  {
    title: "Matrixyl Peptide Supplier Guide: What Formulators Should Know",
    slug: "matrixyl-peptide-supplier-guide",
    category: "cosmetic-peptides",
    products: ["matrixyl", "palmitoylTripeptide1", "palmitoylTetrapeptide7"],
    categories: ["signal", "carrier"],
    guide: "matrixyl-3000-palmitoyl-tripeptide-tetrapeptide",
    angle: "what cosmetic formulators should confirm around sequence naming, purity records, MOQ, and ingredient documentation",
  },
  {
    title: "Argireline Peptide Explained for Cosmetic Formulation Buyers",
    slug: "argireline-peptide-cosmetic-formulation",
    category: "cosmetic-peptides",
    products: ["argireline", "snap8", "synAke"],
    categories: ["neurotransmitter", "signal"],
    guide: "neurotransmitter-peptides-explained",
    angle: "how expression-line peptide conversations translate into sourcing language for cosmetic ingredient buyers",
  },
  {
    title: "Snap-8 Peptide vs Argireline: Cosmetic Peptide Comparison",
    slug: "snap-8-vs-argireline",
    category: "cosmetic-peptides",
    products: ["snap8", "argireline", "synAke"],
    categories: ["neurotransmitter", "signal"],
    guide: "argireline-peptide-cosmetic-formulation",
    angle: "how formulators compare closely related cosmetic peptides while keeping documentation and commercial availability clear",
  },
  {
    title: "Syn-Ake Peptide: Sourcing Context for Cosmetic and Skincare Formulators",
    slug: "syn-ake-peptide-sourcing-context",
    category: "cosmetic-peptides",
    products: ["synAke", "argireline", "snap8"],
    categories: ["neurotransmitter", "signal"],
    guide: "snap-8-vs-argireline",
    angle: "how a specialty cosmetic peptide should be reviewed for naming, documentation, MOQ, and private-label readiness",
  },
  {
    title: "Palmitoyl Tripeptide-1 and Palmitoyl Tetrapeptide-7: Matrixyl 3000 Explained",
    slug: "matrixyl-3000-palmitoyl-tripeptide-tetrapeptide",
    category: "cosmetic-peptides",
    products: ["palmitoylTripeptide1", "palmitoylTetrapeptide7", "matrixyl"],
    categories: ["signal", "carrier"],
    guide: "matrixyl-peptide-supplier-guide",
    angle: "why component-level naming matters when buyers compare Matrixyl, Matrixyl 3000, and adjacent signal peptide sourcing options",
  },
  {
    title: "Copper Peptides vs Signal Peptides: What Cosmetic Buyers Should Know",
    slug: "copper-peptides-vs-signal-peptides",
    category: "cosmetic-peptides",
    products: ["ghkCu", "copperPeptide", "matrixyl"],
    categories: ["carrier", "signal"],
    guide: "carrier-peptides-explained",
    angle: "how carrier peptide and signal peptide categories differ in formulation positioning, appearance expectations, and documentation review",
  },
  {
    title: "Peptide Serums and Formulation Trends: What Ingredient Buyers Are Watching in 2026",
    slug: "peptide-serums-formulation-trends-2026",
    category: "cosmetic-peptides",
    products: ["matrixyl", "argireline", "ghkCu", "nonapeptide"],
    categories: ["signal", "carrier"],
    guide: "cosmetic-peptides-guide",
    angle: "what ingredient buyers are tracking across cosmetic peptide systems, private-label planning, and documentation-backed sourcing",
  },
  {
    title: "Anti-Aging Peptides in Skincare: Commercial Ingredient Sourcing Guide",
    slug: "anti-aging-peptides-skincare-sourcing-guide",
    category: "cosmetic-peptides",
    products: ["matrixyl", "argireline", "snap8", "ghkCu"],
    categories: ["signal", "neurotransmitter"],
    guide: "cosmetic-peptides-guide",
    angle: "how anti-aging skincare positioning can stay commercial, ingredient-focused, and documentation-led",
  },
  {
    title: "Carrier Peptides Explained: GHK-Cu and Copper Peptide Supply Context",
    slug: "carrier-peptides-ghk-cu-supply-context",
    category: "cosmetic-peptides",
    products: ["ghkCu", "copperPeptide", "manganese"],
    categories: ["carrier", "signal"],
    guide: "copper-peptides-vs-signal-peptides",
    angle: "how carrier peptide sourcing connects ingredient appearance, trace documentation, and formulation-led buyer questions",
  },
  {
    title: "How to Read a Peptide COA Before Placing a B2B Order",
    slug: "how-to-read-peptide-coa",
    category: "quality-documentation",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "trending"],
    guide: "batch-number-coa-verification",
    angle: "how buyers can read identity, purity, water content, and document scope before moving into quote follow-up",
  },
  {
    title: "Peptide Purity Explained: HPLC, MS, Appearance, and Batch Documentation",
    slug: "peptide-purity-hplc-ms-documentation",
    category: "quality-documentation",
    products: ["bpc157", "ll37", "retatrutide"],
    categories: ["growth", "antimicrobial"],
    guide: "how-to-read-peptide-coa",
    angle: "how analytical references support sourcing decisions without turning a product page into a lab report",
  },
  {
    title: "What a Professional Peptide Supplier Should Provide Before Shipment",
    slug: "professional-peptide-supplier-before-shipment",
    category: "quality-documentation",
    products: ["cjc1295", "bpc157", "retatrutide"],
    categories: ["growth", "metabolic"],
    guide: "peptide-supplier-checklist",
    angle: "the pre-shipment documentation, packaging, and communication checkpoints buyers should expect from a serious supplier",
  },
  {
    title: "Batch Numbers, COA Verification, and Documentation Transparency Explained",
    slug: "batch-number-coa-verification",
    category: "quality-documentation",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "carrier"],
    guide: "how-to-read-peptide-coa",
    angle: "why batch numbers, COA status, and verification URLs matter for documentation review",
  },
  {
    title: "Why Peptide Buyers Should Ask for Lot-Specific Documentation",
    slug: "lot-specific-peptide-documentation",
    category: "quality-documentation",
    products: ["bpc157", "tb500", "retatrutide"],
    categories: ["growth", "trending"],
    guide: "batch-number-coa-verification",
    angle: "how lot-specific documentation reduces ambiguity between catalog-level copy and final batch records",
  },
  {
    title: "Peptide Testing Terms Explained for Commercial Buyers",
    slug: "peptide-testing-terms-commercial-buyers",
    category: "quality-documentation",
    products: ["bpc157", "ghkCu", "retatrutide"],
    categories: ["growth", "carrier"],
    guide: "peptide-purity-hplc-ms-documentation",
    angle: "a practical vocabulary guide for buyers reviewing HPLC, MS, appearance, residual solvent, and batch release language",
  },
  {
    title: "Lyophilized Peptide Powder: Storage, Packaging, and Documentation Context",
    slug: "lyophilized-peptide-powder-packaging-documentation",
    category: "quality-documentation",
    products: ["bpc157", "tb500", "cjc1295"],
    categories: ["growth", "signal"],
    guide: "professional-peptide-supplier-before-shipment",
    angle: "how storage, packaging, and document scope shape practical peptide supply planning",
  },
  {
    title: "Peptide MOQ Explained: How Minimum Order Quantities Work",
    slug: "peptide-moq-explained",
    category: "peptide-pricing",
    products: ["retatrutide", "bpc157", "matrixyl"],
    categories: ["trending", "signal"],
    guide: "bulk-peptide-supply-moq-lead-time",
    angle: "how MOQ connects synthesis economics, packaging choices, documentation needs, and quote-led supply",
  },
  {
    title: "How Atlas BioLabs Supports Documentation-Ready Peptide Sourcing",
    slug: "documentation-ready-peptide-sourcing",
    category: "peptide-sourcing",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "trending"],
    guide: "peptide-supplier-checklist",
    angle: "how Atlas BioLabs connects catalog review, documentation support, batch transparency, and buyer follow-up",
  },
  {
    title: "Peptide Supplier Checklist: 15 Things to Confirm Before Ordering",
    slug: "peptide-supplier-checklist",
    category: "peptide-sourcing",
    products: ["bpc157", "retatrutide", "matrixyl"],
    categories: ["growth", "signal"],
    guide: "compare-peptide-suppliers",
    angle: "the practical supplier checkpoints that help procurement teams compare products, documentation, MOQ, and support",
  },
  {
    title: "How to Source Peptides Wholesale Without Guesswork",
    slug: "source-peptides-wholesale",
    category: "wholesale-supply",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "trending"],
    guide: "bulk-peptide-supply-moq-lead-time",
    angle: "how wholesale buyers can move from product interest to batch-ready procurement with fewer open questions",
  },
  {
    title: "Peptide Supplier vs Peptide Marketplace: What B2B Buyers Should Know",
    slug: "peptide-supplier-vs-marketplace",
    category: "peptide-sourcing",
    products: ["bpc157", "retatrutide", "matrixyl"],
    categories: ["growth", "signal"],
    guide: "compare-peptide-suppliers",
    angle: "why a quote-led supplier relationship can be different from browsing anonymous marketplace listings",
  },
  {
    title: "Custom Peptide Sourcing: How Quote-Led Supply Works",
    slug: "custom-peptide-sourcing-quote-led-supply",
    category: "custom-peptides",
    products: ["cjc1295", "ipamorelin", "motsc"],
    categories: ["growth", "trending"],
    guide: "research-peptide-supply-chain",
    angle: "how custom sequence review, feasibility, MOQ, and documentation expectations come together in a quote-led workflow",
  },
  {
    title: "Bulk Peptide Supply: MOQ, Lead Time, Packaging, and Documentation",
    slug: "bulk-peptide-supply-moq-lead-time",
    category: "wholesale-supply",
    products: ["bpc157", "retatrutide", "matrixyl"],
    categories: ["growth", "signal"],
    guide: "peptide-moq-explained",
    angle: "how bulk supply decisions depend on MOQ, production timing, package format, and batch record expectations",
  },
  {
    title: "How to Compare Peptide Suppliers for Commercial Sourcing",
    slug: "compare-peptide-suppliers",
    category: "peptide-sourcing",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "carrier"],
    guide: "peptide-supplier-checklist",
    angle: "how buyers can compare supplier fit beyond price by reviewing communication, documentation, and repeatability",
  },
  {
    title: "What Makes a Peptide Product Page Trustworthy?",
    slug: "trustworthy-peptide-product-page",
    category: "compliance",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "trending"],
    guide: "peptide-supplier-checklist",
    angle: "why strong product pages show category context, SKU details, documentation scope, and quote paths without unsupported claims",
  },
  {
    title: "Peptide Catalog Guide: How to Navigate Atlas BioLabs Products",
    slug: "atlas-biolabs-peptide-catalog-guide",
    category: "peptide-sourcing",
    products: ["bpc157", "retatrutide", "matrixyl"],
    categories: ["signal", "trending"],
    guide: "source-peptides-wholesale",
    angle: "how buyers can use categories, product pages, and blog guides together before requesting a quote",
  },
  {
    title: "Research Peptide Supply Chain: From Request to Documentation",
    slug: "research-peptide-supply-chain",
    category: "wholesale-supply",
    products: ["bpc157", "retatrutide", "cjc1295"],
    categories: ["growth", "metabolic"],
    guide: "professional-peptide-supplier-before-shipment",
    angle: "how a sourcing request moves through quote review, production coordination, documentation, and dispatch planning",
  },
  {
    title: "How Quote-Based Peptide Ordering Works for B2B Buyers",
    slug: "quote-based-peptide-ordering",
    category: "peptide-sourcing",
    products: ["bpc157", "retatrutide", "ghkCu"],
    categories: ["growth", "trending"],
    guide: "peptide-moq-explained",
    angle: "why quote-led ordering is useful when products vary by pack size, destination, documentation, and supply timing",
  },
  {
    title: "Peptide Sourcing Mistakes Buyers Should Avoid",
    slug: "peptide-sourcing-mistakes",
    category: "compliance",
    products: ["bpc157", "retatrutide", "matrixyl"],
    categories: ["growth", "signal"],
    guide: "peptide-supplier-checklist",
    angle: "common commercial sourcing mistakes around vague specifications, missing documentation, unclear MOQ, and unsupported claims",
  },
  {
    title: "Signal Peptides Explained: Cosmetic and Formulation Supply Context",
    slug: "signal-peptides-explained",
    category: "cosmetic-peptides",
    products: ["matrixyl", "palmitoylTripeptide1", "palmitoylTetrapeptide7"],
    categories: ["signal", "carrier"],
    guide: "cosmetic-peptides-guide",
    angle: "how signal peptides are positioned in cosmetic formulation conversations and buyer documentation workflows",
  },
  {
    title: "Carrier Peptides Explained: Copper Peptides and Commercial Applications",
    slug: "carrier-peptides-explained",
    category: "cosmetic-peptides",
    products: ["ghkCu", "copperPeptide", "matrixyl"],
    categories: ["carrier", "signal"],
    guide: "carrier-peptides-ghk-cu-supply-context",
    angle: "how carrier peptide supply discussions connect mineral-associated peptides, ingredient review, and commercial formulation planning",
  },
  {
    title: "Neurotransmitter Peptides Explained: Argireline, Snap-8, and Syn-Ake",
    slug: "neurotransmitter-peptides-explained",
    category: "cosmetic-peptides",
    products: ["argireline", "snap8", "synAke"],
    categories: ["neurotransmitter", "signal"],
    guide: "snap-8-vs-argireline",
    angle: "how neurotransmitter-style cosmetic peptide categories are compared for ingredient positioning and sourcing",
  },
  {
    title: "Growth Peptides Explained: BPC-157, TB-500, and Research Buyer Interest",
    slug: "growth-peptides-explained",
    category: "trending-peptides",
    products: ["bpc157", "tb500", "tesamorelin"],
    categories: ["growth", "trending"],
    guide: "bpc-157-and-tb-500-research-context",
    angle: "how growth and repair category interest becomes a sourcing conversation around MOQ, documentation, and quote readiness",
  },
  {
    title: "Metabolic Peptides Explained: GLP-1 and Triple Agonist Research Context",
    slug: "metabolic-peptides-glp1-triple-agonist",
    category: "trending-peptides",
    products: ["retatrutide", "semaglutide", "tirzepatide"],
    categories: ["metabolic", "trending"],
    guide: "triple-agonist-peptides-explained",
    angle: "how metabolic peptide categories are discussed in research-aware supply conversations without product-level medical promises",
  },
  {
    title: "Enzyme Inhibitor Peptides Explained for Research Buyers",
    slug: "enzyme-inhibitor-peptides-explained",
    category: "cosmetic-peptides",
    products: ["nonapeptide", "oligopeptide68", "decapeptide12"],
    categories: ["enzyme", "signal"],
    guide: "cosmetic-peptides-guide",
    angle: "how enzyme inhibitor peptide discussions intersect with tone-focused cosmetic ingredient sourcing and documentation review",
  },
  {
    title: "Antimicrobial Peptides: Research Supply and Documentation Context",
    slug: "antimicrobial-peptides-research-supply",
    category: "peptide-sourcing",
    products: ["ll37", "defensin", "pexiganan"],
    categories: ["antimicrobial", "growth"],
    guide: "peptide-testing-terms-commercial-buyers",
    angle: "how antimicrobial peptide supply should be framed around research context, batch documentation, and careful commercial language",
  },
  {
    title: "Trending and Emerging Peptides to Watch in 2026",
    slug: "trending-emerging-peptides-2026",
    category: "trending-peptides",
    products: ["retatrutide", "klow", "cagrilintide", "motsc"],
    categories: ["trending", "metabolic"],
    guide: "retatrutide-peptide-commercial-sourcing",
    angle: "which newer catalog items buyers are asking about and how to evaluate them through sourcing, documentation, and status visibility",
  },
];

const extraProductMap = {
  ara290: ["ARA-290", "ara-290"],
  cjc1295: ["CJC-1295", "cjc-1295-with-dac"],
  decapeptide12: ["Decapeptide-12", "decapeptide-12"],
  defensin: ["Defensin Peptide", "defensin-peptide"],
  ipamorelin: ["Ipamorelin", "ipamorelin"],
  kpv: ["KPV Peptide", "kpv-peptide"],
  manganese: ["Manganese Tripeptide-1", "manganese-tripeptide-1"],
  oligopeptide68: ["Oligopeptide-68", "oligopeptide-68"],
  pexiganan: ["Pexiganan", "pexiganan"],
  survodutide: ["Survodutide", "survodutide"],
  mazdutide: ["Mazdutide", "mazdutide"],
};

Object.assign(products, extraProductMap);

function yamlList(values) {
  return values.map((value) => `  - "${value.replaceAll('"', '\\"')}"`).join("\n");
}

function linkProduct(productKey) {
  const [name, slug] = products[productKey];
  return `[${name}](/shop/${slug})`;
}

function linkCategory(categoryKey) {
  const [name, slug] = categories[categoryKey];
  return `[${name}](/categories/${slug})`;
}

function productSlugs(productKeys) {
  return productKeys.map((key) => products[key][1]);
}

function categorySlugs(categoryKeys) {
  return categoryKeys.map((key) => categories[key][1]);
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function dateForIndex(index) {
  const start = new Date("2025-01-08T00:00:00.000Z");
  const next = new Date(start);
  next.setUTCDate(start.getUTCDate() + index * 10 + ((index * 7) % 5));
  return formatDate(next);
}

function updatedForIndex(index, publishedDate) {
  const start = new Date("2026-01-12T00:00:00.000Z");
  const next = new Date(start);
  next.setUTCDate(start.getUTCDate() + index * 2);
  const max = new Date("2026-05-20T00:00:00.000Z");
  const published = new Date(`${publishedDate}T00:00:00.000Z`);
  const minimumUpdated = new Date(published);
  minimumUpdated.setUTCDate(published.getUTCDate() + 3);
  const updated = next > minimumUpdated ? next : minimumUpdated;

  return formatDate(updated > max ? max : updated);
}

function descriptionFor(post) {
  const topic = post.title.split(":")[0].replace(/\?$/, "");
  const shortTopic = topic.length > 72 ? `${topic.slice(0, 69).trim()}...` : topic;

  return `Review ${shortTopic} for B2B peptide sourcing, documentation support, MOQ planning, batch transparency, and quote-led Atlas BioLabs supply.`;
}

function bodyFor(post) {
  const linkedProducts = post.products.map(linkProduct);
  const linkedCategories = post.categories.map(linkCategory);
  const primaryProducts = linkedProducts.slice(0, 3).join(", ");
  const primaryCategories = linkedCategories.join(" and ");
  const categoryName = categoryLabel[post.category];
  const relatedGuide = `[related sourcing guide](/blog/${post.guide})`;

  return `Atlas BioLabs created this guide for qualified B2B buyers who want a clearer commercial view of ${post.angle}. The goal is not to provide medical, dosage, diagnostic, veterinary, or personal-use guidance. It is to help procurement and formulation teams understand how product pages, documentation, MOQ, batch transparency, and quote-led supply fit together.

## Why buyers are watching this topic

Commercial interest usually grows when a peptide or peptide category appears in more research context, formulation discussion, or catalog-development planning. That does not make every product interchangeable, and it does not replace batch-specific review. It simply means buyers need a more organized way to compare product identity, requested pack size, lead time, documentation scope, and the supplier workflow behind the quote.

For this topic, buyers often start by reviewing ${primaryProducts}. Category context also matters, especially when comparing ${primaryCategories}. Those pages keep the product and category URLs stable, which gives search engines and procurement teams one canonical place to evaluate the sourcing context.

## Commercial sourcing questions to clarify

Before requesting a quote, buyers should be ready to share intended commercial context, target quantity, packaging preference, destination market, and documentation expectations. Atlas BioLabs can then align MOQ, lead time, pack-size options, and available batch documentation with the request instead of treating every inquiry as a generic catalog question.

Useful review points include:

- Confirm the exact product name, catalog code, and requested pack size.
- Ask whether COA, HPLC, MS or LC-MS, SDS, or other batch records are available on request.
- Keep product variations such as vial size or bulk pack size on the main product page unless a dedicated variant page is truly needed.
- Compare related products and categories through crawlable links rather than relying on filter-only URLs.

## Documentation and batch transparency

Strong peptide sourcing copy should connect visible product content with the records a buyer may request later. For Atlas BioLabs, that means clear product pages, category-level buying context, batch transparency support, and a quote workflow that can capture commercial requirements before supply is finalized.

Batch-specific records should be matched to the final lot, not inferred from generic catalog language. That is especially important for emerging peptides, blends, cosmetic peptide ingredients, and products where the buyer needs to compare documentation across multiple SKUs.

## Related products and categories

Start with ${linkedProducts.join(", ")} and review ${linkedCategories.join(" plus ")} for a broader category view. For another angle on this topic, continue with the ${relatedGuide}.

## Quote-led next step

If the product looks relevant to your sourcing plan, use the [Atlas BioLabs shop](/shop) to compare SKUs, then send a [request quote](/request-quote) with target quantity, pack format, destination, and documentation needs. The strongest quote requests are specific enough for commercial follow-up while staying grounded in research, formulation, and B2B supply context.`;
}

mkdirSync(outputDir, { recursive: true });

for (const [index, post] of posts.entries()) {
  const description = descriptionFor(post);
  const publishedDate = dateForIndex(index);
  const tags = [
    categoryLabel[post.category],
    "Commercial Sourcing",
    "Documentation Support",
    "B2B Peptide Supply",
  ];
  const frontmatter = `---
title: "${post.title.replaceAll('"', '\\"')}"
description: "${description.replaceAll('"', '\\"')}"
date: "${dateForIndex(index)}"
updatedAt: "${updatedForIndex(index, publishedDate)}"
slug: "${post.slug}"
author: "Atlas BioLabs Editorial"
category: "${post.category}"
tags:
${yamlList(tags)}
relatedProductSlugs:
${yamlList(productSlugs(post.products))}
relatedCategorySlugs:
${yamlList(categorySlugs(post.categories))}
seoTitle: "${post.title.replaceAll('"', '\\"')}"
metaDescription: "${description.replaceAll('"', '\\"')}"
canonical: "${siteUrl}/blog/${post.slug}"
excerpt: "${description.replaceAll('"', '\\"')}"
image: "${imageByCategory[post.category]}"
---`;

  writeFileSync(join(outputDir, `${post.slug}.mdx`), `${frontmatter}\n\n${bodyFor(post)}\n`, "utf8");
}

console.log(`Generated ${posts.length} SEO blog posts in ${outputDir}`);
