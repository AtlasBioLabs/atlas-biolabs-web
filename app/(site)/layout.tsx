import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { getInquiryCartCount } from "@/lib/cart-session";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const itemCount = await getInquiryCartCount();

  return (
    <>
      <Navbar itemCount={itemCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
