const fallbackSiteUrl = "https://atlasbiolabs.co";

export const siteConfig = {
  name: "Atlas BioLabs",
  tagline: "Global Peptide Supply & Sourcing",
  url:
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim().length > 0
      ? process.env.NEXT_PUBLIC_SITE_URL
      : fallbackSiteUrl,
};

export function absoluteUrl(path: string) {
  const url = new URL(path, siteConfig.url);

  if (url.pathname === "/" && !url.search && !url.hash) {
    return url.origin;
  }

  return url.toString();
}
