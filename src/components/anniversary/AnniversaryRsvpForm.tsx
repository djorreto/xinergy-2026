"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  ANNIVERSARY_TOKEN,
  ANNIVERSARY_TRAVEL_OPTIONS,
  type AnniversaryTravelValue,
} from "@/lib/anniversary";

function errorMessage(
  t: ReturnType<typeof useTranslations<"ui.aniversario.form">>,
  key: string | null,
) {
  switch (key) {
    case "network_error":
      return t("errors.network_error");
    case "invalid_name":
      return t("errors.invalid_name");
    case "invalid_last_name":
      return t("errors.invalid_last_name");
    case "invalid_email":
      return t("errors.invalid_email");
    case "invalid_travel":
      return t("errors.invalid_travel");
    default:
      return t("errors.generic");
  }
}

export function AnniversaryRsvpForm() {
  const t = useTranslations("ui.aniversario.form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [travel, setTravel] = useState<AnniversaryTravelValue | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorKey(null);

    if (!travel) {
      setStatus("error");
      setErrorKey("invalid_travel");
      return;
    }

    try {
      const res = await fetch("/api/aniversario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: ANNIVERSARY_TOKEN,
          firstName,
          lastName,
          email,
          travel,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorKey(data.error ?? "generic");
        return;
      }
      setStatus("success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setTravel("");
    } catch {
      setStatus("error");
      setErrorKey("network_error");
    }
  }

  if (status === "success") {
    return (
      <div className="anniv-rsvp is-done">
        <p className="anniv-rsvp__eyebrow">{t("successEyebrow")}</p>
        <p className="anniv-rsvp__title font-display">{t("successTitle")}</p>
        <p className="anniv-rsvp__lead">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form className="anniv-rsvp" onSubmit={handleSubmit}>
      <p className="anniv-rsvp__eyebrow">{t("eyebrow")}</p>
      <h2 className="anniv-rsvp__title font-display">{t("title")}</h2>
      <p className="anniv-rsvp__lead">{t("lead")}</p>

      <div className="anniv-rsvp__grid">
        <label className="anniv-rsvp__field">
          <span>{t("firstName")}</span>
          <input
            type="text"
            autoComplete="given-name"
            autoCapitalize="words"
            enterKeyHint="next"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label className="anniv-rsvp__field">
          <span>{t("lastName")}</span>
          <input
            type="text"
            autoComplete="family-name"
            autoCapitalize="words"
            enterKeyHint="next"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
        <label className="anniv-rsvp__field anniv-rsvp__field--full">
          <span>{t("email")}</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="next"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
      </div>

      <fieldset className="anniv-rsvp__travel">
        <legend>{t("travelLabel")}</legend>
        <div className="anniv-rsvp__choices">
          {ANNIVERSARY_TRAVEL_OPTIONS.map((option) => {
            const selected = travel === option.value;
            return (
              <label key={option.value} className={selected ? "is-on" : ""}>
                <input
                  type="radio"
                  name="anniv-travel"
                  value={option.value}
                  checked={selected}
                  onChange={() => setTravel(option.value)}
                  required
                />
                {t(`travel.${option.labelKey}`)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {status === "error" ? (
        <p className="anniv-rsvp__error" role="alert">
          {errorMessage(t, errorKey)}
        </p>
      ) : null}

      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
