"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: Replace mocked list with an external API
export const mockedCurrencyList = {
  USD: { symbol: "$", flag: "🇺🇸" },
  UAH: { symbol: "₴", flag: "🇺🇦" },
  EUR: { symbol: "€", flag: "🇪🇺" },
  RUB: { symbol: "₽", flag: "🇷🇺" },
};

export type CurrencyCode = keyof typeof mockedCurrencyList;

interface CurrencySwitcherProps {
  variant?: "symbol" | "code" | "flag";
  name?: string;
  defaultValue?: string;
  onCurrencyChange?: (currency: CurrencyCode) => void;
}

const isCurrencyCode = (value: string | undefined): value is CurrencyCode =>
  value !== undefined && value in mockedCurrencyList;

export function CurrencySwitcher({
  variant = "symbol",
  name,
  defaultValue,
  onCurrencyChange,
}: CurrencySwitcherProps) {
  const [currency, setCurrency] = React.useState<CurrencyCode>(() =>
    isCurrencyCode(defaultValue) ? defaultValue : "USD",
  );

  const presentation = React.useMemo(() => {
    switch (variant) {
      case "code":
        return (
          <span
            aria-label={`Selected currency: ${currency}`}
            className="text-[0.70rem] text-muted-foreground uppercase"
          >
            {currency}
          </span>
        );
      case "symbol":
        return (
          <span
            aria-label={`Selected currency: ${currency}`}
            className="text-2xl"
          >
            {mockedCurrencyList[currency].symbol}
          </span>
        );
      case "flag":
        return mockedCurrencyList[currency].flag;
      default:
        throw new Error(`${variant} is not a supported currency variant`);
    }
  }, [variant, currency]);

  const setNewCurrency = (selectedCurrency: string) => {
    if (isCurrencyCode(selectedCurrency)) {
      setCurrency(selectedCurrency);

      if (onCurrencyChange) onCurrencyChange(selectedCurrency);
    }
  };

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={currency}
        defaultValue={defaultValue}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xl">
            {presentation}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-content" align="start">
          <DropdownMenuRadioGroup
            value={currency}
            onValueChange={setNewCurrency}
          >
            {Object.entries(mockedCurrencyList).map(
              ([currencyCode, currencyDetails]) => (
                <DropdownMenuRadioItem
                  className="flex gap-2"
                  key={currencyCode}
                  value={currencyCode}
                >
                  <span>{`${currencyDetails.flag} ${currencyCode}`}</span>
                </DropdownMenuRadioItem>
              ),
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
