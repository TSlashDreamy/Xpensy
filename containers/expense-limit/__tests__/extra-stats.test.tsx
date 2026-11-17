import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PrivacyProvider } from "@/components/privacy/privacy-provider";
import type { ExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import type { Currency } from "@/lib/currencies";
import { amountFormatter } from "@/shared/utils";

import ExtraStats from "../components/extra-stats";
import { buildStats } from "../stats-config";

afterEach(cleanup);

const stats: ExpenseLimitStats = {
  remaining: 1234.56,
  todayAmount: 42,
  currency: "USD",
  configuredLimit: 2000,
  configuredLimitCurrency: "EUR",
  convertedLimit: 1850,
  startDate: "2026-11-08",
  endDate: "2026-11-12",
  daysLeft: 1,
  percentLeft: 62,
};

const currencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€", isoNumeric: 978 },
  {
    code: "USD",
    name: "United States Dollar",
    symbol: "$",
    isoNumeric: 840,
  },
];

const [limitStat] = buildStats(stats, currencies);

describe("ExtraStats", () => {
  it("masks the amount but keeps the label when amounts are hidden", () => {
    render(
      <PrivacyProvider initialHidden>
        <ExtraStats {...limitStat} order={0} />
      </PrivacyProvider>,
    );

    expect(
      screen.queryByText(amountFormatter.format(stats.remaining)),
    ).not.toBeInTheDocument();
    expect(screen.getByText("#####")).toBeInTheDocument();
    expect(screen.getByText("left")).toBeInTheDocument();
  });
});
