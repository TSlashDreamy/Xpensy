import type { Currency } from "@/lib/currencies";

export const matchesCurrencyQuery = (currency: Currency, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const code = currency.code.toLowerCase();
  const name = currency.name.toLowerCase();
  const symbol = currency.symbol?.toLowerCase() ?? "";

  return (
    code.includes(normalizedQuery) ||
    name.includes(normalizedQuery) ||
    symbol.includes(normalizedQuery)
  );
};
