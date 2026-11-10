import { differenceInCalendarDays, parseISO } from "date-fns";

import {
  roundCurrencyAmount,
  sumInCurrency,
  type CurrencyAmount,
} from "@/lib/currency-conversion";

export interface ExpenseLimitStatsRow extends CurrencyAmount {
  expense_date: string;
}

export interface ExpenseLimitStatsInput {
  amount: number;
  startDate: string;
  endDate: string;
  rows: ExpenseLimitStatsRow[];
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
}: ExpenseLimitStatsInput): {
  remaining: number;
  todayAmount: number;
  daysLeft: number;
  percentLeft: number;
} {
  const spent = sumInCurrency(rows, rates);
  const remaining = roundCurrencyAmount(amount - spent);
  const percentLeft = amount > 0 ? Math.round((remaining / amount) * 100) : 0;

  const inRange = startDate <= today && today <= endDate;
  const daysLeft = inRange
    ? differenceInCalendarDays(parseISO(endDate), parseISO(today)) + 1
    : 0;

  const spentToday = sumInCurrency(
    rows.filter(({ expense_date }) => expense_date === today),
    rates,
  );
  const remainingBeforeToday = roundCurrencyAmount(remaining + spentToday);
  const todayAmount =
    daysLeft > 0
      ? roundCurrencyAmount(
          Math.max(remainingBeforeToday / daysLeft - spentToday, 0),
        )
      : 0;

  return { remaining, todayAmount, daysLeft, percentLeft };
}

export function percentLeftLabel(stats: {
  remaining: number;
  percentLeft: number;
}): string {
  if (stats.remaining >= 0) {
    return `${stats.percentLeft}% left`;
  }
  const over = Math.abs(stats.percentLeft);
  return over < 1 ? "Over the limit" : `${over}% over the limit`;
}
