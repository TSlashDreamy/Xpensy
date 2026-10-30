"use server";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

interface UserExpense {
  amount: number;
  currency: string;
}

type ReturnedData = UserExpense[] | null;

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

// If user_id is undefined gets the data of the current user
export async function getUserExpenseSum(
  convertToCurrency: string,
  user_id?: string,
): Promise<number | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data }: { data: ReturnedData } = await supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .select("amount, currency")
    // collection_id === null -> personal expenses
    .filter("collection_id", "is", "null")
    .eq("user_id", user_id ?? user.id);

  if (!data?.length) return 0;

  const amountsByCurrency = data.reduce<Record<string, number>>(
    (grouped, { amount, currency }) => {
      grouped[currency] = (grouped[currency] ?? 0) + amount;
      return grouped;
    },
    {},
  );

  const sums = await Promise.all(
    Object.entries(amountsByCurrency).map(async ([currency, total]) => {
      const rate =
        currency === convertToCurrency
          ? 1
          : await getExchangeRate(currency, convertToCurrency);
      return total * rate;
    }),
  );

  return Number(sums.reduce((sum, value) => sum + value, 0).toFixed(2));
}
