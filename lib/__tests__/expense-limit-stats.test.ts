import { describe, expect, it } from "vitest";

import {
  calculateExpenseLimitStats,
  type ExpenseLimitStatsInput,
} from "@/lib/expense-limit-stats";

const baseInput: ExpenseLimitStatsInput = {
  amount: 2000,
  startDate: "2026-11-08",
  endDate: "2026-11-12",
  rows: [],
  rates: { USD: 1 },
  today: "2026-11-08",
};

const calculate = (overrides: Partial<ExpenseLimitStatsInput>) =>
  calculateExpenseLimitStats({ ...baseInput, ...overrides });

describe("calculateExpenseLimitStats", () => {
  it("subtracts the window's expenses and splits the rest across the days left", () => {
    expect(
      calculate({
        rows: [{ amount: 1000, currency: "USD" }],
      }),
    ).toEqual({ remaining: 1000, todayAmount: 200 });
  });

  it("keeps an overspent remainder negative and spends nothing today", () => {
    expect(
      calculate({
        amount: 100,
        rows: [{ amount: 150, currency: "USD" }],
      }),
    ).toEqual({ remaining: -50, todayAmount: 0 });
  });

  it("spends nothing today when the range starts in the future", () => {
    expect(
      calculate({
        startDate: "2026-11-10",
        endDate: "2026-11-20",
      }),
    ).toEqual({ remaining: 2000, todayAmount: 0 });
  });

  it("spends nothing today when the range already ended", () => {
    expect(
      calculate({
        startDate: "2026-10-01",
        endDate: "2026-11-01",
      }),
    ).toEqual({ remaining: 2000, todayAmount: 0 });
  });

  it("gives the whole remainder on the last day of the range", () => {
    expect(
      calculate({
        amount: 500,
        startDate: "2026-11-01",
        endDate: "2026-11-08",
      }),
    ).toEqual({ remaining: 500, todayAmount: 500 });
  });

  it("rounds the daily amount to two decimals", () => {
    expect(
      calculate({
        amount: 100,
        endDate: "2026-11-10",
      }),
    ).toEqual({ remaining: 100, todayAmount: 33.33 });
  });

  it("converts mixed currencies before subtracting them", () => {
    expect(
      calculate({
        amount: 100,
        rows: [
          { amount: 10, currency: "USD" },
          { amount: 10, currency: "EUR" },
        ],
        rates: { USD: 1, EUR: 2 },
      }),
    ).toMatchObject({ remaining: 70 });
  });
});
