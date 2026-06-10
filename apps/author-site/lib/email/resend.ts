type EmailPayload = { to: string; subject: string; html: string; text?: string };

export async function sendTransactionalEmail(payload: EmailPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return { ok: false, skipped: true, reason: "Resend is not configured." } as const;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, ...payload })
  });

  if (!response.ok) return { ok: false, skipped: false, reason: await response.text() } as const;
  return { ok: true, skipped: false } as const;
}
