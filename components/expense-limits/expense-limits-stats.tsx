import { differenceInCalendarDays, format, parseISO } from "date-fns";

import {
  RiPieChartLine as LimitIcon,
  RiExchangeLine as ConvertIcon,
  RiPercentLine as PercentageIcon,
  RiCalendar2Line as DateRangeIcon,
  RiCalendarScheduleLine as DateLeftIcon,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import { getCurrencies } from "@/lib/currencies";
import { percentLeftLabel } from "@/lib/expense-limit-stats";

const amountFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default async function ExpenseLimitsStats() {
  const [stats, currencies] = await Promise.all([
    getExpenseLimitStats(),
    getCurrencies(),
  ]);

  if (!stats) return null;

  const symbols = new Map(
    currencies.map(({ code, symbol }) => [code, symbol ?? code]),
  );
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

  return (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger>
          <Badge
            className="animate-in fade-in slide-in-from-bottom-1 duration-300"
            variant={stats.remaining <= 0 ? "destructive" : "button"}
          >
            <span
              key={stats.remaining}
              className="animate-in fade-in zoom-in-95 inline-block duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none"
            >
              {`${symbol} ${amountFormatter.format(stats.remaining)} ${stats.remaining <= 0 ? "over limit" : "left"}`}
            </span>
          </Badge>
        </PopoverTrigger>
        <PopoverContent>
          <ul className="flex flex-col gap-1">
            <li className="flex gap-1 items-center">
              <LimitIcon size="16" />
              {`Configured limit: ${initialCurrencySymbol} ${amountFormatter.format(stats.configuredLimit)}`}
            </li>
            {stats.currency !== stats.configuredLimitCurrency && (
              <li className="flex gap-1 items-center">
                <ConvertIcon size="16" />
                {`In selected currency: ${symbol} ${amountFormatter.format(stats.convertedLimit)}`}
              </li>
            )}
            <li className="flex gap-1 items-center">
              <PercentageIcon size="16" />
              {percentLeftLabel(stats)}
            </li>
          </ul>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Badge
            className="animate-in fade-in slide-in-from-bottom-1 duration-600"
            variant="button"
          >
            <span
              key={stats.remaining}
              className="animate-in fade-in zoom-in-95 inline-block duration-1200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none"
            >
              {symbol} {amountFormatter.format(stats.todayAmount)} for today
            </span>
          </Badge>
        </PopoverTrigger>
        <PopoverContent>
          <ul className="flex flex-col gap-1">
            <li className="flex gap-1 items-center">
              <DateRangeIcon size="16" />
              {`Period: ${format(parseISO(stats.startDate), "MMM d, yyyy")} – ${format(parseISO(stats.endDate), "MMM d, yyyy")}`}
            </li>
            <li className="flex gap-1 items-center">
              <DateLeftIcon size="16" />
              {daysLeftLabel}
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
