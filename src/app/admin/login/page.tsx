"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { domainErrorMessage, isAllowedEmail } from "@/lib/auth/domain";

const fieldClass =
  "mt-2 w-full border border-xinergy-charcoal/15 bg-white px-4 py-3 text-base text-xinergy-charcoal outline-none focus:border-xinergy-orange";

function errorText(code: string | null): string | null {
  if (code === "not_invited") return "Ese correo no está habilitado en Insights.";
  if (code === "domain") return domainErrorMessage();
  if (code === "rate_limited") return "Pediste demasiados códigos. Espera un rato.";
  if (code === "email_failed") return "No se pudo enviar el correo. Inténtalo de nuevo.";
  if (code === "invalid_code") return "Código incorrecto o vencido.";
  return null;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(errorText(searchParams.get("error")));

  async function requestCode() {
    setError(null);
    setMessage(null);
    const normalized = email.trim().toLowerCase();
    if (!isAllowedEmail(normalized)) {
      setError(domainErrorMessage());
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(errorText(data.error ?? "email_failed"));
        return;
      }
      setCodeSent(true);
      setMessage(`Te enviamos un código a ${normalized}.`);
    } catch {
      setError("No se pudo enviar el código.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/admin/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(errorText(data.error ?? "invalid_code"));
        return;
      }
      window.location.href = searchParams.get("from") || "/admin/insights";
    } catch {
      setError("Código incorrecto o vencido.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <p className="label-editorial">Xinergy</p>
      <h1 className="mt-3 font-display text-3xl">Insights</h1>
      <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">
        Acceso propio de este administrador. El código llega al correo que esté habilitado aquí, no al de Reporte Comercial.
      </p>
      <form onSubmit={verify} className="mt-8 space-y-4">
        {error ? <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
        {message ? <p className="border border-xinergy-orange/30 bg-xinergy-cream px-3 py-2 text-sm">{message}</p> : null}
        <label className="block text-sm">
          Correo
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} autoComplete="email" />
        </label>
        <label className="block text-sm">
          Código
          <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\s/g, ""))} className={fieldClass} inputMode="numeric" autoComplete="one-time-code" />
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={() => void requestCode()} className="border border-xinergy-charcoal/20 px-4 py-2.5 text-sm font-semibold">
            {codeSent ? "Reenviar código" : "Enviar código"}
          </button>
          <button type="submit" disabled={busy || otp.trim().length < 6} className="bg-xinergy-orange px-4 py-2.5 text-sm font-semibold text-xinergy-charcoal disabled:opacity-50">
            Entrar
          </button>
        </div>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
