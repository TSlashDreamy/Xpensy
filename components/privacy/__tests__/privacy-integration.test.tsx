import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HideExpensesToggle from "@/components/home-actions/hide-expenses-toggle";
import AnimatedExpenseAmount from "@/containers/expense-counter/animated-expense-amount";

import { PrivacyProvider } from "../privacy-provider";
import PrivateAmount from "../private-amount";

afterEach(cleanup);

describe("privacy wiring", () => {
  it("hides every amount consumer when the toggle is clicked", () => {
    render(
      <PrivacyProvider initialHidden={false}>
        <HideExpensesToggle />
        <PrivateAmount value="USD 1,234.56" />
        <AnimatedExpenseAmount expensesAmount={123} isPending={false} />
      </PrivacyProvider>,
    );

    expect(screen.getByText("USD 1,234.56")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "Hide amounts" });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("USD 1,234.56")).not.toBeInTheDocument();
    expect(screen.queryByText("123")).not.toBeInTheDocument();
    expect(screen.getAllByText("#####")).toHaveLength(2);
    expect(screen.getAllByText("Amount hidden")).toHaveLength(2);
  });

  it("requires a provider for amount consumers", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      expect(() => render(<PrivateAmount value="USD 1,234.56" />)).toThrow(
        "usePrivacy must be used within PrivacyProvider",
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
