"use client";

import { useState } from "react";

type Props = {
  token: string;
  name: string;
  email: string;
  inviteTitle: string;
};

export function InviteConfirmClient({ token, name, email, inviteTitle }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/registro/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "generic");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("network_error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-xinergy-orange/40 bg-gradient-to-br from-[#2a2433] via-[#363040] to-[#3f374b] p-6 text-white sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
          Confirmado
        </p>
        <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
          Gracias, {name.split(" ")[0]}
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/75">
          Registramos tu confirmación para <strong className="text-white">{inviteTitle}</strong>{" "}
          con el correo <strong className="text-white">{email}</strong>.
          Te enviaremos los detalles dentro de las próximas 24 horas.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.35)] sm:p-8">
      <div
        aria-hidden
        className="mb-5 h-1 w-full bg-gradient-to-r from-xinergy-orange via-[#ffc14d] to-xinergy-orange"
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-xinergy-orange">
        Confirmación personal
      </p>
      <h2 className="mt-2 font-display text-[1.35rem] leading-tight text-xinergy-charcoal sm:text-xl">
        Hola, {name.split(" ")[0]}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-xinergy-slate">
        Confirmas como <strong className="text-xinergy-charcoal">{email}</strong>.
        Al continuar, aceptas que tus datos se usen para gestionar esta invitación.
      </p>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error === "expired_token"
            ? "Este enlace de confirmación expiró. Escríbenos para reenviar uno nuevo."
            : error === "network_error"
              ? "Error de conexión. Intenta de nuevo."
              : "No pudimos confirmar. Intenta de nuevo o escríbenos."}
        </p>
      )}

      <button
        type="button"
        onClick={confirm}
        disabled={status === "loading"}
        className="btn-primary invite-submit mt-6 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Confirmando…" : "Confirmar asistencia"}
      </button>
    </div>
  );
}
