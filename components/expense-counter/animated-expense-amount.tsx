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

const NON_DIGIT_RE = /[^0-9]/;

const rollDigitsArray = (digits: string[]): string[] =>
  digits.map((character) => {
    if (NON_DIGIT_RE.test(character)) {
      return character;
    }
    return String((Number(character) + 1) % 10);
  });

export default function AnimatedExpenseAmount({
  expensesAmount,
  isPending,
  className,
}: AnimatedExpenseAmountProps) {
  const [displayedDigits, setDisplayedDigits] = React.useState<string[]>(() =>
    String(expensesAmount).split(""),
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!isPending || prefersReducedMotion) {
      setDisplayedDigits(String(expensesAmount).split(""));
      return;
    }

    const id = setInterval(() => {
      setDisplayedDigits((previous) => rollDigitsArray(previous));
    }, 100);

    return () => clearInterval(id);
  }, [isPending, expensesAmount, prefersReducedMotion]);

  return (
    <span className={cn("relative inline-flex tabular-nums", className)}>
      <span className="sr-only">{String(expensesAmount)}</span>
      <span aria-hidden="true" className="inline-flex">
        {displayedDigits.map((character, index, { length }) => {
          const key = length - 1 - index;
          const decimalIndex = displayedDigits.indexOf(".");
          const integerEnd =
            decimalIndex === -1 ? displayedDigits.length : decimalIndex;

          if (NON_DIGIT_RE.test(character)) {
            return (
              <span className="h-[1em] leading-[1em]" key={key}>
                {character}
              </span>
            );
          }

          return (
            <DigitColumn
              // Every 3rd digit should have a padding
              className={
                index < integerEnd - 1 && (integerEnd - 1 - index) % 3 === 0
                  ? "pr-2"
                  : null
              }
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
