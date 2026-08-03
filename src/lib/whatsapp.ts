/** Diego Jorreto — WhatsApp business contact */
const WHATSAPP_PHONE = "56987419290";

/** Prefilled greeting for WhatsApp CTA */
const WHATSAPP_GREETING =
  "Hola, me interesa conocer más sobre cómo generar eficiencias en mi compañía.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
