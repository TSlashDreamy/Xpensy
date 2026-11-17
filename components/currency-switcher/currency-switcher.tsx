"use client";

import React from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Currency } from "@/lib/currencies";
import { getCurrencyFlag } from "@/lib/currency-flag";
import { matchesCurrencyQuery } from "@/lib/currency-search";

import CurrencyButton from "./currency-button";

import type { CurrencyButtonProps } from "./currency-button";

export type CurrencyCode = Currency["code"];

interface CurrencySwitcherProps extends Omit<
  CurrencyButtonProps,
  "currentCurrency"
> {
  currencies: Currency[];
  onValueChange?: (currency: CurrencyCode) => void;
  name?: string;
}

/**
 * A fully controlled currency combobox with search. The selected currency is
 * owned by the parent, which keeps it in sync with the rest of the app.
 */
export default function CurrencySwitcher({
  className,
  currencies,
  value,
  onValueChange,
  name,
  variant,
}: CurrencySwitcherProps) {
  const currentCurrency = React.useMemo(
    () => currencies.find(({ code }) => code === value) ?? null,
    [currencies, value],
  );

  const handleValueChange = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        return;
      }

      onValueChange?.(currency.code);
    },
    [onValueChange],
  );

  return (
    <>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <Combobox
        items={currencies}
        value={currentCurrency}
        onValueChange={handleValueChange}
        itemToStringLabel={(currency: Currency) => currency.code}
        itemToStringValue={(currency: Currency) => currency.code}
        filter={matchesCurrencyQuery}
      >
        <CurrencyButton
          className={className}
          currentCurrency={currentCurrency}
          value={value}
          variant={variant}
        />
        <ComboboxContent className="w-64 min-w-64">
          <ComboboxInput
            className="h-auto! py-1 text-sm sm:text-xs sm:py-0"
            showTrigger={false}
            showClear={false}
            placeholder="Search currency"
            aria-label="Search currency"
          />
          <ComboboxEmpty>No currency found.</ComboboxEmpty>
          <ComboboxList>
            {(currency: Currency) => (
              <ComboboxItem
                className="py-2 text-sm sm:text-xs sm:py-1"
                key={currency.code}
                value={currency}
              >
                <span>{getCurrencyFlag(currency)}</span>
                <span>{currency.code}</span>
                <span className="text-muted-foreground">{currency.name}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  );
}
