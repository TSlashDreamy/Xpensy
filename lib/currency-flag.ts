import type { Currency } from "@/lib/currencies";

const isCountryCode = (code: string) =>
  code.length === 3 && !code.startsWith("X") && code !== "CMD";

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
}: Pick<Currency, "code" | "symbol">) {
  return isCountryCode(code) ? codeToFlag(code) : (symbol ?? code);
}
