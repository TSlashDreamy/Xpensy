import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getExpenseLimit } from "@/lib/actions/getExpenseLimits";
import { getExpenseLimitStats } from "@/lib/actions/getExpenseLimitStats";
import { getUserProfile } from "@/lib/actions/getUserProfile";
import { getExchangeRates } from "@/lib/currency-conversion";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/actions/getExpenseLimits", () => ({ getExpenseLimit: vi.fn() }));
vi.mock("@/lib/actions/getUserProfile", () => ({ getUserProfile: vi.fn() }));
vi.mock("@/lib/currency-conversion", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/currency-conversion")>();

  return { ...actual, getExchangeRates: vi.fn() };
});

type ExpenseRow = {
  amount: number;
  currency: string;
  expense_date: string;
};

type QueryResult = {
  data: ExpenseRow[] | null;
  error: { details: string } | null;
};

let queryResult: QueryResult;

const builder = {
  select: vi.fn(),
  filter: vi.fn(),
  eq: vi.fn(),
  gte: vi.fn(),
  lte: vi.fn(),
};

const createClientMock = vi.mocked(createClient);
const getExpenseLimitMock = vi.mocked(getExpenseLimit);
const getExchangeRatesMock = vi.mocked(getExchangeRates);
const getUserProfileMock = vi.mocked(getUserProfile);

const limit = {
  id: "limit-1",
  user_id: "user-1",
  amount: 2000,
  currency: "USD",
  start_date: "2026-11-08",
  end_date: "2026-11-12",
  collection_id: null,
};

const mockUser = (user: { id: string } | null) => {
  createClientMock.mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({ data: { user } })),
    },
    from: vi.fn(() => builder),
  } as unknown as Awaited<ReturnType<typeof createClient>>);
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 8, 12));

  queryResult = { data: [], error: null };

  builder.select.mockReturnValue(builder);
  builder.filter.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.gte.mockReturnValue(builder);
  builder.lte.mockImplementation(async () => queryResult);

  getExpenseLimitMock.mockResolvedValue(limit);
  getExchangeRatesMock.mockResolvedValue({ USD: 1 });
  getUserProfileMock.mockResolvedValue({
    display_name: "Tester",
    avatar_url: null,
    preferred_currency: "USD",
  });
  mockUser({ id: "user-1" });
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("getExpenseLimitStats", () => {
  it("returns the remaining and daily amounts for the limit window", async () => {
    queryResult = {
      data: [{ amount: 1000, currency: "USD", expense_date: "2026-11-09" }],
      error: null,
    };

    await expect(getExpenseLimitStats()).resolves.toEqual({
      remaining: 1000,
      todayAmount: 200,
      currency: "USD",
    });

    expect(builder.filter).toHaveBeenCalledWith("collection_id", "is", null);
    expect(builder.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(builder.gte).toHaveBeenCalledWith("expense_date", "2026-11-08");
    expect(builder.lte).toHaveBeenCalledWith("expense_date", "2026-11-12");
    expect(getExchangeRatesMock).toHaveBeenCalledWith(["USD"], "USD");
    expect(getUserProfileMock).toHaveBeenCalledWith("user-1");
  });

  it("converts mixed-currency window rows into the selected currency", async () => {
    getExpenseLimitMock.mockResolvedValue({ ...limit, amount: 100 });
    getExchangeRatesMock.mockResolvedValue({ USD: 1, EUR: 2 });
    queryResult = {
      data: [
        { amount: 10, currency: "USD", expense_date: "2026-11-08" },
        { amount: 10, currency: "EUR", expense_date: "2026-11-08" },
      ],
      error: null,
    };

    await expect(getExpenseLimitStats()).resolves.toEqual({
      remaining: 70,
      todayAmount: 14,
      currency: "USD",
    });
    expect(getExchangeRatesMock).toHaveBeenCalledWith(["USD", "EUR"], "USD");
  });

  it("converts the limit amount and window rows into the selected currency", async () => {
    getUserProfileMock.mockResolvedValue({
      display_name: "Tester",
      avatar_url: null,
      preferred_currency: "EUR",
    });
    getExpenseLimitMock.mockResolvedValue({ ...limit, amount: 100 });
    getExchangeRatesMock.mockResolvedValue({ USD: 0.9, EUR: 1 });
    queryResult = {
      data: [
        { amount: 10, currency: "USD", expense_date: "2026-11-08" },
        { amount: 10, currency: "EUR", expense_date: "2026-11-08" },
      ],
      error: null,
    };

    await expect(getExpenseLimitStats()).resolves.toEqual({
      remaining: 71,
      todayAmount: 14.2,
      currency: "EUR",
    });
    expect(getExchangeRatesMock).toHaveBeenCalledWith(["USD", "EUR"], "EUR");
  });

  it("falls back to USD when the profile is missing", async () => {
    getUserProfileMock.mockResolvedValue(null);
    getExpenseLimitMock.mockResolvedValue({
      ...limit,
      amount: 100,
      currency: "EUR",
    });
    getExchangeRatesMock.mockResolvedValue({ EUR: 1.1 });

    await expect(getExpenseLimitStats()).resolves.toEqual({
      remaining: 110,
      todayAmount: 22,
      currency: "USD",
    });
    expect(getExchangeRatesMock).toHaveBeenCalledWith(["EUR"], "USD");
  });

  it("returns null without querying when there is no limit", async () => {
    getExpenseLimitMock.mockResolvedValue(null);

    await expect(getExpenseLimitStats()).resolves.toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns null when there is no authenticated user", async () => {
    mockUser(null);

    await expect(getExpenseLimitStats()).resolves.toBeNull();
  });

  it("returns null and logs the details when the expenses query fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    queryResult = { data: null, error: { details: "boom" } };

    await expect(getExpenseLimitStats()).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("boom");
  });

  it("returns the whole amount across the window when there are no rows", async () => {
    await expect(getExpenseLimitStats()).resolves.toEqual({
      remaining: 2000,
      todayAmount: 400,
      currency: "USD",
    });
  });
});
