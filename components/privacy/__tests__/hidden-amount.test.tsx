import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import HiddenAmount from "../hidden-amount";

afterEach(cleanup);

describe("HiddenAmount", () => {
  it("shows a fixed mask with an accessible label instead of an amount", () => {
    render(<HiddenAmount />);

    expect(screen.getByText("#####")).toBeInTheDocument();
    expect(screen.getByText("Amount hidden")).toBeInTheDocument();
  });
});
