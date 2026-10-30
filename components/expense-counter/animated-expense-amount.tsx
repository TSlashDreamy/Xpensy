"use client";

import { cn } from "cn";
import React from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import DigitColumn from "./digit-column";

interface AnimatedExpenseAmountProps {
  expensesAmount: number;
  isPending: boolean;
  className?: string;
}

const rollDigits = (text: string) =>
  text.replace(/\d/g, (digit) => String((Number(digit) + 1) % 10));

export default function AnimatedExpenseAmount({
  expensesAmount,
  isPending,
  className,
}: AnimatedExpenseAmountProps) {
  const [displayedText, setDisplayedText] = React.useState(
    String(expensesAmount),
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!isPending || prefersReducedMotion) {
      setDisplayedText(String(expensesAmount));
      return;
    }

    const id = setInterval(() => {
      setDisplayedText((previous) => rollDigits(previous));
    }, 100);

    return () => clearInterval(id);
  }, [isPending, expensesAmount, prefersReducedMotion]);

  return (
    <span className={cn("relative inline-flex tabular-nums", className)}>
      <span className="sr-only">{String(expensesAmount)}</span>
      <span aria-hidden="true" className="inline-flex">
        {displayedText.split("").map((character, index) => {
          // key from the RIGHT so columns stay stable when digit count changes
          const key = displayedText.length - 1 - index;

          // in case the character is not a digit
          if (!/[0-9]/.test(character)) {
            return (
              <span className="h-[1em] leading-[1em]" key={key}>
                {character}
              </span>
            );
          }

          return (
            <DigitColumn
              key={key}
              digit={Number(character)}
              isPending={isPending}
            />
          );
        })}
      </span>
    </span>
  );
}
