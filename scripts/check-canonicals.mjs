import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const nextBin = join(rootDir, "node_modules", "next", "dist", "bin", "next");
const buildIdPath = join(rootDir, ".next", "BUILD_ID");
const port = Number(process.env.CANONICAL_CHECK_PORT || "3112");
const localBaseUrl = `http://127.0.0.1:${port}`;
const baseUrl = process.env.CANONICAL_CHECK_BASE_URL || localBaseUrl;
const shouldStartLocalServer = !process.env.CANONICAL_CHECK_BASE_URL;

const expectedPages = [
  { path: "/", expectedCanonical: "https://www.atlasbiolabs.co/" },
  { path: "/shop", expectedCanonical: "https://www.atlasbiolabs.co/shop" },
  {
    path: "/shop?category=signal-peptides",
    expectedCanonical: "https://www.atlasbiolabs.co/shop",
  },
  {
    path: "/shop?status=standard",
    expectedCanonical: "https://www.atlasbiolabs.co/shop",
  },
  {
    path: "/shop?search=bpc",
    expectedCanonical: "https://www.atlasbiolabs.co/shop",
  },
  {
    path: "/wholesale",
    expectedCanonical: "https://www.atlasbiolabs.co/wholesale",
  },
  {
    path: "/blog/top-peptides-in-demand",
    expectedCanonical: "https://www.atlasbiolabs.co/blog/top-peptides-in-demand",
  },
  {
    path: "/shop/cjc-1295-with-dac",
    expectedCanonical: "https://www.atlasbiolabs.co/shop/cjc-1295-with-dac",
  },
];

function extractCanonicals(html) {
  return [
    ...html.matchAll(
      /<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["'][^>]*>/gi
    ),
  ].map((match) => match[1]?.trim() ?? "");
}

function canonicalEquals(actual, expected) {
  if (actual === expected) {
    return true;
  }

  // Next.js normalizes the root canonical to the origin in Metadata API output.
  return (
    actual === "https://www.atlasbiolabs.co" &&
    expected === "https://www.atlasbiolabs.co/"
  );
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

async function checkPage(page) {
  const response = await fetch(`${baseUrl}${page.path}`, {
    redirect: "follow",
    signal: AbortSignal.timeout(10000),
  });
  const html = await response.text();
  const canonicals = extractCanonicals(html);
  const canonical = canonicals[0] ?? "";
  const ok =
    response.ok &&
    canonicals.length === 1 &&
    canonicalEquals(canonical, page.expectedCanonical);

  return {
    ...page,
    ok,
    status: response.status,
    finalUrl: response.url,
    canonical,
    expectedCanonical: page.expectedCanonical,
    canonicalCount: canonicals.length,
  };
}

async function checkNonWwwRedirect() {
  const response = await fetch(`${localBaseUrl}/wholesale`, {
    headers: { host: "atlasbiolabs.co" },
    redirect: "manual",
    signal: AbortSignal.timeout(10000),
  });
  const location = response.headers.get("location") ?? "";

  return {
    ok:
      response.status === 308 &&
      location === "https://www.atlasbiolabs.co/wholesale",
    status: response.status,
    location,
  };
}

async function run() {
  let server;

  if (shouldStartLocalServer) {
    if (!existsSync(buildIdPath)) {
      throw new Error(
        "Missing .next/BUILD_ID. Run `npm run build` before `npm run check:canonicals`."
      );
    }

    server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
      cwd: rootDir,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });

    await waitForServer();
  }

  try {
    const results = [];

    for (const page of expectedPages) {
      results.push(await checkPage(page));
    }

    const redirectResult = shouldStartLocalServer && process.env.CANONICAL_CHECK_REDIRECT === "1"
      ? await checkNonWwwRedirect()
      : null;

    console.log("# Canonical Check");
    console.log("");
    console.log(`Fetch base: ${baseUrl}`);
    console.log("");

    for (const result of results) {
      console.log(`${result.ok ? "PASS" : "FAIL"} ${result.path}`);
      console.log(`  status: ${result.status}`);
      console.log(`  final URL: ${result.finalUrl}`);
      console.log(`  canonical href: ${result.canonical || "(missing)"}`);
      console.log(`  canonical count: ${result.canonicalCount}`);
      console.log(`  expected: ${result.expectedCanonical}`);
      console.log(
        `  canonical equals expected: ${canonicalEquals(result.canonical, result.expectedCanonical)}`
      );
    }

    if (redirectResult) {
      console.log(
        `${redirectResult.ok ? "PASS" : "FAIL"} non-www host redirect /wholesale`
      );
      console.log(`  status: ${redirectResult.status}`);
      console.log(`  location: ${redirectResult.location || "(missing)"}`);
      console.log(`  expected: https://www.atlasbiolabs.co/wholesale`);
    }

    if (
      results.some((result) => !result.ok) ||
      (redirectResult && !redirectResult.ok)
    ) {
      process.exitCode = 1;
    }
  } finally {
    if (server && !server.killed) {
      server.kill("SIGTERM");
      await Promise.race([
        delay(3000),
        new Promise((resolve) => server.once("exit", resolve)),
      ]);
    }
  }
}

run().catch((error) => {
  console.error("Canonical check failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
