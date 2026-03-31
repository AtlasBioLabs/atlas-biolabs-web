'use server'

import { revalidatePath } from "next/cache";

import {
  clearInquiryCart,
  getInquiryCart,
} from "@/lib/cart-session";
import { sendFormNotification } from "@/lib/form-mail";
import type { FormSubmissionState } from "@/lib/form-state";
import {
  contactDetails,
  type CartInquiryFormData,
  type QuoteRequestFormData,
} from "@/lib/site-content";

type ContactFormField = "name" | "email" | "organization" | "message";
type CustomRequestField =
  | "name"
  | "email"
  | "company"
  | "peptideName"
  | "quantity"
  | "timeline"
  | "notes";
type QuoteField = keyof QuoteRequestFormData;
type CartField = keyof CartInquiryFormData;

type ContactFormValues = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

type CustomRequestValues = {
  name: string;
  email: string;
  company: string;
  peptideName: string;
  quantity: string;
  timeline: string;
  notes: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDirectEmailFallbackMessage(requestLabel: string) {
  return `We could not send your ${requestLabel} right now. Please email ${contactDetails.recipientEmail} directly.`;
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function createSuccessState<TField extends string>(
  message: string
): FormSubmissionState<TField> {
  return {
    status: "success",
    message,
    fieldErrors: {},
    submissionId: Date.now(),
  };
}

function createErrorState<TField extends string>(
  message: string,
  fieldErrors: Partial<Record<TField, string>> = {}
): FormSubmissionState<TField> {
  return {
    status: "error",
    message,
    fieldErrors,
    submissionId: Date.now(),
  };
}

function validateContactForm(formData: FormData) {
  const data: ContactFormValues = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    organization: readString(formData, "organization"),
    message: readString(formData, "message"),
  };

  const fieldErrors: Partial<Record<ContactFormField, string>> = {};

  if (!data.name) {
    fieldErrors.name = "Name is required.";
  }

  if (!emailPattern.test(data.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!data.message) {
    fieldErrors.message = "Message is required.";
  } else if (data.message.length < 20) {
    fieldErrors.message = "Please include at least 20 characters.";
  }

  return { data, fieldErrors };
}

function validateCustomRequestForm(formData: FormData) {
  const data: CustomRequestValues = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    company: readString(formData, "company"),
    peptideName: readString(formData, "peptideName"),
    quantity: readString(formData, "quantity"),
    timeline: readString(formData, "timeline"),
    notes: readString(formData, "notes"),
  };

  const fieldErrors: Partial<Record<CustomRequestField, string>> = {};

  if (!data.name) {
    fieldErrors.name = "Full name is required.";
  }

  if (!emailPattern.test(data.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!data.peptideName) {
    fieldErrors.peptideName = "Peptide request is required.";
  }

  if (!data.quantity) {
    fieldErrors.quantity = "Requested quantity is required.";
  }

  if (!data.notes) {
    fieldErrors.notes = "Project details are required.";
  } else if (data.notes.length < 20) {
    fieldErrors.notes = "Please include at least 20 characters.";
  }

  return { data, fieldErrors };
}

function validateQuoteRequestForm(formData: FormData) {
  const data: QuoteRequestFormData = {
    fullName: readString(formData, "fullName"),
    companyName: readString(formData, "companyName"),
    email: readString(formData, "email"),
    phoneWhatsApp: readString(formData, "phoneWhatsApp"),
    country: readString(formData, "country"),
    product: readString(formData, "product"),
    quantity: readString(formData, "quantity"),
    message: readString(formData, "message"),
  };

  const fieldErrors: Partial<Record<QuoteField, string>> = {};

  if (!data.fullName) fieldErrors.fullName = "Full name is required.";
  if (!emailPattern.test(data.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!data.phoneWhatsApp) {
    fieldErrors.phoneWhatsApp = "Phone or WhatsApp is required.";
  }
  if (!data.country) fieldErrors.country = "Country is required.";
  if (!data.product) fieldErrors.product = "Product is required.";
  if (!data.quantity) {
    fieldErrors.quantity = "Quantity or MOQ requirement is required.";
  }
  if (!data.message) {
    fieldErrors.message = "Message is required.";
  }

  return { data, fieldErrors };
}

function validateCartInquiryForm(formData: FormData) {
  const data: CartInquiryFormData = {
    fullName: readString(formData, "fullName"),
    companyName: readString(formData, "companyName"),
    email: readString(formData, "email"),
    phoneWhatsApp: readString(formData, "phoneWhatsApp"),
    country: readString(formData, "country"),
    paymentMethod: readString(formData, "paymentMethod"),
    product: readString(formData, "product"),
    quantity: readString(formData, "quantity"),
    message: readString(formData, "message"),
  };

  const fieldErrors: Partial<Record<CartField, string>> = {};

  if (!data.fullName) fieldErrors.fullName = "Full name is required.";
  if (!emailPattern.test(data.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!data.phoneWhatsApp) {
    fieldErrors.phoneWhatsApp = "Phone or WhatsApp is required.";
  }
  if (!data.country) fieldErrors.country = "Country is required.";
  if (!data.paymentMethod) {
    fieldErrors.paymentMethod = "Payment method is required.";
  }
  if (!data.message) fieldErrors.message = "Message is required.";

  return { data, fieldErrors };
}

export async function submitContactFormAction(
  _previousState: FormSubmissionState<ContactFormField>,
  formData: FormData
): Promise<FormSubmissionState<ContactFormField>> {
  const { data, fieldErrors } = validateContactForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState(
      "Please review the highlighted fields and try again.",
      fieldErrors
    );
  }

  try {
    await sendFormNotification({
      subject: `Atlas BioLabs contact form - ${data.name}`,
      heading: "Contact Form Submission",
      previewText: `${data.name} sent a new message through the Atlas BioLabs contact form.`,
      replyTo: data.email,
      fields: [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Organization", value: data.organization || "Not provided" },
      ],
      sections: [
        {
          title: "Message",
          lines: [data.message],
        },
      ],
      footer: "Submitted from the Atlas BioLabs contact page.",
    });

    return createSuccessState(
      "Thank you. We received your message and will get back to you soon."
    );
  } catch (error) {
    console.error("Failed to submit contact form.", error);
    return createErrorState(getDirectEmailFallbackMessage("message"));
  }
}

export async function submitCustomRequestFormAction(
  _previousState: FormSubmissionState<CustomRequestField>,
  formData: FormData
): Promise<FormSubmissionState<CustomRequestField>> {
  const { data, fieldErrors } = validateCustomRequestForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState(
      "Please review the highlighted fields and try again.",
      fieldErrors
    );
  }

  try {
    await sendFormNotification({
      subject: `Atlas BioLabs custom request - ${data.name}`,
      heading: "Custom Request Submission",
      previewText: `${data.name} submitted a custom peptide sourcing request.`,
      replyTo: data.email,
      fields: [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Company", value: data.company || "Not provided" },
        { label: "Requested peptide", value: data.peptideName },
        { label: "Target quantity", value: data.quantity },
        { label: "Target timeline", value: data.timeline || "Not provided" },
      ],
      sections: [
        {
          title: "Project details",
          lines: [data.notes],
        },
      ],
      footer: "Submitted from the Atlas BioLabs custom requests page.",
    });

    return createSuccessState(
      "Thank you. We received your custom request and will get back to you soon."
    );
  } catch (error) {
    console.error("Failed to submit custom request form.", error);
    return createErrorState(getDirectEmailFallbackMessage("request"));
  }
}

export async function submitQuoteRequestFormAction(
  _previousState: FormSubmissionState<QuoteField>,
  formData: FormData
): Promise<FormSubmissionState<QuoteField>> {
  const { data, fieldErrors } = validateQuoteRequestForm(formData);
  const source = readString(formData, "source") || "quote request form";

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState(
      "Please review the highlighted fields and try again.",
      fieldErrors
    );
  }

  try {
    await sendFormNotification({
      subject: `Atlas BioLabs quote request - ${data.fullName}`,
      heading: "Quote Request Submission",
      previewText: `${data.fullName} requested a quote for ${data.product}.`,
      replyTo: data.email,
      fields: [
        { label: "Form source", value: source },
        { label: "Full name", value: data.fullName },
        { label: "Company", value: data.companyName || "Not provided" },
        { label: "Email", value: data.email },
        { label: "Phone / WhatsApp", value: data.phoneWhatsApp },
        { label: "Country", value: data.country },
        { label: "Product", value: data.product },
        { label: "Quantity", value: data.quantity },
      ],
      sections: [
        {
          title: "Message",
          lines: [data.message],
        },
      ],
      footer: "Submitted from the Atlas BioLabs quote workflow.",
    });

    return createSuccessState(
      "Thank you. We received your quote request and will get back to you soon."
    );
  } catch (error) {
    console.error("Failed to submit quote request form.", error);
    return createErrorState(getDirectEmailFallbackMessage("request"));
  }
}

export async function submitCartInquiryFormAction(
  _previousState: FormSubmissionState<CartField>,
  formData: FormData
): Promise<FormSubmissionState<CartField>> {
  const { data, fieldErrors } = validateCartInquiryForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState(
      "Please review the highlighted fields and try again.",
      fieldErrors
    );
  }

  const items = await getInquiryCart();

  if (items.length === 0) {
    return createErrorState(
      "Your inquiry cart is empty. Add products before submitting an inquiry."
    );
  }

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const effectiveSubtotal = items.reduce(
    (sum, item) => sum + item.unitPriceFrom * item.quantity,
    0
  );

  try {
    await sendFormNotification({
      subject: `Atlas BioLabs cart inquiry - ${data.fullName}`,
      heading: "Cart Inquiry Submission",
      previewText: `${data.fullName} submitted an inquiry for ${items.length} product line(s).`,
      replyTo: data.email,
      fields: [
        { label: "Full name", value: data.fullName },
        { label: "Company", value: data.companyName || "Not provided" },
        { label: "Email", value: data.email },
        { label: "Phone / WhatsApp", value: data.phoneWhatsApp },
        { label: "Country", value: data.country },
        { label: "Preferred payment method", value: data.paymentMethod },
        { label: "Total units", value: `${totalUnits} units` },
        {
          label: "Estimated starting subtotal",
          value: `$${effectiveSubtotal.toFixed(2)} USD`,
        },
      ],
      sections: [
        {
          title: "Selected products",
          lines: items.map(
            (item) =>
              `${item.name}: ${item.quantity} units, MOQ ${item.moq}, from $${item.unitPriceFrom}/unit, line subtotal $${(
                item.unitPriceFrom * item.quantity
              ).toFixed(2)} USD`
          ),
        },
        {
          title: "Inquiry message",
          lines: [data.message],
        },
      ],
      footer: "Submitted from the Atlas BioLabs inquiry cart.",
    });

    await clearInquiryCart();
    revalidatePath("/cart");
    revalidatePath("/", "layout");

    return createSuccessState(
      "Thank you. We received your inquiry and will get back to you soon."
    );
  } catch (error) {
    console.error("Failed to submit cart inquiry form.", error);
    return createErrorState(getDirectEmailFallbackMessage("inquiry"));
  }
}
