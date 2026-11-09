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
        rows: [{ amount: 1000, currency: "USD", expense_date: "2026-11-09" }],
      }),
    ).toEqual({ remaining: 1000, todayAmount: 200 });
  });

  it("keeps an overspent remainder negative and spends nothing today", () => {
    expect(
      calculate({
        amount: 100,
        rows: [{ amount: 150, currency: "USD", expense_date: "2026-11-09" }],
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
          { amount: 10, currency: "USD", expense_date: "2026-11-09" },
          { amount: 10, currency: "EUR", expense_date: "2026-11-09" },
        ],
        rates: { USD: 1, EUR: 2 },
      }),
    ).toMatchObject({ remaining: 70 });
  });

  it("subtracts expenses already recorded today from today's allowance", () => {
    expect(
      calculate({
        rows: [{ amount: 100, currency: "USD", expense_date: "2026-11-08" }],
      }),
    ).toEqual({ remaining: 1900, todayAmount: 300 });
  });

  it("sums every expense recorded today in its own currency", () => {
    expect(
      calculate({
        rows: [
          { amount: 60, currency: "USD", expense_date: "2026-11-08" },
          { amount: 20, currency: "EUR", expense_date: "2026-11-08" },
        ],
        rates: { USD: 1, EUR: 2 },
      }),
    ).toEqual({ remaining: 1900, todayAmount: 300 });
  });

  it("combines earlier spending in the share with today's spending in full", () => {
    expect(
      calculate({
        startDate: "2026-11-06",
        endDate: "2026-11-12",
        rows: [
          { amount: 1000, currency: "USD", expense_date: "2026-11-07" },
          { amount: 100, currency: "USD", expense_date: "2026-11-08" },
        ],
      }),
    ).toEqual({ remaining: 900, todayAmount: 100 });
  });

  it("spends nothing more today once today's expenses exceed today's share", () => {
    expect(
      calculate({
        rows: [{ amount: 1500, currency: "USD", expense_date: "2026-11-08" }],
      }),
    ).toEqual({ remaining: 500, todayAmount: 0 });
  });
});
