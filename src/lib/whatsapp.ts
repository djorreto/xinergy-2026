/** Diego Jorreto — WhatsApp business contact */
const WHATSAPP_PHONE = "56987419290";

/** Prefilled greeting so chats from the site are easy to spot */
const WHATSAPP_GREETING = "Hola, vengo desde xinergy.lat";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
