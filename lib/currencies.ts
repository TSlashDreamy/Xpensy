import { cacheLife } from "next/cache";
import { z } from "zod";

export interface Currency {
  code: string;
  name: string;
  symbol: string | null;
}

const FrankfurterCurrencySchema = z.object({
  iso_code: z.string().length(3),
  name: z.string(),
  symbol: z.string().nullable(),
});

const FrankfurterCurrenciesSchema = z.array(FrankfurterCurrencySchema);

const FALLBACK_CURRENCIES: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "USD", name: "United States Dollar", symbol: "$" },
];

const FRANKFURTER_CURRENCIES_URL = "https://api.frankfurter.dev/v2/currencies";

const CURRENCIES_REQUEST_TIMEOUT_MS = 5000;

/**
 * Used to get the list of supported currencies (Frankfurter API).
 *
 * The list of currencies barely ever changes, so it is cached on the server
 * instead of being fetched on every request.
 */
export async function getCurrencies(): Promise<Currency[]> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(FRANKFURTER_CURRENCIES_URL, {
      signal: AbortSignal.timeout(CURRENCIES_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch currencies: ${response.status}`);
    }

    const parsed = FrankfurterCurrenciesSchema.parse(await response.json());

    return parsed
      .map(({ iso_code, name, symbol }) => ({ code: iso_code, name, symbol }))
      .sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error(error);

    return FALLBACK_CURRENCIES;
  }
}
