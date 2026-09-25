/** Utilidades de los widgets flotantes (WhatsApp y solicitud de llamada). */

export const CALLBACK_SLOTS = [
  { value: "09:00-11:00", label: "09:00 - 11:00" },
  { value: "11:00-13:00", label: "11:00 - 13:00" },
  { value: "16:00-18:00", label: "16:00 - 18:00" },
] as const;

/** Mismo formato que valida request_callback en la base de datos. */
export const SPANISH_PHONE = /^(\+34|0034|34)?[6789]\d{8}$/;

export function cleanPhone(value: string): string {
  return value.replace(/[\s\-.()]/g, "");
}

export function whatsappMessage(serviceTitle?: string | null): string {
  return serviceTitle
    ? `Hola, estoy interesado en información sobre ${serviceTitle}.`
    : "Hola, estoy interesado en vuestros servicios de instalaciones eléctricas.";
}

/** wa.me exige el número en formato internacional solo con dígitos (sin +, espacios ni 00). */
export function whatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9) digits = `34${digits}`; // número español sin prefijo
  return digits.length >= 10 ? digits : null;
}

export function whatsappUrl(number: string, serviceTitle?: string | null): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(serviceTitle))}`;
}
