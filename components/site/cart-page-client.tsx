"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

import {
  clearInquiryCartAction,
  removeInquiryItemAction,
  setInquiryQuantityAction,
} from "@/app/(site)/cart/actions";
import { submitCartInquiryFormAction } from "@/app/(site)/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInitialFormState } from "@/lib/form-state";
import type { CartInquiryFormData, CartItem } from "@/lib/site-content";

type CartPageClientProps = {
  items: CartItem[];
};

const initialState = createInitialFormState<keyof CartInquiryFormData>();

export function CartPageClient({ items }: CartPageClientProps) {
  const [state, formAction, pending] = useActionState(
    submitCartInquiryFormAction,
    initialState
  );
  const [dismissedErrors, setDismissedErrors] = useState<
    Partial<Record<keyof CartInquiryFormData, number>>
  >({});

  const effectiveSubtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.unitPriceFrom * item.quantity,
        0
      ),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const productPrefill = useMemo(
    () =>
      items
        .map((item) => `${item.name} (${item.quantity} units, MOQ ${item.moq})`)
        .join("; "),
    [items]
  );

  const quantityPrefill = `${totalItems} units total`;

  function getError(field: keyof CartInquiryFormData) {
    return dismissedErrors[field] === state.submissionId
      ? undefined
      : state.fieldErrors[field];
  }

  function clearError(field: keyof CartInquiryFormData) {
    setDismissedErrors((current) => ({
      ...current,
      [field]: state.submissionId,
    }));
  }

  if (state.status === "success") {
    return (
      <section className="section-space pt-10">
        <div className="site-container">
          <div className="surface-card mx-auto max-w-2xl space-y-4 p-8 text-center">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Inquiry Submitted
            </h2>
            <p className="text-sm text-muted-foreground">{state.message}</p>
            <Button asChild className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]">
              <Link href="/shop">Browse More Products</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section-space pt-10">
        <div className="site-container">
          <div className="surface-card mx-auto max-w-2xl space-y-4 p-8 text-center">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">
              Your inquiry cart is empty
            </h2>
            <p className="text-sm text-muted-foreground">
              Add products from the shop, then submit your inquiry for commercial sourcing and quote support.
            </p>
            <Button asChild className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]">
              <Link href="/shop">Browse Shop</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space pt-10">
      <div className="site-container">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="surface-card p-6 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  Inquiry Cart
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
                  Selected Peptides
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">{totalItems} unit(s)</p>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-xl border border-border/70 bg-white p-3"
                >
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted/30">
                      <Image
                        src={item.image}
                        alt={`${item.name} image`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[var(--brand-navy)]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Starting from ${item.unitPriceFrom} USD
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        MOQ {item.moq} units
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Subtotal: ${(item.unitPriceFrom * item.quantity).toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <form action={setInquiryQuantityAction}>
                        <input type="hidden" name="slug" value={item.slug} />
                        <input
                          type="hidden"
                          name="quantity"
                          value={String(Math.max(item.moq, item.quantity - 1))}
                        />
                        <Button
                          type="submit"
                          size="icon-xs"
                          variant="outline"
                          className="size-11 touch-manipulation"
                          disabled={item.quantity <= item.moq}
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <MinusIcon className="size-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                      </form>
                      <span className="min-w-12 text-center text-sm font-medium text-[var(--brand-navy)]">
                        {item.quantity}
                      </span>
                      <form action={setInquiryQuantityAction}>
                        <input type="hidden" name="slug" value={item.slug} />
                        <input
                          type="hidden"
                          name="quantity"
                          value={String(item.quantity + 1)}
                        />
                        <Button
                          type="submit"
                          size="icon-xs"
                          variant="outline"
                          className="size-11 touch-manipulation"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <PlusIcon className="size-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </form>
                    </div>
                    <form action={removeInquiryItemAction}>
                      <input type="hidden" name="slug" value={item.slug} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="min-h-11 touch-manipulation text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${item.name} from inquiry cart`}
                      >
                        <Trash2Icon className="size-4" />
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-border/70 bg-muted/35 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Estimated starting subtotal</span>
                <span className="font-semibold text-[var(--brand-navy)]">
                  ${effectiveSubtotal.toFixed(2)} USD
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
                <form action={clearInquiryCartAction}>
                  <Button type="submit" variant="ghost">
                    Clear Inquiry Cart
                  </Button>
                </form>
              </div>
            </div>
          </article>

          <form action={formAction} className="surface-card space-y-5 p-6 sm:p-7" noValidate>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Inquiry Details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
                Submit Inquiry to Proceed
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Share your details and we will send the next sourcing and quote steps.
              </p>
            </div>

            {state.status === "error" && state.message ? (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {state.message}
              </p>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="cart-name" className="text-sm font-medium text-[var(--brand-navy)]">
                Full Name
              </label>
              <Input
                id="cart-name"
                name="fullName"
                defaultValue=""
                onInput={() => clearError("fullName")}
                placeholder="Alex Morgan"
                className="h-10"
                autoComplete="name"
                enterKeyHint="next"
                aria-invalid={Boolean(getError("fullName"))}
              />
              {getError("fullName") ? (
                <p className="text-xs text-destructive">{getError("fullName")}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="cart-company" className="text-sm font-medium text-[var(--brand-navy)]">
                Company Name (Optional)
              </label>
              <Input
                id="cart-company"
                name="companyName"
                defaultValue=""
                onInput={() => clearError("companyName")}
                placeholder="Northline Wellness"
                className="h-10"
                autoComplete="organization"
                enterKeyHint="next"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="cart-email" className="text-sm font-medium text-[var(--brand-navy)]">
                  Email
                </label>
                <Input
                  id="cart-email"
                  name="email"
                  type="email"
                  defaultValue=""
                  onInput={() => clearError("email")}
                  placeholder="alex@brand.com"
                  className="h-10"
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="next"
                  aria-invalid={Boolean(getError("email"))}
                />
                {getError("email") ? (
                  <p className="text-xs text-destructive">{getError("email")}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label htmlFor="cart-phone" className="text-sm font-medium text-[var(--brand-navy)]">
                  Phone / WhatsApp
                </label>
                <Input
                  id="cart-phone"
                  name="phoneWhatsApp"
                  defaultValue=""
                  onInput={() => clearError("phoneWhatsApp")}
                  placeholder="+1 555 010 2200"
                  className="h-10"
                  autoComplete="tel"
                  inputMode="tel"
                  enterKeyHint="next"
                  aria-invalid={Boolean(getError("phoneWhatsApp"))}
                />
                {getError("phoneWhatsApp") ? (
                  <p className="text-xs text-destructive">{getError("phoneWhatsApp")}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="cart-country" className="text-sm font-medium text-[var(--brand-navy)]">
                  Country
                </label>
                <Input
                  id="cart-country"
                  name="country"
                  defaultValue=""
                  onInput={() => clearError("country")}
                  placeholder="United States"
                  className="h-10"
                  autoComplete="country-name"
                  enterKeyHint="next"
                  aria-invalid={Boolean(getError("country"))}
                />
                {getError("country") ? (
                  <p className="text-xs text-destructive">{getError("country")}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="cart-quantity" className="text-sm font-medium text-[var(--brand-navy)]">
                  Quantity Needed
                </label>
                <Input
                  id="cart-quantity"
                  name="quantity"
                  value={quantityPrefill}
                  readOnly
                  className="h-10 bg-muted/35"
                  aria-invalid={Boolean(getError("quantity"))}
                />
                {getError("quantity") ? (
                  <p className="text-xs text-destructive">{getError("quantity")}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cart-product" className="text-sm font-medium text-[var(--brand-navy)]">
                Products
              </label>
              <textarea
                id="cart-product"
                name="product"
                value={productPrefill}
                readOnly
                className="min-h-24 w-full rounded-lg border border-input bg-muted/35 px-3 py-2 text-sm text-[var(--brand-navy)] outline-none"
                aria-invalid={Boolean(getError("product"))}
              />
              {getError("product") ? (
                <p className="text-xs text-destructive">{getError("product")}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="cart-message" className="text-sm font-medium text-[var(--brand-navy)]">
                Message
              </label>
              <textarea
                id="cart-message"
                name="message"
                defaultValue=""
                onInput={() => clearError("message")}
                placeholder="Share timeline, destination country, format preference, or documentation needs."
                className="min-h-32 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                enterKeyHint="send"
                aria-invalid={Boolean(getError("message"))}
              />
              {getError("message") ? (
                <p className="text-xs text-destructive">{getError("message")}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
              disabled={pending}
            >
              {pending ? "Submitting Inquiry..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
