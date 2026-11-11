import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { endOfMonth, format } from "date-fns";
import { afterEach, describe, expect, it, vi } from "vitest";

import SetLimitForm from "@/components/forms/set-limit-form";
import { clearExpenseLimit } from "@/lib/actions/clearExpenseLimit";
import { setExpenseLimitAction } from "@/lib/actions/setExpenseLimit";
import type { Currency } from "@/lib/currencies";

vi.mock("@/lib/actions/setExpenseLimit", () => ({
  setExpenseLimitAction: vi.fn(async () => ({
    message: null,
    error: {},
    values: {},
  })),
}));
vi.mock("@/lib/actions/clearExpenseLimit", () => ({
  clearExpenseLimit: vi.fn(async () => true),
}));

afterEach(cleanup);

const currencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", isoNumeric: null },
  { code: "EUR", name: "Euro", symbol: "€", isoNumeric: null },
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

  it("should pre-fill the fields from the saved limit", () => {
    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        initialValues={{
          amount: 47000,
          currency: "EUR",
          startDate: "2027-01-01",
          endDate: "2027-12-31",
        }}
        onSuccess={() => {}}
      />,
    );

    expect(getInput("limitAmount")).toHaveValue(47000);
    expect(getInput("limitCurrency")).toHaveValue("EUR");
    expect(getInput("limitStartDate")).toHaveValue("2027-01-01");
    expect(getInput("limitEndDate")).toHaveValue("2027-12-31");
  });

  it("should keep a failed submit's values over the pre-filled ones", async () => {
    vi.mocked(setExpenseLimitAction).mockResolvedValueOnce({
      error: {},
      message: "We couldn't write your info to database. Try again later.",
      values: {
        limitAmount: 5000,
        limitCurrency: "USD",
        limitStartDate: "2028-02-01",
        limitEndDate: "2028-02-28",
      },
      success: false,
    });

    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        initialValues={{
          amount: 47000,
          currency: "EUR",
          startDate: "2027-01-01",
          endDate: "2027-12-31",
        }}
        onSuccess={() => {}}
      />,
    );

    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(getInput("limitAmount")).toHaveValue(5000);
      expect(getInput("limitCurrency")).toHaveValue("USD");
      expect(getInput("limitStartDate")).toHaveValue("2028-02-01");
      expect(getInput("limitEndDate")).toHaveValue("2028-02-28");
    });
  });

  it("should offer the remove button only when a limit is saved", () => {
    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        onSuccess={() => {}}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Remove limit" }),
    ).not.toBeInTheDocument();

    cleanup();

    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        initialValues={{
          amount: 47000,
          currency: "EUR",
          startDate: "2027-01-01",
          endDate: "2027-12-31",
        }}
        onSuccess={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Remove limit" }),
    ).toBeInTheDocument();
  });

  it("should clear the saved limit and close on success", async () => {
    const onSuccess = vi.fn();
    vi.mocked(clearExpenseLimit).mockResolvedValueOnce(true);

    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        initialValues={{
          amount: 47000,
          currency: "EUR",
          startDate: "2027-01-01",
          endDate: "2027-12-31",
        }}
        onSuccess={onSuccess}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove limit" }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(clearExpenseLimit).toHaveBeenCalled();
  });

  it("should surface an error when clearing fails", async () => {
    const onSuccess = vi.fn();
    vi.mocked(clearExpenseLimit).mockResolvedValueOnce(false);

    render(
      <SetLimitForm
        currencies={currencies}
        defaultCurrency="USD"
        initialValues={{
          amount: 47000,
          currency: "EUR",
          startDate: "2027-01-01",
          endDate: "2027-12-31",
        }}
        onSuccess={onSuccess}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove limit" }));

    await waitFor(() =>
      expect(
        screen.getByText(/couldn't remove your limit/i),
      ).toBeInTheDocument(),
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
