import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HIDE_AMOUNTS_COOKIE } from "@/shared/privacy";

import { PrivacyProvider, usePrivacy } from "../privacy-provider";

function Probe() {
  const { hidden, toggle } = usePrivacy();
  return <button onClick={toggle}>{hidden ? "hidden" : "visible"}</button>;
}

afterEach(() => {
  cleanup();
  document.cookie = `${HIDE_AMOUNTS_COOKIE}=; Max-Age=0; Path=/`;
});

describe("PrivacyProvider", () => {
  it("seeds from initialHidden and persists toggles to the cookie", () => {
    render(
      <PrivacyProvider initialHidden>
        <Probe />
      </PrivacyProvider>,
    );

    expect(screen.getByRole("button", { name: "hidden" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "hidden" }));

    expect(screen.getByRole("button", { name: "visible" })).toBeInTheDocument();
    expect(document.cookie).toContain(`${HIDE_AMOUNTS_COOKIE}=0`);
  });
});
