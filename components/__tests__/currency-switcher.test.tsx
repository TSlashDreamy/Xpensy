import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CurrencySwitcher } from "@/components/currency-switcher";
import type { Currency } from "@/lib/currencies";

afterEach(cleanup);

const currencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "USD", name: "United States Dollar", symbol: "$" },
];

const openCurrencyList = async () => {
  const trigger = screen.getByRole("combobox", { name: /Select currency/ });
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger);

  await screen.findByRole("listbox", {}, { timeout: 3000 });

  return trigger;
};

describe("CurrencySwitcher", () => {
  it("should render the symbol of the selected currency", () => {
    render(
      <CurrencySwitcher currencies={currencies} value="UAH" variant="symbol" />,
    );

    expect(screen.getByLabelText("Selected currency: UAH")).toHaveTextContent(
      "₴",
    );
  });

  it("should render the code of the selected currency", () => {
    render(
      <CurrencySwitcher currencies={currencies} value="UAH" variant="code" />,
    );

    expect(screen.getByLabelText("Selected currency: UAH")).toHaveTextContent(
      "UAH",
    );
  });

  it("should render the flag of the selected currency", () => {
    render(
      <CurrencySwitcher currencies={currencies} value="UAH" variant="flag" />,
    );

    expect(screen.getByText("🇺🇦")).toBeInTheDocument();
  });

  it("should fall back to the code when the currency is unknown", () => {
    render(
      <CurrencySwitcher currencies={currencies} value="XXX" variant="symbol" />,
    );

    expect(screen.getByLabelText("Selected currency: XXX")).toHaveTextContent(
      "XXX",
    );
  });

  it("should submit the selected currency through the hidden input", () => {
    const { container } = render(
      <CurrencySwitcher
        currencies={currencies}
        value="UAH"
        name="expenseCurrency"
      />,
    );

    const input = container.querySelector<HTMLInputElement>(
      "input[name='expenseCurrency']",
    );
    expect(input).toHaveValue("UAH");
  });

  it("should not render a hidden input when no name is given", () => {
    const { container } = render(
      <CurrencySwitcher currencies={currencies} value="UAH" />,
    );

    expect(container.querySelector("input[name]")).not.toBeInTheDocument();
  });

  it("should report the picked currency to the parent", async () => {
    const onValueChange = vi.fn();

    render(
      <CurrencySwitcher
        currencies={currencies}
        value="UAH"
        onValueChange={onValueChange}
      />,
    );

    await openCurrencyList();

    const euro = await screen.findByRole("option", { name: /EUR/ });
    fireEvent.click(euro);

    expect(onValueChange).toHaveBeenCalledWith("EUR");
  });

  it("should filter currencies by code or name as the user types", async () => {
    render(<CurrencySwitcher currencies={currencies} value="UAH" />);

    await openCurrencyList();

    const input = screen.getByRole("combobox", { name: /Search currency/ });
    fireEvent.change(input, { target: { value: "uah" } });

    expect(
      screen.getByRole("option", { name: /Ukrainian Hryvnia/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Euro/ }),
    ).not.toBeInTheDocument();
  });
});
