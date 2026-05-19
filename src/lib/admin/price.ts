/**
 * Format a numeric price (rubles) into the display label the public site reads
 * from `products.price_label`. Empty/null → "По запросу".
 */
export function formatPriceLabel(price: number | null | undefined): string {
  if (price == null || !Number.isFinite(price)) return "По запросу";
  const rounded = Math.round(price);
  const grouped = rounded.toLocaleString("ru-RU").replace(/ /g, " ");
  return `${grouped} ₽`;
}

/**
 * Parse free-form price input (string or number) to a number-or-null.
 * Accepts "250 000", "250,000", "250000.5", " ", "" → null.
 */
export function parsePriceInput(value: string | number | null | undefined): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = value.replace(/[\s ]/g, "").replace(",", ".");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}
