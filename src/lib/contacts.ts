/**
 * Single source of truth for all contact details on the public site.
 * Update once — propagates to Header, Footer, Contacts page, etc.
 */

export const PRIMARY_PHONE = {
  label: "+7 982 198-15-21",
  href: "tel:+79821981521",
  digits: "79821981521",
} as const;

export const SECONDARY_PHONE = {
  label: "+7 918 084-44-62",
  href: "tel:+79180844462",
  digits: "79180844462",
} as const;

export const EMAIL = {
  label: "Rada-Med-X@yandex.ru",
  href: "mailto:Rada-Med-X@yandex.ru",
} as const;

// Messengers are bound to a dedicated number, independent of the phones above.
const MESSENGER_DIGITS = "79821981521";
export const TELEGRAM_URL = `https://t.me/+${MESSENGER_DIGITS}`;
export const WHATSAPP_URL = `https://wa.me/${MESSENGER_DIGITS}`;
export const MAX_URL = `https://max.ru/+${MESSENGER_DIGITS}`;

export const WORK_HOURS = {
  hours: "10:00–19:00",
  weekend: "Сб–Вс — выходные",
} as const;
