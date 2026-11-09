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
      <Badge variant="secondary">
        {symbol} {amountFormatter.format(stats.remaining)} left
      </Badge>
      <Badge variant="secondary">
        {symbol} {amountFormatter.format(stats.todayAmount)} for today
      </Badge>
    </div>
  );
}
