import { getUserExpenses } from "@/lib/actions/getUserExpenses";

import { CurrencySwitcher } from "../currency-switcher";

export default async function ExpenseCounter() {
  const expensesData = await getUserExpenses();

  // TODO: This is not enough. We should convert currency and only then sum everything
  const expenses =
    expensesData?.reduce(
      (expensesSum, currentExpense) => expensesSum + currentExpense.amount,
      0,
    ) ?? 0;

  return (
    <div className="flex items-center gap-1">
      <CurrencySwitcher />
      <span className="text-counter">{expenses}</span>
    </div>
  );
}
