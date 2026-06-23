"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const fieldClass =
  "mt-3 w-full border border-xinergy-charcoal/15 bg-white px-4 py-3.5 text-base text-xinergy-charcoal outline-none transition placeholder:text-xinergy-slate/45 focus:border-xinergy-orange sm:text-[length:var(--type-body)]";

function errorMessage(
  t: ReturnType<typeof useTranslations<"ui.contact.form">>,
  key: string | null,
) {
  switch (key) {
    case "network_error":
      return t("errors.network_error");
    case "invalid_name":
      return t("errors.invalid_name");
    case "invalid_email":
      return t("errors.invalid_email");
    case "invalid_message":
      return t("errors.invalid_message");
    default:
      return t("errors.generic");
  }
}

export function ContactForm() {
  const t = useTranslations("ui.contact.form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorKey(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, role, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorKey(data.error ?? "generic");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setRole("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorKey("network_error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-xinergy-orange/30 bg-xinergy-cream p-8 sm:p-10">
        <p className="label-editorial">{t("successEyebrow")}</p>
        <p className="mt-3 font-display text-xl text-xinergy-charcoal sm:text-2xl">
          {t("successTitle")}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-xinergy-orange hover:underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-xinergy-charcoal/10 bg-white p-6 sm:p-8"
    >
      <p className="label-editorial">{t("eyebrow")}</p>
      <h2 className="mt-2 font-display text-[length:var(--type-section)] text-xinergy-charcoal">{t("title")}</h2>
      <p className="type-body-sm mt-2 text-xinergy-slate">{t("subtitle")}</p>

      <div className="mt-6 space-y-6">
        <fieldset>
          <label htmlFor="contact-name" className="label-editorial">
            {t("name")}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="contact-email" className="label-editorial">
            {t("email")}
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="contact-phone" className="label-editorial">
            {t("phone")}
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="contact-company" className="label-editorial">
            {t("company")}
          </label>
          <input
            id="contact-company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="contact-role" className="label-editorial">
            {t("role")}
          </label>
          <input
            id="contact-role"
            type="text"
            autoComplete="organization-title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="contact-message" className="label-editorial">
            {t("message")}
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldClass} min-h-[7.5rem] resize-y`}
          />
        </fieldset>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {errorMessage(t, errorKey)}
        </p>
      )}

      <div className="mt-6">
        <button
          type="submit"
          className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto"
          disabled={status === "loading"}
        >
          {status === "loading" ? t("sending") : t("submit")}
        </button>
      </div>
    </form>
  );
}
