"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitContactFormAction } from "@/app/(site)/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInitialFormState } from "@/lib/form-state";

type ContactFormData = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

type ContactField = keyof ContactFormData;

const initialState = createInitialFormState<ContactField>();

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitContactFormAction,
    initialState
  );
  const [dismissedErrors, setDismissedErrors] = useState<
    Partial<Record<ContactField, number>>
  >({});

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  function getError(field: ContactField) {
    return dismissedErrors[field] === state.submissionId
      ? undefined
      : state.fieldErrors[field];
  }

  function clearError(field: ContactField) {
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

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-[var(--brand-navy)]">
          Full Name
        </label>
        <Input
          id="name"
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
        <label htmlFor="email" className="text-sm font-medium text-[var(--brand-navy)]">
          Work Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue=""
          onInput={() => clearError("email")}
          placeholder="alex@company.com"
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
        <label
          htmlFor="organization"
          className="text-sm font-medium text-[var(--brand-navy)]"
        >
          Organization
        </label>
        <Input
          id="organization"
          name="organization"
          defaultValue=""
          onInput={() => clearError("organization")}
          placeholder="Northline Wellness"
          className="h-10"
          autoComplete="organization"
          enterKeyHint="next"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-[var(--brand-navy)]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          defaultValue=""
          onInput={() => clearError("message")}
          placeholder="Tell us what peptides you need, expected quantity, destination market, and preferred timeline."
          className="min-h-36 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          enterKeyHint="send"
          aria-invalid={Boolean(getError("message"))}
        />
        {getError("message") ? (
          <p className="text-xs text-destructive">{getError("message")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Include MOQ or bulk targets so we can recommend the right sourcing path.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          We will review your message and follow up by email.
        </p>
        <Button
          type="submit"
          className="bg-[var(--brand-navy)] hover:bg-[var(--brand-blue)]"
          disabled={pending}
        >
          {pending ? "Sending Message..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
