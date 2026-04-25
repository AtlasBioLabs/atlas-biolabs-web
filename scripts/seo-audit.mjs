import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const nextBin = join(rootDir, "node_modules", "next", "dist", "bin", "next");
const buildIdPath = join(rootDir, ".next", "BUILD_ID");
const port = Number(process.env.SEO_AUDIT_PORT || "3111");
const baseUrl = `http://127.0.0.1:${port}`;
const canonicalOrigin = "https://atlasbiolabs.co";

const auditedRoutes = [
  {
    label: "Homepage",
    path: "/",
    expectedCanonical: canonicalOrigin,
    expectedTypes: ["Organization", "WebSite"],
    expectBreadcrumb: false,
  },
  {
    label: "Shop",
    path: "/shop",
    expectedCanonical: `${canonicalOrigin}/shop`,
    expectedTypes: ["BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Category",
    path: "/categories/signal-peptides",
    expectedCanonical: `${canonicalOrigin}/categories/signal-peptides`,
    expectedTypes: ["BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Trending Category",
    path: "/categories/trending-emerging-peptides",
    expectedCanonical: `${canonicalOrigin}/categories/trending-emerging-peptides`,
    expectedTypes: ["BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Product",
    path: "/shop/bpc-157",
    expectedCanonical: `${canonicalOrigin}/shop/bpc-157`,
    expectedTypes: ["Product", "BreadcrumbList"],
    expectBreadcrumb: true,
    expectVisiblePrice: true,
    productSchemaChecks: true,
  },
  {
    label: "Emerging Product",
    path: "/shop/retatrutide",
    expectedCanonical: `${canonicalOrigin}/shop/retatrutide`,
    expectedTypes: ["Product", "BreadcrumbList"],
    expectBreadcrumb: true,
    expectVisiblePrice: true,
    productSchemaChecks: true,
    expectedStatusText: "Emerging",
  },
  {
    label: "Blend Product",
    path: "/shop/klow-glow-blend",
    expectedCanonical: `${canonicalOrigin}/shop/klow-glow-blend`,
    expectedTypes: ["Product", "BreadcrumbList"],
    expectBreadcrumb: true,
    expectVisiblePrice: true,
    productSchemaChecks: true,
    expectedStatusText: "Blend",
  },
  {
    label: "Blog Index",
    path: "/blog",
    expectedCanonical: `${canonicalOrigin}/blog`,
    expectedTypes: ["BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Blog Post",
    path: "/blog/peptide-supplier-guide",
    expectedCanonical: `${canonicalOrigin}/blog/peptide-supplier-guide`,
    expectedTypes: ["Article", "BreadcrumbList"],
    expectBreadcrumb: true,
    articleSchemaChecks: true,
  },
  {
    label: "Wholesale",
    path: "/wholesale",
    expectedCanonical: `${canonicalOrigin}/wholesale`,
    expectedTypes: ["BreadcrumbList"],
    expectBreadcrumb: true,
  },
  {
    label: "Contact",
    path: "/contact",
    expectedCanonical: `${canonicalOrigin}/contact`,
    expectedTypes: ["BreadcrumbList"],
    expectBreadcrumb: true,
  },
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

function extractCanonical(html) {
  const match = html.match(
    /<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["'][^>]*>/i
  );
  return match?.[1]?.trim() ?? "";
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

function getTopLevelBlockByType(blocks, type) {
  return blocks.find((block) => !Array.isArray(block) && block?.["@type"] === type);
}

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10000),
  });

  const text = await response.text();
  return { response, text };
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

async function run() {
  assert(
    existsSync(buildIdPath),
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

    const results = [];

    for (const route of auditedRoutes) {
      const { response, text } = await fetchText(route.path);
      assert(response.ok, `${route.label}: expected 200, received ${response.status}`);

      const title = extractTitle(text);
      const description = extractMetaDescription(text);
      const canonical = extractCanonical(text);
      const jsonLdBlocks = getJsonLdBlocks(text);
      const topLevelTypes = getTopLevelTypes(jsonLdBlocks);

      assert(title.length > 0, `${route.label}: missing <title>`);
      assert(description.length > 0, `${route.label}: missing meta description`);
      assert(canonical === route.expectedCanonical, `${route.label}: canonical mismatch`);
      assert(!hasNoIndex(text), `${route.label}: page is marked noindex`);

      for (const type of route.expectedTypes) {
        assert(topLevelTypes.includes(type), `${route.label}: missing ${type} JSON-LD`);
      }

      if (route.expectBreadcrumb) {
        assert(hasBreadcrumbNav(text), `${route.label}: missing visible breadcrumb nav`);
      }

      if (route.expectVisiblePrice) {
        assert(
          /Starting from[\s\S]{0,240}USD/i.test(text),
          `${route.label}: visible price not found in rendered HTML`
        );
      }

      if (route.expectedStatusText) {
        assert(text.includes(route.expectedStatusText), `${route.label}: missing status badge text`);
      }

      if (route.productSchemaChecks) {
        const productBlock = getTopLevelBlockByType(jsonLdBlocks, "Product");
        assert(productBlock, `${route.label}: Product JSON-LD block not found`);
        assert(productBlock.offers?.priceCurrency === "USD", `${route.label}: missing USD priceCurrency`);
        assert(productBlock.offers?.price, `${route.label}: Product JSON-LD missing offers.price`);
        assert(productBlock.offers?.url === route.expectedCanonical, `${route.label}: Product offer URL mismatch`);
      }

      if (route.articleSchemaChecks) {
        const articleBlock = getTopLevelBlockByType(jsonLdBlocks, "Article");
        assert(articleBlock, `${route.label}: Article JSON-LD block not found`);
        assert(articleBlock.datePublished, `${route.label}: Article missing datePublished`);
        assert(articleBlock.dateModified, `${route.label}: Article missing dateModified`);
        assert(articleBlock.mainEntityOfPage === route.expectedCanonical, `${route.label}: Article mainEntityOfPage mismatch`);
      }

      if (route.path === "/" || route.path === "/shop" || route.path === "/shop/bpc-157" || route.path === "/blog/peptide-supplier-guide") {
        assert(/<img[^>]+alt=["'][^"']+["']/i.test(text), `${route.label}: no image alt text found`);
      }

      results.push({
        route: route.path,
        title,
        canonical,
        types: topLevelTypes,
      });
    }

    const robots = await fetchText("/robots.txt");
    assert(robots.response.ok, "robots.txt: expected 200");
    assert(/Sitemap:\s*https:\/\/atlasbiolabs\.co\/sitemap\.xml/i.test(robots.text), "robots.txt: missing sitemap reference");
    assert(/Disallow:\s*\/api\/internal\//i.test(robots.text), "robots.txt: missing /api/internal/ disallow");

    const sitemap = await fetchText("/sitemap.xml");
    assert(sitemap.response.ok, "sitemap.xml: expected 200");
    assert(sitemap.text.includes(`${canonicalOrigin}/shop/bpc-157`), "sitemap.xml: missing product canonical");
    assert(
      sitemap.text.includes(`${canonicalOrigin}/shop/retatrutide`),
      "sitemap.xml: missing emerging product canonical"
    );
    assert(
      sitemap.text.includes(`${canonicalOrigin}/shop/klow-glow-blend`),
      "sitemap.xml: missing blend product canonical"
    );
    assert(sitemap.text.includes(`${canonicalOrigin}/categories/signal-peptides`), "sitemap.xml: missing category canonical");
    assert(
      sitemap.text.includes(`${canonicalOrigin}/categories/trending-emerging-peptides`),
      "sitemap.xml: missing trending category canonical"
    );
    assert(sitemap.text.includes(`${canonicalOrigin}/blog/peptide-supplier-guide`), "sitemap.xml: missing blog canonical");

    const productMatches = sitemap.text.match(/<loc>https:\/\/atlasbiolabs\.co\/shop\/[^<]+<\/loc>/g) ?? [];
    assert(productMatches.length === 41, `sitemap.xml: expected 41 product URLs, found ${productMatches.length}`);

    console.log("# SEO Audit");
    console.log("");
    console.log(`Base URL: ${baseUrl}`);
    console.log("");
    for (const result of results) {
      console.log(`- PASS ${result.route} -> ${result.types.join(", ")}`);
    }
    console.log(`- PASS /robots.txt -> sitemap and crawl rules present`);
    console.log(`- PASS /sitemap.xml -> canonical URLs present, 41 product URLs detected`);
  } finally {
    if (!server.killed) {
      server.kill("SIGTERM");
      await Promise.race([delay(3000), new Promise((resolve) => server.once("exit", resolve))]);
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
