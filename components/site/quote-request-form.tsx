"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitQuoteRequestFormAction } from "@/app/(site)/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInitialFormState } from "@/lib/form-state";
import type { QuoteRequestFormData } from "@/lib/site-content";

type QuoteField = keyof QuoteRequestFormData;
type QuoteRequestFormProps = {
  initialProduct?: string;
  initialQuantity?: string;
};

const initialState = createInitialFormState<QuoteField>();

export function QuoteRequestForm({
  initialProduct = "",
  initialQuantity = "",
}: QuoteRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitQuoteRequestFormAction,
    initialState
  );
  const [dismissedErrors, setDismissedErrors] = useState<
    Partial<Record<QuoteField, number>>
  >({});

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  function getError(field: QuoteField) {
    return dismissedErrors[field] === state.submissionId
      ? undefined
      : state.fieldErrors[field];
  }

  function clearError(field: QuoteField) {
    setDismissedErrors((current) => ({
      ...current,
      [field]: state.submissionId,
    }));
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="surface-card space-y-5 p-6 sm:p-8"
      noValidate
    >
      <input type="hidden" name="source" value="Request quote page" />

      {state.status === "success" ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {state.message}
        </p>
      ) : null}

      {state.status === "error" && state.message ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="quote-full-name" className="text-sm font-medium text-[var(--brand-navy)]">
            Full Name
          </label>
          <Input
            id="quote-full-name"
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
          <label htmlFor="quote-company" className="text-sm font-medium text-[var(--brand-navy)]">
            Company Name (Optional)
          </label>
          <Input
            id="quote-company"
            name="companyName"
            defaultValue=""
            onInput={() => clearError("companyName")}
            placeholder="Northline Wellness"
            className="h-10"
            autoComplete="organization"
            enterKeyHint="next"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="quote-email" className="text-sm font-medium text-[var(--brand-navy)]">
            Email
          </label>
          <Input
            id="quote-email"
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
          <label htmlFor="quote-phone" className="text-sm font-medium text-[var(--brand-navy)]">
            Phone / WhatsApp
          </label>
          <Input
            id="quote-phone"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="quote-country" className="text-sm font-medium text-[var(--brand-navy)]">
            Country
          </label>
          <Input
            id="quote-country"
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
          <label htmlFor="quote-product" className="text-sm font-medium text-[var(--brand-navy)]">
            Product
          </label>
          <Input
            id="quote-product"
            name="product"
            defaultValue={initialProduct}
            onInput={() => clearError("product")}
            placeholder="BPC-157"
            className="h-10"
            enterKeyHint="next"
            aria-invalid={Boolean(getError("product"))}
          />
          {getError("product") ? (
            <p className="text-xs text-destructive">{getError("product")}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="quote-quantity" className="text-sm font-medium text-[var(--brand-navy)]">
          Quantity / MOQ Needed
        </label>
        <Input
          id="quote-quantity"
          name="quantity"
          defaultValue={initialQuantity}
          onInput={() => clearError("quantity")}
          placeholder="300 units monthly"
          className="h-10"
          enterKeyHint="next"
          aria-invalid={Boolean(getError("quantity"))}
        />
        {getError("quantity") ? (
          <p className="text-xs text-destructive">{getError("quantity")}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="quote-message" className="text-sm font-medium text-[var(--brand-navy)]">
          Message
        </label>
        <textarea
          id="quote-message"
          name="message"
          defaultValue=""
          onInput={() => clearError("message")}
          placeholder="Share your timeline, destination market, pack size preference, and documentation requirements."
          className="min-h-32 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          enterKeyHint="send"
          aria-invalid={Boolean(getError("message"))}
        />
        {getError("message") ? (
          <p className="text-xs text-destructive">{getError("message")}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          We will review your request and follow up with the next commercial steps.
        </p>
        <Button
          type="submit"
          className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
          disabled={pending}
        >
          {pending ? "Sending Request..." : "Submit Quote Request"}
        </Button>
      </div>
    </form>
  );
}
