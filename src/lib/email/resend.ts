type SendResult = { ok: true; id?: string } | { ok: false; error: string };

export function insightsFromAddress(): string {
  return (
    process.env.INSIGHTS_FROM_EMAIL?.trim() ||
    process.env.REPORT_FROM_EMAIL?.trim() ||
    "Xinergy <reportes@send.xinergy.cl>"
  );
}

export async function sendResendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "email_not_configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: insightsFromAddress(),
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        tags: [{ name: "category", value: "insight_download" }],
      }),
    });
    const json = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!response.ok) return { ok: false, error: json.message || `resend_${response.status}` };
    return { ok: true, id: json.id };
  } catch {
    return { ok: false, error: "email_network" };
  }
}
