import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

function stripMarkdownSyntax(raw: string) {
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

function extractHeadings(raw: string) {
  const slugger = new GithubSlugger();
  const headings: Array<{ level: number; text: string; slug: string }> = [];
  let inCodeBlock = false;

  for (const line of raw.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = /^(##|###)\s+(.*)$/.exec(line.trim());

    if (!match) {
      continue;
    }

    const text = stripMarkdownSyntax(match[2].replace(/\s+#*$/, ""));

    if (!text) {
      continue;
    }

    headings.push({
      level: match[1].length,
      text,
      slug: slugger.slug(text),
    });
  }

  return headings;
}

function getReadingTimeMinutes(raw: string) {
  const wordCount = stripMarkdownSyntax(raw)
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(wordCount / 220));
}

export const BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    slug: { type: "string", required: true },
    author: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    image: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post.slug}`,
    },
    headings: {
      type: "json",
      resolve: (post) => extractHeadings(post.body.raw),
    },
    readingTimeMinutes: {
      type: "number",
      resolve: (post) => getReadingTimeMinutes(post.body.raw),
    },
    readingTime: {
      type: "string",
      resolve: (post) => `${getReadingTimeMinutes(post.body.raw)} min read`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [BlogPost],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
    ],
  },
});
