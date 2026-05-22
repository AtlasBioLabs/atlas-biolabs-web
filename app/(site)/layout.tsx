import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Navbar } from "@/components/site/navbar";
import { getInquiryCartCount } from "@/lib/cart-session";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const itemCount = await getInquiryCartCount();

  return (
    <>
      <JsonLd id="site-organization-schema" data={getOrganizationSchema()} />
      <JsonLd id="site-website-schema" data={getWebsiteSchema()} />
      <Navbar itemCount={itemCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
