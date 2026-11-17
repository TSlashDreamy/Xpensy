import { getExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import { getCurrencies } from "@/lib/currencies";

import ExtraStats from "./components/extra-stats";
import { buildStats } from "./stats-config";

export default async function ExpenseLimitStats() {
  const [stats, currencies] = await Promise.all([
    getExpenseLimitStats(),
    getCurrencies(),
  ]);

  if (!stats) return null;

  const statList = buildStats(stats, currencies);

  return (
    <div className="flex gap-4">
      {statList.map((stat, index) => (
        <ExtraStats key={stat.id} {...stat} order={index} />
      ))}
    </div>
  );
}
