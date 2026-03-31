"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, MenuIcon, ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  aboutSubmenuItems,
  brand,
  navItems,
  primaryNavCta,
} from "@/lib/site-content";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

type NavbarProps = {
  itemCount: number;
};

export function Navbar({ itemCount }: NavbarProps) {
  const pathname = usePathname();
  const aboutSubmenuActive = aboutSubmenuItems.some((item) =>
    isActivePath(pathname, item.href)
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/94 backdrop-blur-sm">
      <div className="site-container flex h-20 items-center justify-between gap-5">
        <Link href="/" className="inline-flex min-w-0 items-center gap-3">
          <Image
            src="public/Atlas Bio Labs Logo.png"
            width={32}
            height={32}
            alt="Atlas BioLabs logo"
            className="rounded-md border border-border bg-white"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-semibold text-[var(--brand-navy)]">
              {brand.name}
            </span>
            <span className="hidden truncate text-xs text-muted-foreground sm:inline">
              {brand.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            if (item.href === "/about") {
              const active = isActivePath(pathname, item.href) || aboutSubmenuActive;

              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-accent text-[var(--brand-navy)]"
                        : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]"
                    )}
                  >
                    {item.label}
                    <ChevronDownIcon className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </Link>

                  <div className="pointer-events-none absolute top-full left-0 z-50 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <div className="min-w-52 rounded-xl border border-border/80 bg-white p-2 shadow-[0_18px_36px_-30px_rgba(10,26,47,0.45)]">
                      {aboutSubmenuItems.map((subItem) => {
                        const subActive = isActivePath(pathname, subItem.href);

                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm transition-colors",
                              subActive
                                ? "bg-accent text-[var(--brand-navy)]"
                                : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]"
                            )}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-[var(--brand-navy)]"
                    : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" className="relative">
            <Link href="/cart" className="gap-2">
              <ShoppingBagIcon className="size-4" />
              Inquiry Cart
              {itemCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-navy)] px-1.5 py-0.5 text-[11px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button asChild className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]">
            <Link href={primaryNavCta.href}>{primaryNavCta.label}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="relative size-10 touch-manipulation"
          >
            <Link href="/cart" aria-label="Open inquiry cart">
              <ShoppingBagIcon className="size-4" />
              <span className="sr-only">Open inquiry cart</span>
              {itemCount > 0 ? (
                <span className="absolute -top-2 -right-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-navy)] px-1.5 py-0.5 text-[11px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </Button>

          <details key={pathname} className="relative lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-background text-[var(--brand-navy)] touch-manipulation [&::-webkit-details-marker]:hidden">
              <MenuIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(88vw,22rem)] overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_18px_40px_-26px_rgba(10,26,47,0.45)]">
              <div className="border-b border-border/70 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-md bg-[var(--brand-navy)] text-xs font-semibold text-white">
                    AB
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--brand-navy)]">
                      {brand.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-2 px-5 py-4">
                {navItems.map((item) => {
                  if (item.href === "/about") {
                    const active = isActivePath(pathname, item.href) || aboutSubmenuActive;

                    return (
                      <div key={item.href} className="space-y-2">
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium touch-manipulation",
                            active
                              ? "bg-accent text-[var(--brand-navy)]"
                              : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]"
                          )}
                        >
                          {item.label}
                        </Link>

                        <div className="ml-3 border-l border-border pl-3">
                          {aboutSubmenuItems.map((subItem) => {
                            const subActive = isActivePath(pathname, subItem.href);

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm touch-manipulation",
                                  subActive
                                    ? "bg-accent text-[var(--brand-navy)]"
                                    : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]"
                                )}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium touch-manipulation",
                        active
                          ? "bg-accent text-[var(--brand-navy)]"
                          : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="grid gap-2 border-t border-border/70 px-5 py-4">
                <Button asChild variant="outline" className="w-full touch-manipulation">
                  <Link href="/cart" className="justify-center gap-2">
                    <ShoppingBagIcon className="size-4" />
                    Inquiry Cart {itemCount > 0 ? `(${itemCount})` : ""}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full touch-manipulation bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
                >
                  <Link href={primaryNavCta.href}>{primaryNavCta.label}</Link>
                </Button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
