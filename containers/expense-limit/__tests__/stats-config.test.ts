import { describe, expect, it } from "vitest";

import type { ExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import type { Currency } from "@/lib/currencies";
import { amountFormatter } from "@/shared/utils";

import { buildStats } from "../stats-config";

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

describe("buildStats", () => {
  it("marks only the monetary and percent values as sensitive", () => {
    const [limit] = buildStats(stats, currencies);

    expect(limit.title).toEqual([
      { text: "$ " },
      { text: amountFormatter.format(stats.remaining), sensitive: true },
      { text: " left" },
    ]);

    const configured = limit.details.find(
      (detail) => detail.id === "configured-limit",
    );
    expect(configured?.segments).toEqual([
      { text: "Configured limit: " },
      { text: "€ " },
      { text: amountFormatter.format(stats.configuredLimit), sensitive: true },
    ]);

    const converted = limit.details.find(
      (detail) => detail.id === "converted-limit",
    );
    expect(converted?.segments).toEqual([
      { text: "In selected currency: " },
      { text: "$ " },
      { text: amountFormatter.format(stats.convertedLimit), sensitive: true },
    ]);

    const percent = limit.details.find(
      (detail) => detail.id === "percent-left",
    );
    expect(percent?.segments).toEqual([
      { text: `${stats.percentLeft}%`, sensitive: true },
      { text: " left" },
    ]);

    const [, today] = buildStats(stats, currencies);
    expect(today.title).toEqual([
      { text: "$ " },
      { text: amountFormatter.format(stats.todayAmount), sensitive: true },
      { text: " for today" },
    ]);
  });

  it("labels an overspend below one percent without exposing a number", () => {
    const [limit] = buildStats(
      { ...stats, remaining: -5, percentLeft: -0.4 },
      currencies,
    );
    const percent = limit.details.find(
      (detail) => detail.id === "percent-left",
    );

    expect(percent?.segments).toEqual([{ text: "Over the limit" }]);
  });

  it("masks a visible over-limit percent but keeps the label", () => {
    const [limit] = buildStats(
      { ...stats, remaining: -50, percentLeft: -5 },
      currencies,
    );
    const percent = limit.details.find(
      (detail) => detail.id === "percent-left",
    );

    expect(percent?.segments).toEqual([
      { text: "5%", sensitive: true },
      { text: " over the limit" },
    ]);
  });
});
