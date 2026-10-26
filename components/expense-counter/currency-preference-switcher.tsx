"use client";

import React from "react";

import { CurrencySwitcher } from "@/components/currency-switcher";
import { updatePreferredCurrency } from "@/lib/actions/updatePreferredCurrency";
import type { Currency } from "@/lib/currencies";

interface CurrencyPreferenceSwitcherProps {
  currencies: Currency[];
  value: string;
}

/**
 * Switches the currency the whole app is displayed in. The choice is
 * persisted as the user profile preference, so every server component reads
 * the very same currency.
 */
export function CurrencyPreferenceSwitcher({
  currencies,
  value,
}: CurrencyPreferenceSwitcherProps) {
  const [optimisticValue, setOptimisticValue] = React.useOptimistic(value);
  const [, startTransition] = React.useTransition();

  const handleValueChange = React.useCallback(
    (currency: string) => {
      startTransition(async () => {
        setOptimisticValue(currency);

        const result = await updatePreferredCurrency(currency);

        if (!result.success) {
          console.error(result.error);
        }
      });
    },
    [setOptimisticValue, startTransition],
  );

  return (
    <CurrencySwitcher
      currencies={currencies}
      value={optimisticValue}
      onValueChange={handleValueChange}
      variant="symbol"
    />
  );
}
