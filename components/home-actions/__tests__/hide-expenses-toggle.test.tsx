import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { HIDE_AMOUNTS_COOKIE } from "@/shared/privacy";
import { cleanup, fireEvent, render, screen } from "@/test-utils";

import HideExpensesToggle from "../hide-expenses-toggle";

beforeEach(() => {
  document.cookie = `${HIDE_AMOUNTS_COOKIE}=; Max-Age=0; Path=/`;
});

afterEach(cleanup);

describe("HideExpensesToggle", () => {
  it("exposes a pressed toggle and persists both states", () => {
    render(<HideExpensesToggle />);

    const toggle = screen.getByRole("button", { name: "Hide amounts" });

    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(document.cookie).toContain(`${HIDE_AMOUNTS_COOKIE}=1`);

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(document.cookie).toContain(`${HIDE_AMOUNTS_COOKIE}=0`);
  });
});
