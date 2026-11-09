"use client";

import { RiPieChartLine as LimitIcon } from "@remixicon/react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Currency } from "@/lib/currencies";

import SetLimitForm from "../forms/set-limit-form";

interface ExpenseLimitsProps {
  currencies: Currency[];
  defaultCurrency?: string;
}

export default function ExpenseLimits({
  currencies,
  defaultCurrency,
}: ExpenseLimitsProps) {
  const [isOpened, setIsOpened] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSuccess = React.useCallback(() => setIsOpened(false), []);

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <PopoverTrigger asChild>
        <Button className="rounded-full size-14 sm:size-10" variant="outline">
          <LimitIcon className="size-5 sm:size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader className={isMobile ? "text-center" : ""}>
          <PopoverTitle>Expense limits</PopoverTitle>
          <PopoverDescription>
            Set the desired period and amount
          </PopoverDescription>
        </PopoverHeader>
        <SetLimitForm
          currencies={currencies}
          defaultCurrency={defaultCurrency}
          onSuccess={handleSuccess}
        />
      </PopoverContent>
    </Popover>
  );
}
