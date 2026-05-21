/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(process.cwd(), "content", "blog");
const requiredFields = [
  "title",
  "description",
  "date",
  "updatedAt",
  "slug",
  "author",
  "category",
  "tags",
  "relatedProductSlugs",
  "relatedCategorySlugs",
  "relatedArticleSlugs",
  "seoTitle",
  "metaDescription",
  "canonical",
  "excerpt",
  "image",
];
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

function stripMarkdownSyntax(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(raw) {
  return stripMarkdownSyntax(raw)
    .split(/\s+/)
    .filter(Boolean).length;
}

const files = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx"))
  .sort((left, right) => left.localeCompare(right));

const issues = [];

for (const file of files) {
  const fullPath = path.join(blogDir, file);
  const source = fs.readFileSync(fullPath, "utf8");

  if (source.includes("\r\n")) {
    issues.push(`${file}: uses CRLF line endings; save MDX files with LF line endings.`);
  }

  try {
    const parsed = matter(source);

    for (const field of requiredFields) {
      const value = parsed.data[field];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        issues.push(`${file}: missing required frontmatter field "${field}".`);
      }
    }

    const body = parsed.content;
    const wordCount = countWords(body);
    const minimumWordCount = pillarSlugs.has(parsed.data.slug) ? 2000 : 1200;

    if (wordCount < minimumWordCount) {
      issues.push(
        `${file}: only ${wordCount} words; expected at least ${minimumWordCount}.`
      );
    }

    if (!body.includes("](/shop)")) {
      issues.push(`${file}: missing internal link to /shop.`);
    }

    if (!body.includes("](/request-quote)")) {
      issues.push(`${file}: missing internal link to /request-quote.`);
    }

    const productLinks = [...body.matchAll(/\]\(\/shop\/[^)]+\)/g)];
    if (productLinks.length < 2) {
      issues.push(`${file}: expected at least two product links.`);
    }

    const categoryLinks = [...body.matchAll(/\]\(\/categories\/[^)]+\)/g)];
    if (categoryLinks.length < 1) {
      issues.push(`${file}: expected at least one category link.`);
    }

    const articleLinks = [...body.matchAll(/\]\(\/blog\/[^)]+\)/g)];
    if (articleLinks.length < 1) {
      issues.push(`${file}: expected at least one related article link.`);
    }

    if (
      !body.includes(
        "Atlas BioLabs content is provided for qualified commercial sourcing, research, documentation, and formulation context only. No medical, dosing, or human-use claims are made."
      )
    ) {
      issues.push(`${file}: missing required compliance note.`);
    }
  } catch (error) {
    issues.push(`${file}: ${error.message}`);
  }
}

if (issues.length > 0) {
  console.error("Blog validation failed:");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Blog validation passed for ${files.length} posts.`);
