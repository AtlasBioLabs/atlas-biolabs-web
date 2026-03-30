import Image from "next/image";
import Link from "next/link";
import { PackageCheckIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroContent } from "@/lib/site-content";

const icons = [ShieldCheckIcon, PackageCheckIcon, TruckIcon];

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f4f8ff] via-[#fbfdff] to-white">
      <div className="pointer-events-none absolute top-10 right-[-6rem] h-56 w-56 rounded-full bg-[var(--brand-blue)]/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-5rem] left-[-8rem] h-72 w-72 rounded-full bg-[var(--brand-navy)]/7 blur-3xl" />

      <div className="section-space pb-14">
        <div className="site-container grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-[var(--brand-grey)]/70 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-navy)]">
              {content.eyebrow}
            </p>
            <h1 className="max-w-4xl text-4xl leading-[1.08] font-semibold text-[var(--brand-navy)] sm:text-5xl lg:text-[3.35rem]">
              {content.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[var(--brand-navy)] px-5 hover:bg-[var(--brand-blue)]"
              >
                <Link href={content.primaryHref}>{content.primaryLabel}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-5">
                <Link href={content.secondaryHref}>{content.secondaryLabel}</Link>
              </Button>
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              We support U.S.-focused commercial buyers through a global peptide manufacturing network.
            </p>
          </div>

          <div className="grid gap-4">
            <article className="surface-card relative overflow-hidden">
              <div className="relative min-h-[420px]">
                <Image
                  src="/images/lab-hero.jpg"
                  alt="Sterile laboratory workflow with packaged vials being handled by a technician in gloves."
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/90 via-[#071322]/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/74">
                    Real Supply Workflow
                  </p>
                  <h2 className="mt-2 max-w-md text-2xl font-semibold text-white">
                    We back commercial sourcing with visible process and disciplined handling.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/78">
                    We support quote-based buying with a clear view of laboratory handling, documentation readiness, and buyer communication.
                  </p>
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.highlights.map((highlight, index) => {
                const Icon = icons[index % icons.length];

                return (
                  <article
                    key={highlight}
                    className="surface-card-soft rounded-2xl px-4 py-4"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--brand-blue)]/12 text-[var(--brand-navy)]">
                      <Icon className="size-4" />
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--brand-navy)]">
                      {highlight}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
