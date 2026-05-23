import fs from "node:fs";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

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

/**
 * Converts a print-ready HTML document into a PDF buffer.
 *
 * The quality document route still supports HTML previews with `format: "html"`,
 * but normal downloads now call this helper so HPLC, MS/LC-MS, SDS, and COA
 * files download directly as PDFs.
 */
export async function renderHtmlToPdfBuffer(html: string) {
  const executablePath = await getChromiumExecutablePath();
  const isLocalChrome = chromeExecutableCandidates.some(
    (candidate) => candidate && executablePath === candidate
  );

  const browser = await puppeteer.launch({
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

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
            setTimeout(resolve, 1500);
          });
        })
      );
    });

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
