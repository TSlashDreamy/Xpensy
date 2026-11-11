import { afterEach, describe, expect, it, vi } from "vitest";

import { getCurrencies } from "@/lib/currencies";

vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const FRANKFURTER_RESPONSE = [
  {
    iso_code: "EUR",
    iso_numeric: "978",
    name: "Euro",
    symbol: "€",
    type: "currency",
  },
  {
    iso_code: "USD",
    iso_numeric: "840",
    name: "United States Dollar",
    symbol: "$",
    type: "currency",
  },
  {
    iso_code: "AAVE",
    iso_numeric: null,
    name: "Aave",
    symbol: "AAVE",
    type: "crypto",
  },
  {
    iso_code: "BTC",
    iso_numeric: null,
    name: "Bitcoin",
    symbol: "₿",
    type: "crypto",
  },
  {
    iso_code: "USDC",
    iso_numeric: null,
    name: "USD Coin",
    symbol: "USDC",
    type: "crypto",
  },
  {
    iso_code: "XAU",
    iso_numeric: "959",
    name: "Gold (Troy Ounce)",
    symbol: "oz t",
    type: "metal",
  },
];

const mockFetch = (body: unknown) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getCurrencies", () => {
  it("keeps fiat currencies when the API returns crypto with 4-letter codes", async () => {
    mockFetch(FRANKFURTER_RESPONSE);

    const currencies = await getCurrencies();

    expect(currencies.map(({ code }) => code)).toEqual(["EUR", "USD"]);
  });

  it("drops crypto and metal entries instead of falling back to USD", async () => {
    mockFetch(FRANKFURTER_RESPONSE);

    const currencies = await getCurrencies();

    expect(currencies.some(({ name }) => name === "United States Dollar")).toBe(
      true,
    );
    expect(currencies).toHaveLength(2);
  });

  it("skips a malformed entry without discarding the rest", async () => {
    mockFetch([
      {
        iso_code: "EUR",
        iso_numeric: "978",
        name: "Euro",
        symbol: "€",
        type: "currency",
      },
      { iso_code: "BAD", name: null, symbol: null },
    ]);

    const currencies = await getCurrencies();

    expect(currencies).toEqual([
      { code: "EUR", name: "Euro", symbol: "€", isoNumeric: 978 },
    ]);
  });
});
