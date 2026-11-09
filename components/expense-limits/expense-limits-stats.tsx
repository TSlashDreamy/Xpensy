import { Badge } from "@/components/ui/badge";
import { getExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import { getCurrencies } from "@/lib/currencies";

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

  return (
    <div className="flex gap-4">
      <Badge
        className="animate-in fade-in slide-in-from-bottom-1 duration-300"
        variant="secondary"
      >
        <span
          key={stats.remaining}
          className="animate-in fade-in zoom-in-95 inline-block duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none"
        >
          {`${symbol} ${amountFormatter.format(stats.remaining)} left`}
        </span>
      </Badge>
      <Badge
        className="animate-in fade-in slide-in-from-bottom-1 duration-600"
        variant="secondary"
      >
        <span
          key={stats.remaining}
          className="animate-in fade-in zoom-in-95 inline-block duration-1200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none"
        >
          {symbol} {amountFormatter.format(stats.todayAmount)} for today
        </span>
      </Badge>
    </div>
  );
}
