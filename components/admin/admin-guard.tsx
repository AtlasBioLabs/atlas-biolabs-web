"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOutIcon, ShieldAlertIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { getActiveAdminUser, type AdminUserRecord } from "@/lib/coa-verification-admin";
import type { BreadcrumbItem } from "@/lib/seo";

type AdminGuardContext = {
  adminUser: AdminUserRecord;
  supabase: SupabaseClient;
  user: User;
  signOut: () => Promise<void>;
};

type AdminGuardProps = {
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  hideHeaderOnPrint?: boolean;
  children: (context: AdminGuardContext) => React.ReactNode;
};

export function AdminGuard({
  title,
  description,
  breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "COA Admin", path: "/admin/coa-verifications" },
  ],
  hideHeaderOnPrint = false,
  children,
}: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUserRecord | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!session?.user) {
        setUser(null);
        setAdminUser(null);
        setIsAccessDenied(false);
        setIsLoading(false);
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      setUser(session.user);
      const adminRecord = await getActiveAdminUser(supabase, session.user);

      if (!isMounted) {
        return;
      }

      if (!adminRecord) {
        setAdminUser(null);
        setIsAccessDenied(true);
        setIsLoading(false);
        return;
      }

      setAdminUser(adminRecord);
      setIsAccessDenied(false);
      setIsLoading(false);
    }

    verifyAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      verifyAccess();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setAdminUser(null);
    setIsAccessDenied(false);
    router.replace("/admin/login");
  }

  return (
    <>
      <section
        data-admin-shell-header
        className={`section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] via-white to-white ${
          hideHeaderOnPrint ? "print:hidden" : ""
        }`}
      >
        <div className="site-container">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Atlas Labs QA Admin
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-border/70 bg-white px-4 py-2 text-sm text-[var(--brand-navy)] shadow-sm">
                  {user.email}
                </div>
                <Button
                  variant="outline"
                  className="h-10 border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                  onClick={signOut}
                >
                  <LogOutIcon className="mr-1 size-4" />
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section
        data-admin-shell-content
        className={`section-space pt-10 ${hideHeaderOnPrint ? "print:pt-0" : ""}`}
      >
        <div className="site-container">
          {isLoading ? (
            <Card className="surface-card border p-0">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Checking Atlas Labs admin access...
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && isAccessDenied ? (
            <Card className="surface-card border border-rose-200 bg-rose-50/60 p-0">
              <CardContent className="space-y-4 py-8 text-center">
                <ShieldAlertIcon className="mx-auto size-10 text-rose-600" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-rose-900">Access denied</h2>
                  <p className="mx-auto max-w-2xl text-sm leading-relaxed text-rose-800">
                    Your account is authenticated, but it is not currently active in the
                    Atlas Labs QA and documentation access register.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-rose-200 bg-white text-rose-700 hover:bg-rose-100"
                  onClick={signOut}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && user && adminUser && !isAccessDenied ? (
            <>{children({ adminUser, supabase, user, signOut })}</>
          ) : null}
        </div>
      </section>
    </>
  );
}
