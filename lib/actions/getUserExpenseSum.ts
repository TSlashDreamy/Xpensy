"use server";

import {
  getExchangeRates,
  sumInCurrency,
  type CurrencyAmount,
} from "@/lib/currency-conversion";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

type ReturnedData = CurrencyAmount[] | null;

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

  const currencies = [...new Set(data.map(({ currency }) => currency))];
  const rates = await getExchangeRates(currencies, convertToCurrency);

  return sumInCurrency(data, rates);
}
