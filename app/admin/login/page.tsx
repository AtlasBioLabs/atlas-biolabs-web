"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getActiveAdminUser } from "@/lib/coa-verification-admin";
import type { BreadcrumbItem } from "@/lib/seo";
import { createBrowserSupabaseClient } from "@/lib/supabase";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "Admin Login", path: "/admin/login" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getNextDestination() {
    if (typeof window === "undefined") {
      return "/admin/coa-verifications";
    }

    const nextParam = new URLSearchParams(window.location.search).get("next");
    return nextParam || "/admin/coa-verifications";
  }

  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted || !session?.user) {
        return;
      }

      const adminRecord = await getActiveAdminUser(supabase, session.user);

      if (!isMounted) {
        return;
      }

      if (adminRecord) {
        router.replace(getNextDestination());
        return;
      }

      setAccessDenied(true);
      setErrorMessage(
        "Access denied. This account is not active for Atlas Labs QA administration."
      );
    }

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setAccessDenied(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setErrorMessage(error?.message ?? "Login failed. Please check your credentials.");
      setIsSubmitting(false);
      return;
    }

    const adminRecord = await getActiveAdminUser(supabase, data.user);

    if (!adminRecord) {
      setAccessDenied(true);
      setErrorMessage(
        "Access denied. Your account is authenticated but not active in the Atlas Labs admin access register."
      );
      setIsSubmitting(false);
      return;
    }

    router.replace(getNextDestination());
    router.refresh();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAccessDenied(false);
    setErrorMessage(null);
  }

  return (
    <>
      <section className="section-space border-b border-border/70 bg-gradient-to-b from-[#f8fbff] via-white to-white">
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
            Atlas Labs QA Admin
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-[var(--brand-navy)]">
            Admin login
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Restricted Atlas BioLabs access for QA release tracking, document control, and
            COA verification management.
          </p>
        </div>
      </section>

      <section className="section-space pt-10">
        <div className="site-container grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="surface-card border p-0">
            <CardHeader className="border-b border-border/70 py-6">
              <CardTitle className="text-2xl text-[var(--brand-navy)]">
                Sign in to Atlas Labs admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 py-6">
              {errorMessage ? (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    accessDenied
                      ? "border border-rose-200 bg-rose-50 text-rose-800"
                      : "border border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                >
                  {errorMessage}
                </div>
              ) : null}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="admin-email"
                    className="text-sm font-medium text-[var(--brand-navy)]"
                  >
                    Email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 border-[#d5def0] bg-white px-4 text-[var(--brand-navy)]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-medium text-[var(--brand-navy)]"
                  >
                    Password
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 border-[#d5def0] bg-white px-4 text-[var(--brand-navy)]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full bg-[#0A1A2F] text-white hover:bg-[#2E6BFF]"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
                {accessDenied ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="h-11 w-full border-[#d5def0] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                  >
                    Logout unauthorized session
                  </Button>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card className="surface-card border p-0">
            <CardHeader className="border-b border-border/70 py-6">
              <CardTitle className="text-2xl text-[var(--brand-navy)]">
                Compliance note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              <div className="rounded-xl border border-[#d5def0] bg-[#f7faff] p-4">
                <p className="text-sm leading-relaxed text-[var(--brand-navy)]">
                  Admin access is restricted to authorized Atlas Labs QA and
                  documentation users.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-relaxed text-amber-900">
                  Atlas BioLabs admin tools are intended for document release,
                  verification control, and record maintenance only. They do not
                  provide dosage, treatment, medical, veterinary, diagnostic, or
                  human-use guidance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
