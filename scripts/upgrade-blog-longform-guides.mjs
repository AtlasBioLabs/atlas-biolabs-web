import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const blogDir = join(process.cwd(), "content", "blog");
const siteUrl = "https://www.atlasbiolabs.co";
const today = "2026-05-21";

const pillarSlugs = new Set([
  "peptide-supplier-checklist",
  "how-to-read-peptide-coa",
  "peptide-purity-hplc-ms-documentation",
  "source-peptides-wholesale",
  "cosmetic-peptides-guide",
  "trending-emerging-peptides-2026",
  "retatrutide-peptide-commercial-sourcing",
  "atlas-biolabs-peptide-catalog-guide",
]);

const productNames = {
  "acetyl-hexapeptide-8-argireline": "Acetyl Hexapeptide-8 (Argireline)",
  "acetyl-octapeptide-3-snap-8": "Acetyl Octapeptide-3 (SNAP-8)",
  "bpc-157": "BPC-157",
  "cagrilintide": "Cagrilintide",
  "cagrisema": "CagriSema",
  "cjc-1295-with-dac": "CJC-1295",
  "copper-peptide-ghk": "Copper Peptide GHK",
  "copper-tripeptide-1-ghk-cu": "Copper Tripeptide-1 (GHK-Cu)",
  "defensin-peptide": "Defensin Peptide",
  "dipeptide-diaminobutyroyl-benzylamide-diacetate-syn-ake":
    "Syn-Ake Peptide",
  "ipamorelin": "Ipamorelin",
  "klow-glow-blend": "KLOW / Glow Blend",
  "kpv-peptide": "KPV Peptide",
  "ll-37": "LL-37",
  "manganese-tripeptide-1": "Manganese Tripeptide-1",
  "mots-c": "MOTS-c",
  "nonapeptide-1-melanostatine": "Nonapeptide-1",
  "palmitoyl-pentapeptide-4-matrixyl": "Palmitoyl Pentapeptide-4 (Matrixyl)",
  "palmitoyl-tetrapeptide-7": "Palmitoyl Tetrapeptide-7",
  "palmitoyl-tripeptide-1": "Palmitoyl Tripeptide-1",
  "pexiganan": "Pexiganan",
  "retatrutide": "Retatrutide",
  "semaglutide-demo-trending": "Semaglutide",
  "snap-8": "SNAP-8",
  "survodutide": "Survodutide",
  "tb-500-thymosin-beta-4-fragment": "TB-500",
  "tesamorelin": "Tesamorelin",
  "tirzepatide-demo-trending": "Tirzepatide",
};

const categoryNames = {
  "antimicrobial-peptides": "Antimicrobial Peptides",
  "carrier-peptides": "Carrier Peptides",
  "enzyme-inhibitor-peptides": "Enzyme Inhibitor Peptides",
  "growth-repair-peptides": "Growth and Repair Peptides",
  "metabolic-advanced-peptides": "Metabolic and Advanced Peptides",
  "neurotransmitter-peptides": "Neurotransmitter Peptides",
  "signal-peptides": "Signal Peptides",
  "trending-emerging-peptides": "Trending and Emerging Peptides",
};

const categoryImages = {
  "compliance": "/blog/peptide-regulation.svg",
  "cosmetic-peptides": "/blog/types-of-peptides.svg",
  "custom-peptides": "/blog/custom-peptides.svg",
  "peptide-pricing": "/blog/peptide-pricing.svg",
  "peptide-sourcing": "/blog/peptide-supplier-guide.svg",
  "quality-documentation": "/blog/peptide-quality.svg",
  "trending-peptides": "/blog/top-peptides.svg",
  "wholesale-supply": "/blog/supply-chain.svg",
};

const oldPostRelations = {
  "atlas-labs-quality-systems": {
    products: ["bpc-157", "copper-tripeptide-1-ghk-cu", "ll-37"],
    categories: ["growth-repair-peptides", "carrier-peptides"],
    category: "quality-documentation",
  },
  "custom-peptide-sourcing": {
    products: ["cjc-1295-with-dac", "ipamorelin", "mots-c"],
    categories: ["growth-repair-peptides", "trending-emerging-peptides"],
    category: "custom-peptides",
  },
  "how-to-buy-peptides": {
    products: ["bpc-157", "retatrutide", "palmitoyl-pentapeptide-4-matrixyl"],
    categories: ["growth-repair-peptides", "trending-emerging-peptides"],
    category: "peptide-sourcing",
  },
  "peptide-market-trends": {
    products: ["retatrutide", "klow-glow-blend", "cagrilintide"],
    categories: ["trending-emerging-peptides", "metabolic-advanced-peptides"],
    category: "trending-peptides",
  },
  "peptide-pricing-explained": {
    products: ["retatrutide", "bpc-157", "palmitoyl-pentapeptide-4-matrixyl"],
    categories: ["trending-emerging-peptides", "signal-peptides"],
    category: "peptide-pricing",
  },
  "peptide-quality-purity-coa": {
    products: ["bpc-157", "ll-37", "copper-tripeptide-1-ghk-cu"],
    categories: ["growth-repair-peptides", "carrier-peptides"],
    category: "quality-documentation",
  },
  "peptide-regulations-legal-landscape": {
    products: ["bpc-157", "retatrutide", "ll-37"],
    categories: ["growth-repair-peptides", "trending-emerging-peptides"],
    category: "compliance",
  },
  "peptide-sourcing-risks": {
    products: ["bpc-157", "retatrutide", "copper-tripeptide-1-ghk-cu"],
    categories: ["growth-repair-peptides", "trending-emerging-peptides"],
    category: "compliance",
  },
  "peptide-supplier-guide": {
    products: ["bpc-157", "retatrutide", "cjc-1295-with-dac"],
    categories: ["growth-repair-peptides", "trending-emerging-peptides"],
    category: "peptide-sourcing",
  },
  "peptide-supply-chain-logistics": {
    products: ["bpc-157", "retatrutide", "tesamorelin"],
    categories: ["growth-repair-peptides", "metabolic-advanced-peptides"],
    category: "wholesale-supply",
  },
  "top-peptides-in-demand": {
    products: ["retatrutide", "klow-glow-blend", "bpc-157", "cagrilintide"],
    categories: ["trending-emerging-peptides", "metabolic-advanced-peptides"],
    category: "trending-peptides",
  },
  "types-of-peptides": {
    products: [
      "palmitoyl-pentapeptide-4-matrixyl",
      "copper-tripeptide-1-ghk-cu",
      "acetyl-hexapeptide-8-argireline",
    ],
    categories: ["signal-peptides", "carrier-peptides"],
    category: "cosmetic-peptides",
  },
  "what-are-peptides": {
    products: ["bpc-157", "copper-tripeptide-1-ghk-cu", "retatrutide"],
    categories: ["growth-repair-peptides", "carrier-peptides"],
    category: "peptide-sourcing",
  },
  "what-we-do-at-atlas-labs": {
    products: ["bpc-157", "retatrutide", "copper-tripeptide-1-ghk-cu"],
    categories: ["growth-repair-peptides", "trending-emerging-peptides"],
    category: "peptide-sourcing",
  },
};

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function yamlList(values) {
  return values.map((value) => `  - ${yamlString(value)}`).join("\n");
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function sentenceTopic(title) {
  return title.replace(/\s+/g, " ").replace(/[?.!]+$/, "");
}

function compactDescription(title) {
  const topic = sentenceTopic(title).split(":")[0];
  const shortTopic = topic.length > 72 ? `${topic.slice(0, 69).trim()}...` : topic;

  return `A practical Atlas BioLabs buyer guide to ${shortTopic}, with sourcing, MOQ, documentation, batch transparency, and quote-planning context.`;
}

function inferCategory(data) {
  if (data.category) return data.category;
  const slug = data.slug ?? "";
  const title = `${data.title ?? ""} ${slug}`.toLowerCase();

  if (oldPostRelations[slug]?.category) return oldPostRelations[slug].category;
  if (title.includes("cosmetic") || title.includes("skincare") || title.includes("matrixyl")) return "cosmetic-peptides";
  if (title.includes("coa") || title.includes("purity") || title.includes("documentation") || title.includes("testing")) return "quality-documentation";
  if (title.includes("price") || title.includes("moq")) return "peptide-pricing";
  if (title.includes("wholesale") || title.includes("bulk") || title.includes("supply chain")) return "wholesale-supply";
  if (title.includes("custom")) return "custom-peptides";
  if (title.includes("compliance") || title.includes("risk") || title.includes("regulation")) return "compliance";
  if (title.includes("trend") || title.includes("retatrutide") || title.includes("emerging")) return "trending-peptides";

  return "peptide-sourcing";
}

function inferProducts(data) {
  if (Array.isArray(data.relatedProductSlugs) && data.relatedProductSlugs.length >= 2) {
    return data.relatedProductSlugs;
  }

  const slug = data.slug ?? "";
  if (oldPostRelations[slug]?.products) {
    return oldPostRelations[slug].products;
  }

  return ["bpc-157", "retatrutide", "copper-tripeptide-1-ghk-cu"];
}

function inferCategories(data) {
  if (Array.isArray(data.relatedCategorySlugs) && data.relatedCategorySlugs.length >= 1) {
    return data.relatedCategorySlugs;
  }

  const slug = data.slug ?? "";
  if (oldPostRelations[slug]?.categories) {
    return oldPostRelations[slug].categories;
  }

  return ["growth-repair-peptides", "trending-emerging-peptides"];
}

function getCluster(category) {
  if (category === "cosmetic-peptides") return "cosmetic formulation";
  if (category === "quality-documentation") return "quality documentation";
  if (category === "peptide-pricing") return "pricing and MOQ";
  if (category === "trending-peptides") return "trending peptide";
  if (category === "wholesale-supply") return "wholesale supply";
  if (category === "custom-peptides") return "custom sourcing";
  if (category === "compliance") return "compliance and risk review";
  return "commercial peptide sourcing";
}

function productLink(slug) {
  return `[${productNames[slug] ?? slug}](/shop/${slug})`;
}

function categoryLink(slug) {
  return `[${categoryNames[slug] ?? slug}](/categories/${slug})`;
}

function findRelatedArticles(post, allPosts) {
  if (Array.isArray(post.data.relatedArticleSlugs) && post.data.relatedArticleSlugs.length > 0) {
    return post.data.relatedArticleSlugs.filter((slug) => slug !== post.data.slug).slice(0, 3);
  }

  const sameCategory = allPosts
    .filter((candidate) => candidate.data.slug !== post.data.slug)
    .filter((candidate) => inferCategory(candidate.data) === inferCategory(post.data))
    .map((candidate) => candidate.data.slug);

  const pillarFallbacks = [
    "peptide-supplier-checklist",
    "how-to-read-peptide-coa",
    "atlas-biolabs-peptide-catalog-guide",
    "source-peptides-wholesale",
  ].filter((slug) => slug !== post.data.slug);

  return unique([...sameCategory, ...pillarFallbacks]).slice(0, 3);
}

function buyerComparisonTable(productSlugs) {
  const rows = productSlugs.slice(0, 4).map((slug) => {
    const name = productNames[slug] ?? slug;
    return `| ${productLink(slug)} | Product-level sourcing review | COA, HPLC/MS where applicable, SDS or safety documentation on request | Confirm pack size, MOQ, destination, and desired document pack |`;
  });

  return `| Product | Common research/formulation context | Documentation expectation | Quote consideration |
| --- | --- | --- | --- |
${rows.join("\n")}`;
}

function coaTable() {
  return `| COA field | What it means | Why buyers should check it | What to ask the supplier |
| --- | --- | --- | --- |
| Batch / lot number | The batch-specific identifier tied to the product record | It prevents confusion between catalog copy and the supplied lot | Ask whether the lot number appears consistently across COA, label, and supporting files |
| Appearance | Visual description such as powder color or form | It helps flag obvious mismatch before deeper testing review | Ask whether appearance matches the product specification or final batch file |
| Purity | Usually reported through HPLC or a related analytical method | It gives buyers a basis for comparing documentation expectations | Ask whether the purity value is batch-specific and which method supports it |
| Identity | Confirmation by MS, LC-MS, MS/MS, or supplier identity record | It supports product identification before commercial shipment | Ask which identity method is available for the lot |
| Packaging and storage | Pack format and handling context | It affects logistics, stability planning, and receiving expectations | Ask for packaging format, storage notes, and shipping conditions before dispatch |`;
}

function supplierTable() {
  return `| Evaluation area | Good sign | Risk signal | Question to ask |
| --- | --- | --- | --- |
| Product identity | Clear product name, SKU, category, and canonical product URL | Multiple names with no matching documentation | Which product record will the quote and COA reference? |
| Documentation | Lot-specific COA and supporting files are discussed before shipment | Generic documents are treated as batch proof | Which documents are available for the final lot? |
| MOQ and pack size | MOQ, pack sizes, and quote assumptions are visible | Price is discussed without quantity or packaging context | What MOQ and pack-size options fit this request? |
| Communication | Supplier asks about destination, use context, and timeline | Supplier pushes checkout without qualification | What information do you need to prepare a clean quote? |
| Release review | Batch transparency and QA review are part of the workflow | Verification status is unclear or overstated | How is the final batch record reviewed before shipment? |`;
}

function moqTable() {
  return `| Order type | Typical buyer need | MOQ consideration | Documentation consideration |
| --- | --- | --- | --- |
| Sample-entry review | Compare product fit before larger planning | Ask whether small pilot quantities are available | Confirm whether documents are batch-specific or representative |
| Catalog replenishment | Repeat a known SKU on a recurring schedule | Review lead time and stock continuity | Match each lot to its own COA and batch reference |
| Bulk supply | Support larger commercial programs | Clarify price tiers, packaging, and dispatch windows | Request document pack expectations before invoice approval |
| Private-label planning | Align ingredient, pack, and label requirements | MOQ may depend on packaging and labeling complexity | Confirm label option, SDS, COA, and supporting records |
| Custom sourcing | Evaluate non-standard sequence or requirement | MOQ may depend on synthesis complexity and feasibility | Confirm sequence, specification target, and analytical method needs |`;
}

function pillarExtra({ title, productSlugs, categorySlugs, relatedArticleSlugs }) {
  return `## Strategic buyer framework

For a pillar topic like ${title}, serious buyers should slow down long enough to separate three decisions: product fit, supplier fit, and documentation fit. Product fit asks whether the catalog item belongs in the buyer's research, formulation, or commercial sourcing plan. Supplier fit asks whether communication, MOQ planning, and lead-time expectations are realistic. Documentation fit asks whether the final lot can be supported by the records the buyer needs before shipment.

That structure is useful because many sourcing problems come from mixing those decisions together. A product may be interesting, but the MOQ may not fit the current purchasing stage. A price may look attractive, but the documentation package may not support the buyer's internal review. A supplier may have access to a SKU, but may not be able to communicate clearly about batch transparency, packaging, or quote assumptions.

## Supporting pages to review

Use these pages as a working research path rather than isolated reading:

- Review ${productSlugs.slice(0, 4).map(productLink).join(", ")} for product-level sourcing context.
- Compare ${categorySlugs.slice(0, 2).map(categoryLink).join(" and ")} for category-level buying context.
- Continue with ${relatedArticleSlugs.map((slug) => `[${slug.replace(/-/g, " ")}](/blog/${slug})`).join(", ")} for supporting buyer guidance.
- Use the [Atlas BioLabs catalog](/shop) to compare product pages before sending a [quote request](/request-quote).

## Expanded common mistakes section

| Mistake | Why it creates friction | Better buyer approach |
| --- | --- | --- |
| Asking only for the lowest price | Price without quantity, pack size, and documentation scope is not comparable | Ask for price with MOQ, pack format, lead time, and document expectations |
| Treating catalog copy as a COA | Product pages describe sourcing context, not final batch release | Ask for lot-specific documentation tied to the final batch |
| Comparing products without category context | Adjacent peptides may sit in different formulation or research conversations | Review both product pages and category pages before shortlisting |
| Waiting to mention destination market | Shipping conditions and documentation expectations may depend on destination | Include destination, timing, and document needs in the first request |
| Ignoring verification status | A pending or draft document should not be treated as released | Confirm whether the COA is released, pending, superseded, or revoked |`;
}

function bodyFor(post, allPosts) {
  const data = post.data;
  const title = data.title;
  const slug = data.slug;
  const category = inferCategory(data);
  const cluster = getCluster(category);
  const productSlugs = unique(inferProducts(data)).slice(0, 4);
  const categorySlugs = unique(inferCategories(data)).slice(0, 2);
  const relatedArticleSlugs = findRelatedArticles(post, allPosts);
  const isPillar = pillarSlugs.has(slug);
  const productsText = productSlugs.map(productLink).join(", ");
  const categoriesText = categorySlugs.map(categoryLink).join(" and ");
  const relatedText = relatedArticleSlugs
    .map((articleSlug) => `[${articleSlug.replace(/-/g, " ")}](/blog/${articleSlug})`)
    .join(", ");

  return `${title} matters because peptide buyers are no longer evaluating catalog pages as isolated product listings. Procurement teams, formulation teams, and research supply buyers are comparing product identity, documentation support, MOQ planning, packaging expectations, lead time, and supplier communication in one workflow. Atlas BioLabs approaches this topic as a commercial sourcing guide: practical enough for buyer review, detailed enough for internal discussion, and careful enough to avoid turning sourcing content into medical or consumer advice.

The strongest buyers use articles like this to prepare better questions before they request a quote. They review the product page, compare the category, decide which records matter, and then ask for clear next steps around MOQ, pack size, shipping conditions, and batch transparency. That is where a supplier can be genuinely helpful. A cleaner request creates a cleaner quote, and a cleaner quote gives both sides fewer surprises before shipment.

## Quick Summary for Buyers

- Treat ${sentenceTopic(title)} as a ${cluster} topic connected to sourcing decisions, not as a standalone keyword.
- Review product-level pages such as ${productsText} before asking for price or availability.
- Compare category context through ${categoriesText} so product selection is not separated from buyer intent.
- Ask about COA, batch or lot number, appearance, purity, HPLC/MS where applicable, packaging, storage context, and lead time.
- Use quote-led supply when MOQ, destination, documentation, or packaging requirements need human review.
- Keep the discussion commercial: product selection, documentation expectations, supplier evaluation, and batch transparency.

${isPillar ? `## Table of Contents

- [What this topic means in commercial sourcing](#what-this-topic-means-in-commercial-sourcing)
- [Why buyers are discussing it now](#why-buyers-are-discussing-it-now)
- [What buyers usually compare](#what-buyers-usually-compare)
- [Documentation expectations](#documentation-expectations)
- [MOQ and pack-size planning](#moq-and-pack-size-planning)
- [Supplier evaluation](#supplier-evaluation)
- [Practical buyer checklist](#practical-buyer-checklist)
- [Atlas BioLabs sourcing workflow](#atlas-biolabs-sourcing-workflow)
- [FAQ](#faq)
` : ""}
## What this topic means in commercial sourcing

### What it is

In a commercial sourcing context, ${sentenceTopic(title).toLowerCase()} is best understood as a decision-support topic. It helps buyers decide what to compare, which product pages to review, and what information should be shared before a quote. For Atlas BioLabs, the conversation usually connects product selection, category fit, MOQ, documentation, and buyer workflow rather than isolated claims about a peptide.

That distinction matters. A product page can show the SKU, catalog code, category, short overview, pack sizes, MOQ, lead time, and documentation support. A buyer guide can explain how to use that information. The two should work together. When buyers read this guide and then review ${productsText}, they can move into the quote process with a more organized view of what they need.

### Why buyers are discussing it now

Peptide sourcing is becoming more structured. Buyers are asking for clearer documentation, more transparent batch references, cleaner quote workflows, and better category explanations. Cosmetic formulation teams want ingredient context. Procurement teams want MOQ and packaging clarity. Research supply buyers want to understand what documents may be available before the order advances. Those needs make ${cluster} content more valuable than a thin product mention.

Market interest also moves quickly. Newer peptides, blends, cosmetic ingredients, and documentation practices can become visible before buyers fully understand the sourcing implications. Helpful content should slow the process down just enough to make decisions better. It should explain what to compare, what to ask, and where a buyer can get stuck.

## What buyers usually compare

Most buyers compare more than product names. They compare category fit, documentation expectations, available pack sizes, MOQ, lead time, shipping conditions, and how professionally a supplier responds. The table below gives a practical way to compare products tied to this guide.

${buyerComparisonTable(productSlugs)}

Product comparison should stay tied to canonical product pages. Pack sizes, MOQ notes, and quote options generally belong on the main product page unless there is real search demand and operational support for a dedicated variant page. That keeps search signals cleaner and gives buyers one stable URL to review before requesting a quote.

## Documentation expectations

Documentation is where many buyer conversations become serious. A professional supplier should be able to discuss what is available, what is pending, and what belongs to the final lot. Buyers should not assume that a generic document proves the final batch. Lot-specific documentation is the safer expectation when the order moves toward shipment.

${coaTable()}

For ${sentenceTopic(title).toLowerCase()}, documentation may include a COA, batch or lot number, appearance review, purity report, HPLC or MS where appropriate, packaging notes, storage context, lead time, and document-pack expectations. The exact document set depends on the product, supplier workflow, and buyer requirements, so it should be clarified before the order is treated as ready.

## MOQ and pack-size planning

MOQ planning is not just a pricing issue. It affects supplier feasibility, packaging decisions, dispatch timing, and the amount of documentation work required. A buyer asking for a small evaluation quantity has a different workflow than a buyer preparing recurring wholesale supply or private-label planning.

${moqTable()}

The practical move is to share target quantity, preferred pack size, destination market, timeline, and documentation needs in the first request. Atlas BioLabs can then frame the conversation around real supply conditions rather than guessing from a short product name.

## Supplier evaluation

A supplier should make the buying process calmer, not more confusing. Good supplier evaluation looks at product clarity, documentation support, communication quality, quote structure, and release-status discipline. If a supplier cannot explain what is batch-specific, what is pending, and what is available on request, buyers should slow down.

${supplierTable()}

## Questions to ask before requesting a quote

Buyers can make the quote process more efficient by sending specific, commercially useful questions:

- Which product page, SKU, and catalog code should this request reference?
- What pack sizes and MOQ options are realistic for this product?
- What documentation can be discussed before shipment, and what is lot-specific?
- Is HPLC, MS, LC-MS, SDS, or additional testing available or available on request?
- What packaging, storage, and shipping conditions should the buyer plan around?
- What lead time assumptions apply to stock, production, or custom sourcing?
- Are there any destination-market considerations that should be clarified early?

## Common mistakes to avoid

Where buyers often get stuck is not usually the peptide name. It is the missing context around the name. Common mistakes include asking for price without quantity, comparing products without category context, treating a representative document as final batch proof, waiting too long to mention documentation needs, or assuming a quote can be accurate without pack-size and destination details.

Another mistake is allowing hype to outrun supplier evaluation. Helpful sourcing content should support confident commercial decisions, but it should not make medical, dosing, diagnostic, or human-use claims. Serious buyers are better served by clear product identity, documentation expectations, and a supplier workflow that can be reviewed.

## Practical buyer checklist

- Confirm the exact product name, SKU, and preferred product URL.
- Review at least one related category page such as ${categoriesText}.
- Compare two to four adjacent product pages, including ${productsText}.
- Decide whether the request is for evaluation, recurring supply, private-label planning, or custom sourcing.
- Define target quantity, pack size, destination, and desired lead time.
- Ask what documentation is available before shipment and what is tied to the final lot.
- Confirm whether storage, packaging, or shipping conditions affect the plan.
- Save the related guide ${relatedText} for internal review before sending the final request.

## Atlas BioLabs sourcing workflow

Atlas BioLabs helps buyers keep the process structured from product selection through quote review. The workflow starts with product and category review, then moves into MOQ clarification, pack-size planning, documentation expectations, batch transparency, and commercial communication. That structure helps buyers avoid vague requests and gives the Atlas BioLabs team enough context to respond usefully.

For a buyer reviewing ${sentenceTopic(title).toLowerCase()}, the next step is usually simple: compare the relevant products in the [Atlas BioLabs catalog](/shop), review the related category page, and submit a [quote request](/request-quote) with the target quantity, packaging preference, destination, timeline, and document expectations. Atlas BioLabs can then align sourcing notes, MOQ, lead time, and documentation support around the actual request.

${isPillar ? pillarExtra({ title, productSlugs, categorySlugs, relatedArticleSlugs }) : ""}
## Frequently Asked Questions

### Is this article product advice or medical guidance?

No. This article is written for qualified commercial sourcing, research context, documentation review, and formulation planning. It is not medical, dosing, diagnostic, veterinary, consumer health, or human-use guidance.

### What should buyers review before requesting a quote?

Buyers should review the product page, category context, desired pack size, MOQ expectations, destination market, lead time, and documentation needs. A more specific request usually produces a more useful commercial response.

### Why does lot-specific documentation matter?

Lot-specific documentation connects the supplied product to the batch or lot number being shipped. It helps buyers distinguish between general catalog information and the records that support a particular batch.

### Should pack-size variants have separate URLs?

Usually no. Most pack-size variants should remain on the main product page so buyers and search engines have one canonical URL with clear variant context. Separate URLs should be reserved for real product differences with independent search demand and operational support.

### How does Atlas BioLabs support buyer communication?

Atlas BioLabs supports product selection, quote review, MOQ clarification, documentation expectations, batch transparency, and commercial communication so qualified B2B buyers can move from research into structured sourcing decisions.

## Compliance note

Atlas BioLabs content is provided for qualified commercial sourcing, research, documentation, and formulation context only. No medical, dosing, or human-use claims are made.

## Final CTA

Use this guide as a working brief, then [browse the Atlas BioLabs catalog](/shop), compare the linked product and category pages, and [request a quote](/request-quote) with your target quantity, pack size, destination, timeline, and documentation expectations.`;
}

const files = readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx"))
  .sort((left, right) => left.localeCompare(right));

const parsedPosts = files.map((file) => {
  const fullPath = join(blogDir, file);
  const parsed = matter(readFileSync(fullPath, "utf8"));
  return { file, fullPath, data: parsed.data };
});

for (const post of parsedPosts) {
  const data = post.data;
  const title = data.title;
  const slug = data.slug;
  const category = inferCategory(data);
  const relatedProductSlugs = unique(inferProducts(data)).slice(0, 4);
  const relatedCategorySlugs = unique(inferCategories(data)).slice(0, 2);
  const relatedArticleSlugs = findRelatedArticles(post, parsedPosts);
  const description = data.description && data.description.length < 170
    ? data.description
    : compactDescription(title);
  const metaDescription = compactDescription(title);
  const excerpt = metaDescription;
  const image = data.image || categoryImages[category] || "/blog/peptide-guide.svg";
  const tags = Array.isArray(data.tags) && data.tags.length > 0
    ? data.tags
    : ["Commercial Sourcing", "Documentation Support", "B2B Peptide Supply"];

  const frontmatter = [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `date: ${yamlString(data.date)}`,
    `updatedAt: ${yamlString(data.updatedAt ?? data.updated ?? today)}`,
    `slug: ${yamlString(slug)}`,
    `author: ${yamlString(data.author || "Atlas BioLabs Editorial")}`,
    `category: ${yamlString(category)}`,
    "tags:",
    yamlList(tags),
    "relatedProductSlugs:",
    yamlList(relatedProductSlugs),
    "relatedCategorySlugs:",
    yamlList(relatedCategorySlugs),
    "relatedArticleSlugs:",
    yamlList(relatedArticleSlugs),
    `seoTitle: ${yamlString(data.seoTitle || title)}`,
    `metaDescription: ${yamlString(data.metaDescription || metaDescription)}`,
    `canonical: ${yamlString(`${siteUrl}/blog/${slug}`)}`,
    `excerpt: ${yamlString(data.excerpt || excerpt)}`,
    `image: ${yamlString(image)}`,
    "---",
  ].join("\n");

  writeFileSync(post.fullPath, `${frontmatter}\n\n${bodyFor(post, parsedPosts)}\n`, "utf8");
}

console.log(`Upgraded ${parsedPosts.length} blog posts to long-form buyer guides.`);
