import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PrivacyProvider, usePrivacy } from "../privacy-provider";
import PrivateAmount from "../private-amount";

afterEach(cleanup);

const renderAmount = (initialHidden: boolean) =>
  render(
    <PrivacyProvider initialHidden={initialHidden}>
      <PrivateAmount value="USD 1,234.56" />
    </PrivacyProvider>,
  );

function ToggleProbe() {
  const { toggle } = usePrivacy();
  return (
    <button onClick={toggle} type="button">
      toggle
    </button>
  );
}

describe("PrivateAmount", () => {
  it("renders the formatted value when amounts are visible", () => {
    renderAmount(false);

    expect(screen.getByText("USD 1,234.56")).toBeInTheDocument();
    expect(screen.queryByText("#####")).not.toBeInTheDocument();
  });

  it("renders a fixed mask and no real value when amounts are hidden", () => {
    renderAmount(true);

    expect(screen.queryByText("USD 1,234.56")).not.toBeInTheDocument();
    expect(screen.getByText("#####")).toBeInTheDocument();
    expect(screen.getByText("Amount hidden")).toBeInTheDocument();
  });

  it("removes the real value immediately when hiding", () => {
    render(
      <PrivacyProvider>
        <ToggleProbe />
        <PrivateAmount value="USD 1,234.56" />
      </PrivacyProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.queryByText("USD 1,234.56")).not.toBeInTheDocument();
    expect(screen.getByText("#####")).toBeInTheDocument();
  });
});
