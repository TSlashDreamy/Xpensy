import { differenceInCalendarDays, parseISO } from "date-fns";

import {
  roundCurrencyAmount,
  sumInCurrency,
  type CurrencyAmount,
} from "@/lib/currency-conversion";

export interface ExpenseLimitStatsInput {
  amount: number;
  startDate: string;
  endDate: string;
  rows: CurrencyAmount[];
  rates: Record<string, number>;
  today: string;
}

export function calculateExpenseLimitStats({
  amount,
  startDate,
  endDate,
  rows,
  rates,
  today,
}: ExpenseLimitStatsInput): { remaining: number; todayAmount: number } {
  const spent = sumInCurrency(rows, rates);
  const remaining = roundCurrencyAmount(amount - spent);

  const inRange = startDate <= today && today <= endDate;
  const daysLeft = inRange
    ? differenceInCalendarDays(parseISO(endDate), parseISO(today)) + 1
    : 0;
  const todayAmount =
    daysLeft > 0 ? roundCurrencyAmount(Math.max(remaining, 0) / daysLeft) : 0;

  return { remaining, todayAmount };
}
