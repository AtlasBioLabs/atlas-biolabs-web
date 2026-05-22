import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import matter from "gray-matter";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const nextBin = join(rootDir, "node_modules", "next", "dist", "bin", "next");
const buildIdPath = join(rootDir, ".next", "BUILD_ID");
const blogDir = join(rootDir, "content", "blog");
const port = Number(process.env.SEO_AUDIT_PORT || "3111");
const baseUrl = `http://127.0.0.1:${port}`;
const canonicalOrigin = "https://www.atlasbiolabs.co";
const complianceNote =
  "Atlas BioLabs content is provided for qualified commercial sourcing, research, documentation, and formulation context only. No medical, dosing, or human-use claims are made.";

const auditedRoutes = [
  {
    label: "Homepage",
    path: "/",
    expectedCanonical: `${canonicalOrigin}/`,
    expectedTypes: ["Organization", "WebSite"],
    expectBreadcrumb: false,
  },
  {
    label: "Shop",
    path: "/shop",
    expectedCanonical: `${canonicalOrigin}/shop`,
    expectedTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
    expectBreadcrumb: true,
  },
  {
    label: "Product",
    path: "/shop/bpc-157",
    expectedCanonical: `${canonicalOrigin}/shop/bpc-157`,
    expectedTypes: ["Product", "ProductGroup", "BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Category",
    path: "/categories/trending-emerging-peptides",
    expectedCanonical: `${canonicalOrigin}/categories/trending-emerging-peptides`,
    expectedTypes: ["BreadcrumbList", "CollectionPage", "ItemList"],
    expectBreadcrumb: true,
  },
  {
    label: "Blog Hub",
    path: "/blog",
    expectedCanonical: `${canonicalOrigin}/blog`,
    expectedTypes: ["BreadcrumbList", "CollectionPage"],
    expectBreadcrumb: true,
  },
  {
    label: "Blog Start Here",
    path: "/blog/start-here",
    expectedCanonical: `${canonicalOrigin}/blog/start-here`,
    expectedTypes: ["BreadcrumbList", "WebPage"],
    expectBreadcrumb: true,
  },
  {
    label: "Blog Post",
    path: "/blog/retatrutide-peptide-commercial-sourcing",
    expectedCanonical: `${canonicalOrigin}/blog/retatrutide-peptide-commercial-sourcing`,
    expectedTypes: ["Article", "BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Landing Page",
    path: "/peptide-supplier",
    expectedCanonical: `${canonicalOrigin}/peptide-supplier`,
    expectedTypes: ["BreadcrumbList", "CollectionPage"],
    expectBreadcrumb: true,
  },
  {
    label: "Documentation Page",
    path: "/peptide-documentation",
    expectedCanonical: `${canonicalOrigin}/peptide-documentation`,
    expectedTypes: ["BreadcrumbList", "WebPage"],
    expectBreadcrumb: true,
  },
  {
    label: "Comparison Page",
    path: "/compare/bpc-157-vs-tb-500",
    expectedCanonical: `${canonicalOrigin}/compare/bpc-157-vs-tb-500`,
    expectedTypes: ["BreadcrumbList", "WebPage"],
    expectBreadcrumb: true,
  },
  {
    label: "Glossary Page",
    path: "/glossary/coa",
    expectedCanonical: `${canonicalOrigin}/glossary/coa`,
    expectedTypes: ["BreadcrumbList", "WebPage"],
    expectBreadcrumb: true,
  },
  {
    label: "Download Page",
    path: "/downloads/peptide-supplier-checklist",
    expectedCanonical: `${canonicalOrigin}/downloads/peptide-supplier-checklist`,
    expectedTypes: ["BreadcrumbList", "WebPage"],
    expectBreadcrumb: true,
  },
  {
    label: "FAQ Page",
    path: "/faq",
    expectedCanonical: `${canonicalOrigin}/faq`,
    expectedTypes: ["BreadcrumbList", "WebPage"],
    expectBreadcrumb: true,
  },
];

const requiredStaticRoutes = [
  "/",
  "/shop",
  "/categories",
  "/blog",
  "/blog/start-here",
  "/wholesale",
  "/about",
  "/contact",
  "/request-quote",
  "/quality-assurance",
  "/research",
  "/peptide-supplier",
  "/wholesale-peptides",
  "/custom-peptide-sourcing",
  "/peptide-documentation",
  "/coa-verification",
  "/bulk-peptide-supply",
  "/cosmetic-peptide-supplier",
  "/research-peptide-supplier",
  "/compliance",
  "/shipping-and-lead-times",
  "/faq",
  "/compare",
  "/compare/bpc-157-vs-tb-500",
  "/compare/ghk-cu-vs-matrixyl",
  "/compare/retatrutide-vs-semaglutide-vs-tirzepatide",
  "/compare/argireline-vs-snap-8",
  "/compare/copper-peptides-vs-signal-peptides",
  "/glossary",
  "/glossary/coa",
  "/glossary/hplc",
  "/glossary/mass-spectrometry",
  "/glossary/lyophilized-powder",
  "/glossary/moq",
  "/glossary/batch-number",
  "/glossary/peptide-purity",
  "/glossary/lead-time",
  "/glossary/pack-size",
  "/glossary/product-variation",
  "/downloads",
  "/downloads/peptide-supplier-checklist",
  "/downloads/coa-review-checklist",
  "/downloads/bulk-peptide-quote-preparation",
  "/downloads/cosmetic-peptide-buyer-guide",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match?.[1]?.trim() ?? "";
}

function extractMetaDescription(html) {
  const match = html.match(
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["'][^>]*>/i
  );
  return match?.[1]?.trim() ?? "";
}

function extractCanonicals(html) {
  return [
    ...html.matchAll(
      /<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["'][^>]*>/gi
    ),
  ].map((match) => match[1]?.trim() ?? "");
}

function extractH1(html) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? "";
}

function hasNoIndex(html) {
  return /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

function hasBreadcrumbNav(html) {
  return /<nav[^>]+aria-label=["']Breadcrumb["']/i.test(html);
}

function getJsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]?.trim())
    .filter(Boolean)
    .map((payload) => JSON.parse(payload));
}

function getTopLevelTypes(blocks) {
  return blocks.flatMap((block) => {
    if (Array.isArray(block)) {
      return block
        .map((entry) => entry?.["@type"])
        .filter((value) => typeof value === "string");
    }

    const type = block?.["@type"];
    return typeof type === "string" ? [type] : [];
  });
}

function canonicalEquals(actual, expected) {
  if (actual === expected) {
    return true;
  }

  return actual === canonicalOrigin && expected === `${canonicalOrigin}/`;
}

function normalizeRoute(route) {
  if (route === canonicalOrigin || route === `${canonicalOrigin}/`) {
    return "/";
  }

  const pathname = route
    .replace(canonicalOrigin, "")
    .replace(/\/+$/, "");

  return pathname || "/";
}

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10000),
  });

  return { response, text: await response.text() };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl, {
        redirect: "manual",
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok || response.status === 307 || response.status === 308) {
        return;
      }
    } catch {}

    await delay(1000);
  }

  throw new Error(`Timed out waiting for Next.js to start on ${baseUrl}`);
}

function getSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function getBlogFiles() {
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort((left, right) => left.localeCompare(right));
}

function getInternalMarkdownLinks(body) {
  return [...body.matchAll(/\]\((\/[^)\s]+)\)/g)].map((match) => match[1]);
}

async function run() {
  assert(
    fs.existsSync(buildIdPath),
    "Missing .next/BUILD_ID. Run `npm run build` before `npm run seo:audit`."
  );

  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: rootDir,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer();

    const runtimePasses = [];

    for (const route of auditedRoutes) {
      const { response, text } = await fetchText(route.path);
      assert(response.ok, `${route.label}: expected 200, received ${response.status}`);

      const title = extractTitle(text);
      const description = extractMetaDescription(text);
      const canonicals = extractCanonicals(text);
      const canonical = canonicals[0] ?? "";
      const h1 = extractH1(text);
      const jsonLdBlocks = getJsonLdBlocks(text);
      const topLevelTypes = getTopLevelTypes(jsonLdBlocks);

      assert(title.length > 0, `${route.label}: missing <title>`);
      assert(description.length > 0, `${route.label}: missing meta description`);
      assert(h1.length > 0, `${route.label}: missing H1`);
      assert(canonicals.length === 1, `${route.label}: expected exactly one canonical link, found ${canonicals.length}`);
      assert(canonicalEquals(canonical, route.expectedCanonical), `${route.label}: canonical mismatch`);
      assert(!hasNoIndex(text), `${route.label}: page is marked noindex`);
      if (route.expectBreadcrumb !== false) {
        assert(hasBreadcrumbNav(text), `${route.label}: missing visible breadcrumb nav`);
      }

      for (const type of route.expectedTypes) {
        assert(topLevelTypes.includes(type), `${route.label}: missing ${type} JSON-LD`);
      }

      if (route.path === "/shop") {
        const productHrefs = new Set(
          [...text.matchAll(/href="\/shop\/([^"#?]+)"/g)].map((match) => `/shop/${match[1]}`)
        );
        const categoryHrefs = new Set(
          [...text.matchAll(/href="\/categories\/([^"#?]+)"/g)].map(
            (match) => `/categories/${match[1]}`
          )
        );

        assert(productHrefs.size === 41, `Shop: expected 41 crawlable product links, found ${productHrefs.size}`);
        assert(categoryHrefs.size === 8, `Shop: expected 8 crawlable category links, found ${categoryHrefs.size}`);
      }

      if (route.path.startsWith("/shop/")) {
        assert(/SKU/i.test(text), `${route.label}: product page missing SKU label`);
        assert(/Catalog Code/i.test(text), `${route.label}: product page missing category/catalog detail block`);
        assert(/<img[^>]+alt=["'][^"']+["']/i.test(text), `${route.label}: product page missing image alt text`);
        assert(/Related Products/i.test(text), `${route.label}: product page missing related products section`);
        assert(/Related Articles/i.test(text), `${route.label}: product page missing related articles section`);
      }

      if (route.path.startsWith("/blog/") && route.path !== "/blog/start-here") {
        assert(topLevelTypes.includes("Article"), `${route.label}: expected Article JSON-LD`);
      }

      runtimePasses.push(`PASS ${route.path} -> ${topLevelTypes.join(", ")}`);
    }

    const robots = await fetchText("/robots.txt");
    assert(robots.response.ok, "robots.txt: expected 200");
    assert(/Sitemap:\s*https:\/\/www\.atlasbiolabs\.co\/sitemap\.xml/i.test(robots.text), "robots.txt: missing sitemap reference");
    for (const disallow of ["/admin/", "/api/", "/dashboard/", "/internal/", "/account/"]) {
      assert(new RegExp(`Disallow:\\s*${disallow.replace(/\//g, "\\/")}`, "i").test(robots.text), `robots.txt: missing ${disallow} disallow`);
    }

    const sitemap = await fetchText("/sitemap.xml");
    assert(sitemap.response.ok, "sitemap.xml: expected 200");
    assert(!/https:\/\/atlasbiolabs\.co\//i.test(sitemap.text), "sitemap.xml: contains non-www URL");
    assert(!/http:\/\/(?:www\.)?atlasbiolabs\.co\//i.test(sitemap.text), "sitemap.xml: contains http URL");

    const sitemapUrls = getSitemapUrls(sitemap.text);
    const sitemapRouteSet = new Set(sitemapUrls.map(normalizeRoute));

    for (const route of requiredStaticRoutes) {
      assert(sitemapRouteSet.has(route), `sitemap.xml: missing required URL ${route}`);
    }

    const productUrls = sitemapUrls.filter((url) => url.includes("/shop/"));
    const categoryUrls = sitemapUrls.filter((url) => url.includes("/categories/"));
    const blogCategoryUrls = sitemapUrls.filter((url) => url.includes("/blog/category/"));
    const blogPostUrls = sitemapUrls.filter(
      (url) => url.includes("/blog/") && !url.includes("/blog/category/") && !url.endsWith("/blog")
    );

    assert(productUrls.length === 41, `sitemap.xml: expected 41 product URLs, found ${productUrls.length}`);
    assert(categoryUrls.length === 8, `sitemap.xml: expected 8 category URLs, found ${categoryUrls.length}`);
    assert(blogCategoryUrls.length === 8, `sitemap.xml: expected 8 blog category URLs, found ${blogCategoryUrls.length}`);

    const allPageSummaries = [];
    for (const url of sitemapUrls) {
      const route = normalizeRoute(url);
      const { response, text } = await fetchText(route);
      assert(response.ok, `${route}: expected 200 during sitemap audit`);

      const title = extractTitle(text);
      const description = extractMetaDescription(text);
      const h1 = extractH1(text);
      const canonicals = extractCanonicals(text);
      const canonical = canonicals[0] ?? "";

      assert(title.length > 0, `${route}: missing title`);
      assert(description.length > 0, `${route}: missing meta description`);
      assert(h1.length > 0, `${route}: missing H1`);
      assert(canonicals.length === 1, `${route}: expected one canonical link, found ${canonicals.length}`);
      assert(canonicalEquals(canonical, url), `${route}: canonical mismatch against sitemap URL`);
      assert(!hasNoIndex(text), `${route}: public sitemap URL should not be noindex`);

      allPageSummaries.push({ route, title, description });
    }

    const duplicateTitles = new Map();
    const duplicateDescriptions = new Map();
    for (const summary of allPageSummaries) {
      duplicateTitles.set(summary.title, [...(duplicateTitles.get(summary.title) ?? []), summary.route]);
      duplicateDescriptions.set(summary.description, [
        ...(duplicateDescriptions.get(summary.description) ?? []),
        summary.route,
      ]);
    }

    const duplicateTitleEntries = [...duplicateTitles.entries()].filter(([, routes]) => routes.length > 1);
    const duplicateDescriptionEntries = [...duplicateDescriptions.entries()].filter(([, routes]) => routes.length > 1);
    assert(duplicateTitleEntries.length === 0, `duplicate meta titles found: ${duplicateTitleEntries.map(([, routes]) => routes.join(", ")).join(" | ")}`);
    assert(duplicateDescriptionEntries.length === 0, `duplicate meta descriptions found: ${duplicateDescriptionEntries.map(([, routes]) => routes.join(", ")).join(" | ")}`);

    const blogIssues = [];
    const blogFiles = getBlogFiles();
    for (const file of blogFiles) {
      const fullPath = path.join(blogDir, file);
      const source = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(source);
      const slug = parsed.data.slug;
      const body = parsed.content;

      if (!parsed.data.category) {
        blogIssues.push(`${file}: missing category`);
      }
      if (!parsed.data.excerpt) {
        blogIssues.push(`${file}: missing excerpt`);
      }
      if (!Array.isArray(parsed.data.relatedProductSlugs) || parsed.data.relatedProductSlugs.length === 0) {
        blogIssues.push(`${file}: missing relatedProductSlugs`);
      }
      if (!body.includes(complianceNote)) {
        blogIssues.push(`${file}: missing compliance note in body`);
      }
      if (!slug) {
        blogIssues.push(`${file}: missing slug`);
      } else if (!sitemapRouteSet.has(`/blog/${slug}`)) {
        blogIssues.push(`${file}: sitemap missing /blog/${slug}`);
      }

      for (const href of getInternalMarkdownLinks(body)) {
        const normalizedHref = href.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
        if (!sitemapRouteSet.has(normalizedHref) && !requiredStaticRoutes.includes(normalizedHref)) {
          blogIssues.push(`${file}: broken internal link ${href}`);
        }
      }
    }

    assert(blogIssues.length === 0, `blog content audit failed: ${blogIssues.join(" | ")}`);

    console.log("# SEO Audit");
    console.log("");
    console.log(`Base URL: ${baseUrl}`);
    console.log("");
    for (const pass of runtimePasses) {
      console.log(`- ${pass}`);
    }
    console.log(`- PASS sitemap.xml -> ${sitemapUrls.length} URLs, 41 product URLs, ${blogPostUrls.length} blog URLs, and all Advanced SEO Phase 3 pages detected`);
    console.log(`- PASS robots.txt -> sitemap and disallow rules present`);
    console.log(`- PASS metadata uniqueness -> no duplicate public titles or descriptions found`);
    console.log(`- PASS blog content scan -> ${blogFiles.length} posts validated for category, excerpt, related products, compliance note, and internal links`);
  } finally {
    if (!server.killed) {
      server.kill("SIGTERM");
      await Promise.race([
        delay(3000),
        new Promise((resolve) => server.once("exit", resolve)),
      ]);
    }

    if (server.exitCode && server.exitCode !== 0 && output.trim().length > 0) {
      console.error(output);
    }
  }
}

run().catch((error) => {
  console.error("SEO audit failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
