import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/lib/site-config";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";
import "./globals.css";

const googleAnalyticsId = "G-YVZF8QLCVV";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Atlas BioLabs - Peptide Supply & Sourcing",
    template: "%s | Atlas BioLabs",
  },
  description:
    "Atlas BioLabs supplies peptides for commercial buyers through global sourcing partners, with documentation support, batch transparency, and structured supply systems.",
  applicationName: siteConfig.name,
  keywords: [
    "peptides",
    "peptide supplier",
    "peptide sourcing",
    "wholesale peptides",
    "cosmetic peptides",
    "research peptides",
    "peptide manufacturers",
    "buy peptides",
    "peptide supply USA",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Atlas BioLabs - Peptide Supply & Sourcing",
    description:
      "Atlas BioLabs supplies peptides for commercial buyers through global sourcing partners, with documentation support, batch transparency, and structured supply systems.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        alt: "Atlas BioLabs favicon brand preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas BioLabs - Peptide Supply & Sourcing",
    description:
      "Atlas BioLabs supplies peptides for commercial buyers through global sourcing partners, with documentation support, batch transparency, and structured supply systems.",
    images: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd id="organization-schema" data={getOrganizationSchema()} />
        <JsonLd id="website-schema" data={getWebsiteSchema()} />
        {children}
      </body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `}
      </Script>
    </html>
  );
}
