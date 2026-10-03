"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ATTRIBUTION_KEY, type Attribution } from "@/lib/insights/attribution";

const fieldClass =
  "mt-2 w-full border border-xinergy-charcoal/15 bg-white px-4 py-3.5 text-base text-xinergy-charcoal outline-none transition placeholder:text-xinergy-slate/45 focus:border-xinergy-orange";

type Props = {
  slug: string;
};

function errorMessage(
  t: ReturnType<typeof useTranslations<"ui.insights.download">>,
  key: string | null,
) {
  switch (key) {
    case "invalid_name":
      return t("errors.invalid_name");
    case "invalid_email":
      return t("errors.invalid_email");
    case "disposable_email":
      return t("errors.disposable_email");
    case "fake_email":
      return t("errors.fake_email");
    case "rate_limited":
      return t("errors.rate_limited");
    case "captcha":
      return t("errors.captcha");
    case "email_failed":
      return t("errors.email_failed");
    case "network_error":
      return t("errors.network_error");
    default:
      return t("errors.generic");
  }
}

export function PovDownloadForm({ slug }: Props) {
  const t = useTranslations("ui.insights.download");
  const locale = useLocale();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    const elementId = "insight-turnstile";

    function render() {
      const turnstile = (
        window as Window & {
          turnstile?: { render: (element: HTMLElement, options: object) => void };
        }
      ).turnstile;
      const element = document.getElementById(elementId);
      if (!turnstile || !element || element.dataset.rendered === "true" || cancelled) return;
      element.dataset.rendered = "true";
      turnstile.render(element, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
      });
    }

    const existing = document.getElementById("cf-turnstile-script") as HTMLScriptElement | null;
    if (existing) {
      if ((window as Window & { turnstile?: unknown }).turnstile) render();
      else existing.addEventListener("load", render, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.addEventListener("load", render, { once: true });
    document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorKey(null);

    let attribution: Attribution = {};
    try {
      attribution = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}") as Attribution;
    } catch {
      attribution = {};
    }

    const params = new URLSearchParams(window.location.search);
    const turnstile = turnstileToken;

    try {
      const response = await fetch("/api/insights/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          companyWebsite,
          turnstileToken: turnstile,
          slug,
          locale,
          utmSource: params.get("utm_source") || attribution.utm_source,
          utmMedium: params.get("utm_medium") || attribution.utm_medium,
          utmCampaign: params.get("utm_campaign") || attribution.utm_campaign,
          utmContent: params.get("utm_content") || attribution.utm_content,
          utmTerm: params.get("utm_term") || attribution.utm_term,
          referrer: attribution.referrer || document.referrer,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; downloadUrl?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setErrorKey(data.error ?? "generic");
        return;
      }
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorKey("network_error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-xinergy-orange/30 bg-xinergy-cream p-6 sm:p-10">
        <p className="label-editorial">{t("successEyebrow")}</p>
        <p className="mt-3 font-display text-xl text-xinergy-charcoal">{t("successTitle")}</p>
        <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">{t("successBody", { email })}</p>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            className="mt-5 inline-flex bg-xinergy-orange px-5 py-3 text-sm font-semibold text-xinergy-charcoal transition hover:bg-xinergy-orange-dark"
          >
            {t("downloadAgain")}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative border border-xinergy-charcoal/10 bg-white p-4 sm:p-10">
      <p className="label-editorial">{t("eyebrow")}</p>
      <h2 className="mt-3 font-display text-2xl text-xinergy-charcoal">{t("title")}</h2>
      <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">{t("body")}</p>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={companyWebsite}
            onChange={(event) => setCompanyWebsite(event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="block text-sm text-xinergy-charcoal">
          {t("firstName")}
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={fieldClass}
            autoComplete="given-name"
          />
        </label>
        <label className="block text-sm text-xinergy-charcoal">
          {t("lastName")}
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={fieldClass}
            autoComplete="family-name"
          />
        </label>
        <label className="block text-sm text-xinergy-charcoal">
          {t("email")}
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
            autoComplete="email"
          />
        </label>
      </div>

      {siteKey ? <div id="insight-turnstile" className="mt-5" /> : null}

      {status === "error" ? <p className="mt-4 text-sm text-red-700">{errorMessage(t, errorKey)}</p> : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 flex w-full items-center justify-center bg-xinergy-orange px-5 py-3 text-sm font-semibold text-xinergy-charcoal transition hover:bg-xinergy-orange-dark disabled:opacity-60 sm:inline-flex sm:w-auto"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
