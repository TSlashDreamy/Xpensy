import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getExpenseLimit } from "@/lib/actions/getExpenseLimit";
import { createClient } from "@/lib/supabase/server";
import type { ExpenseLimits } from "@/lib/types";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

type QueryResult = {
  data: ExpenseLimits | null;
  error: { details: string } | null;
};

let queryResult: QueryResult;

const builder = {
  select: vi.fn(),
  eq: vi.fn(),
  is: vi.fn(),
  maybeSingle: vi.fn(),
};

const from = vi.fn(() => builder);

const createClientMock = vi.mocked(createClient);

const limit: ExpenseLimits = {
  id: "limit-1",
  user_id: "user-1",
  amount: 47000,
  currency: "UAH",
  start_date: "2026-11-08",
  end_date: "2026-11-30",
  collection_id: null,
};

const mockUser = (user: { id: string } | null) => {
  createClientMock.mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({ data: { user } })),
    },
    from,
  } as unknown as Awaited<ReturnType<typeof createClient>>);
};

beforeEach(() => {
  queryResult = { data: limit, error: null };

  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.maybeSingle.mockImplementation(async () => queryResult);

  mockUser({ id: "user-1" });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getExpenseLimit", () => {
  it("returns the personal limit with a null collection filter", async () => {
    await expect(getExpenseLimit()).resolves.toEqual(limit);

    expect(builder.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(builder.is).toHaveBeenCalledWith("collection_id", null);
    expect(builder.maybeSingle).toHaveBeenCalledTimes(1);
  });

  it("filters by collection id when one is provided", async () => {
    const collectionLimit = { ...limit, collection_id: "collection-1" };
    queryResult = { data: collectionLimit, error: null };

    await expect(getExpenseLimit("collection-1")).resolves.toEqual(
      collectionLimit,
    );

    expect(builder.eq).toHaveBeenCalledWith("collection_id", "collection-1");
    expect(builder.is).not.toHaveBeenCalled();
  });

  it("returns null when there is no authenticated user", async () => {
    mockUser(null);

    await expect(getExpenseLimit()).resolves.toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it("returns null when no limit exists", async () => {
    queryResult = { data: null, error: null };

    await expect(getExpenseLimit()).resolves.toBe(null);
  });

  it("returns null when the query errors", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    queryResult = { data: null, error: { details: "multiple rows" } };

    await expect(getExpenseLimit()).resolves.toBe(null);
    expect(errorSpy).toHaveBeenCalledWith("multiple rows");
  });
});
