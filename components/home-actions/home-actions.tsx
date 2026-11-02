import {
  RiPieChartLine as LimitIcon,
  RiEyeOffLine as HideIcon,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/actions/getUserProfile";
import { getCurrencies } from "@/lib/currencies";

import AddExpense from "../add-expense-component/add-expense-component";

export default async function HomeActions() {
  const [currencies, profile] = await Promise.all([
    getCurrencies(),
    getUserProfile(),
  ]);

  return (
    <div className="flex gap-3">
      <Button className="rounded-full size-10" variant="outline">
        <LimitIcon className="size-4" />
      </Button>
      <AddExpense
        currencies={currencies}
        defaultCurrency={profile?.preferred_currency ?? "USD"}
      />
      <Button className="rounded-full size-10" variant="outline">
        <HideIcon className="size-4" />
      </Button>
    </div>
  );
}
