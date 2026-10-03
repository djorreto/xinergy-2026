import type { Locale } from "@/i18n/routing";
import { sendResendEmail } from "@/lib/email/resend";

const COPY: Record<
  Locale,
  { subject: (title: string) => string; intro: string; button: string; expires: string; ignore: string }
> = {
  es: {
    subject: (title) => `Tu documento de Xinergy: ${title}`,
    intro: "Confirma tu correo para descargar el documento completo.",
    button: "Descargar el PDF",
    expires: "El enlace es personal y vence en 72 horas.",
    ignore: "Si no solicitaste este documento, puedes ignorar este mensaje.",
  },
  en: {
    subject: (title) => `Your Xinergy document: ${title}`,
    intro: "Confirm your email to download the full document.",
    button: "Download the PDF",
    expires: "This link is personal and expires in 72 hours.",
    ignore: "If you did not request this document, you can ignore this message.",
  },
  pt: {
    subject: (title) => `Seu documento Xinergy: ${title}`,
    intro: "Confirme seu e-mail para baixar o documento completo.",
    button: "Baixar o PDF",
    expires: "O link é pessoal e expira em 72 horas.",
    ignore: "Se você não solicitou este documento, pode ignorar esta mensagem.",
  },
};

export async function sendInsightAccessEmail(opts: {
  to: string;
  firstName: string;
  title: string;
  locale: Locale;
  accessUrl: string;
}) {
  const copy = COPY[opts.locale];
  const text = `${opts.firstName},\n\n${copy.intro}\n\n${opts.title}\n${opts.accessUrl}\n\n${copy.expires}\n${copy.ignore}\n`;
  const html = `<!doctype html>
<html>
<body style="margin:0;background:#f6f1ea;font-family:Helvetica,Arial,sans-serif;color:#3f374b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1ea;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;padding:32px;">
        <tr><td style="font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#d88900;">Xinergy</td></tr>
        <tr><td style="padding-top:16px;font-size:24px;line-height:1.3;font-weight:700;">${escapeHtml(opts.title)}</td></tr>
        <tr><td style="padding-top:16px;font-size:16px;line-height:1.5;">${escapeHtml(opts.firstName)}, ${escapeHtml(copy.intro)}</td></tr>
        <tr><td style="padding-top:28px;">
          <a href="${opts.accessUrl}" style="display:inline-block;background:#fca100;color:#3f374b;text-decoration:none;font-weight:700;padding:14px 22px;">${escapeHtml(copy.button)}</a>
        </td></tr>
        <tr><td style="padding-top:24px;font-size:13px;line-height:1.5;color:#6d6574;">${escapeHtml(copy.expires)}<br>${escapeHtml(copy.ignore)}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return sendResendEmail({
    to: opts.to,
    subject: copy.subject(opts.title),
    html,
    text,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
