import {
  RiPieChartLine as LimitIcon,
  RiExchangeLine as ConvertIcon,
  RiPercentLine as PercentageIcon,
  RiCalendar2Line as DateRangeIcon,
  RiCalendarScheduleLine as DateLeftIcon,
  type RemixiconComponentType,
} from "@remixicon/react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";

import { badgeVariants } from "@/components/ui/badge";
import type { ExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import type { Currency } from "@/lib/currencies";
import { percentLeftLabel } from "@/lib/expense-limit-stats";
import { amountFormatter } from "@/shared/utils";

import type { VariantProps } from "class-variance-authority";

export interface StatDetail {
  icon: RemixiconComponentType;
  label: string;
}

export interface ExpenseStat {
  id: string;
  title: string;
  variant: VariantProps<typeof badgeVariants>["variant"];
  details: StatDetail[];
}

const getSymbols = (currencies: Currency[]) =>
  new Map(currencies.map(({ code, symbol }) => [code, symbol ?? code]));

export function buildStats(
  stats: ExpenseLimitStats,
  currencies: Currency[],
): ExpenseStat[] {
  const symbols = getSymbols(currencies);
  const symbol = symbols.get(stats.currency) ?? stats.currency;
  const initialCurrencySymbol =
    symbols.get(stats.configuredLimitCurrency) ?? stats.configuredLimitCurrency;

  const today = format(new Date(), "yyyy-MM-dd");
  const daysUntilStart = differenceInCalendarDays(
    parseISO(stats.startDate),
    parseISO(today),
  );
  const daysLeftLabel =
    daysUntilStart > 0
      ? `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"}`
      : `${stats.daysLeft} day${stats.daysLeft === 1 ? "" : "s"} left`;

  const limitDetails: StatDetail[] = [
    {
      icon: LimitIcon,
      label: `Configured limit: ${initialCurrencySymbol} ${amountFormatter.format(stats.configuredLimit)}`,
    },
    ...(stats.currency !== stats.configuredLimitCurrency
      ? [
          {
            icon: ConvertIcon,
            label: `In selected currency: ${symbol} ${amountFormatter.format(stats.convertedLimit)}`,
          },
        ]
      : []),
    { icon: PercentageIcon, label: percentLeftLabel(stats) },
  ];

  return [
    {
      id: "limit",
      title: `${symbol} ${amountFormatter.format(stats.remaining)} ${stats.remaining <= 0 ? "over limit" : "left"}`,
      variant: stats.remaining <= 0 ? "destructive" : "button",
      details: limitDetails,
    },
    {
      id: "today",
      title: `${symbol} ${amountFormatter.format(stats.todayAmount)} for today`,
      variant: "button",
      details: [
        {
          icon: DateRangeIcon,
          label: `Period: ${format(parseISO(stats.startDate), "MMM d, yyyy")} – ${format(parseISO(stats.endDate), "MMM d, yyyy")}`,
        },
        { icon: DateLeftIcon, label: daysLeftLabel },
      ],
    },
  ];
}
