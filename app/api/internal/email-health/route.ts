import { NextRequest, NextResponse } from "next/server";

import { sendFormNotification } from "@/lib/form-mail";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const configuredToken = process.env.INTERNAL_HEALTH_TOKEN?.trim();

  if (configuredToken) {
    const headerToken = request.headers.get("x-health-token")?.trim();
    const queryToken = request.nextUrl.searchParams.get("token")?.trim();
    return headerToken === configuredToken || queryToken === configuredToken;
  }

  const hostname = request.nextUrl.hostname;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1";

  return process.env.NODE_ENV !== "production" || isLocalHost;
}

function getMaskedValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  if (value.length <= 8) {
    return "********";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getConfigStatus() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.FORM_NOTIFICATION_TO?.trim() || "dathuncho12@gmail.com";

  return {
    ready: Boolean(apiKey && from && to),
    resendApiKeyPresent: Boolean(apiKey),
    resendApiKeyMasked: getMaskedValue(apiKey),
    resendFromEmail: from || null,
    notificationTo: to,
    usingResendDevSender: from === "onboarding@resend.dev",
    tokenProtected: Boolean(process.env.INTERNAL_HEALTH_TOKEN?.trim()),
    environment: process.env.NODE_ENV || "development",
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    config: getConfigStatus(),
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    await sendFormNotification({
      subject: "Atlas BioLabs email health check",
      heading: "Internal Email Health Check",
      previewText: "This message confirms that the Atlas BioLabs Resend integration is able to send mail.",
      fields: [
        {
          label: "Triggered at",
          value: new Date().toISOString(),
        },
        {
          label: "Environment",
          value: process.env.NODE_ENV || "development",
        },
      ],
      footer:
        "Triggered from the internal email health route. If you received this, the current Resend configuration is working.",
    });

    return NextResponse.json({
      ok: true,
      message: "Test email sent successfully.",
      config: getConfigStatus(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email health check failure.";

    return NextResponse.json(
      {
        ok: false,
        message,
        config: getConfigStatus(),
      },
      { status: 500 }
    );
  }
}
