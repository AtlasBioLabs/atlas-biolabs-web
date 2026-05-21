import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Atlas Labs Admin",
    template: "%s | Atlas BioLabs",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
