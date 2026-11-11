import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setExpenseLimitAction } from "@/lib/actions/setExpenseLimit";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

type LookupResult = {
  data: { id: string } | null;
  error: { details: string } | null;
};

type WriteResult = {
  error: { code: string; details: string } | null;
};

let lookupResult: LookupResult;

const lookupBuilder = {
  select: vi.fn(() => lookupBuilder),
  eq: vi.fn(() => lookupBuilder),
  is: vi.fn(() => lookupBuilder),
  maybeSingle: vi.fn(async () => lookupResult),
};
const insert = vi.fn(async (): Promise<WriteResult> => ({ error: null }));
const updateEq = vi.fn(async (): Promise<WriteResult> => ({ error: null }));
const update = vi.fn(() => ({ eq: updateEq }));
const table = { select: vi.fn(() => lookupBuilder), insert, update };

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
  it("inserts when no existing limit exists", async () => {
    lookupResult = { data: null, error: null };

    const result = await setExpenseLimitAction({}, buildFormData());

    expect(result).toMatchObject({ success: true, message: null });
    expect(insert).toHaveBeenCalledWith(expectedLimit);
    expect(update).not.toHaveBeenCalled();
    expect(lookupBuilder.is).toHaveBeenCalledWith("collection_id", null);
  });

  it("updates the existing limit by id", async () => {
    lookupResult = { data: { id: "limit-1" }, error: null };

    const result = await setExpenseLimitAction({}, buildFormData());

    expect(result).toMatchObject({ success: true, message: null });
    expect(update).toHaveBeenCalledWith(expectedLimit);
    expect(updateEq).toHaveBeenCalledWith("id", "limit-1");
    expect(insert).not.toHaveBeenCalled();
  });

  it("returns an error when there is no authenticated user", async () => {
    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: null } })),
      },
      from: vi.fn(() => table),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await setExpenseLimitAction({}, buildFormData());

    expect(result).toMatchObject({
      success: false,
      message: "We couldn't find a user",
    });
    expect(table.select).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it("returns an error when the existing-limit lookup fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    lookupResult = { data: null, error: { details: "lookup failed" } };

    const result = await setExpenseLimitAction({}, buildFormData());

    expect(result).toMatchObject({
      success: false,
      message: "We couldn't write your info to database. Try again later.",
    });
    expect(insert).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("lookup failed");
  });

  it("returns an error when the insert fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    lookupResult = { data: null, error: null };
    insert.mockResolvedValueOnce({
      error: { code: "23505", details: "duplicate key" },
    });

    const result = await setExpenseLimitAction({}, buildFormData());

    expect(result).toMatchObject({
      success: false,
      message: "We couldn't write your info to database. Try again later.",
    });
    expect(errorSpy).toHaveBeenCalledWith("duplicate key");
  });
});
