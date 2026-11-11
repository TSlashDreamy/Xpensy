import { cacheLife } from "next/cache";
import { z } from "zod";

export interface Currency {
  code: string;
  name: string;
  symbol: string | null;
  isoNumeric: number | null;
}

const FrankfurterCurrencySchema = z.object({
  iso_code: z.string().min(3),
  name: z.string(),
  symbol: z.string().nullable(),
  iso_numeric: z.coerce.number().nullable().optional(),
  type: z.string(),
});

// Validated per item so a single unexpected entry cannot discard the whole list.
const FrankfurterCurrenciesSchema = z.array(z.unknown());

const CURRENCY_TYPE = "currency";

const FALLBACK_CURRENCIES: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", isoNumeric: 0 },
];

const FRANKFURTER_CURRENCIES_URL = "https://api.frankfurter.dev/v2/currencies";

const CURRENCIES_REQUEST_TIMEOUT_MS = 5000;

const toCurrency = (input: unknown): Currency | null => {
  const parsed = FrankfurterCurrencySchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  const { iso_code, name, symbol, iso_numeric, type } = parsed.data;

  // The API tags crypto and metal entries with their own `type`; only fiat
  // currencies are supported by the app.
  if (type !== CURRENCY_TYPE) {
    return null;
  }

  // Downstream validators expect ISO 4217 codes.
  if (iso_code.length !== 3) {
    return null;
  }

  return {
    code: iso_code,
    name,
    symbol,
    isoNumeric: iso_numeric ?? null,
  };
};

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
      .map(toCurrency)
      .filter((currency): currency is Currency => currency !== null)
      .sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error(error);

    return FALLBACK_CURRENCIES;
  }
}
