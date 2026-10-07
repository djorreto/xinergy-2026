import type { Locale } from "@/i18n/routing";
import { domainAcceptsMail } from "@/lib/insights/mail-domain";
import {
  clip,
  domainMatches,
  emailDomain,
  isBlockedEmail,
  isPersonName,
  isValidEmail,
} from "@/lib/insights/validate";
import { getAdminUser } from "@/lib/auth/admin";
import { isLiveInsight } from "@/lib/insights/schedule";
import { clientIp, hashDownloadToken, hashIp, newDownloadToken, requestCountry, santiagoDate } from "@/lib/insights/tokens";
import { createInsightLead } from "@/lib/monday/insights-board";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";

const HOUR_LIMIT = 8;
const DAY_LIMIT = 5;
const SIGNED_URL_SECONDS = 60 * 10;

type RequestInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  companyWebsite?: string;
  turnstileToken?: string;
  slug?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  preview?: boolean;
};

export type RequestResult = { ok: true; downloadUrl?: string } | { ok: false; error: string };

function isLocale(value: string | undefined): value is Locale {
  return value === "es" || value === "en" || value === "pt";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = (await response.json().catch(() => ({}))) as { success?: boolean };
  return Boolean(data.success);
}

export async function requestInsightDownload(request: Request, input: RequestInput): Promise<RequestResult> {
  if (!supabaseConfigured()) return { ok: false, error: "unavailable" };
  if (input.companyWebsite?.trim()) return { ok: true };

  const firstName = input.firstName?.trim() ?? "";
  const lastName = input.lastName?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";
  const slug = input.slug?.trim() ?? "";
  const locale = input.locale;

  if (!isPersonName(firstName) || !isPersonName(lastName)) return { ok: false, error: "invalid_name" };
  if (!isValidEmail(email)) return { ok: false, error: "invalid_email" };
  if (isBlockedEmail(email)) return { ok: false, error: "disposable_email" };
  if (!(await domainAcceptsMail(emailDomain(email)))) return { ok: false, error: "fake_email" };
  if (!isLocale(locale) || !slug) return { ok: false, error: "invalid_insight" };
  if (input.preview === true) {
    const session = await getAdminUser();
    if (!session) return { ok: false, error: "invalid_insight" };
    return adminPreviewDownload(slug, locale);
  }

  const ip = clientIp(request);
  if (!(await verifyTurnstile(input.turnstileToken?.trim() ?? "", ip))) {
    return { ok: false, error: "captcha" };
  }

  const admin = await createAdminClient();
  const domain = emailDomain(email);
  const sinceHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const sinceDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const ipHash = hashIp(ip);

  const [{ count: ipCount }, { count: emailCount }] = await Promise.all([
    admin
      .from("web_insight_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", sinceHour),
    admin
      .from("web_insight_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", sinceDay),
  ]);

  if ((ipCount ?? 0) >= HOUR_LIMIT || (emailCount ?? 0) >= DAY_LIMIT) {
    return { ok: false, error: "rate_limited" };
  }

  await admin.from("web_insight_attempts").insert({ ip_hash: ipHash, email });

  const { data: insight, error: insightError } = await admin
    .from("web_insights")
    .select("id, slug, kind, status, available_at, pdf_path, web_insight_locales(locale, title)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  const copy = (insight?.web_insight_locales ?? []).find(
    (item: { locale: string; title: string }) => item.locale === locale && item.title.trim(),
  );
  if (insightError || insight?.kind !== "documento" || !insight?.pdf_path || !copy || !isLiveInsight(insight.status, insight.available_at)) {
    return { ok: false, error: "invalid_insight" };
  }

  const { data: competitors } = await admin.from("web_insight_competitor_domains").select("domain");
  const isCompetitor = (competitors ?? []).some((row) => domainMatches(domain, row.domain));
  const now = new Date();
  const token = newDownloadToken();
  const { data: saved, error: insertError } = await admin
    .from("web_insight_downloads")
    .insert({
      token_hash: token.hash,
      insight_id: insight.id,
      locale,
      first_name: firstName,
      last_name: lastName,
      email,
      email_domain: domain,
      is_competitor: isCompetitor,
      utm_source: clip(input.utmSource, 200),
      utm_medium: clip(input.utmMedium, 200),
      utm_campaign: clip(input.utmCampaign, 200),
      utm_content: clip(input.utmContent, 200),
      utm_term: clip(input.utmTerm, 200),
      referrer: clip(input.referrer, 500),
      country_code: requestCountry(request),
      expires_at: new Date(now.getTime() + SIGNED_URL_SECONDS * 1000).toISOString(),
      validated_at: now.toISOString(),
    })
    .select("id")
    .single();
  if (insertError || !saved) return { ok: false, error: "unavailable" };

  const signed = await admin.storage.from("insight-pdfs").createSignedUrl(insight.pdf_path, SIGNED_URL_SECONDS, {
    download: `${insight.slug}.pdf`,
  });
  if (signed.error || !signed.data?.signedUrl) {
    await admin.from("web_insight_downloads").delete().eq("id", saved.id);
    return { ok: false, error: "unavailable" };
  }

  try {
    const itemId = await createInsightLead({
      firstName,
      lastName,
      email,
      domain,
      pov: copy.title,
      requestedOn: santiagoDate(now),
      validatedOn: santiagoDate(now),
      utmSource: clip(input.utmSource, 200),
      utmMedium: clip(input.utmMedium, 200),
      utmCampaign: clip(input.utmCampaign, 200),
      utmContent: clip(input.utmContent, 200),
      utmTerm: clip(input.utmTerm, 200),
      referrer: clip(input.referrer, 500),
      competitor: isCompetitor,
    });
    await admin.from("web_insight_downloads").update({ monday_item_id: itemId, monday_error: null }).eq("id", saved.id);
  } catch (mondayError) {
    const message = mondayError instanceof Error ? mondayError.message : "monday_error";
    console.error("[insights] Monday no registró la descarga:", message);
    await admin.from("web_insight_downloads").update({ monday_error: message.slice(0, 500) }).eq("id", saved.id);
  }

  return { ok: true, downloadUrl: signed.data.signedUrl };
}

async function adminPreviewDownload(slug: string, locale: Locale): Promise<RequestResult> {
  const admin = await createAdminClient();
  const { data: insight, error } = await admin
    .from("web_insights")
    .select("id, slug, kind, pdf_path, web_insight_locales(locale, title)")
    .eq("slug", slug)
    .maybeSingle();
  const copies = insight?.web_insight_locales ?? [];
  const copy = copies.find((item: { locale: string; title: string }) => item.locale === locale && item.title.trim())
    ?? copies.find((item: { locale: string; title: string }) => item.title.trim());
  if (error || insight?.kind !== "documento" || !insight.pdf_path || !copy) return { ok: false, error: "invalid_insight" };
  const signed = await admin.storage.from("insight-pdfs").createSignedUrl(insight.pdf_path, SIGNED_URL_SECONDS, {
    download: `${insight.slug}.pdf`,
  });
  if (signed.error || !signed.data?.signedUrl) return { ok: false, error: "unavailable" };
  return { ok: true, downloadUrl: signed.data.signedUrl };
}

type DownloadRow = {
  id: string;
  insight_id: string;
  locale: string;
  first_name: string;
  last_name: string;
  email: string;
  email_domain: string;
  is_competitor: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  created_at: string;
  expires_at: string;
  validated_at: string | null;
  monday_item_id: string | null;
  web_insights: { slug: string; kind: string | null; pdf_path: string | null; web_insight_locales: { locale: string; title: string }[] } | null;
};

export async function redeemInsightDownload(token: string): Promise<
  | { ok: true; url: string }
  | { ok: false; reason: "invalid" | "expired" | "unavailable"; locale: Locale }
> {
  const localeFallback: Locale = "es";
  if (!token || token.length < 20 || !supabaseConfigured()) {
    return { ok: false, reason: "invalid", locale: localeFallback };
  }

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("web_insight_downloads")
    .select(
      "id, insight_id, locale, first_name, last_name, email, email_domain, is_competitor, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, created_at, expires_at, validated_at, monday_item_id, web_insights(slug, kind, pdf_path, web_insight_locales(locale, title))",
    )
    .eq("token_hash", hashDownloadToken(token))
    .maybeSingle();

  const row = data as DownloadRow | null;
  const locale = isLocale(row?.locale) ? row.locale : localeFallback;
  if (error || !row) return { ok: false, reason: "invalid", locale };
  if (new Date(row.expires_at).getTime() < Date.now()) return { ok: false, reason: "expired", locale };

  const pdfPath = row.web_insights?.kind === "documento" ? row.web_insights.pdf_path : null;
  if (!pdfPath) return { ok: false, reason: "unavailable", locale };

  const now = new Date().toISOString();
  if (!row.validated_at) {
    await admin.from("web_insight_downloads").update({ validated_at: now }).eq("id", row.id);
  }

  if (!row.monday_item_id) {
    const title =
      row.web_insights?.web_insight_locales.find((item) => item.locale === row.locale)?.title ||
      row.web_insights?.slug ||
      "Point of View";
    try {
      const itemId = await createInsightLead({
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        domain: row.email_domain,
        pov: title,
        requestedOn: santiagoDate(new Date(row.created_at)),
        validatedOn: santiagoDate(),
        utmSource: row.utm_source,
        utmMedium: row.utm_medium,
        utmCampaign: row.utm_campaign,
        utmContent: row.utm_content,
        utmTerm: row.utm_term,
        referrer: row.referrer,
        competitor: row.is_competitor,
      });
      await admin.from("web_insight_downloads").update({ monday_item_id: itemId, monday_error: null }).eq("id", row.id);
    } catch (mondayError) {
      const message = mondayError instanceof Error ? mondayError.message : "monday_error";
      console.error("[insights] Monday no registró la descarga:", message);
      await admin.from("web_insight_downloads").update({ monday_error: message.slice(0, 500) }).eq("id", row.id);
    }
  }

  const signed = await admin.storage.from("insight-pdfs").createSignedUrl(pdfPath, SIGNED_URL_SECONDS, {
    download: `${row.web_insights?.slug || "xinergy"}.pdf`,
  });
  if (signed.error || !signed.data?.signedUrl) return { ok: false, reason: "unavailable", locale };
  return { ok: true, url: signed.data.signedUrl };
}
