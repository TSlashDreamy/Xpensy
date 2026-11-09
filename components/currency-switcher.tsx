"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import type { Currency } from "@/lib/currencies";
import { getCurrencyFlag } from "@/lib/currency-flag";
import { matchesCurrencyQuery } from "@/lib/currency-search";

export type CurrencyCode = Currency["code"];

interface CurrencySwitcherProps {
  className?: string;
  currencies: Currency[];
  value: CurrencyCode;
  onValueChange?: (currency: CurrencyCode) => void;
  variant?: "symbol" | "code" | "flag";
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
  variant = "symbol",
  name,
}: CurrencySwitcherProps) {
  const currentCurrency = React.useMemo(
    () => currencies.find(({ code }) => code === value) ?? null,
    [currencies, value],
  );

  const presentation = React.useMemo(() => {
    switch (variant) {
      case "code":
        return (
          <span
            aria-label={`Selected currency: ${value}`}
            className="text-[0.70rem] text-muted-foreground uppercase"
          >
            {value}
          </span>
        );
      case "symbol":
        return (
          <span aria-label={`Selected currency: ${value}`} className="text-2xl">
            {currentCurrency?.symbol ?? value}
          </span>
        );
      case "flag":
        return currentCurrency ? getCurrencyFlag(currentCurrency) : value;
      default:
        throw new Error(`${variant} is not a supported currency variant`);
    }
  }, [variant, value, currentCurrency]);

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
        <ComboboxTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xl"
              aria-label="Select currency"
              className={className}
            />
          }
          showChevron={false}
        >
          {presentation}
        </ComboboxTrigger>
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
