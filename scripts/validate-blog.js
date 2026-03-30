/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(process.cwd(), "content", "blog");
const requiredFields = [
  "title",
  "description",
  "date",
  "slug",
  "author",
  "tags",
  "image",
];

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
