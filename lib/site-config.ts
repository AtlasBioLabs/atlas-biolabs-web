import { SITE_NAME, SITE_URL } from "@/lib/site";

export const siteConfig = {
  name: SITE_NAME,
  tagline: "Global Peptide Supply & Sourcing",
  url: SITE_URL,
};

export function absoluteUrl(path: string) {
  const url = new URL(path, siteConfig.url);

  if (url.pathname === "/" && !url.search && !url.hash) {
    return `${url.origin}/`;
  }

  return url.toString();
}
