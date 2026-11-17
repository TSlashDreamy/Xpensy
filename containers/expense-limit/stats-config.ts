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

export interface StatSegment {
  text: string;
  sensitive?: boolean;
}

export interface StatDetail {
  id: string;
  icon: RemixiconComponentType;
  segments: StatSegment[];
}

export interface ExpenseStat {
  id: string;
  title: StatSegment[];
  variant: VariantProps<typeof badgeVariants>["variant"];
  details: StatDetail[];
}

const getSymbols = (currencies: Currency[]) =>
  new Map(currencies.map(({ code, symbol }) => [code, symbol ?? code]));

const text = (value: string): StatSegment => ({ text: value });
const amount = (value: string): StatSegment => ({
  text: value,
  sensitive: true,
});

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

  // Split the label so only the percentage is masked; the words stay readable.
  const percentLabel = percentLeftLabel(stats);
  const percentEnd = percentLabel.indexOf("%");
  const percentSegments =
    percentEnd === -1
      ? [text(percentLabel)]
      : [
          amount(percentLabel.slice(0, percentEnd + 1)),
          text(percentLabel.slice(percentEnd + 1)),
        ];

  const limitDetails: StatDetail[] = [
    {
      id: "configured-limit",
      icon: LimitIcon,
      segments: [
        text("Configured limit: "),
        text(`${initialCurrencySymbol} `),
        amount(amountFormatter.format(stats.configuredLimit)),
      ],
    },
    ...(stats.currency !== stats.configuredLimitCurrency
      ? [
          {
            id: "converted-limit",
            icon: ConvertIcon,
            segments: [
              text("In selected currency: "),
              text(`${symbol} `),
              amount(amountFormatter.format(stats.convertedLimit)),
            ],
          },
        ]
      : []),
    {
      id: "percent-left",
      icon: PercentageIcon,
      segments: percentSegments,
    },
  ];

  return [
    {
      id: "limit",
      title: [
        text(`${symbol} `),
        amount(amountFormatter.format(stats.remaining)),
        text(` ${stats.remaining <= 0 ? "over limit" : "left"}`),
      ],
      variant: stats.remaining <= 0 ? "destructive" : "button",
      details: limitDetails,
    },
    {
      id: "today",
      title: [
        text(`${symbol} `),
        amount(amountFormatter.format(stats.todayAmount)),
        text(" for today"),
      ],
      variant: "button",
      details: [
        {
          id: "period",
          icon: DateRangeIcon,
          segments: [
            text(
              `Period: ${format(parseISO(stats.startDate), "MMM d, yyyy")} – ${format(parseISO(stats.endDate), "MMM d, yyyy")}`,
            ),
          ],
        },
        {
          id: "days-left",
          icon: DateLeftIcon,
          segments: [text(daysLeftLabel)],
        },
      ],
    },
  ];
}
