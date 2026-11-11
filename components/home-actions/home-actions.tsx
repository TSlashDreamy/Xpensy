import { RiEyeOffLine as HideIcon } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { getExpenseLimit } from "@/lib/actions/getExpenseLimit";
import { getUserProfile } from "@/lib/actions/getUserProfile";
import { getCurrencies } from "@/lib/currencies";

import AddExpense from "../add-expense-component/add-expense-component";
import ExpenseLimits from "../expense-limits/expense-limits";

export default async function HomeActions() {
  const [currencies, profile, limit] = await Promise.all([
    getCurrencies(),
    getUserProfile(),
    getExpenseLimit(),
  ]);

  return (
    <div className="flex gap-5 sm:gap-3">
      <ExpenseLimits
        currencies={currencies}
        defaultCurrency={profile?.preferred_currency ?? "USD"}
        limit={limit}
      />
      <AddExpense
        currencies={currencies}
        defaultCurrency={profile?.preferred_currency ?? "USD"}
      />
      <Button className="rounded-full size-14 sm:size-10" variant="outline">
        <HideIcon className="size-5 sm:size-4" />
      </Button>
    </div>
  );
}
