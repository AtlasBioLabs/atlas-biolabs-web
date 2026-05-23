import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

const chromeExecutableCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_EXECUTABLE_PATH,
  process.env.GOOGLE_CHROME_SHIM,
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA || ""}\\Google\\Chrome\\Application\\chrome.exe`,
].filter(Boolean) as string[];

type BrowserStorageItem = {
  key: string;
  value: unknown;
};

let sharedBrowserPromise: Promise<Browser> | null = null;
let chromiumExecutablePathPromise: Promise<string> | null = null;
let launchLock: Promise<void> = Promise.resolve();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTextFileBusyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("ETXTBSY") || message.toLowerCase().includes("text file busy");
}

function getLocalChromeExecutablePath() {
  for (const executablePath of chromeExecutableCandidates) {
    if (executablePath && fs.existsSync(executablePath)) {
      return executablePath;
    }
  }

  return null;
}

async function getChromiumExecutablePath() {
  const localExecutablePath = getLocalChromeExecutablePath();

  if (localExecutablePath) {
    return localExecutablePath;
  }

  // On serverless hosts, @sparticuz/chromium extracts its binary to /tmp.
  // Calling executablePath repeatedly during a cold start can leave the binary
  // briefly locked, producing "spawn ETXTBSY". Cache the promise per runtime.
  if (!chromiumExecutablePathPromise) {
    chromiumExecutablePathPromise = chromium.executablePath();
  }

  return chromiumExecutablePathPromise;
}

async function copyExecutableForSpawn(executablePath: string) {
  const copyDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "atlas-chromium-"));
  const copyPath = path.join(copyDir, path.basename(executablePath));
  await fs.promises.copyFile(executablePath, copyPath);
  await fs.promises.chmod(copyPath, 0o755);
  return copyPath;
}

async function launchPuppeteerWithPath(executablePath: string, isLocalChrome: boolean) {
  const args = isLocalChrome
    ? ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    : chromium.args;

  return puppeteer.launch({
    args,
    defaultViewport: {
      width: 1280,
      height: 1600,
      deviceScaleFactor: 1,
    },
    executablePath,
    headless: true,
  });
}

async function launchBrowser() {
  // Serialize live Chromium launches. This prevents two serverless requests from
  // trying to spawn/copy the extracted binary at the same time in the same runtime.
  let releaseLock!: () => void;
  const previousLock = launchLock;
  launchLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  await previousLock;

  try {
    const originalExecutablePath = await getChromiumExecutablePath();
    const isLocalChrome = chromeExecutableCandidates.some(
      (candidate) => candidate && originalExecutablePath === candidate
    );

    let lastError: unknown;

    for (let attempt = 1; attempt <= 7; attempt += 1) {
      try {
        const executablePath =
          attempt === 1 || isLocalChrome
            ? originalExecutablePath
            : await copyExecutableForSpawn(originalExecutablePath);

        return await launchPuppeteerWithPath(executablePath, isLocalChrome);
      } catch (error) {
        lastError = error;

        if (!isTextFileBusyError(error) || attempt === 7) {
          break;
        }

        // If the extracted binary is locked, wait and retry using a fresh copy.
        await sleep(650 * attempt);
      }
    }

    throw lastError;
  } finally {
    releaseLock();
  }
}

async function getSharedBrowser() {
  if (sharedBrowserPromise) {
    try {
      const browser = await sharedBrowserPromise;
      if (browser.isConnected()) {
        return browser;
      }
    } catch {
      // Recreate below.
    }
  }

  sharedBrowserPromise = launchBrowser();
  return sharedBrowserPromise;
}

async function getFreshPage() {
  const browser = await getSharedBrowser();

  try {
    return await browser.newPage();
  } catch (error) {
    sharedBrowserPromise = null;
    const recoveredBrowser = await getSharedBrowser();
    return recoveredBrowser.newPage();
  }
}


async function waitForImages(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
              setTimeout(resolve, 1800);
            })
      )
    );
  });
}

/**
 * Converts a print-ready HTML document into a PDF buffer.
 */
export async function renderHtmlToPdfBuffer(html: string) {
  const page = await getFreshPage();

  try {
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await waitForImages(page);
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: "0.25in",
        right: "0.25in",
        bottom: "0.25in",
        left: "0.25in",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await page.close().catch(() => {
      // Ignore page shutdown errors so the route can return the original PDF/render error.
    });
  }
}

/**
 * Renders an existing app route into a PDF. This is used for COAs so the PDF
 * comes from the exact same printable COA page/template the admin sees when
 * clicking Print COA, instead of a second hard-coded COA template in the API.
 */
export async function renderUrlToPdfBuffer(
  url: string,
  options?: {
    localStorageItems?: BrowserStorageItem[];
    waitForSelector?: string;
  }
) {
  const page = await getFreshPage();

  try {
    if (options?.localStorageItems?.length) {
      await page.evaluateOnNewDocument((items: BrowserStorageItem[]) => {
        for (const item of items) {
          window.localStorage.setItem(item.key, JSON.stringify(item.value));
        }
      }, options.localStorageItems);
    }

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    if (options?.waitForSelector) {
      await page.waitForSelector(options.waitForSelector, { timeout: 60_000 });
    }

    await waitForImages(page);
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0in",
        right: "0in",
        bottom: "0in",
        left: "0in",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await page.close().catch(() => {
      // Ignore page shutdown errors so the route can return the original PDF/render error.
    });
  }
}
