/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(process.cwd(), "content", "blog");
const publicBlogDir = path.join(process.cwd(), "public", "blog");
const inlineDir = path.join(publicBlogDir, "inline");

const themes = {
  "what-are-peptides": {
    label: "Peptide Basics",
    heading: "What peptides are",
    summary: "Structure, use, and sourcing in one view.",
    chips: ["Chain length", "Use profile", "Regulatory context"],
    inlineAlt: "Editorial cover explaining peptide structure, commercial context, and sourcing relevance",
    palette: ["#071c31", "#0f2c4e", "#1485b8", "#89ddd2", "#f5fbff", "#d8ecf5"],
    kind: "structure",
    boardTitle: "Structure overview",
    boardSubtitle: "How sequence design connects to category and commercial use",
    statValue: "4",
    statLabel: "Core buyer lenses",
    nodes: ["Amino acids", "Peptide bonds", "Chain length", "Use profile"],
    bullets: [
      "Shows the building blocks buyers reference when comparing peptide types.",
      "Connects structure to product positioning across research and cosmetic supply.",
      "Frames documentation and classification as part of commercial decision-making.",
    ],
  },
  "types-of-peptides": {
    label: "Category Guide",
    heading: "Peptide classes",
    summary: "The main groups buyers see across cosmetic and research supply.",
    chips: ["Signal", "Carrier", "Neuro"],
    inlineAlt: "Editorial matrix showing major peptide classes and how they are grouped",
    palette: ["#0d2340", "#183b66", "#1d9cc8", "#8ee6d6", "#f6fbff", "#d7ecf3"],
    kind: "matrix",
    boardTitle: "Category map",
    boardSubtitle: "Common functional groups used in product sourcing discussions",
    statValue: "4",
    statLabel: "Main classes",
    cells: [
      { title: "Signal peptides", subtitle: "Structure-support communication" },
      { title: "Carrier peptides", subtitle: "Mineral and cofactor transport" },
      { title: "Neuro peptides", subtitle: "Neuromuscular signaling context" },
      { title: "Repair systems", subtitle: "Regeneration pathway research" },
    ],
    bullets: [
      "Helps buyers sort peptide listings by role rather than by name alone.",
      "Creates a cleaner visual distinction between cosmetic and research-facing groups.",
      "Supports better category navigation across product and content pages.",
    ],
  },
  "how-to-buy-peptides": {
    label: "Buyer Guide",
    heading: "How buyers source peptides",
    summary: "The usual path from shortlist to shipment.",
    chips: ["MOQ", "Documents", "Lead time"],
    inlineAlt: "Editorial workflow showing how buyers compare peptide suppliers and documentation",
    palette: ["#11213a", "#23496f", "#1fa1c3", "#c7ea7c", "#f7fcff", "#dce9d8"],
    kind: "flow",
    boardTitle: "Commercial buying path",
    boardSubtitle: "How sourcing teams move from shortlist to confirmed dispatch",
    statValue: "4",
    statLabel: "Review steps",
    steps: ["Shortlist", "Verify MOQ", "Check documents", "Plan dispatch"],
    bullets: [
      "Makes the sourcing path easier to understand at a glance.",
      "Surfaces documentation, quantity planning, and supplier responsiveness.",
      "Feels closer to a real procurement briefing than a generic blog thumbnail.",
    ],
  },
  "peptide-market-trends": {
    label: "Market Trends",
    heading: "Where demand is moving",
    summary: "A quick read on category growth and supply momentum.",
    chips: ["Growth", "Demand", "Supply"],
    inlineAlt: "Editorial chart showing peptide market demand and category growth signals",
    palette: ["#0c2038", "#12456f", "#1bb3c5", "#ffd56d", "#f7fcff", "#f7ead1"],
    kind: "chart",
    boardTitle: "Market growth view",
    boardSubtitle: "Category momentum, demand concentration, and supplier expansion",
    statValue: "3",
    statLabel: "Demand drivers",
    metrics: ["Category demand", "Supplier expansion", "Commercial visibility"],
    bullets: [
      "Highlights where buyers see stable category interest and new sourcing activity.",
      "Supports trend-focused reading without turning the cover into a generic bar chart.",
      "Adds a more professional analyst-style tone to the article library.",
    ],
  },
  "peptide-pricing-explained": {
    label: "Pricing",
    heading: "What changes pricing",
    summary: "Purity, complexity, volume, and supply all shape the quote.",
    chips: ["Purity", "Complexity", "Volume"],
    inlineAlt: "Editorial pricing graphic showing purity, sequence complexity, and volume effects",
    palette: ["#0f1d31", "#32486f", "#1ea4c7", "#ffa062", "#fffaf7", "#f7ded0"],
    kind: "pricing",
    boardTitle: "Pricing model",
    boardSubtitle: "The main variables commercial buyers review before quoting",
    statValue: "3",
    statLabel: "Primary cost levers",
    metrics: ["Purity target", "Sequence complexity", "Order volume"],
    bullets: [
      "Turns pricing from a vague topic into a concrete supply-side comparison.",
      "Explains why like-for-like quotes depend on more than product name alone.",
      "Presents pricing as a sourcing system rather than a simple list price.",
    ],
  },
  "peptide-quality-purity-coa": {
    label: "Quality Review",
    heading: "How to read quality documents",
    summary: "COAs, purity data, and lot checks that actually matter.",
    chips: ["COA", "Purity", "Traceability"],
    inlineAlt: "Editorial cover showing certificate review, purity checks, and peptide documentation",
    palette: ["#10233f", "#1b4f77", "#1fb2bd", "#9ae4d5", "#f5fdff", "#d7edf2"],
    kind: "document",
    boardTitle: "Documentation review",
    boardSubtitle: "Purity data, batch records, and release alignment in one view",
    statValue: "3",
    statLabel: "Review checkpoints",
    checks: ["Identity match", "Purity result", "Lot traceability"],
    bullets: [
      "Looks more like a quality-system article than a decorative blog card.",
      "Makes the role of COA review and release support visually obvious.",
      "Improves trust by showing documentation as part of the core story.",
    ],
  },
  "peptide-regulations-legal-landscape": {
    label: "Regulation",
    heading: "Regulation by market",
    summary: "Classification, import review, and labeling in practical terms.",
    chips: ["Classification", "Import", "Labeling"],
    inlineAlt: "Editorial compliance cover explaining peptide regulations, import review, and labeling",
    palette: ["#0e2443", "#1c4f82", "#22b5d2", "#7de1c6", "#f6fbff", "#d7efe7"],
    kind: "compliance",
    boardTitle: "Regulatory checkpoints",
    boardSubtitle: "How buyer teams think about classification, route, and intended use",
    statValue: "3",
    statLabel: "Compliance pillars",
    checks: ["Product classification", "Import route review", "Labeling alignment"],
    bullets: [
      "Explains regulation as a checklist, not an abstract legal concept.",
      "Fits the article topic better than a generic globe or network graphic alone.",
      "Keeps the visual tone professional and commercial rather than alarmist.",
    ],
  },
  "peptide-supply-chain-logistics": {
    label: "Supply Chain",
    heading: "How supply moves",
    summary: "From production review to export, transit, and delivery.",
    chips: ["Planning", "Dispatch", "Delivery"],
    inlineAlt: "Editorial supply chain cover showing peptide production, export, transit, and delivery",
    palette: ["#112742", "#21557e", "#2db4c8", "#7fe2df", "#f4fbff", "#d7eff1"],
    kind: "flow",
    boardTitle: "Supply route overview",
    boardSubtitle: "The checkpoints between manufacturing and buyer receipt",
    statValue: "4",
    statLabel: "Logistics stages",
    steps: ["Production", "Review", "Export", "Receipt"],
    bullets: [
      "Makes the logistics article feel operational and commercially grounded.",
      "Shows how verification and dispatch planning sit inside the supply path.",
      "Adds more clarity for wholesale and cross-border sourcing readers.",
    ],
  },
  "peptide-supplier-guide": {
    label: "Supplier Guide",
    heading: "How to compare suppliers",
    summary: "What matters when you are choosing a peptide supplier.",
    chips: ["MOQ fit", "Documents", "Response speed"],
    inlineAlt: "Editorial supplier scorecard showing documentation, MOQ fit, and response speed",
    palette: ["#10203d", "#27486d", "#1fa4c5", "#a4df7d", "#f8fbf5", "#e5efd9"],
    kind: "dashboard",
    boardTitle: "Supplier scorecard",
    boardSubtitle: "The comparison signals buyers review before committing to volume",
    statValue: "5",
    statLabel: "Evaluation lenses",
    metrics: ["MOQ fit", "Documentation", "Capacity", "Lead time", "Response speed"],
    bullets: [
      "Gives the article a stronger buying-team feel than a generic abstract graphic.",
      "Reinforces that supplier selection depends on operational fit, not price alone.",
      "Makes the article look more like a commercial resource library asset.",
    ],
  },
  "custom-peptide-sourcing": {
    label: "Custom Peptides",
    heading: "Custom peptide projects",
    summary: "From sequence brief to production plan.",
    chips: ["Sequence", "Purity", "Lead time"],
    inlineAlt: "Editorial cover showing custom peptide sequence planning and production workflow",
    palette: ["#0b2340", "#19517d", "#1aa4cc", "#86e2d6", "#f4fcff", "#d7edf2"],
    kind: "sequence",
    boardTitle: "Custom project path",
    boardSubtitle: "Moving from sequence brief to release-ready commercial supply",
    statValue: "4",
    statLabel: "Project inputs",
    steps: ["Sequence brief", "Purity target", "Production plan", "Release support"],
    bullets: [
      "Makes custom work feel structured and professionally managed.",
      "Explains that custom sourcing is a specification process, not just a request form.",
      "Creates a clearer bridge between technical requirements and commercial planning.",
    ],
  },
  "top-peptides-in-demand": {
    label: "Demand Signals",
    heading: "Peptides buyers ask for most",
    summary: "The groups getting the most attention across the market.",
    chips: ["Signal", "Carrier", "Research"],
    inlineAlt: "Editorial demand cover showing high-interest peptide groups and product clusters",
    palette: ["#11243f", "#24507d", "#1fa8cb", "#f8c85a", "#fffaf1", "#f6e8c8"],
    kind: "portfolio",
    boardTitle: "Demand cluster view",
    boardSubtitle: "How category interest and product visibility group together",
    statValue: "3",
    statLabel: "Main clusters",
    metrics: ["Signal peptides", "Carrier peptides", "Research-focused lines"],
    bullets: [
      "Uses product-group storytelling instead of another plain trend background.",
      "Makes the article feel closer to a category briefing for commercial buyers.",
      "Keeps the image explanatory even when shown at smaller card sizes.",
    ],
  },
  "peptide-sourcing-risks": {
    label: "Risk Review",
    heading: "Where sourcing goes wrong",
    summary: "The common issues that slow or derail supply.",
    chips: ["Quality drift", "Delays", "Spec mismatch"],
    inlineAlt: "Editorial risk review cover showing peptide sourcing pitfalls and mitigation points",
    palette: ["#182234", "#394f78", "#1ca4bc", "#ff8570", "#fff6f4", "#f7ddd8"],
    kind: "risk",
    boardTitle: "Risk and mitigation view",
    boardSubtitle: "Where sourcing issues emerge and how review systems reduce exposure",
    statValue: "4",
    statLabel: "Exposure points",
    metrics: ["Quality drift", "Spec mismatch", "Document gaps", "Transit delays"],
    bullets: [
      "Frames risk as something buyer teams manage through process, not fear-based language.",
      "Adds professional urgency while still feeling measured and explanatory.",
      "Matches the article tone better than a generic warning icon treatment.",
    ],
  },
  "atlas-labs-quality-systems": {
    label: "Atlas Labs",
    heading: "How our review system works",
    summary: "The steps we use to review batches and documents.",
    chips: ["Incoming review", "Traceability", "Batch alignment"],
    inlineAlt: "Editorial Atlas Labs cover showing incoming review, traceability, and quality systems",
    palette: ["#10243e", "#1e507d", "#1da8c7", "#90e2d6", "#f4fdff", "#d6eef2"],
    kind: "lab",
    boardTitle: "Atlas Labs quality flow",
    boardSubtitle: "How our internal review system supports cleaner supply decisions",
    statValue: "4",
    statLabel: "Core controls",
    metrics: ["Incoming review", "Document checks", "Batch alignment", "Supply continuity"],
    bullets: [
      "Feels company-specific and operational instead of generic biotech imagery.",
      "Explains the process behind Atlas Labs quality review in a more credible way.",
      "Supports the article as a trust-building, detail-rich editorial piece.",
    ],
  },
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text, maxLength) {
  const words = String(text).split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
      continue;
    }

    current = next;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function textLines(lines, x, startY, fontSize, lineHeight, color, weight, opacity = 1) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" fill="${color}" fill-opacity="${opacity}" font-size="${fontSize}" font-weight="${weight}" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(line)}</text>`
    )
    .join("");
}

function chip(x, y, label, palette) {
  const width = Math.max(120, 40 + label.length * 8);
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="36" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />
      <text x="${width / 2}" y="23" text-anchor="middle" fill="${palette[4]}" font-size="14" font-weight="700" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(label)}</text>
    </g>
  `;
}

function infoTile(x, y, width, title, text, palette) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="112" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <rect x="22" y="20" width="94" height="10" rx="5" fill="${palette[3]}" opacity="0.92" />
      <text x="22" y="56" fill="${palette[4]}" font-size="20" font-weight="700" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(title)}</text>
      ${textLines(wrapText(text, 26).slice(0, 2), 22, 82, 14, 20, palette[4], 500, 0.72)}
    </g>
  `;
}

function bulletRow(index, y, text, palette) {
  return `
    <g transform="translate(0 ${y})">
      <circle cx="18" cy="18" r="18" fill="${index === 1 ? palette[3] : palette[2]}" opacity="0.95" />
      <text x="18" y="24" text-anchor="middle" fill="${palette[0]}" font-size="14" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${index + 1}</text>
      <rect x="52" y="0" width="444" height="54" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
      ${textLines(wrapText(text, 46).slice(0, 2), 76, 23, 16, 19, palette[4], 500, 0.86)}
    </g>
  `;
}

function statBadge(x, y, value, label, palette) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="164" height="104" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <text x="28" y="48" fill="${palette[4]}" font-size="38" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(value)}</text>
      <text x="28" y="76" fill="${palette[4]}" fill-opacity="0.72" font-size="15" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(label)}</text>
    </g>
  `;
}

function renderStructureDiagram(theme, palette) {
  return `
    <g transform="translate(54 188)">
      <path d="M110 112C184 56 264 48 330 112C398 176 474 180 562 112" fill="none" stroke="${palette[2]}" stroke-width="10" stroke-linecap="round" />
      <path d="M122 212C196 154 284 150 350 212C416 274 502 280 584 212" fill="none" stroke="${palette[3]}" stroke-width="10" stroke-linecap="round" opacity="0.95" />
      ${theme.nodes
        .map((node, index) => {
          const x = 88 + index * 154;
          const y = index % 2 === 0 ? 112 : 212;
          return `
            <g transform="translate(${x} ${y})">
              <circle cx="0" cy="0" r="24" fill="${index % 2 === 0 ? palette[3] : palette[2]}" />
              <circle cx="0" cy="0" r="10" fill="${palette[4]}" opacity="0.9" />
              <rect x="-54" y="46" width="108" height="38" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" />
              <text x="0" y="70" text-anchor="middle" fill="${palette[4]}" font-size="13" font-weight="700" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(node)}</text>
            </g>
          `;
        })
        .join("")}
      ${infoTile(0, 292, 214, "Sequence", "Amino acid order defines the peptide chain.", palette)}
      ${infoTile(234, 292, 214, "Category", "Functional class shapes how buyers compare use cases.", palette)}
      ${infoTile(468, 292, 214, "Context", "Commercial sourcing adds documentation and classification review.", palette)}
    </g>
  `;
}

function renderMatrixDiagram(theme, palette) {
  return `
    <g transform="translate(58 188)">
      ${theme.cells
        .map((cell, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const x = col * 334;
          const y = row * 184;
          return `
            <g transform="translate(${x} ${y})">
              <rect width="306" height="152" rx="30" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
              <rect x="24" y="22" width="84" height="12" rx="6" fill="${index % 2 === 0 ? palette[2] : palette[3]}" />
              <text x="24" y="70" fill="${palette[4]}" font-size="24" font-weight="750" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(cell.title)}</text>
              ${textLines(wrapText(cell.subtitle, 26), 24, 102, 15, 20, palette[4], 500, 0.72)}
            </g>
          `;
        })
        .join("")}
    </g>
  `;
}

function renderFlowDiagram(theme, palette) {
  return `
    <g transform="translate(58 226)">
      <path d="M84 94H618" stroke="rgba(255,255,255,0.16)" stroke-width="6" stroke-linecap="round" />
      ${theme.steps
        .map((step, index) => {
          const x = 44 + index * 182;
          return `
            <g transform="translate(${x} 0)">
              <circle cx="40" cy="94" r="34" fill="${index % 2 === 0 ? palette[2] : palette[3]}" />
              <text x="40" y="104" text-anchor="middle" fill="${palette[0]}" font-size="22" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${index + 1}</text>
              <rect x="-2" y="164" width="180" height="116" rx="26" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
              <text x="22" y="208" fill="${palette[4]}" font-size="22" font-weight="750" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(step)}</text>
              <rect x="22" y="228" width="120" height="10" rx="5" fill="rgba(255,255,255,0.3)" />
              <rect x="22" y="248" width="86" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
            </g>
          `;
        })
        .join("")}
    </g>
  `;
}

function renderChartDiagram(theme, palette) {
  return `
    <g transform="translate(58 196)">
      <rect width="688" height="396" rx="34" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" />
      ${[0, 1, 2, 3].map((row) => `<line x1="48" y1="${78 + row * 74}" x2="632" y2="${78 + row * 74}" stroke="rgba(255,255,255,0.11)" stroke-width="2" />`).join("")}
      ${[0, 1, 2, 3, 4].map((col) => `<line x1="${92 + col * 108}" y1="44" x2="${92 + col * 108}" y2="332" stroke="rgba(255,255,255,0.07)" stroke-width="2" />`).join("")}
      <path d="M72 296C136 280 176 248 224 238C286 224 332 240 390 208C444 180 498 132 612 108" fill="none" stroke="${palette[3]}" stroke-width="10" stroke-linecap="round" />
      <path d="M72 322C164 296 230 304 300 282C382 256 454 240 612 176" fill="none" stroke="${palette[2]}" stroke-width="8" stroke-linecap="round" opacity="0.95" />
      ${theme.metrics
        .map((label, index) => {
          const x = 62 + index * 214;
          return infoTile(x, 420, 196, label, "Commercial signal used in sourcing review.", palette);
        })
        .join("")}
    </g>
  `;
}

function renderPricingDiagram(theme, palette) {
  return `
    <g transform="translate(58 188)">
      <rect width="344" height="408" rx="34" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
      <text x="28" y="58" fill="${palette[4]}" font-size="22" font-weight="750" font-family="Inter, Arial, Helvetica, sans-serif">Quote composition</text>
      ${theme.metrics
        .map((label, index) => {
          return `
            <g transform="translate(28 ${100 + index * 96})">
              <rect width="286" height="68" rx="22" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
              <rect x="18" y="20" width="${84 + index * 46}" height="28" rx="14" fill="${index % 2 === 0 ? palette[2] : palette[3]}" opacity="0.94" />
              <text x="132" y="43" fill="${palette[4]}" font-size="17" font-weight="650" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(label)}</text>
            </g>
          `;
        })
        .join("")}
      <g transform="translate(434 48)">
        <rect width="312" height="548" rx="34" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
        <text x="28" y="56" fill="${palette[4]}" font-size="22" font-weight="750" font-family="Inter, Arial, Helvetica, sans-serif">Commercial effect</text>
        <path d="M48 414V146" stroke="rgba(255,255,255,0.12)" stroke-width="4" stroke-linecap="round" />
        <path d="M48 414H262" stroke="rgba(255,255,255,0.12)" stroke-width="4" stroke-linecap="round" />
        <path d="M78 376C132 330 160 306 198 252C222 218 234 178 252 132" fill="none" stroke="${palette[3]}" stroke-width="10" stroke-linecap="round" />
        <circle cx="252" cy="132" r="14" fill="${palette[3]}" />
        <circle cx="198" cy="252" r="14" fill="${palette[2]}" />
        <circle cx="132" cy="330" r="14" fill="${palette[3]}" />
        ${infoTile(28, 452, 256, "Pricing context", "Higher spec, tighter purity, and smaller batches usually drive higher quoting pressure.", palette)}
      </g>
    </g>
  `;
}

function renderDocumentDiagram(theme, palette) {
  return `
    <g transform="translate(60 184)">
      <g transform="translate(0 10)">
        <rect width="300" height="420" rx="34" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" />
        <rect x="38" y="38" width="128" height="16" rx="8" fill="${palette[3]}" />
        <rect x="38" y="72" width="188" height="10" rx="5" fill="rgba(255,255,255,0.78)" />
        ${[0, 1, 2, 3].map((index) => `<rect x="38" y="${118 + index * 56}" width="220" height="12" rx="6" fill="rgba(255,255,255,0.26)" />`).join("")}
        <path d="M42 330C96 310 152 318 196 286C232 260 242 226 252 194" fill="none" stroke="${palette[2]}" stroke-width="8" stroke-linecap="round" />
        <circle cx="234" cy="340" r="44" fill="${palette[3]}" opacity="0.95" />
        <path d="M216 340l12 12 24-28" fill="none" stroke="${palette[0]}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <g transform="translate(338 0)">
        ${theme.checks
          .map((check, index) => {
            return `
              <g transform="translate(0 ${index * 154})">
                <rect width="384" height="126" rx="30" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
                <circle cx="42" cy="44" r="16" fill="${index % 2 === 0 ? palette[3] : palette[2]}" />
                <path d="M34 44l6 6 12-14" fill="none" stroke="${palette[0]}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <text x="76" y="50" fill="${palette[4]}" font-size="22" font-weight="750" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(check)}</text>
                <rect x="76" y="72" width="226" height="10" rx="5" fill="rgba(255,255,255,0.24)" />
                <rect x="76" y="92" width="176" height="10" rx="5" fill="rgba(255,255,255,0.16)" />
              </g>
            `;
          })
          .join("")}
      </g>
    </g>
  `;
}

function renderComplianceDiagram(theme, palette) {
  return `
    <g transform="translate(60 194)">
      <circle cx="146" cy="168" r="118" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
      <ellipse cx="146" cy="168" rx="118" ry="44" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="4" />
      <ellipse cx="146" cy="168" rx="70" ry="118" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="4" />
      <path d="M28 168H264M52 112C78 130 104 140 146 140C186 140 216 126 248 108M48 228C84 206 112 198 154 198C188 198 220 206 252 224" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      <path d="M268 168H650" stroke="rgba(255,255,255,0.16)" stroke-width="6" stroke-linecap="round" />
      ${theme.checks
        .map((check, index) => {
          const x = 334 + index * 132;
          return `
            <g transform="translate(${x} 118)">
              <circle cx="0" cy="50" r="24" fill="${index % 2 === 0 ? palette[2] : palette[3]}" />
              <text x="0" y="56" text-anchor="middle" fill="${palette[0]}" font-size="16" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${index + 1}</text>
              <rect x="-58" y="108" width="116" height="84" rx="22" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" />
              ${textLines(wrapText(check, 13), -40, 142, 14, 18, palette[4], 700)}
            </g>
          `;
        })
        .join("")}
      ${infoTile(0, 326, 220, "Context", "Classification and intended use shape regulatory treatment.", palette)}
      ${infoTile(240, 326, 220, "Route", "Import review depends on jurisdiction and buyer pathway.", palette)}
      ${infoTile(480, 326, 220, "Labeling", "Commercial presentation should align with intended use.", palette)}
    </g>
  `;
}

function renderDashboardDiagram(theme, palette) {
  return `
    <g transform="translate(60 196)">
      <rect width="700" height="386" rx="34" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
      ${theme.metrics
        .slice(0, 5)
        .map((metric, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 28 + col * 220;
          const y = 28 + row * 136;
          const width = row === 1 && index === 4 ? 424 : 192;
          return `
            <g transform="translate(${x} ${y})">
              <rect width="${width}" height="108" rx="26" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
              <rect x="18" y="18" width="78" height="12" rx="6" fill="${index % 2 === 0 ? palette[2] : palette[3]}" />
              <text x="18" y="62" fill="${palette[4]}" font-size="20" font-weight="750" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(metric)}</text>
              <rect x="18" y="78" width="${Math.max(110, width - 84)}" height="10" rx="5" fill="rgba(255,255,255,0.22)" />
            </g>
          `;
        })
        .join("")}
      <path d="M54 324H646" stroke="rgba(255,255,255,0.14)" stroke-width="3" />
      <path d="M72 344C150 316 204 316 268 282C326 252 378 238 452 198C508 168 570 136 622 118" fill="none" stroke="${palette[3]}" stroke-width="9" stroke-linecap="round" />
    </g>
  `;
}

function renderSequenceDiagram(theme, palette) {
  return `
    <g transform="translate(56 194)">
      <path d="M118 24C168 72 194 116 194 160C194 206 166 252 118 302" fill="none" stroke="${palette[3]}" stroke-width="10" stroke-linecap="round" />
      <path d="M286 24C236 72 210 116 210 160C210 206 238 252 286 302" fill="none" stroke="${palette[2]}" stroke-width="10" stroke-linecap="round" />
      ${[0, 1, 2, 3, 4].map((index) => {
        const y = 62 + index * 48;
        return `
          <line x1="134" y1="${y}" x2="270" y2="${y}" stroke="rgba(255,255,255,0.2)" stroke-width="6" />
          <circle cx="134" cy="${y}" r="12" fill="${index % 2 === 0 ? palette[2] : palette[4]}" />
          <circle cx="270" cy="${y}" r="12" fill="${index % 2 === 0 ? palette[4] : palette[3]}" />
        `;
      }).join("")}
      ${theme.steps
        .map((step, index) => {
          return infoTile(356, index * 132, 332, step, "Defined as part of the project brief and supply path.", palette);
        })
        .join("")}
    </g>
  `;
}

function renderPortfolioDiagram(theme, palette) {
  return `
    <g transform="translate(58 202)">
      ${theme.metrics
        .map((metric, index) => {
          const x = 18 + index * 220;
          return `
            <g transform="translate(${x} 0)">
              <rect x="26" width="74" height="196" rx="28" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.16)" />
              <rect x="38" y="18" width="50" height="18" rx="9" fill="${index % 2 === 0 ? palette[3] : palette[2]}" />
              <rect x="38" y="54" width="50" height="92" rx="24" fill="rgba(255,255,255,0.84)" />
              <rect x="38" y="160" width="50" height="12" rx="6" fill="rgba(255,255,255,0.22)" />
              <rect x="-10" y="226" width="146" height="88" rx="24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" />
              ${textLines(wrapText(metric, 14), 18, 260, 15, 18, palette[4], 700)}
            </g>
          `;
        })
        .join("")}
      <path d="M58 358C144 326 210 322 296 292C382 262 452 234 618 170" fill="none" stroke="${palette[3]}" stroke-width="9" stroke-linecap="round" />
    </g>
  `;
}

function renderRiskDiagram(theme, palette) {
  return `
    <g transform="translate(74 188)">
      <path d="M292 8L560 456H24Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="6" />
      <rect x="274" y="136" width="36" height="126" rx="18" fill="${palette[3]}" />
      <circle cx="292" cy="312" r="20" fill="${palette[3]}" />
      ${theme.metrics
        .slice(0, 3)
        .map((metric, index) => {
          const positions = [
            [396, 44],
            [420, 194],
            [398, 344],
          ];
          const [x, y] = positions[index];
          return infoTile(x, y, 248, metric, "Managed through tighter review, supplier alignment, and planning.", palette);
        })
        .join("")}
    </g>
  `;
}

function renderLabDiagram(theme, palette) {
  return `
    <g transform="translate(56 190)">
      <rect width="712" height="408" rx="34" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" />
      <g transform="translate(44 48)">
        <path d="M88 0C112 0 128 18 128 42V72H170C192 72 208 88 208 110V128C208 150 194 168 172 172L212 252H166L132 186H78V300H36V186H0V148H36V42C36 18 60 0 88 0Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
        <circle cx="136" cy="136" r="34" fill="${palette[3]}" opacity="0.9" />
      </g>
      ${infoTile(300, 40, 356, theme.metrics[0], "Built into our internal review and supply-control process.", palette)}
      ${infoTile(300, 178, 356, theme.metrics[1], "Supports clearer release review and supply coordination.", palette)}
      ${infoTile(300, 316, 172, theme.metrics[2], "Keeps lot-level review aligned with incoming data.", palette)}
      ${infoTile(484, 316, 172, theme.metrics[3], "Helps maintain continuity across repeat commercial supply.", palette)}
    </g>
  `;
}

function renderBoard(theme, palette) {
  switch (theme.kind) {
    case "structure":
      return renderStructureDiagram(theme, palette);
    case "matrix":
      return renderMatrixDiagram(theme, palette);
    case "flow":
      return renderFlowDiagram(theme, palette);
    case "chart":
      return renderChartDiagram(theme, palette);
    case "pricing":
      return renderPricingDiagram(theme, palette);
    case "document":
      return renderDocumentDiagram(theme, palette);
    case "compliance":
      return renderComplianceDiagram(theme, palette);
    case "dashboard":
      return renderDashboardDiagram(theme, palette);
    case "sequence":
      return renderSequenceDiagram(theme, palette);
    case "portfolio":
      return renderPortfolioDiagram(theme, palette);
    case "risk":
      return renderRiskDiagram(theme, palette);
    case "lab":
      return renderLabDiagram(theme, palette);
    default:
      return "";
  }
}

function renderFeaturedSvg(theme) {
  const [bg, panel, accent, accentSoft, text, muted] = theme.palette;
  const headingLines = wrapText(theme.heading, 22).slice(0, 2);
  const summaryLines = wrapText(theme.summary, 30).slice(0, 2);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="120" y1="80" x2="1510" y2="840" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bg}" />
      <stop offset="1" stop-color="${panel}" />
    </linearGradient>
    <linearGradient id="rightPanel" x1="930" y1="92" x2="1520" y2="786" gradientUnits="userSpaceOnUse">
      <stop stop-color="rgba(255,255,255,0.11)" />
      <stop offset="1" stop-color="rgba(255,255,255,0.06)" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" rx="56" fill="url(#bg)" />
  <circle cx="1380" cy="140" r="180" fill="${accent}" opacity="0.14" />
  <circle cx="180" cy="760" r="210" fill="${accentSoft}" opacity="0.15" />
  <path d="M0 716C180 650 354 628 528 640C712 654 864 720 1056 714C1220 710 1402 636 1600 520V900H0V716Z" fill="rgba(255,255,255,0.04)" />
  <g opacity="0.1">
    ${[0, 1, 2, 3, 4].map((row) => `<line x1="74" y1="${106 + row * 136}" x2="864" y2="${106 + row * 136}" stroke="white" />`).join("")}
    ${[0, 1, 2, 3, 4, 5].map((col) => `<line x1="${86 + col * 132}" y1="86" x2="${86 + col * 132}" y2="770" stroke="white" />`).join("")}
  </g>
  <g transform="translate(72 84)">
    <rect width="816" height="734" rx="42" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" />
    <rect x="34" y="34" width="150" height="34" rx="17" fill="${accent}" opacity="0.92" />
    <text x="109" y="56" text-anchor="middle" fill="${bg}" font-size="15" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">Atlas Insight</text>
    <text x="34" y="114" fill="${text}" font-size="30" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(theme.boardTitle)}</text>
    ${statBadge(618, 28, theme.statValue, theme.statLabel, theme.palette)}
    ${renderBoard(theme, theme.palette)}
  </g>
  <g transform="translate(940 92)">
    <rect width="584" height="716" rx="44" fill="url(#rightPanel)" stroke="rgba(255,255,255,0.16)" />
    <rect x="42" y="42" width="170" height="38" rx="19" fill="${accent}" opacity="0.94" />
    <text x="127" y="66" text-anchor="middle" fill="${bg}" font-size="15" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(theme.label)}</text>
    ${textLines(headingLines, 42, 170, 50, 58, text, 800)}
    ${textLines(summaryLines, 42, 300, 24, 34, muted, 600, 0.96)}
    <rect x="42" y="372" width="452" height="1" fill="rgba(255,255,255,0.14)" />
    ${chip(42, 418, theme.chips[0], theme.palette)}
    ${chip(188, 418, theme.chips[1], theme.palette)}
    ${chip(354, 418, theme.chips[2], theme.palette)}
  </g>
</svg>`;
}

function renderInlineSvg(theme) {
  const [bg, panel, accent, accentSoft, text, muted] = theme.palette;
  const headingLines = wrapText(theme.heading, 22).slice(0, 2);
  const summaryLines = wrapText(theme.summary, 26).slice(0, 3);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1400" height="860" viewBox="0 0 1400 860" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgInline" x1="80" y1="80" x2="1320" y2="800" gradientUnits="userSpaceOnUse">
      <stop stop-color="${bg}" />
      <stop offset="1" stop-color="${panel}" />
    </linearGradient>
  </defs>
  <rect width="1400" height="860" rx="52" fill="url(#bgInline)" />
  <circle cx="1180" cy="132" r="150" fill="${accent}" opacity="0.14" />
  <circle cx="170" cy="720" r="186" fill="${accentSoft}" opacity="0.15" />
  <g transform="translate(60 78)">
    <rect width="722" height="666" rx="40" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" />
    <rect x="30" y="30" width="132" height="32" rx="16" fill="${accent}" opacity="0.92" />
    <text x="96" y="51" text-anchor="middle" fill="${bg}" font-size="14" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">Atlas Insight</text>
    <text x="30" y="106" fill="${text}" font-size="28" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(theme.boardTitle)}</text>
    ${textLines(wrapText(theme.boardSubtitle, 40), 30, 136, 16, 21, muted, 600, 0.88)}
    <g transform="scale(0.86) translate(8 114)">
      ${renderBoard(theme, theme.palette)}
    </g>
  </g>
  <g transform="translate(832 98)">
    <rect width="504" height="626" rx="38" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" />
    <text x="34" y="54" fill="${accentSoft}" font-size="15" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif">${escapeXml(theme.label)}</text>
    ${textLines(headingLines, 34, 118, 38, 48, text, 800)}
    ${textLines(summaryLines, 34, 220, 18, 26, text, 500, 0.82)}
    ${theme.chips.map((item, index) => chip(34 + index * 146, 324, item, theme.palette)).join("")}
    ${theme.bullets.slice(0, 2).map((bullet, index) => bulletRow(index, 402 + index * 72, bullet, theme.palette)).join("")}
  </g>
</svg>`;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function insertInlineImage(raw, imageMarkdown) {
  const normalized = raw.replace(/\r\n/g, "\n");
  const frontmatterMatch = normalized.match(/^---\n[\s\S]*?\n---\n\n/);

  if (!frontmatterMatch) {
    return normalized;
  }

  const frontmatterBlock = frontmatterMatch[0];
  let body = normalized.slice(frontmatterBlock.length);

  if (body.includes(imageMarkdown)) {
    return normalized;
  }

  if (/^!\[[^\]]*\]\([^)]+\)\n\n/.test(body)) {
    body = body.replace(/^!\[[^\]]*\]\([^)]+\)\n\n/, `${imageMarkdown}\n\n`);
    return `${frontmatterBlock}${body}`;
  }

  const separator = "\n\n---\n\n";
  if (body.includes(separator)) {
    body = body.replace(separator, `\n\n${imageMarkdown}${separator}`);
    return `${frontmatterBlock}${body}`;
  }

  return `${frontmatterBlock}${imageMarkdown}\n\n${body}`;
}

ensureDir(publicBlogDir);
ensureDir(inlineDir);

const files = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx"))
  .sort((left, right) => left.localeCompare(right));

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const parsed = matter(raw);
  const theme = themes[parsed.data.slug];

  if (!theme) {
    continue;
  }

  const featuredRelative = String(parsed.data.image || "").replace(/^\/blog\//, "");
  const inlineRelative = path.posix.join("inline", `${parsed.data.slug}-overview.svg`);
  const inlinePublicPath = `/blog/${inlineRelative}`;
  const inlineMarkdown = `![${theme.inlineAlt}](${inlinePublicPath})`;

  fs.writeFileSync(path.join(publicBlogDir, featuredRelative), renderFeaturedSvg(theme), "utf8");
  fs.writeFileSync(path.join(publicBlogDir, inlineRelative), renderInlineSvg(theme), "utf8");

  const updated = insertInlineImage(raw, inlineMarkdown);
  fs.writeFileSync(filePath, updated, "utf8");
}

console.log(`Generated upgraded featured and inline blog visuals for ${files.length} posts.`);
