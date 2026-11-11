export interface CurrencyAmount {
  amount: number;
  currency: string;
}

export function roundCurrencyAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function sumInCurrency(
  rows: CurrencyAmount[],
  rates: Record<string, number>,
): number {
  const total = rows.reduce(
    (sum, { amount, currency }) => sum + amount * (rates[currency] ?? 1),
    0,
  );
  return roundCurrencyAmount(total);
}

async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<number> {
  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}`,
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data: Array<{ rate: number }> = await response.json();
    const rate = data[0]?.rate;
    if (typeof rate !== "number") throw new Error("Rate missing in response");
    return rate;
  } catch (error) {
    console.error(
      `Failed to fetch exchange rate ${fromCurrency} -> ${toCurrency}`,
      error,
    );
    return 1;
  }
}

export async function getExchangeRates(
  currencies: string[],
  targetCurrency: string,
): Promise<Record<string, number>> {
  const uniqueCurrencies = [...new Set(currencies)];
  const rates: Record<string, number> = {};

  await Promise.all(
    uniqueCurrencies.map(async (currency) => {
      rates[currency] =
        currency === targetCurrency
          ? 1
          : await getExchangeRate(currency, targetCurrency);
    }),
  );

  return rates;
}
