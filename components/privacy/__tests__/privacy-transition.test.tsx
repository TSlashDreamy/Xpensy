import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import PrivacyTransition from "../privacy-transition";

afterEach(cleanup);

describe("PrivacyTransition", () => {
  it("tags the current privacy state for the entry animation", () => {
    const { rerender } = render(
      <PrivacyTransition hidden={false}>
        <span>amount</span>
      </PrivacyTransition>,
    );

    expect(
      screen.getByText("amount").closest("[data-privacy-state]"),
    ).toHaveAttribute("data-privacy-state", "visible");

    rerender(
      <PrivacyTransition hidden>
        <span>amount</span>
      </PrivacyTransition>,
    );

    expect(
      screen.getByText("amount").closest("[data-privacy-state]"),
    ).toHaveAttribute("data-privacy-state", "hidden");
  });

  it("remounts its content when the state changes so the entry animation restarts", () => {
    const { rerender } = render(
      <PrivacyTransition hidden={false}>
        <span>amount</span>
      </PrivacyTransition>,
    );

    const visibleNode = screen
      .getByText("amount")
      .closest("[data-privacy-state]");

    rerender(
      <PrivacyTransition hidden>
        <span>amount</span>
      </PrivacyTransition>,
    );

    const hiddenNode = screen
      .getByText("amount")
      .closest("[data-privacy-state]");

    expect(hiddenNode).not.toBe(visibleNode);
  });
});
