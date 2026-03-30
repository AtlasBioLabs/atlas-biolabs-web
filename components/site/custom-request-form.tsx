"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitCustomRequestFormAction } from "@/app/(site)/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInitialFormState } from "@/lib/form-state";

type CustomRequestData = {
  name: string;
  email: string;
  company: string;
  peptideName: string;
  quantity: string;
  timeline: string;
  notes: string;
};

type CustomRequestField = keyof CustomRequestData;

const initialState = createInitialFormState<CustomRequestField>();

export function CustomRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitCustomRequestFormAction,
    initialState
  );
  const [dismissedErrors, setDismissedErrors] = useState<
    Partial<Record<CustomRequestField, number>>
  >({});

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  function getError(field: CustomRequestField) {
    return dismissedErrors[field] === state.submissionId
      ? undefined
      : state.fieldErrors[field];
  }

  function clearError(field: CustomRequestField) {
    setDismissedErrors((current) => ({
      ...current,
      [field]: state.submissionId,
    }));
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="surface-card space-y-5 p-6 sm:p-7"
      noValidate
    >
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
          <label htmlFor="custom-name" className="text-sm font-medium text-[var(--brand-navy)]">
            Full Name
          </label>
          <Input
            id="custom-name"
            name="name"
            defaultValue=""
            onInput={() => clearError("name")}
            placeholder="Alex Morgan"
            className="h-10"
            autoComplete="name"
            enterKeyHint="next"
            aria-invalid={Boolean(getError("name"))}
          />
          {getError("name") ? (
            <p className="text-xs text-destructive">{getError("name")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="custom-email" className="text-sm font-medium text-[var(--brand-navy)]">
            Work Email
          </label>
          <Input
            id="custom-email"
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
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="custom-company" className="text-sm font-medium text-[var(--brand-navy)]">
            Company
          </label>
          <Input
            id="custom-company"
            name="company"
            defaultValue=""
            onInput={() => clearError("company")}
            placeholder="Northline Wellness"
            className="h-10"
            autoComplete="organization"
            enterKeyHint="next"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="custom-peptide"
            className="text-sm font-medium text-[var(--brand-navy)]"
          >
            Peptide Request
          </label>
          <Input
            id="custom-peptide"
            name="peptideName"
            defaultValue=""
            onInput={() => clearError("peptideName")}
            placeholder="Custom sequence or analog"
            className="h-10"
            enterKeyHint="next"
            aria-invalid={Boolean(getError("peptideName"))}
          />
          {getError("peptideName") ? (
            <p className="text-xs text-destructive">{getError("peptideName")}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="custom-quantity"
            className="text-sm font-medium text-[var(--brand-navy)]"
          >
            Target Quantity
          </label>
          <Input
            id="custom-quantity"
            name="quantity"
            defaultValue=""
            onInput={() => clearError("quantity")}
            placeholder="500 units monthly"
            className="h-10"
            enterKeyHint="next"
            aria-invalid={Boolean(getError("quantity"))}
          />
          {getError("quantity") ? (
            <p className="text-xs text-destructive">{getError("quantity")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="custom-timeline"
            className="text-sm font-medium text-[var(--brand-navy)]"
          >
            Target Timeline
          </label>
          <Input
            id="custom-timeline"
            name="timeline"
            defaultValue=""
            onInput={() => clearError("timeline")}
            placeholder="Q3 launch window"
            className="h-10"
            enterKeyHint="next"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="custom-notes"
          className="text-sm font-medium text-[var(--brand-navy)]"
        >
          Project Details
        </label>
        <textarea
          id="custom-notes"
          name="notes"
          defaultValue=""
          onInput={() => clearError("notes")}
          placeholder="Tell us about the requested sequence, format, purity target, documentation expectations, and delivery timeline."
          className="min-h-36 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          enterKeyHint="send"
          aria-invalid={Boolean(getError("notes"))}
        />
        {getError("notes") ? (
          <p className="text-xs text-destructive">{getError("notes")}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          We will review the request and come back with the next sourcing steps.
        </p>
        <Button
          type="submit"
          className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
          disabled={pending}
        >
          {pending ? "Sending Request..." : "Submit Custom Request"}
        </Button>
      </div>
    </form>
  );
}
