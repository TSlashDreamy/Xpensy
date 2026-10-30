import { getUserExpenseSum } from "@/lib/actions/getUserExpenseSum";
import { getUserProfile } from "@/lib/actions/getUserProfile";
import { getCurrencies } from "@/lib/currencies";

import ExpenseCounterClient from "./expense-counter-client";

export default async function ExpenseCounter() {
  const [profile, currencies] = await Promise.all([
    getUserProfile(),
    getCurrencies(),
  ]);

  const currency = profile?.preferred_currency ?? "USD";
  const expenses = (await getUserExpenseSum(currency)) ?? 0;

  return (
    <ExpenseCounterClient
      currencies={currencies}
      expensesAmount={expenses}
      selectedCurrency={currency}
    />
  );
}
