import { revalidatePath } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearExpenseLimit } from "@/lib/actions/clearExpenseLimit";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

type DeleteResult = {
  error: { details: string } | null;
};

let deleteResult: DeleteResult;

const deleteBuilder = {
  eq: vi.fn(() => deleteBuilder),
  is: vi.fn(async () => deleteResult),
};
const deleteRows = vi.fn(() => deleteBuilder);
const table = { delete: deleteRows };

const createClientMock = vi.mocked(createClient);

const mockUser = (user: { id: string } | null) => {
  createClientMock.mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({ data: { user } })),
    },
    from: vi.fn(() => table),
  } as unknown as Awaited<ReturnType<typeof createClient>>);
};

beforeEach(() => {
  deleteResult = { error: null };
  mockUser({ id: "user-1" });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("clearExpenseLimit", () => {
  it("deletes the personal limit and revalidates the homepage", async () => {
    await expect(clearExpenseLimit()).resolves.toBe(true);

    expect(deleteRows).toHaveBeenCalled();
    expect(deleteBuilder.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(deleteBuilder.is).toHaveBeenCalledWith("collection_id", null);
    expect(revalidatePath).toHaveBeenCalledWith("/homepage");
  });

  it("returns false when there is no authenticated user", async () => {
    mockUser(null);

    await expect(clearExpenseLimit()).resolves.toBe(false);

    expect(deleteRows).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns false when the delete fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    deleteResult = { error: { details: "delete failed" } };

    await expect(clearExpenseLimit()).resolves.toBe(false);

    expect(errorSpy).toHaveBeenCalledWith("delete failed");
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
