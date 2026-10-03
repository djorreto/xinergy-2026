function readDomainEnv(): string {
  return (
    process.env.ALLOWED_EMAIL_DOMAINS?.trim() ||
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS?.trim() ||
    "xinergy.cl,duxpartners.com,opticks.cl"
  );
}

export const ALLOWED_EMAIL_DOMAINS = readDomainEnv()
  .split(",")
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const parts = normalized.split("@");
  if (parts.length !== 2 || !parts[0]) return false;
  return ALLOWED_EMAIL_DOMAINS.includes(parts[1]);
}

export function domainErrorMessage(): string {
  const domains = ALLOWED_EMAIL_DOMAINS.map((domain) => `@${domain}`).join(" o ");
  return `Solo se permiten correos ${domains}`;
}
