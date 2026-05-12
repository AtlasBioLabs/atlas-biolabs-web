import "server-only";

export type AutomationBotPayload = {
  source: "request_quote" | "contact_form" | "custom_request" | "inquiry_cart";
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  product_interest?: string;
  estimated_quantity?: string;
  timeline?: string;
  message?: string;
  items?: unknown[];
  page_url?: string;
  user_agent?: string;
};

export type AutomationBotResult = {
  success: boolean;
  rfq_id?: number;
  error?: string;
};

const DEFAULT_TIMEOUT_MS = 8000;

function sanitizeEndpoint(endpoint: string | undefined) {
  return endpoint?.trim() || "";
}

function sanitizeToken(token: string | undefined) {
  return token?.trim() || "";
}

export async function sendRfqToAutomationBot(
  payload: AutomationBotPayload
): Promise<AutomationBotResult> {
  const endpoint = sanitizeEndpoint(process.env.ATLAS_BOT_RFQ_ENDPOINT);
  const token = sanitizeToken(process.env.ATLAS_BOT_API_TOKEN);

  if (!endpoint || !token) {
    console.warn(
      "Atlas automation bot RFQ sync skipped: endpoint or token is not configured."
    );
    return { success: false, error: "Bot endpoint or token is not configured." };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ATLAS-RFQ-TOKEN": token,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      console.error("Atlas automation bot RFQ sync failed.", {
        status: response.status,
        statusText: response.statusText,
        body: text.slice(0, 500),
      });
      return {
        success: false,
        error: `Bot endpoint returned ${response.status}.`,
      };
    }

    const rfqId =
      data && typeof data === "object" && "rfq_id" in data
        ? Number((data as { rfq_id?: unknown }).rfq_id)
        : undefined;

    return {
      success: true,
      rfq_id: Number.isFinite(rfqId) ? rfqId : undefined,
    };
  } catch (error) {
    console.error("Atlas automation bot RFQ sync failed.", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown bot sync error.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
