/** Campos Monday del evento / consentimiento */

export const EVENT_CONTENT_INTEREST_FIELD = "single_selectrhkegso";
export const EVENT_ATTENDANCE_FIELD = "single_select3jhimgp";
export const ALMUERZO_CONSENT_FIELD = "booleanj2klu8v4";
export const EVENTO_CONSENT_FIELD = "booleankfuxguo4";

export const EVENT_CONTENT_OPTIONS = [
  { value: "0", labelKey: "business" as const },
  { value: "1", labelKey: "workshops" as const },
  { value: "2", labelKey: "both" as const },
] as const;

export const EVENT_ATTENDANCE_OPTIONS = [
  { value: "0", labelKey: "inPerson" as const },
  { value: "1", labelKey: "virtual" as const },
] as const;

export type EventContentInterestValue = (typeof EVENT_CONTENT_OPTIONS)[number]["value"];
export type EventAttendanceValue = (typeof EVENT_ATTENDANCE_OPTIONS)[number]["value"];

export function isEventContentInterest(
  value: string,
): value is EventContentInterestValue {
  return EVENT_CONTENT_OPTIONS.some((option) => option.value === value);
}

export function isEventAttendance(value: string): value is EventAttendanceValue {
  return EVENT_ATTENDANCE_OPTIONS.some((option) => option.value === value);
}
