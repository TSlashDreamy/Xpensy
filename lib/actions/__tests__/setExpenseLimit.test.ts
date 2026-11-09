import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setExpenseLimitAction } from "@/lib/actions/setExpenseLimit";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

type TableQueryBuilder = {
  insert: (values: unknown) => Promise<{ error: null }>;
  update: (values: unknown) => {
    eq: (column: string, value: string) => Promise<{ error: null }>;
  };
};

// The real PostgrestQueryBuilder methods read their state from `this`.
// Calling a destructured method would leave `this` undefined and reproduce
// the `cloneRequestState` TypeError.
const insert = vi.fn(function (this: TableQueryBuilder | undefined) {
  if (!this) {
    throw new TypeError(
      "Cannot read properties of undefined (reading 'cloneRequestState')",
    );
  }

  return Promise.resolve({ error: null });
});

const update = vi.fn(function (this: TableQueryBuilder | undefined) {
  if (!this) {
    throw new TypeError(
      "Cannot read properties of undefined (reading 'cloneRequestState')",
    );
  }

  return { eq: vi.fn(async () => ({ error: null })) };
});

const table: TableQueryBuilder = { insert, update };

const createClientMock = vi.mocked(createClient);

const buildFormData = () => {
  const formData = new FormData();

  formData.set("limitAmount", "47000");
  formData.set("limitCurrency", "UAH");
  formData.set("limitStartDate", "2026-11-08");
  formData.set("limitEndDate", "2026-11-30");

  return formData;
};

const expectedLimit = {
  user_id: "user-1",
  amount: 47000,
  currency: "UAH",
  start_date: "2026-11-08",
  end_date: "2026-11-30",
  collection_id: null,
};

beforeEach(() => {
  createClientMock.mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })),
    },
    from: vi.fn(() => table),
  } as unknown as Awaited<ReturnType<typeof createClient>>);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("setExpenseLimitAction", () => {
  it("inserts a new limit through the table query builder", async () => {
    const result = await setExpenseLimitAction({}, buildFormData());

    expect(result).toMatchObject({ success: true, message: null });
    expect(insert).toHaveBeenCalledWith(expectedLimit);
  });

  it("updates an existing limit through the table query builder", async () => {
    const result = await setExpenseLimitAction({}, buildFormData(), "limit-1");

    expect(result).toMatchObject({ success: true, message: null });
    expect(update).toHaveBeenCalledWith(expectedLimit);
  });
});
