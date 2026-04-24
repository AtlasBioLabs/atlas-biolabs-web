import { productScienceCopyByName } from "@/lib/product-science";

export type NavItem = {
  label: string;
  href: string;
};

export type ProductCategoryId =
  | "signal-peptides"
  | "carrier-peptides"
  | "neurotransmitter-peptides"
  | "enzyme-inhibitor-peptides"
  | "antimicrobial-peptides"
  | "growth-repair-peptides"
  | "metabolic-advanced-peptides";

export type ProductCategory = {
  id: ProductCategoryId;
  label: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategoryId;
  image: string;
  shortDescription: string;
  summary: string;
  overview: string;
  functionalRole: string[];
  mechanismInsight: string;
  commonApplications: string[];
  keyCharacteristics: string[];
  associatedUses: string[];
  packSizes: string[];
  moq: number;
  priceFrom: number;
  priceRange: string;
  purityDocumentation: string[];
  contentBenefits: string[];
  storageHandling: string[];
  leadTime: string;
  intendedBuyerType: string[];
  trustSupport: string[];
};

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  unitPriceFrom: number;
  quantity: number;
  moq: number;
};

export type TrustMetric = {
  label: string;
  value: string;
};

export type ContactDetails = {
  recipientEmail: string;
  detailsNotice: string;
};

export type CtaContent = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  highlights: string[];
};

export type ValuePoint = {
  title: string;
  description: string;
};

export type InfoBlock = {
  title: string;
  description: string;
  points: string[];
};

export type TeamMember = {
  displayName: string;
  role: string;
  focus: string;
  image: string;
};

export type QuoteRequestFormData = {
  fullName: string;
  companyName: string;
  email: string;
  phoneWhatsApp: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
};

export type CartInquiryFormData = {
  fullName: string;
  companyName: string;
  email: string;
  phoneWhatsApp: string;
  country: string;
  paymentMethod: string;
  product: string;
  quantity: string;
  message: string;
};

export const brand = {
  name: "Atlas BioLabs",
  tagline: "Global Peptide Supply & Sourcing",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const aboutSubmenuItems: NavItem[] = [
  { label: "Quality Assurance", href: "/quality-assurance" },
  { label: "Research", href: "/research" },
];

export const primaryNavCta = {
  label: "Request Quote",
  href: "/request-quote",
};

export const productCategories: ProductCategory[] = [
  { id: "signal-peptides", label: "Signal Peptides", description: "Anti-aging / collagen" },
  { id: "carrier-peptides", label: "Carrier Peptides", description: "Repair / mineral delivery" },
  {
    id: "neurotransmitter-peptides",
    label: "Neurotransmitter Peptides",
    description: "Wrinkle reduction",
  },
  {
    id: "enzyme-inhibitor-peptides",
    label: "Enzyme Inhibitor Peptides",
    description: "Anti-aging control",
  },
  {
    id: "antimicrobial-peptides",
    label: "Antimicrobial Peptides",
    description: "Skin protection",
  },
  {
    id: "growth-repair-peptides",
    label: "Growth Peptides",
    description: "Regeneration",
  },
  {
    id: "metabolic-advanced-peptides",
    label: "Metabolic Peptides",
    description: "Performance / trending",
  },
];

type CategoryTemplate = Pick<
  Product,
  | "purityDocumentation"
  | "contentBenefits"
  | "storageHandling"
  | "intendedBuyerType"
  | "trustSupport"
>;

const categoryTemplates: Record<ProductCategoryId, CategoryTemplate> = {
  "signal-peptides": {
    purityDocumentation: [
      "Typical release profile: >=98% by HPLC with lot identity checks.",
      "COA and chromatogram are available on request for approved inquiries.",
      "Release records are retained for repeat-order traceability.",
    ],
    contentBenefits: [
      "Common in collagen-positioned premium cosmetic portfolios.",
      "Used in anti-aging concept formulas across private-label and OEM channels.",
      "Supports premium peptide positioning in topical product launches.",
    ],
    storageHandling: [
      "Store sealed units at 2-8 C away from direct light.",
      "Keep unopened material dry and humidity controlled.",
      "Use lot-based handling logs for inventory consistency.",
    ],
    intendedBuyerType: [
      "Cosmetic formulation brands",
      "Private-label skin care manufacturers",
      "Ingredient distributors serving beauty channels",
    ],
    trustSupport: [
      "MOQ options from 5-6 units",
      "COA available on request",
      "Fast quote turnaround for recurring buyers",
    ],
  },
  "carrier-peptides": {
    purityDocumentation: [
      "Typical release profile: >=98% by HPLC with identity verification.",
      "COA support includes lot traceability references.",
      "Batch-level handling notes are available for formulation teams.",
    ],
    contentBenefits: [
      "Used in peptide-mineral cosmetic ingredient systems.",
      "Supports premium repair-positioned product-line development.",
      "Chosen for differentiated carrier-peptide catalogs.",
    ],
    storageHandling: [
      "Store in refrigerated conditions and protect from humidity.",
      "Maintain sealed packaging through receiving and transfer.",
      "Follow lot guidance provided in release documentation.",
    ],
    intendedBuyerType: [
      "OEM and ODM cosmetic manufacturers",
      "Formulation labs for high-end skin care",
      "Wholesale ingredient buyers with recurring demand",
    ],
    trustSupport: [
      "Tiered bulk pricing support",
      "Lot-level records for procurement review",
      "Account help for multi-SKU sourcing plans",
    ],
  },
  "neurotransmitter-peptides": {
    purityDocumentation: [
      "Typical release profile: >=98% by HPLC with sequence verification.",
      "Lot traceability and release checks are completed before dispatch.",
      "COA package is available on request for approved accounts.",
    ],
    contentBenefits: [
      "Common in wrinkle-focused cosmetic concept portfolios.",
      "Used in premium anti-aging serum and ampoule programs.",
      "Supports high-velocity cosmetic category assortments.",
    ],
    storageHandling: [
      "Store under refrigerated conditions and protect from light.",
      "Limit ambient exposure during production transfer.",
      "Maintain lot-level handling notes for repeat consistency.",
    ],
    intendedBuyerType: [
      "Premium beauty brand operators",
      "Global cosmetic ingredient distributors",
      "Contract manufacturers serving anti-aging lines",
    ],
    trustSupport: [
      "Commercial lot traceability support",
      "MOQ-to-wholesale quote alignment",
      "Dedicated response coordination for active buyers",
    ],
  },
  "enzyme-inhibitor-peptides": {
    purityDocumentation: [
      "Typical release profile: >=98% by HPLC with identity confirmation.",
      "COA package is available on request for procurement workflows.",
      "Batch release summaries are archived for repeat orders.",
    ],
    contentBenefits: [
      "Used in tone-focused and anti-aging cosmetic concepts.",
      "Supports category expansion in premium formulation portfolios.",
      "Selected for high-value brightening-oriented ingredient systems.",
    ],
    storageHandling: [
      "Store sealed product in cool and low-humidity conditions.",
      "Use temperature-controlled transfer for large dispatches.",
      "Reference lot-specific handling notes before processing.",
    ],
    intendedBuyerType: [
      "Tone-focused cosmetic product brands",
      "Private-label manufacturers expanding anti-aging lines",
      "Wholesale buyers planning repeat production runs",
    ],
    trustSupport: [
      "Documentation-first onboarding support",
      "Flexible MOQ and lead time planning",
      "Commercial account follow-up on quote requests",
    ],
  },
  "antimicrobial-peptides": {
    purityDocumentation: [
      "Typical release profile: >=95% by HPLC with identity confirmation.",
      "COA support is available on request for qualified buyers.",
      "Release packets include lot mapping and handling notes.",
    ],
    contentBenefits: [
      "Used in advanced skin-protection formulation concepts.",
      "Supports differentiated specialty peptide portfolio planning.",
      "Chosen in premium channels requiring trusted ingredient sourcing.",
    ],
    storageHandling: [
      "Maintain refrigerated, sealed storage before use.",
      "Use dry handling conditions during transfer and receiving.",
      "Follow cold-chain dispatch instructions in release documents.",
    ],
    intendedBuyerType: [
      "Specialty cosmetic ingredient distributors",
      "Innovation-led formulation teams",
      "B2B buyers building advanced product catalogs",
    ],
    trustSupport: [
      "Custom quote support for specialty SKUs",
      "Batch release documentation on request",
      "Bulk pricing support for recurring demand",
    ],
  },
  "growth-repair-peptides": {
    purityDocumentation: [
      "Typical release profile: >=99% by HPLC with lot traceability.",
      "COA package can be shared for approved inquiries.",
      "Identity and release checks are logged prior to dispatch.",
    ],
    contentBenefits: [
      "Used in regeneration-themed commercial peptide catalogs.",
      "Supports product-line depth for performance-focused buyers.",
      "Common in recurring high-demand supply programs.",
    ],
    storageHandling: [
      "Store sealed units at 2-8 C with moisture protection.",
      "Use lot segregation for inventory and dispatch planning.",
      "Follow release packet guidance for handling consistency.",
    ],
    intendedBuyerType: [
      "Peptide storefront operators",
      "Performance-category distributors",
      "Commercial buyers managing monthly reorder cycles",
    ],
    trustSupport: [
      "MOQ starts suitable for pilot-to-scale buying",
      "Lead-time support for recurring demand windows",
      "Dedicated account response for cart and quote submissions",
    ],
  },
  "metabolic-advanced-peptides": {
    purityDocumentation: [
      "Typical release profile: >=99% by HPLC with identity verification.",
      "Release packet includes lot traceability references.",
      "COA support is available on request for approved accounts.",
    ],
    contentBenefits: [
      "Used in advanced and trending peptide product planning.",
      "Supports high-demand SKU strategy for catalog operators.",
      "Selected by teams balancing B2B and B2C demand channels.",
    ],
    storageHandling: [
      "Store under controlled refrigerated conditions.",
      "Keep sealed packaging protected from moisture and light.",
      "Use documented handling logs for repeat procurement cycles.",
    ],
    intendedBuyerType: [
      "Trend-responsive peptide suppliers",
      "Wholesale buyers scaling advanced-category SKUs",
      "Commercial operators with mixed B2B and B2C demand",
    ],
    trustSupport: [
      "Fast quote turnaround and MOQ clarity",
      "Volume pricing tiers for wholesale planning",
      "Documentation support for onboarding and repeat orders",
    ],
  },
};

type ProductSeed = {
  name: string;
  category: ProductCategoryId;
  useHint: string;
  packSizes: string[];
  moq: number;
  priceFrom: number;
  priceRange: string;
  leadTime: string;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const productSeeds: ProductSeed[] = [
  {
    name: "Palmitoyl Pentapeptide-4 (Matrixyl)",
    category: "signal-peptides",
    useHint: "collagen-positioned anti-aging topical formulas",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 84,
    priceRange: "USD 84-620 by pack size and volume tier",
    leadTime: "4-7 business days",
  },
  {
    name: "Palmitoyl Tripeptide-1",
    category: "signal-peptides",
    useHint: "premium renewal-focused skin care concepts",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 79,
    priceRange: "USD 79-590 by quantity tier",
    leadTime: "4-7 business days",
  },
  {
    name: "Palmitoyl Tetrapeptide-7",
    category: "signal-peptides",
    useHint: "anti-aging portfolio expansion in private-label channels",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 88,
    priceRange: "USD 88-660 by volume",
    leadTime: "4-8 business days",
  },
  {
    name: "Palmitoyl Tripeptide-5",
    category: "signal-peptides",
    useHint: "firming-positioned cosmetic formula pipelines",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 91,
    priceRange: "USD 91-680 by supply tier",
    leadTime: "4-8 business days",
  },
  {
    name: "Oligopeptide-1 (EGF)",
    category: "signal-peptides",
    useHint: "premium specialty skin care SKU development",
    packSizes: ["100 mg", "1 g", "10 g", "Bulk by quote"],
    moq: 10,
    priceFrom: 118,
    priceRange: "USD 118-860 by specification and quantity",
    leadTime: "5-8 business days",
  },
  {
    name: "Copper Tripeptide-1 (GHK-Cu)",
    category: "carrier-peptides",
    useHint: "peptide-mineral cosmetic ingredient strategies",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 15,
    priceFrom: 132,
    priceRange: "USD 132-940 by order scale",
    leadTime: "5-8 business days",
  },
  {
    name: "Copper Peptide GHK",
    category: "carrier-peptides",
    useHint: "premium private-label skin care formulation programs",
    packSizes: ["1 g", "10 g", "Bulk 100 g"],
    moq: 15,
    priceFrom: 126,
    priceRange: "USD 126-890 by quantity tier",
    leadTime: "5-8 business days",
  },
  {
    name: "Copper Tripeptide-1 Hydrochloride",
    category: "carrier-peptides",
    useHint: "controlled hydrochloride-format formulation workflows",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 20,
    priceFrom: 141,
    priceRange: "USD 141-980 by order tier",
    leadTime: "6-9 business days",
  },
  {
    name: "Manganese Tripeptide-1",
    category: "carrier-peptides",
    useHint: "specialized mineral-delivery concept development",
    packSizes: ["1 g", "5 g", "10 g", "Bulk by quote"],
    moq: 20,
    priceFrom: 148,
    priceRange: "USD 148-1,040 by volume plan",
    leadTime: "6-9 business days",
  },
  {
    name: "Acetyl Hexapeptide-8 (Argireline)",
    category: "neurotransmitter-peptides",
    useHint: "wrinkle-focused cosmetic serum and ampoule ranges",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 94,
    priceRange: "USD 94-710 by pack and reorder cadence",
    leadTime: "4-7 business days",
  },
  {
    name: "Dipeptide Diaminobutyroyl Benzylamide Diacetate (Syn-Ake)",
    category: "neurotransmitter-peptides",
    useHint: "premium anti-aging formulations for high-end channels",
    packSizes: ["1 g", "5 g", "10 g", "Bulk by quote"],
    moq: 10,
    priceFrom: 162,
    priceRange: "USD 162-1,120 by quantity band",
    leadTime: "5-8 business days",
  },
  {
    name: "Pentapeptide-18 (Leuphasyl)",
    category: "neurotransmitter-peptides",
    useHint: "multi-peptide anti-aging assortment planning",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 108,
    priceRange: "USD 108-780 by volume",
    leadTime: "4-7 business days",
  },
  {
    name: "Acetyl Octapeptide-3 (Snap-8)",
    category: "neurotransmitter-peptides",
    useHint: "premium wrinkle-focused product positioning",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 10,
    priceFrom: 129,
    priceRange: "USD 129-920 by commercial tier",
    leadTime: "5-8 business days",
  },
  {
    name: "Oligopeptide-68",
    category: "enzyme-inhibitor-peptides",
    useHint: "tone-focused and anti-aging control concepts",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 20,
    priceFrom: 143,
    priceRange: "USD 143-1,010 by volume and packaging plan",
    leadTime: "6-9 business days",
  },
  {
    name: "Nonapeptide-1 (Melanostatine)",
    category: "enzyme-inhibitor-peptides",
    useHint: "premium brightening and tone-focused category builds",
    packSizes: ["1 g", "5 g", "10 g", "Bulk by quote"],
    moq: 20,
    priceFrom: 136,
    priceRange: "USD 136-970 by order band",
    leadTime: "6-9 business days",
  },
  {
    name: "Decapeptide-12",
    category: "enzyme-inhibitor-peptides",
    useHint: "high-value anti-aging control ingredient systems",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 20,
    priceFrom: 151,
    priceRange: "USD 151-1,050 by quantity and schedule",
    leadTime: "6-10 business days",
  },
  {
    name: "Tetrapeptide-30",
    category: "enzyme-inhibitor-peptides",
    useHint: "tone-control skin care concept formulation",
    packSizes: ["1 g", "10 g", "Bulk 50 g+"],
    moq: 20,
    priceFrom: 116,
    priceRange: "USD 116-850 by order structure",
    leadTime: "5-8 business days",
  },
  {
    name: "LL-37",
    category: "antimicrobial-peptides",
    useHint: "advanced skin-protection specialty category planning",
    packSizes: ["10 mg", "100 mg", "1 g", "Bulk by quote"],
    moq: 25,
    priceFrom: 208,
    priceRange: "USD 208-1,500 by format and quantity",
    leadTime: "7-11 business days",
  },
  {
    name: "Defensin Peptide",
    category: "antimicrobial-peptides",
    useHint: "innovation-led specialty ingredient product lines",
    packSizes: ["10 mg", "100 mg", "1 g", "Bulk by quote"],
    moq: 25,
    priceFrom: 228,
    priceRange: "USD 228-1,620 by volume and timeline",
    leadTime: "7-11 business days",
  },
  {
    name: "Pexiganan",
    category: "antimicrobial-peptides",
    useHint: "specialty antimicrobial peptide catalog expansion",
    packSizes: ["10 mg", "100 mg", "1 g", "Bulk by quote"],
    moq: 25,
    priceFrom: 188,
    priceRange: "USD 188-1,420 by supply tier",
    leadTime: "7-10 business days",
  },
  {
    name: "BPC-157",
    category: "growth-repair-peptides",
    useHint: "regeneration-focused high-demand catalog programs",
    packSizes: ["5 mg vial", "10 mg vial", "Bulk API by quote"],
    moq: 10,
    priceFrom: 76,
    priceRange: "USD 76-530 by format and quantity",
    leadTime: "4-6 business days",
  },
  {
    name: "TB-500 (Thymosin Beta-4 fragment)",
    category: "growth-repair-peptides",
    useHint: "performance and regeneration-focused SKU bundles",
    packSizes: ["5 mg vial", "10 mg vial", "Bulk API by quote"],
    moq: 10,
    priceFrom: 90,
    priceRange: "USD 90-600 by quote tier",
    leadTime: "5-7 business days",
  },
  {
    name: "KPV Peptide",
    category: "growth-repair-peptides",
    useHint: "growth and repair assortment diversification for repeat demand",
    packSizes: ["10 mg", "100 mg", "1 g", "Bulk by quote"],
    moq: 10,
    priceFrom: 84,
    priceRange: "USD 84-580 by order plan",
    leadTime: "5-7 business days",
  },
  {
    name: "Thymosin Alpha-1",
    category: "growth-repair-peptides",
    useHint: "advanced growth and repair product-line planning",
    packSizes: ["1 mg", "10 mg", "100 mg", "Bulk by quote"],
    moq: 10,
    priceFrom: 113,
    priceRange: "USD 113-810 by volume and lead time needs",
    leadTime: "6-9 business days",
  },
  {
    name: "CJC-1295 (with DAC)",
    category: "metabolic-advanced-peptides",
    useHint: "advanced-category commercial assortment development",
    packSizes: ["2 mg vial", "5 mg vial", "10 mg vial", "Bulk API"],
    moq: 10,
    priceFrom: 92,
    priceRange: "USD 92-650 by quantity and schedule",
    leadTime: "4-7 business days",
  },
  {
    name: "Ipamorelin",
    category: "metabolic-advanced-peptides",
    useHint: "high-velocity advanced peptide storefront demand",
    packSizes: ["2 mg vial", "5 mg vial", "10 mg vial", "Bulk API"],
    moq: 10,
    priceFrom: 70,
    priceRange: "USD 70-510 by order tier",
    leadTime: "4-6 business days",
  },
  {
    name: "Semaglutide (demo/trending)",
    category: "metabolic-advanced-peptides",
    useHint: "trend-watch category planning and quote-based sourcing",
    packSizes: ["2 mg vial", "5 mg vial", "10 mg vial", "Bulk by quote"],
    moq: 10,
    priceFrom: 138,
    priceRange: "USD 138-970 by package and quantity",
    leadTime: "5-8 business days",
  },
  {
    name: "Tirzepatide (demo/trending)",
    category: "metabolic-advanced-peptides",
    useHint: "advanced-category demand forecasting and portfolio expansion",
    packSizes: ["2 mg vial", "5 mg vial", "10 mg vial", "Bulk by quote"],
    moq: 10,
    priceFrom: 162,
    priceRange: "USD 162-1,100 by volume and lead time commitment",
    leadTime: "6-9 business days",
  },
];

export const products: Product[] = productSeeds.map((seed) => {
  const slug = toSlug(seed.name);
  const template = categoryTemplates[seed.category];
  const scienceCopy = productScienceCopyByName[seed.name];

  if (!scienceCopy) {
    throw new Error(`Missing scientific product copy for ${seed.name}`);
  }

  const moq = seed.moq;

  return {
    slug,
    name: seed.name,
    category: seed.category,
    image: `/products/${slug}.svg`,
    shortDescription: scienceCopy.overview,
    summary: scienceCopy.overview,
    overview: scienceCopy.overview,
    functionalRole: [...scienceCopy.functionalRole],
    mechanismInsight: scienceCopy.mechanismInsight,
    commonApplications: [...scienceCopy.commonApplications],
    keyCharacteristics: [...scienceCopy.keyCharacteristics],
    associatedUses: [...scienceCopy.functionalRole],
    packSizes: seed.packSizes,
    moq,
    priceFrom: seed.priceFrom,
    priceRange: seed.priceRange,
    purityDocumentation: [
      ...template.purityDocumentation,
      "We use Atlas Labs to review incoming documentation checks and batch transparency records before commercial supply support.",
    ],
    contentBenefits: [...scienceCopy.commonApplications],
    storageHandling: [...template.storageHandling],
    leadTime: seed.leadTime,
    intendedBuyerType: [...template.intendedBuyerType],
    trustSupport: [
      ...template.trustSupport,
      "Direct quote support for U.S. and international accounts",
    ],
  };
});

export const catalogProductSlugsByCategory: Record<ProductCategoryId, string[]> =
  productCategories.reduce((accumulator, category) => {
    accumulator[category.id] = products
      .filter((product) => product.category === category.id)
      .map((product) => product.slug);

    return accumulator;
  }, {} as Record<ProductCategoryId, string[]>);

export const featuredProductSlugs = [
  toSlug("Palmitoyl Pentapeptide-4 (Matrixyl)"),
  toSlug("Copper Tripeptide-1 (GHK-Cu)"),
  toSlug("Acetyl Hexapeptide-8 (Argireline)"),
  toSlug("Oligopeptide-68"),
  toSlug("BPC-157"),
  toSlug("CJC-1295 (with DAC)"),
];

function normalizeCatalogText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeCatalogText(value: string) {
  return normalizeCatalogText(value)
    .split(" ")
    .filter((token) => token.length > 2);
}

function uniqueCatalogKeywords(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getProductKeywordPool(product: Product) {
  const category = productCategories.find((entry) => entry.id === product.category);

  return uniqueCatalogKeywords([
    product.name,
    category?.label ?? "",
    category?.description ?? "",
    ...product.functionalRole,
    ...product.commonApplications,
    ...product.keyCharacteristics,
    ...product.associatedUses,
  ]).flatMap((keyword) => {
    const normalizedKeyword = normalizeCatalogText(keyword);

    return normalizedKeyword.includes(" ")
      ? [normalizedKeyword]
      : [normalizedKeyword, ...tokenizeCatalogText(normalizedKeyword)];
  });
}

function getProductRelationCorpus(product: Product) {
  const category = productCategories.find((entry) => entry.id === product.category);

  return normalizeCatalogText(
    [
      product.name,
      category?.label ?? "",
      category?.description ?? "",
      product.shortDescription,
      product.overview,
      product.mechanismInsight,
      product.functionalRole.join(" "),
      product.commonApplications.join(" "),
      product.keyCharacteristics.join(" "),
      product.packSizes.join(" "),
    ].join(" ")
  );
}

export function getRelatedProducts(product: Product, limit = 4) {
  const keywordPool = uniqueCatalogKeywords(getProductKeywordPool(product));
  const featuredSet = new Set(featuredProductSlugs);

  return products
    .filter((candidate) => candidate.slug !== product.slug)
    .map((candidate) => {
      const corpus = getProductRelationCorpus(candidate);
      const sameCategory = candidate.category === product.category;
      const sharedPackSize = candidate.packSizes.some((packSize) =>
        product.packSizes.includes(packSize)
      );

      const keywordScore = keywordPool.reduce((score, keyword) => {
        if (!keyword) {
          return score;
        }

        if (corpus.includes(keyword)) {
          return score + (keyword.includes(" ") ? 6 : 3);
        }

        return score;
      }, 0);

      return {
        product: candidate,
        score:
          keywordScore +
          (sameCategory ? 40 : 0) +
          (sharedPackSize ? 2 : 0) +
          (featuredSet.has(candidate.slug) ? 1 : 0),
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.product.category === product.category) -
          Number(a.product.category === product.category) ||
        a.product.name.localeCompare(b.product.name)
    )
    .slice(0, limit)
    .map((entry) => entry.product);
}

export const heroContent: HeroContent = {
  eyebrow: "Global peptide sourcing, laboratory review, U.S.-focused commercial supply",
  title: "Peptide Supplier and Sourcing Partner for Wholesale Peptides",
  description:
    "Atlas BioLabs supports peptide sourcing, wholesale peptides, and custom peptide sourcing for U.S. and international buyers through qualified manufacturing and sourcing partners in China, with Atlas Labs documentation review, batch transparency, technical product context, and responsive quote handling.",
  primaryLabel: "Shop Peptides",
  primaryHref: "/shop",
  secondaryLabel: "Request Quote",
  secondaryHref: "/request-quote",
  highlights: [
    "We work with qualified manufacturing and sourcing partners in China and keep commercial peptide sourcing structured from the first technical review.",
    "We run Atlas Labs quality review and documentation checks before wholesale peptide supply moves forward.",
    "We respond quickly on quotes for catalog products and custom peptide sourcing requests while keeping pack size, lot context, and documentation expectations visible.",
  ],
};

export const proofChips = [
  "MOQ options by product",
  "COA available on request",
  "Batch transparency support",
  "Fast commercial quote turnaround",
];

export const trustMetrics: TrustMetric[] = [
  { label: "Catalog SKUs", value: "28" },
  { label: "Categories", value: "7" },
  { label: "Global Buyer Reach", value: "U.S. + International" },
  { label: "Quote Speed", value: "< 1 business day" },
];

export const orderingSteps: ValuePoint[] = [
  {
    title: "1. Select Your Products",
    description: "Browse categories, compare pack sizes, and shortlist target SKUs.",
  },
  {
    title: "2. Submit Quantity Targets",
    description:
      "Use the Inquiry Cart or Request Quote to share MOQ, destination, and timeline needs.",
  },
  {
    title: "3. Confirm Commercial Terms",
    description:
      "We confirm pricing tiers, lead time, and documentation support so you can move forward clearly.",
  },
];

export const whyBuyPoints: ValuePoint[] = [
  {
    title: "Global Sourcing, Clear U.S. Support",
    description:
      "We combine qualified manufacturing and sourcing partners in China with clear commercial support for U.S. and international accounts.",
  },
  {
    title: "Documentation and Batch Transparency",
    description:
      "We review incoming product records through Atlas Labs so documentation and batch transparency stay clear before commercial supply begins.",
  },
  {
    title: "Quote-First Commercial Workflow",
    description:
      "Move from product selection to quote confirmation quickly with clear MOQ guidance and wholesale support.",
  },
];

export const wholesaleHighlights: ValuePoint[] = [
  {
    title: "MOQ and Volume Planning",
    description:
      "We support everything from entry MOQ orders to recurring bulk programs with clear commercial terms, technical context, and volume-planning visibility.",
  },
  {
    title: "Sourcing and Dispatch Alignment",
    description:
      "We align sourcing, pack size options, batch handling notes, and dispatch planning with your buying cycle.",
  },
  {
    title: "U.S. and International Buyer Support",
    description:
      "We stay close to domestic and international accounts managing repeat purchase windows, evaluation batches, and recurring procurement schedules.",
  },
];

export const qualityHighlights: ValuePoint[] = [
  {
    title: "Our Atlas Labs Review Layer",
    description:
      "We use Atlas Labs to review incoming product records, analytical context, and documentation before commercial supply begins.",
  },
  {
    title: "Documentation on Request",
    description:
      "We share COA and release-related records on request when your team needs documentation support or technical file review.",
  },
  {
    title: "Batch Transparency",
    description:
      "We keep lot and batch context organized so recurring procurement and repeat validation stay easier to track.",
  },
];

export const shopIntro = {
  title: "Commercial Peptide Catalog",
  description:
    "Explore 28 commercially supplied peptides sourced through qualified partners in China, with Atlas Labs documentation support, batch transparency, category-level technical context, and fast quote options for U.S. and international accounts.",
};

export const wholesaleIntro = {
  title: "Wholesale Peptide Supply and Bulk Sourcing",
  description:
    "We support quote-based wholesale peptide sourcing with MOQ handling, volume pricing tiers, documentation-backed supply planning, lot-aware packaging guidance, and buyer-ready product and category pathways for U.S. and international accounts.",
};

export const wholesaleSteps = [
  "Share product list, target MOQ, and destination market",
  "Receive commercial quote options and supply guidance",
  "Confirm pack sizes, lead time, and documentation requirements",
  "Launch recurring supply with account-level support",
];

export const aboutIntro = {
  title: "A peptide sourcing company built for commercial buyers",
  description:
    "Atlas BioLabs serves U.S. and international accounts through qualified manufacturing and sourcing partners in China, with Atlas Labs supporting documentation review, batch transparency, and consistent quality standards across commercial supply programs.",
};

export const aboutValues: ValuePoint[] = [
  {
    title: "Commercial Supply Focus",
    description:
      "We built the business around product sourcing, quote alignment, and repeat commercial supply, not research-only positioning.",
  },
  {
    title: "Transparent Sourcing Standards",
    description:
      "We prioritize clear product terms, documentation support, and batch-level visibility to reduce procurement friction.",
  },
  {
    title: "Atlas Labs Quality Review",
    description:
      "We run incoming product review and documentation checks through Atlas Labs before supply moves forward.",
  },
];

export const aboutStory = [
  "We launched Atlas BioLabs in 2024 after seeing the same issue repeatedly across the market: serious buyers needed reliable peptide sourcing, but kept running into vague listings, unclear MOQ terms, and slow commercial responses. We built the business to deliver a cleaner, quote-first sourcing experience.",
  "Today, we support U.S. and international accounts through qualified manufacturing and sourcing partners in China. We use Atlas Labs as our quality review and documentation arm so incoming product review, documentation checks, batch transparency, and consistent quality standards stay in place before commercial supply moves forward.",
];

export const founderProfile = {
  name: "Dr. Guy Citrin",
  title: "Founder",
  bio: "I founded Atlas BioLabs in 2024 to build a peptide supply and sourcing company that combines disciplined quality review with practical commercial execution. My focus is simple: help teams move from product evaluation to clear supply terms quickly and confidently.",
};

export const aboutTeam: TeamMember[] = [
  {
    displayName: "Daniel Carter",
    role: "Commercial Operations Lead",
    image: "/images/team-commercial.jpg",
    focus:
      "I lead quote workflows, response-time standards, and day-to-day commercial coordination.",
  },
  {
    displayName: "Dr. Emily Chen",
    role: "Quality and Documentation Manager",
    image: "/images/team-quality.jpg",
    focus:
      "I coordinate Atlas Labs documentation review, COA support requests, and record consistency.",
  },
  {
    displayName: "Wei Zhang",
    role: "Supply Chain Coordinator",
    image: "/images/team-supply.jpg",
    focus:
      "I manage sourcing coordination, dispatch scheduling, and lead time planning across product categories.",
  },
  {
    displayName: "Kevin Liu",
    role: "Product and Catalog Specialist",
    image: "/images/team-catalog.jpg",
    focus:
      "I keep product data accurate, pack sizes clear, and the catalog easy to act on.",
  },
  {
    displayName: "Sarah Mitchell",
    role: "Customer Success and Accounts",
    image: "/images/team-success.jpg",
    focus:
      "I stay close to customer accounts with reorder planning, follow-up, and account support.",
  },
];

export const homeCta: CtaContent = {
  eyebrow: "Ready to source?",
  title: "Move from product review to commercial quote in minutes",
  description:
    "Select products, submit quantity targets, and let us guide you through the right commercial quote process with documentation and batch transparency guidance.",
  primaryLabel: "Shop Peptides",
  primaryHref: "/shop",
  secondaryLabel: "Request Quote",
  secondaryHref: "/request-quote",
};

export const shopCta: CtaContent = {
  eyebrow: "Need non-catalog specs?",
  title: "Submit a custom peptide sourcing request",
  description:
    "If your requirement is outside the standard catalog, share sequence and quantity needs for sourcing and documentation review.",
  primaryLabel: "Custom Peptide Request",
  primaryHref: "/custom-requests",
  secondaryLabel: "Request Quote",
  secondaryHref: "/request-quote",
};

export const wholesaleCta: CtaContent = {
  eyebrow: "Bulk buying support",
  title: "Request pricing for recurring bulk supply programs",
  description:
    "Share your forecasted demand, and we will align MOQ, commercial pricing, documentation support, and lead time expectations.",
  primaryLabel: "Request Quote",
  primaryHref: "/request-quote",
  secondaryLabel: "Shop Catalog",
  secondaryHref: "/shop",
};
export const contactCta: CtaContent = {
  eyebrow: "Need a custom build?",
  title: "Use custom sourcing for non-catalog peptide requests",
  description:
    "For custom sequence or quantity needs, we coordinate a practical response path through our commercial team and Atlas Labs.",
  primaryLabel: "Custom Peptide Request",
  primaryHref: "/custom-requests",
  secondaryLabel: "Request Quote",
  secondaryHref: "/request-quote",
};

export const aboutCta: CtaContent = {
  eyebrow: "Work with Atlas",
  title: "Need a peptide sourcing partner built for commercial scale?",
  description:
    "We support U.S. and international accounts with qualified partner sourcing, Atlas Labs review support, and reliable quote handling.",
  primaryLabel: "Shop Peptides",
  primaryHref: "/shop",
  secondaryLabel: "Request Quote",
  secondaryHref: "/request-quote",
};

export const customRequestsIntro = {
  title: "Custom Peptide Request",
  description:
    "Submit non-catalog peptide sourcing requirements for feasibility review, documentation planning, and commercial quote support.",
};

export const customRequestCapabilities = [
  "Custom sequence and non-catalog product sourcing review",
  "Pack size and format planning for commercial supply programs",
  "MOQ, lead time, and dispatch planning alignment",
  "Atlas Labs documentation review support for custom inquiries",
];

export const customCta: CtaContent = {
  eyebrow: "Need a direct response?",
  title: "Share requirements and receive custom sourcing guidance",
  description:
    "We review custom peptide requests and follow up with practical commercial next steps.",
  primaryLabel: "Request Quote",
  primaryHref: "/request-quote",
  secondaryLabel: "Contact Sales",
  secondaryHref: "/contact",
};

export const qualityIntro = {
  title: "Quality Assurance",
  description:
    "Through Atlas Labs, we review incoming lots, analytical records, and documentation so batch transparency stays clear before commercial supply begins.",
};

export const qualityBlocks: InfoBlock[] = [
  {
    title: "Incoming Product Review",
    description:
      "Incoming lots are reviewed against agreed product, analytical, and documentation standards before commercial release.",
    points: [
      "Incoming lot review framework",
      "Identity and purity checkpoint verification",
      "Batch handoff for commercial supply readiness",
    ],
  },
  {
    title: "Documentation Checks",
    description:
      "We coordinate documentation checks through Atlas Labs so procurement workflows, technical files, and internal records stay consistent.",
    points: [
      "COA available on request",
      "Batch and lot traceability references",
      "Storage and handling guidance alignment",
    ],
  },
  {
    title: "Quality-Focused Standards",
    description:
      "Consistent review, analytical screening, and documentation routines support repeat commercial buying confidence.",
    points: [
      "Standardized quality review checkpoints",
      "Documentation continuity across reorder cycles",
      "Support for recurring U.S. and international buyers",
    ],
  },
];

export const qualityProcessSteps = [
  "Lot from qualified partner network enters Atlas Labs review",
  "Identity, purity, and documentation checks are completed",
  "Batch transparency records are prepared for buyer support",
  "Lot is cleared for commercial supply",
];

export const qualityCta: CtaContent = {
  eyebrow: "Need added QA support?",
  title: "Request documentation and batch support with your quote",
  description:
    "We can align documentation needs during quote review and account onboarding.",
  primaryLabel: "Request Quote",
  primaryHref: "/request-quote",
  secondaryLabel: "Contact Sales",
  secondaryHref: "/contact",
};

export const researchIntro = {
  title: "Atlas Labs Peptide Analysis and Documentation Laboratory",
  description:
    "Atlas Labs is our laboratory and documentation review team. We analyze peptides sourced from qualified partners in China, classify incoming lots by product group, review analytical context, and validate documentation accuracy before commercial supply begins.",
};

export const researchFocus: ValuePoint[] = [
  {
    title: "Incoming Lot Analysis",
    description:
      "Each incoming lot is screened against identity, purity, batch-data, and technical-context checkpoints before supply decisions are made.",
  },
  {
    title: "Peptide Classification",
    description:
      "We classify reviewed materials into commercial peptide categories so product mapping, scientific positioning, and sourcing clarity stay consistent.",
  },
  {
    title: "Documentation Accuracy Control",
    description:
      "We review COA, chromatogram references, lot records, and supporting technical notes for consistency before they move into account workflows.",
  },
];

export const researchLabCapabilities: InfoBlock[] = [
  {
    title: "Analytical Review Bench",
    description:
      "Structured review protocols are applied to incoming peptide lots sourced through qualified manufacturing and sourcing partners in China.",
    points: [
      "Identity and purity checkpoint workflow",
      "Batch-level record cross-checking",
      "Release recommendations for commercial support",
    ],
  },
  {
    title: "Classification Desk",
    description:
      "Reviewed lots are organized into clear peptide classes so commercial teams can align listings, quotes, and buyer guidance accurately.",
    points: [
      "Category-level peptide mapping",
      "Catalog alignment by product class",
      "Cross-team handoff into our supply workflows",
    ],
  },
  {
    title: "Documentation Control Unit",
    description:
      "Atlas Labs verifies document completeness and consistency before records are used in quote support and account review.",
    points: [
      "COA consistency checks",
      "Batch and lot transparency controls",
      "Storage and handling note verification",
    ],
  },
];

export const researchWorkflowSteps = [
  "Receive incoming lots and source documentation from our qualified partner network in China",
  "Run identity, purity, and record-consistency review checkpoints",
  "Classify material into the appropriate commercial peptide category",
  "Validate documentation packet accuracy and traceability fields",
  "Release reviewed findings into our commercial support workflow",
];

export const researchDocumentationControls = [
  "COA-to-lot record matching",
  "Batch number and traceability verification",
  "Specification field consistency checks",
  "Storage and handling instruction validation",
  "Exception logging for clarification or hold decisions",
];

export const researchOutputs: ValuePoint[] = [
  {
    title: "Classification-Ready Catalog Support",
    description:
      "Our commercial team receives clearer category mapping that improves product handoff and account communication.",
  },
  {
    title: "Documentation Review Confidence",
    description:
      "Reviewed records support procurement workflows that require accurate lot and batch-level documentation context.",
  },
  {
    title: "Stronger Supply Handoffs",
    description:
      "We pass quality-reviewed findings into quote and account workflows to support reliable commercial execution.",
  },
];

export const researchCta: CtaContent = {
  eyebrow: "Research and QA",
  title: "We keep quality and supply connected",
  description:
    "Research and documentation review stay tied to a product-first commercial buying flow so the handoff into sourcing feels clear.",
  primaryLabel: "Shop Peptides",
  primaryHref: "/shop",
  secondaryLabel: "Request Quote",
  secondaryHref: "/request-quote",
};

export const contactDetails: ContactDetails = {
  recipientEmail: "hello@atlasbiolabs.co",
  detailsNotice:
    "We share direct phone and account contact details during active quote and account conversations.",
};
