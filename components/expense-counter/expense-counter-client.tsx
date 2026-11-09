"use client";

import React from "react";

import { updatePreferredCurrency } from "@/lib/actions/updatePreferredCurrency";
import type { Currency } from "@/lib/currencies";

import CurrencySwitcher from "../currency-switcher";
import AnimatedExpenseAmount from "./animated-expense-amount";

interface ExpenseCounterClientProps {
  currencies: Currency[];
  selectedCurrency: string;
  expensesAmount: number;
}

export default function ExpenseCounterClient({
  currencies,
  selectedCurrency,
  expensesAmount,
}: ExpenseCounterClientProps) {
  const [optimisticCurrency, setOptimisticCurrency] =
    React.useOptimistic(selectedCurrency);
  const [isCalculatingNewValue, startTransition] = React.useTransition();

  const handleValueChange = React.useCallback(
    (currency: string) => {
      startTransition(async () => {
        setOptimisticCurrency(currency);

        const result = await updatePreferredCurrency(currency);

        if (!result.success) {
          console.error(result.error);
        }
      });
    },
    [setOptimisticCurrency, startTransition],
  );

  return (
    <div className="flex items-center gap-1">
      <CurrencySwitcher
        currencies={currencies}
        value={optimisticCurrency}
        onValueChange={handleValueChange}
        variant="symbol"
      />
      <AnimatedExpenseAmount
        className="text-counter"
        expensesAmount={expensesAmount}
        isPending={isCalculatingNewValue}
      />
    </div>
  );
}
