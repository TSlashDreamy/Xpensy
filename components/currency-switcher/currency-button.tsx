"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { ComboboxTrigger } from "@/components/ui/combobox";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { Currency } from "@/lib/currencies";
import { getCurrencyFlag } from "@/lib/currency-flag";

import type { CurrencyCode } from "./currency-switcher";

export interface CurrencyButtonProps {
  className?: string;
  currentCurrency: Currency | null;
  variant?: "symbol" | "code" | "flag";
  value: CurrencyCode;
}

export default function CurrencyButton({
  className,
  currentCurrency,
  variant = "symbol",
  value,
}: CurrencyButtonProps) {
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent className="text-secondary">
        {currentCurrency?.name}
      </TooltipContent>
    </Tooltip>
  );
}
