import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { afterEach, describe, expect, it } from "vitest";

import DatePicker from "@/components/form-fields/date-picker";

afterEach(cleanup);

const now = new Date();
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const monthMid = new Date(now.getFullYear(), now.getMonth(), 15);
const monthLate = new Date(now.getFullYear(), now.getMonth(), 20);
const monthEnd = new Date(now.getFullYear(), now.getMonth(), 25);

const iso = (date: Date) => format(date, "yyyy-MM-dd");

const getInput = (name: string) =>
  document.querySelector<HTMLInputElement>(`input[name='${name}']`);

const openCalendar = () => {
  fireEvent.pointerDown(screen.getByRole("button"), {
    button: 0,
    ctrlKey: false,
  });
  fireEvent.click(screen.getByRole("button"));
};

const pickDay = (date: Date) => {
  const day = document.querySelector<HTMLButtonElement>(
    `td[data-day='${iso(date)}'] button`,
  );
  expect(day).not.toBeNull();
  fireEvent.click(day as HTMLButtonElement);
};

const renderSingle = (defaultValue = iso(monthStart)) =>
  render(
    <DatePicker
      id="expenseDate"
      name="expenseDate"
      label="Date"
      defaultValue={defaultValue}
      error={undefined}
      required
    />,
  );

const renderRange = (from = iso(monthStart), to = iso(monthMid)) =>
  render(
    <DatePicker
      range
      id="limitDateRange"
      name="limitStartDate"
      endName="limitEndDate"
      label="Date range"
      defaultValue={from}
      endDefaultValue={to}
      error={undefined}
      required
    />,
  );

describe("DatePicker", () => {
  it("should submit a single default date through its hidden input", () => {
    renderSingle();

    expect(getInput("expenseDate")).toHaveValue(iso(monthStart));
  });

  it("should submit a picked single date through its hidden input", () => {
    renderSingle();

    openCalendar();
    pickDay(monthLate);

    expect(getInput("expenseDate")).toHaveValue(iso(monthLate));
  });

  it("should submit both default range dates through two hidden inputs", () => {
    renderRange();

    expect(getInput("limitStartDate")).toHaveValue(iso(monthStart));
    expect(getInput("limitEndDate")).toHaveValue(iso(monthMid));
  });

  it("should show the default range on the trigger", () => {
    renderRange();

    expect(
      screen.getByText(`${format(monthStart, "P")} – ${format(monthMid, "P")}`),
    ).toBeInTheDocument();
  });

  it("should submit a picked range through both hidden inputs", () => {
    renderRange();

    openCalendar();
    pickDay(monthLate);
    pickDay(monthEnd);

    expect(getInput("limitStartDate")).toHaveValue(iso(monthLate));
    expect(getInput("limitEndDate")).toHaveValue(iso(monthEnd));
  });

  it("should sync both hidden inputs with the values handed back by the server", () => {
    const { rerender } = renderRange();

    rerender(
      <DatePicker
        range
        id="limitDateRange"
        name="limitStartDate"
        endName="limitEndDate"
        label="Date range"
        defaultValue={iso(monthLate)}
        endDefaultValue={iso(monthEnd)}
        error={undefined}
        required
      />,
    );

    expect(getInput("limitStartDate")).toHaveValue(iso(monthLate));
    expect(getInput("limitEndDate")).toHaveValue(iso(monthEnd));
  });

  it("should show the validation errors for the range", () => {
    render(
      <DatePicker
        range
        id="limitDateRange"
        name="limitStartDate"
        endName="limitEndDate"
        label="Date range"
        defaultValue={iso(monthStart)}
        endDefaultValue={iso(monthMid)}
        error={{ errors: ["Invalid start date", "Invalid end date"] }}
        required
      />,
    );

    expect(screen.getByText(/Invalid start date/)).toBeInTheDocument();
    expect(screen.getByText(/Invalid end date/)).toBeInTheDocument();
  });
});
