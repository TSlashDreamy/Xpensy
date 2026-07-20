import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ERROR_PAGE_TEST_ID } from "../constants";
import ErrorPage from "../page";

describe("ErrorPage", () => {
  it("should render with unspecified error when nothing is provided in query params", async () => {
    const jsx = await ErrorPage({ searchParams: Promise.resolve({}) });
    render(jsx);

    const errorContainer = screen.getByTestId(ERROR_PAGE_TEST_ID);
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer.textContent).toContain(
      "Sorry, something went wrong.",
    );
    expect(
      screen.getByText("An unspecified error occurred."),
    ).toBeInTheDocument();
  });

  it("should render the error from query params", async () => {
    const jsx = await ErrorPage({
      searchParams: Promise.resolve({ error: "Error reason" }),
    });
    render(jsx);

    expect(screen.getByText("Code error: Error reason")).toBeInTheDocument();
  });
});
