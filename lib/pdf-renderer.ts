import fs from "node:fs";
import chromium from "@sparticuz/chromium";
import puppeteer, { type Page } from "puppeteer-core";

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

  return chromium.executablePath();
}

async function launchBrowser() {
  const executablePath = await getChromiumExecutablePath();
  const isLocalChrome = chromeExecutableCandidates.some(
    (candidate) => candidate && executablePath === candidate
  );

  return puppeteer.launch({
    args: isLocalChrome
      ? ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
      : chromium.args,
    defaultViewport: {
      width: 1280,
      height: 1600,
      deviceScaleFactor: 1,
    },
    executablePath,
    headless: true,
  });
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
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

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
    await browser.close().catch(() => {
      // Ignore browser shutdown errors so the route can return the original PDF/render error.
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
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

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
    await browser.close().catch(() => {
      // Ignore browser shutdown errors so the route can return the original PDF/render error.
    });
  }
}
