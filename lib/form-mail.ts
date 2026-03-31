import { Resend } from "resend";

const DEFAULT_NOTIFICATION_TO = "hello@atlasbiolabs.co";

export type NotificationField = {
  label: string;
  value: string;
};

export type NotificationSection = {
  title: string;
  lines: string[];
};

export type NotificationEmailPayload = {
  subject: string;
  heading: string;
  previewText: string;
  fields: NotificationField[];
  sections?: NotificationSection[];
  footer?: string;
  replyTo?: string;
};

let resendClient: Resend | null = null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getMailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.FORM_NOTIFICATION_TO?.trim() || DEFAULT_NOTIFICATION_TO;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return { client: resendClient, from, to };
}

function buildTextEmail(payload: NotificationEmailPayload) {
  const lines: string[] = [payload.heading, "", payload.previewText, ""];

  for (const field of payload.fields) {
    lines.push(`${field.label}: ${field.value}`);
  }

  for (const section of payload.sections ?? []) {
    lines.push("", `${section.title}:`);
    for (const line of section.lines) {
      lines.push(`- ${line}`);
    }
  }

  if (payload.footer) {
    lines.push("", payload.footer);
  }

  return lines.join("\n");
}

function buildHtmlEmail(payload: NotificationEmailPayload) {
  const fieldRows = payload.fields
    .map(
      (field) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapeHtml(field.label)}</td><td style="padding:8px 12px;color:#334155;border-bottom:1px solid #e2e8f0;">${escapeHtml(field.value)}</td></tr>`
    )
    .join("");

  const sections = (payload.sections ?? [])
    .map((section) => {
      const sectionLines = section.lines
        .map(
          (line) =>
            `<li style="margin:0 0 8px;color:#334155;">${escapeHtml(line)}</li>`
        )
        .join("");

      return `
        <section style="margin-top:24px;">
          <h2 style="margin:0 0 12px;color:#0f172a;font-size:16px;">${escapeHtml(section.title)}</h2>
          <ul style="margin:0;padding-left:20px;">${sectionLines}</ul>
        </section>
      `;
    })
    .join("");

  return `
    <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;">
        <p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Atlas BioLabs Website</p>
        <h1 style="margin:0 0 12px;color:#0f172a;font-size:28px;line-height:1.2;">${escapeHtml(payload.heading)}</h1>
        <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">${escapeHtml(payload.previewText)}</p>

        <table style="width:100%;margin-top:24px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tbody>${fieldRows}</tbody>
        </table>

        ${sections}

        ${
          payload.footer
            ? `<p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.6;">${escapeHtml(payload.footer)}</p>`
            : ""
        }
      </div>
    </div>
  `;
}

export async function sendFormNotification(payload: NotificationEmailPayload) {
  const { client, from, to } = getMailConfig();
  const text = buildTextEmail(payload);
  const html = buildHtmlEmail(payload);

  const response = await client.emails.send({
    from,
    to,
    subject: payload.subject,
    text,
    html,
    replyTo: payload.replyTo,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
