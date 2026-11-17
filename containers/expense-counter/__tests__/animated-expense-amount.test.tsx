import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AnimatedExpenseAmount from "../animated-expense-amount";

const readDigits = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>("[data-digit]"))
    .map((element) => element.dataset.digit)
    .join("");

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("AnimatedExpenseAmount", () => {
  it("Should be rendered with the initial amount and rerendered when amount is updated", () => {
    let amount = 123;

    const { rerender } = render(
      <AnimatedExpenseAmount expensesAmount={amount} isPending={false} />,
    );
    expect(screen.getByText(amount)).toBeInTheDocument();

    amount = 321;
    rerender(<AnimatedExpenseAmount expensesAmount={321} isPending={false} />);

    expect(screen.getByText(amount)).toBeInTheDocument();
  });

  it("changes the digits while pending for the value", () => {
    vi.useFakeTimers();

    const { container } = render(
      <AnimatedExpenseAmount expensesAmount={123} isPending />,
    );

    expect(readDigits(container)).toBe("123");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(readDigits(container)).not.toBe("123");
  });

  it("settles on the new amount when pending ends", () => {
    vi.useFakeTimers();

    const { container, rerender } = render(
      <AnimatedExpenseAmount expensesAmount={123} isPending />,
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender(<AnimatedExpenseAmount expensesAmount={321} isPending={false} />);

    expect(readDigits(container)).toBe("321");
  });
});
