"use server";

import { format } from "date-fns";

import { getExpenseLimit } from "@/lib/actions/getExpenseLimits";
import { getUserProfile } from "@/lib/actions/getUserProfile";
import { getExchangeRates, sumInCurrency } from "@/lib/currency-conversion";
import { calculateExpenseLimitStats } from "@/lib/expense-limit-stats";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

export interface ExpenseLimitStats {
  remaining: number;
  todayAmount: number;
  currency: string;
}

export async function getExpenseLimitStats(
  collection_id?: string,
): Promise<ExpenseLimitStats | null> {
  const limit = await getExpenseLimit(collection_id);
  if (!limit) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .select("amount, currency, expense_date")
    // collection_id === null -> personal expenses
    .filter("collection_id", "is", null)
    .eq("user_id", user.id)
    .gte("expense_date", limit.start_date)
    .lte("expense_date", limit.end_date);

  if (error) {
    console.error(error.details);
    return null;
  }

  const rows = data ?? [];
  const profile = await getUserProfile(user.id);
  const selectedCurrency = profile?.preferred_currency ?? "USD";
  const currencies = [
    ...new Set([limit.currency, ...rows.map(({ currency }) => currency)]),
  ];
  const rates = await getExchangeRates(currencies, selectedCurrency);
  const amount = sumInCurrency(
    [{ amount: limit.amount, currency: limit.currency }],
    rates,
  );

  const { remaining, todayAmount } = calculateExpenseLimitStats({
    amount,
    startDate: limit.start_date,
    endDate: limit.end_date,
    rows,
    rates,
    today: format(new Date(), "yyyy-MM-dd"),
  });

  return { remaining, todayAmount, currency: selectedCurrency };
}
