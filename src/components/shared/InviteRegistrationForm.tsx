"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  EVENT_ATTENDANCE_OPTIONS,
  EVENT_CONTENT_OPTIONS,
  type EventAttendanceValue,
  type EventContentInterestValue,
} from "@/lib/invite-form";
import type { InviteId } from "@/lib/invites";

/** 16px+ evita zoom automático de iOS al enfocar inputs. */
const fieldClass =
  "mt-2 w-full min-h-12 border border-xinergy-charcoal/12 bg-xinergy-ivory px-4 py-3.5 text-[16px] text-xinergy-charcoal outline-none transition placeholder:text-xinergy-slate/40 focus:border-xinergy-orange focus:bg-white sm:min-h-[3.25rem] sm:mt-2.5";

const labelClass =
  "text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-xinergy-slate sm:text-xs sm:tracking-[0.14em]";

const choiceClass = (selected: boolean) =>
  `flex min-h-14 cursor-pointer items-start gap-2.5 border px-3 py-3 text-[0.875rem] leading-snug transition ${
    selected
      ? "border-xinergy-orange bg-xinergy-orange/10 text-xinergy-charcoal"
      : "border-xinergy-charcoal/12 bg-xinergy-ivory text-xinergy-charcoal hover:border-xinergy-orange/40"
  }`;

function errorMessage(
  t: ReturnType<typeof useTranslations<"ui.registro.form">>,
  key: string | null,
) {
  switch (key) {
    case "network_error":
      return t("errors.network_error");
    case "invalid_name":
      return t("errors.invalid_name");
    case "invalid_email":
      return t("errors.invalid_email");
    case "invalid_invite":
      return t("errors.invalid_invite");
    case "invalid_consent":
      return t("errors.invalid_consent");
    case "invalid_content_interest":
      return t("errors.invalid_content_interest");
    case "invalid_attendance":
      return t("errors.invalid_attendance");
    default:
      return t("errors.generic");
  }
}

type Props = {
  token: string;
  inviteId: InviteId;
};

export function InviteRegistrationForm({ token, inviteId }: Props) {
  const t = useTranslations("ui.registro.form");
  const isEvento = inviteId === "evento";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [contentInterest, setContentInterest] = useState<EventContentInterestValue | "">("");
  const [attendanceMode, setAttendanceMode] = useState<EventAttendanceValue | "">("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorKey(null);

    if (!consent) {
      setStatus("error");
      setErrorKey("invalid_consent");
      return;
    }

    if (isEvento && !contentInterest) {
      setStatus("error");
      setErrorKey("invalid_content_interest");
      return;
    }

    if (isEvento && !attendanceMode) {
      setStatus("error");
      setErrorKey("invalid_attendance");
      return;
    }

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name,
          email,
          phone,
          company,
          role,
          consent: true,
          contentInterest: isEvento ? contentInterest : undefined,
          attendanceMode: isEvento ? attendanceMode : undefined,
        }),
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
      setContentInterest("");
      setAttendanceMode("");
      setConsent(false);
    } catch {
      setStatus("error");
      setErrorKey("network_error");
    }
  }

  if (status === "success") {
    return (
      <div className="invite-form-shell border border-xinergy-orange/40 bg-gradient-to-br from-[#2a2433] via-[#363040] to-[#3f374b] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <p className="label-editorial-light">{t("successEyebrow")}</p>
        <p className="mt-3 font-display text-2xl leading-tight text-white sm:text-3xl">
          {t("successTitle")}
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/75 sm:text-sm sm:text-white/70">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="invite-form-shell relative overflow-hidden border border-white/10 bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.4)] sm:p-8"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-xinergy-orange via-[#ffc14d] to-xinergy-orange"
      />
      <p className="label-editorial text-xinergy-orange">{t("eyebrow")}</p>
      <h2 className="mt-2 font-display text-[1.5rem] leading-tight text-xinergy-charcoal sm:text-[length:var(--type-section)]">
        {t("title")}
      </h2>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-xinergy-slate sm:text-[length:var(--type-body-sm)]">
        {t("subtitle")}
      </p>

      <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
        <fieldset>
          <label htmlFor="invite-name" className={labelClass}>
            {t("name")}
          </label>
          <input
            id="invite-name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="invite-email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="invite-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="next"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="invite-phone" className={labelClass}>
            {t("phone")}
          </label>
          <input
            id="invite-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="invite-company" className={labelClass}>
            {t("company")}
          </label>
          <input
            id="invite-company"
            type="text"
            autoComplete="organization"
            autoCapitalize="words"
            enterKeyHint="next"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="invite-role" className={labelClass}>
            {t("role")}
          </label>
          <input
            id="invite-role"
            type="text"
            autoComplete="organization-title"
            autoCapitalize="words"
            enterKeyHint={isEvento ? "next" : "done"}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={fieldClass}
          />
        </fieldset>

        {isEvento && (
          <>
            <fieldset>
              <legend className={`${labelClass} mb-0`}>
                {t("contentInterest.label")}{" "}
                <span className="text-xinergy-orange" aria-hidden>
                  *
                </span>
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {EVENT_CONTENT_OPTIONS.map((option) => {
                  const selected = contentInterest === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`${choiceClass(selected)} sm:min-h-[4.5rem] sm:flex-col sm:items-stretch sm:justify-between sm:text-[0.8125rem]`}
                    >
                      <input
                        type="radio"
                        name="content-interest"
                        value={option.value}
                        checked={selected}
                        onChange={() => setContentInterest(option.value)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--xinergy-orange)] sm:mt-0"
                        required
                      />
                      <span className="font-medium">
                        {t(`contentInterest.options.${option.labelKey}`)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className={`${labelClass} mb-0`}>
                {t("attendance.label")}{" "}
                <span className="text-xinergy-orange" aria-hidden>
                  *
                </span>
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {EVENT_ATTENDANCE_OPTIONS.map((option) => {
                  const selected = attendanceMode === option.value;
                  return (
                    <label key={option.value} className={choiceClass(selected)}>
                      <input
                        type="radio"
                        name="attendance-mode"
                        value={option.value}
                        checked={selected}
                        onChange={() => setAttendanceMode(option.value)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--xinergy-orange)]"
                        required
                      />
                      <span className="font-medium">
                        {t(`attendance.options.${option.labelKey}`)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </>
        )}

        <div className="border border-xinergy-charcoal/10 bg-xinergy-ivory/80 px-3.5 py-4 sm:px-4">
          <p className="text-[0.8125rem] leading-relaxed text-xinergy-slate sm:text-sm">
            {t("consent.body")}
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--xinergy-orange)]"
            />
            <span className="text-[0.875rem] leading-snug text-xinergy-charcoal sm:text-sm">
              {t("consent.checkbox")}{" "}
              <span className="text-xinergy-orange" aria-hidden>
                *
              </span>
            </span>
          </label>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-[0.9375rem] text-red-600 sm:text-sm" role="alert">
          {errorMessage(t, errorKey)}
        </p>
      )}

      <div className="mt-6 sm:mt-7">
        <button
          type="submit"
          className="btn-primary invite-submit w-full justify-center disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? t("sending") : t("submit")}
        </button>
      </div>
    </form>
  );
}
