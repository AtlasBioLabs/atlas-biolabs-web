import Image from "next/image";

import { TrustMetric } from "@/lib/site-content";

type TrustStripProps = {
  metrics: TrustMetric[];
};

export function TrustStrip({ metrics }: TrustStripProps) {
  return (
    <section className="relative -mt-14 pb-2 sm:-mt-16">
      <div className="site-container">
        <div className="surface-card rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Trust and Value
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--brand-navy)] sm:text-xl">
                The Supply Signals Our Buyers Ask About
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              We combine qualified partner sourcing, transparent MOQ entry, and Atlas Labs documentation support so buyers know what to expect.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
              <article className="relative min-h-[250px] overflow-hidden rounded-2xl">
                <Image
                  src="/images/sales-support.jpg"
                  alt="Sales support representative speaking with a client from a headset workstation."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/88 via-[#071322]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                    Buyer Support
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/84">
                    We stay responsive so buyers can align product selection, quote details, and documentation expectations quickly.
                  </p>
                </div>
              </article>

              <article className="relative min-h-[250px] overflow-hidden rounded-2xl">
                <Image
                  src="/images/shipping-boxes.jpg"
                  alt="Prepared shipping cartons staged for warehouse dispatch and order fulfillment."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 28vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/82 via-[#071322]/24 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                    Fulfillment
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/82">
                    We keep outbound preparation organized so repeat orders and volume planning feel steady from the start.
                  </p>
                </div>
              </article>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {metrics.map((metric) => (
              <li
                key={metric.label}
                className="rounded-xl border border-border/70 bg-[var(--brand-white)] px-4 py-3"
              >
                <p className="text-xl font-semibold text-[var(--brand-navy)]">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {metric.label}
                </p>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
