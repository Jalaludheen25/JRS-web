"use server";

export type QuoteState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "message", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Receives quote requests. Delivery goes to QUOTE_WEBHOOK_URL (e.g. a CRM, Zapier/Make hook or
 * an email-sending function). Until that is configured the visitor is told to use email or WhatsApp
 * instead of being shown a false success message.
 */
export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("website") ?? "").trim()) return { status: "success", message: "Thank you." };

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const fieldErrors: QuoteState["fieldErrors"] = {};
  if (data.name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) fieldErrors.email = "Please enter a valid email address.";
  if (data.phone && !/^[+\d][\d\s()-]{6,}$/.test(data.phone)) fieldErrors.phone = "Please enter a valid phone number.";
  if (data.message.length < 10) fieldErrors.message = "Please describe the part or service you need.";
  if (Object.keys(fieldErrors).length) return { status: "error", message: "Please check the highlighted fields.", fieldErrors };

  const hook = process.env.QUOTE_WEBHOOK_URL;
  if (!hook) {
    console.warn("[quote] QUOTE_WEBHOOK_URL is not configured; request not delivered", { topic: data.topic });
    return {
      status: "error",
      message: "Online requests aren't connected yet. Please email info@jrs-me.com or message us on WhatsApp.",
    };
  }

  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, source: "jrs-me.com", receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[quote] delivery failed", err);
    return { status: "error", message: "We couldn't send your request. Please email info@jrs-me.com or message us on WhatsApp." };
  }

  return { status: "success", message: "Thank you. Your request has reached the JRS team, and we'll reply by email or phone." };
}
