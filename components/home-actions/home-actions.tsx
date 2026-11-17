import AddExpense from "@/components/add-expense-component/add-expense-component";
import HideExpensesToggle from "@/components/home-actions/hide-expenses-toggle";
import ExpenseLimitSetter from "@/containers/expense-limit/expense-limit-setter";
import { getExpenseCategories } from "@/lib/actions/getExpenseCategories";
import { getExpenseLimit } from "@/lib/actions/getExpenseLimit";
import { getUserProfile } from "@/lib/actions/getUserProfile";
import { getCurrencies } from "@/lib/currencies";

export default async function HomeActions() {
  const [currencies, profile, limit, expenseCategories] = await Promise.all([
    getCurrencies(),
    getUserProfile(),
    getExpenseLimit(),
    getExpenseCategories(),
  ]);

  return (
    <div className="flex gap-5 sm:gap-3">
      <ExpenseLimitSetter
        currencies={currencies}
        defaultCurrency={profile?.preferred_currency ?? "USD"}
        limit={limit}
      />
      <AddExpense
        currencies={currencies}
        defaultCurrency={profile?.preferred_currency ?? "USD"}
        expenseCategories={expenseCategories}
      />
      <HideExpensesToggle />
    </div>
  );
}
