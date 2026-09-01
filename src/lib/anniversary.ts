import type { Locale } from "@/i18n/routing";

/** Celebración interna 5 años — token opaco, no indexable. */
export const ANNIVERSARY_TOKEN = "c4e91b7a2d8f06e53a1c7b9d4e0f28a6";

/** Miércoles 9 de septiembre 2026, 18:30 hora Chile (verano, UTC−3). */
export const ANNIVERSARY_START_ISO = "2026-09-09T18:30:00-03:00";
export const ANNIVERSARY_END_ISO = "2026-09-09T23:00:00-03:00";

export const ANNIVERSARY_VENUE = "Bar Savia";
export const ANNIVERSARY_ADDRESS = "Alonso de Córdova 3080, Vitacura";
export const ANNIVERSARY_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Alonso%20de%20C%C3%B3rdova%203080%2C%20Vitacura";

export function isAnniversaryToken(token: string): boolean {
  return token === ANNIVERSARY_TOKEN;
}

export function getAnniversaryPath(locale: Locale = "es"): string {
  return `/${locale}/aniversario/${ANNIVERSARY_TOKEN}`;
}

export function getAnniversaryCalendarUrl(): string {
  const text = encodeURIComponent("Xinergy 5 años");
  const details = encodeURIComponent(
    "Celebración de aniversario del equipo Xinergy. Vestimenta: casual oficina.",
  );
  const location = encodeURIComponent(`${ANNIVERSARY_VENUE}, ${ANNIVERSARY_ADDRESS}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=20260909T213000Z/20260910T020000Z&details=${details}&location=${location}`;
}

export function getAnniversaryIcsHref(): string {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Xinergy//Anniversary 5//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:xinergy-5-anos-2026@xinergy.lat",
    "DTSTAMP:20260901T120000Z",
    "DTSTART;TZID=America/Santiago:20260909T183000",
    "DTEND;TZID=America/Santiago:20260909T230000",
    "SUMMARY:Xinergy 5 años",
    `LOCATION:${ANNIVERSARY_VENUE}\\, ${ANNIVERSARY_ADDRESS}`,
    "DESCRIPTION:Celebración de aniversario del equipo Xinergy. Vestimenta: casual oficina.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
