import type { Product } from "@/types/product";

export function normalizeCatalogQuery(value: string) {
  return value.trim().toLowerCase();
}

// Search ranking model:
// - PRIMARY fields are the ones a user *expects* to match when typing a query:
//   the product's own name, brand, manufacturer, and its place in the
//   category tree. A token must hit a PRIMARY field at least once for the
//   product to be considered a match at all.
// - SECONDARY fields (description, short description, characteristics) only
//   adjust the relevance score upward. They never let a product through on
//   their own, which is what previously caused «наконеч» to match the
//   SKEMA unit because its description mentioned the word.
const PRIMARY_HIT = 10;
const PRIMARY_WORD_BOUNDARY_BONUS = 10;
const SECONDARY_HIT = 1;

type ScoredFields = {
  primary: string[];
  secondary: string[];
};

function getScoredFields(product: Product): ScoredFields {
  return {
    primary: [
      product.title,
      product.brand,
      product.manufacturer,
      product.categoryName,
      product.subcategoryName ?? "",
    ],
    secondary: [
      product.shortDescription,
      product.description,
      ...product.characteristics.flatMap((item) => [item.name, item.value]),
    ],
  };
}

export function getProductSearchFields(product: Product) {
  const { primary, secondary } = getScoredFields(product);
  return [...primary, ...secondary];
}

function scoreToken(token: string, fields: ScoredFields): number {
  let primaryScore = 0;
  for (const field of fields.primary) {
    const lower = field.toLowerCase();
    if (!lower.includes(token)) continue;
    primaryScore += PRIMARY_HIT;
    // Word-boundary hit ranks higher than mid-word substring matches.
    if (lower.startsWith(token) || lower.includes(` ${token}`)) {
      primaryScore += PRIMARY_WORD_BOUNDARY_BONUS;
    }
  }
  if (primaryScore === 0) return 0;
  let bonus = 0;
  for (const field of fields.secondary) {
    if (field.toLowerCase().includes(token)) bonus += SECONDARY_HIT;
  }
  return primaryScore + bonus;
}

/**
 * Relevance score for a product against a free-text query. 0 means "exclude
 * from results"; higher numbers mean "more relevant". Tokens (split on
 * whitespace) are AND-combined: every token must score in the product's
 * primary fields. An empty query returns 1 — neutral non-zero, so callers
 * can sort without re-checking the query.
 */
export function scoreProductForQuery(product: Product, query: string): number {
  const tokens = normalizeCatalogQuery(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;
  const fields = getScoredFields(product);
  let total = 0;
  for (const token of tokens) {
    const tokenScore = scoreToken(token, fields);
    if (tokenScore === 0) return 0;
    total += tokenScore;
  }
  return total;
}

export function matchesProductQuery(product: Product, query: string) {
  return scoreProductForQuery(product, query) > 0;
}
