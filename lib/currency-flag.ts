import type { Currency } from "@/lib/currencies";

// We can't show county flag emoji or symbol for those codes
const NO_SYMBOLIC_CURRENCIES = new Set([
  "XAF",
  "XCD",
  "XCG",
  "XOF",
  "XPF",
  "ANG",
  "CMD",
  // Not a country, but a valid ISO 4217 code with a numeric identifier.
  "XDR",
]);

const isCountryCode = (code: string, isoNumeric?: number | null) => {
  if (NO_SYMBOLIC_CURRENCIES.has(code)) {
    return false;
  }

  if (isoNumeric !== null && isoNumeric !== undefined) {
    return true;
  }

  if (code.length !== 3) {
    return false;
  }

  return true;
};

/**
 * Converts a 2-letter ISO country code (e.g. "US") into a flag emoji.
 * Unicode Regional Indicator Symbols start at U+1F1E6 (🇦); each letter
 * A–Z is offset from that base code point to form a paired flag symbol.
 */
const codeToFlag = (code: string) =>
  String.fromCodePoint(
    ...code
      .slice(0, 2)
      .toUpperCase()
      .split("")
      .map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );

/**
 * Returns the flag of a currency, falling back to its symbol for the codes
 * that have no country behind them.
 */
export function getCurrencyFlag({
  code,
  symbol,
  isoNumeric,
}: Pick<Currency, "code" | "symbol"> & { isoNumeric?: number | null }) {
  return isCountryCode(code, isoNumeric) ? codeToFlag(code) : symbol;
}
