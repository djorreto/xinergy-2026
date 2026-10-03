import { isDisposableEmailDomain } from "@/lib/insights/disposable-domains";

const PERSON_NAME = /^[\p{L}\s'.-]+$/u;

const FREEMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "outlook.es",
  "hotmail.com",
  "hotmail.es",
  "live.com",
  "live.cl",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "yahoo.com",
  "yahoo.es",
  "yahoo.com.br",
  "yahoo.com.mx",
  "yahoo.com.ar",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "gmx.com",
  "gmx.es",
  "icloud.com",
]);

export function isPersonName(value: string): boolean {
  const name = value.trim();
  return name.length >= 2 && name.length <= 80 && PERSON_NAME.test(name);
}

export function isValidEmail(value: string): boolean {
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function isFreemailDomain(domain: string): boolean {
  return FREEMAIL_DOMAINS.has(domain.trim().toLowerCase());
}

export function isBlockedEmail(email: string): boolean {
  return isDisposableEmailDomain(emailDomain(email));
}

export function domainMatches(emailDomainValue: string, listedDomain: string): boolean {
  const emailDomainName = emailDomainValue.trim().toLowerCase();
  const listed = listedDomain.trim().toLowerCase();
  return emailDomainName === listed || emailDomainName.endsWith(`.${listed}`);
}

export function clip(value: string | undefined, max: number): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}
