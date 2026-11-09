import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getExchangeRates,
  roundCurrencyAmount,
  sumInCurrency,
} from "@/lib/currency-conversion";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("roundCurrencyAmount", () => {
  it("rounds to two decimal places", () => {
    expect(roundCurrencyAmount(1.005)).toBe(1.01);
  });
});

describe("sumInCurrency", () => {
  it("converts each row with its rate and sums the result", () => {
    expect(
      sumInCurrency(
        [
          { amount: 10, currency: "USD" },
          { amount: 5, currency: "EUR" },
        ],
        { USD: 1, EUR: 2 },
      ),
    ).toBe(20);
  });

  it("falls back to a rate of one when the currency is missing", () => {
    expect(sumInCurrency([{ amount: 10, currency: "GBP" }], {})).toBe(10);
  });
});

describe("getExchangeRates", () => {
  it("does not fetch when only the target currency is requested", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getExchangeRates(["USD"], "USD")).resolves.toEqual({
      USD: 1,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches each non-target currency once", async () => {
    const fetchMock = vi.fn<
      (_input: string) => Promise<{
        ok: boolean;
        json: () => Promise<Array<{ rate: number }>>;
      }>
    >(async () => ({
      ok: true,
      json: async () => [{ rate: 0.5 }],
    }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getExchangeRates(["USD", "EUR"], "USD")).resolves.toEqual({
      EUR: 0.5,
      USD: 1,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("base=EUR");
    expect(fetchMock.mock.calls[0][0]).toContain("quotes=USD");
  });

  it("falls back to one and logs when the lookup fails", async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 500 }));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    vi.stubGlobal("fetch", fetchMock);

    await expect(getExchangeRates(["USD", "EUR"], "USD")).resolves.toEqual({
      EUR: 1,
      USD: 1,
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
