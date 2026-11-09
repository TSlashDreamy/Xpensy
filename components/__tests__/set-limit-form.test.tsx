import { cleanup, render, screen } from "@testing-library/react";
import { endOfMonth, format } from "date-fns";
import { afterEach, describe, expect, it, vi } from "vitest";

import SetLimitForm from "@/components/forms/set-limit-form";
import type { Currency } from "@/lib/currencies";

vi.mock("@/lib/actions/setExpenseLimit", () => ({
  setExpenseLimitAction: vi.fn(async () => ({
    message: null,
    error: {},
    values: {},
  })),
}));

afterEach(cleanup);

const currencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", isoNumeric: null },
];

const today = format(new Date(), "yyyy-MM-dd");
const endOfMonthDate = format(endOfMonth(new Date()), "yyyy-MM-dd");

const getInput = (name: string) =>
  document.querySelector<HTMLInputElement>(`input[name='${name}']`);

describe("SetLimitForm", () => {
  it("should collect the limit period through one date range field", () => {
    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        onSuccess={() => {}}
      />,
    );

    expect(screen.getByLabelText("Limit period")).toBeInTheDocument();
    expect(screen.queryByLabelText("Start date")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("End date")).not.toBeInTheDocument();
    expect(getInput("limitStartDate")).toHaveValue(today);
    expect(getInput("limitEndDate")).toHaveValue(endOfMonthDate);
  });
});
