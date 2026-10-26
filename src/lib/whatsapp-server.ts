const WHATSAPP_PHONE = "56987419290";

const DEFAULT_GREETING =
  "Hola, vengo desde xinergy.lat. Me gustaría conocer más sobre cómo generar eficiencias en mi compañía.";

export function whatsappUrl(text?: string): string {
  const message = (text?.trim() || DEFAULT_GREETING).slice(0, 400);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
