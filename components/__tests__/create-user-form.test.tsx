import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CreateUserForm } from "@/components/forms/create-user-form";
import type { Currency } from "@/lib/currencies";

vi.mock("@/lib/actions/createUser", () => ({
  createUserAction: vi.fn(async () => ({
    message: null,
    error: {},
    values: {},
  })),
}));

afterEach(cleanup);

const currencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "USD", name: "United States Dollar", symbol: "$" },
];

const openCurrencyList = async () => {
  const input = screen.getByRole("combobox");
  fireEvent.mouseDown(input);

  await screen.findByRole("listbox");

  return input;
};

describe("CreateUserForm", () => {
  it("should list every currency it receives", async () => {
    render(<CreateUserForm currencies={currencies} />);

    await openCurrencyList();

    expect(screen.getByRole("option", { name: /Euro/ })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Ukrainian Hryvnia/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /United States Dollar/ }),
    ).toBeInTheDocument();
  });

  it("should depend on the provided currencies instead of a hardcoded list", async () => {
    render(<CreateUserForm currencies={[currencies[0]]} />);

    await openCurrencyList();

    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("should submit the picked currency as its code", async () => {
    render(<CreateUserForm currencies={currencies} />);

    const input = await openCurrencyList();

    fireEvent.click(screen.getByRole("option", { name: /Ukrainian Hryvnia/ }));

    expect(input).toHaveValue("UAH");
    expect(input).toHaveAttribute("name", "preferred_currency");
  });

  it("should filter currencies by code as the user types", async () => {
    render(<CreateUserForm currencies={currencies} />);

    const input = await openCurrencyList();

    fireEvent.change(input, { target: { value: "uah" } });

    expect(
      screen.getByRole("option", { name: /Ukrainian Hryvnia/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Euro/ }),
    ).not.toBeInTheDocument();
  });
});
