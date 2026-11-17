import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import PrivacyTransition from "../privacy-transition";

afterEach(cleanup);

describe("PrivacyTransition", () => {
  it("remounts its content when the state changes so the entry animation restarts", () => {
    const { rerender } = render(
      <PrivacyTransition hidden={false}>
        <span>amount</span>
      </PrivacyTransition>,
    );

    const visibleNode = screen.getByText("amount").parentElement;

    rerender(
      <PrivacyTransition hidden>
        <span>amount</span>
      </PrivacyTransition>,
    );

    expect(screen.getByText("amount").parentElement).not.toBe(visibleNode);
  });
});
