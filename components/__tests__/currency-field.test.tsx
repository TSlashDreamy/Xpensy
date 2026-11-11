import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CurrencyField from "@/components/form-fields/currency-field";
import type { Currency } from "@/lib/currencies";

afterEach(cleanup);

const currencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€", isoNumeric: null },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", isoNumeric: null },
  {
    code: "USD",
    name: "United States Dollar",
    symbol: "$",
    isoNumeric: null,
  },
];

const getHiddenInput = () =>
  document.querySelector<HTMLInputElement>("input[name='limitCurrency']");

const renderField = (defaultValue = "USD") =>
  render(
    <CurrencyField
      currencies={currencies}
      defaultValue={defaultValue}
      error={undefined}
      id="limitCurrency"
      name="limitCurrency"
    />,
  );

describe("CurrencyField", () => {
  it("should submit the default currency through the hidden input", () => {
    renderField("USD");

    expect(getHiddenInput()).toHaveValue("USD");
  });

  it("should submit the picked currency through the hidden input", async () => {
    renderField("USD");

    const trigger = screen.getByRole("combobox", { name: /Select currency/ });
    fireEvent.mouseDown(trigger);
    fireEvent.click(trigger);

    await screen.findByRole("listbox", {}, { timeout: 3000 });

    fireEvent.click(await screen.findByRole("option", { name: /EUR/ }));

    expect(getHiddenInput()).toHaveValue("EUR");
  });

  it("should sync with the default currency handed back by the server", () => {
    const { rerender } = renderField("USD");

    rerender(
      <CurrencyField
        currencies={currencies}
        defaultValue="EUR"
        error={undefined}
        id="limitCurrency"
        name="limitCurrency"
      />,
    );

    expect(getHiddenInput()).toHaveValue("EUR");
  });

  it("should show the validation error", () => {
    render(
      <CurrencyField
        currencies={currencies}
        defaultValue="USD"
        error={{ errors: ["Invalid currency"] }}
        id="limitCurrency"
        name="limitCurrency"
      />,
    );

    expect(screen.getByText("Invalid currency")).toBeInTheDocument();
  });
});
