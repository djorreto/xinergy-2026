import { NextResponse } from "next/server";
import type { Locale } from "@/i18n/routing";
import { redeemInsightDownload } from "@/lib/insights/download";

const COPY: Record<Locale, Record<"invalid" | "expired" | "unavailable", { title: string; body: string }>> = {
  es: {
    invalid: {
      title: "Este enlace no es válido",
      body: "Vuelve al insight y solicita el documento otra vez.",
    },
    expired: {
      title: "Este enlace venció",
      body: "Los enlaces duran 72 horas. Solicita uno nuevo desde la página del insight.",
    },
    unavailable: {
      title: "El documento no está disponible",
      body: "Inténtalo de nuevo en unos minutos. Si sigue fallando, escríbenos.",
    },
  },
  en: {
    invalid: {
      title: "This link is not valid",
      body: "Go back to the insight and request the document again.",
    },
    expired: {
      title: "This link has expired",
      body: "Links last 72 hours. Request a new one from the insight page.",
    },
    unavailable: {
      title: "The document is unavailable",
      body: "Try again in a few minutes. If it keeps failing, write to us.",
    },
  },
  pt: {
    invalid: {
      title: "Este link não é válido",
      body: "Volte ao insight e solicite o documento novamente.",
    },
    expired: {
      title: "Este link expirou",
      body: "Os links duram 72 horas. Solicite um novo na página do insight.",
    },
    unavailable: {
      title: "O documento não está disponível",
      body: "Tente de novo em alguns minutos. Se continuar falhando, escreva para nós.",
    },
  },
};

function errorPage(locale: Locale, reason: "invalid" | "expired" | "unavailable") {
  const copy = COPY[locale][reason];
  const html = `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex,nofollow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${copy.title}</title>
</head>
<body style="margin:0;background:#f6f1ea;color:#3f374b;font-family:Helvetica,Arial,sans-serif;">
  <main style="max-width:36rem;margin:4rem auto;padding:0 1.25rem;">
    <p style="letter-spacing:0.14em;text-transform:uppercase;color:#d88900;font-size:12px;">Xinergy</p>
    <h1 style="font-size:2rem;line-height:1.2;">${copy.title}</h1>
    <p style="font-size:1rem;line-height:1.5;">${copy.body}</p>
    <p><a href="/${locale}/insights" style="color:#d88900;">Insights</a></p>
  </main>
</body>
</html>`;
  return new NextResponse(html, {
    status: reason === "unavailable" ? 503 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await redeemInsightDownload(token);
  if (!result.ok) return errorPage(result.locale, result.reason);

  const response = NextResponse.redirect(result.url, 302);
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
