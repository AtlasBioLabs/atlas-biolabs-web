import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/site-config";
import { siteDefaultTitle, siteDescription } from "@/lib/seo";
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
    default: siteDefaultTitle,
    template: "%s | Atlas BioLabs",
  },
  description: siteDescription,
  applicationName: siteConfig.name,
  keywords: [
    "peptides",
    "peptide supplier",
    "peptide sourcing",
    "wholesale peptides",
    "custom peptide sourcing",
    "cosmetic peptides",
    "research peptides",
    "peptide manufacturers",
    "peptide sourcing company",
    "peptide supply USA",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    title: siteDefaultTitle,
    description: siteDescription,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/og-default.svg",
        alt: "Atlas BioLabs peptide supply and sourcing website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteDefaultTitle,
    description: siteDescription,
    images: ["/og-default.svg"],
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
      <body className="min-h-full flex flex-col">{children}</body>
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
