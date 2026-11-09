"use client";

import { RiCalendar2Line as CalendarIcon } from "@remixicon/react";
import { isValid, parseISO } from "date-fns";
import { format } from "date-fns/format";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { FormFieldProps } from "./types";
import type { DateRange } from "react-day-picker";

interface DatePickerCommonProps {
  id: string;
  name: string;
  label?: FormFieldProps["label"];
  error: FormFieldProps["error"];
  required?: boolean;
  defaultValue?: string;
}

interface SingleDatePickerProps extends DatePickerCommonProps {
  range?: false;
  endName?: never;
  endDefaultValue?: never;
}

interface RangeDatePickerProps extends DatePickerCommonProps {
  range: true;
  endName: string;
  endDefaultValue?: string;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

function parseDefaultDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(String(value).slice(0, 10));
  return isValid(parsed) ? parsed : undefined;
}

function parseDefaultRange(from?: string, to?: string): DateRange | undefined {
  const fromDate = parseDefaultDate(from);
  if (!fromDate) return undefined;
  return { from: fromDate, to: parseDefaultDate(to) };
}

function toInputValue(date: Date | undefined): string {
  return date ? format(date, "yyyy-MM-dd") : "";
}

export default function DatePicker(props: DatePickerProps) {
  const { id, name, label, error, required, defaultValue } = props;
  const isRange = props.range === true;
  const endName = isRange ? props.endName : undefined;
  const endDefaultValue = isRange ? props.endDefaultValue : undefined;

  const [isOpened, setIsOpened] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(() =>
    isRange ? undefined : parseDefaultDate(defaultValue),
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() =>
    isRange ? parseDefaultRange(defaultValue, endDefaultValue) : undefined,
  );
  const [isPickingRangeEnd, setIsPickingRangeEnd] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (isRange) {
      setDateRange(parseDefaultRange(defaultValue, endDefaultValue));
    } else {
      setDate(parseDefaultDate(defaultValue));
    }
  }, [isRange, defaultValue, endDefaultValue]);

  const handleOpenChange = (open: boolean) => {
    setIsOpened(open);
    if (open) setIsPickingRangeEnd(false);
  };

  const handlePickDate = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    setIsOpened(false);
  };

  const handlePickRange = (
    newRange: DateRange | undefined,
    triggerDate: Date,
  ) => {
    if (!newRange?.from) return;

    // The first click starts a fresh range; the second one completes it.
    if (!isPickingRangeEnd) {
      setDateRange({ from: triggerDate, to: undefined });
      setIsPickingRangeEnd(true);
      return;
    }

    setDateRange(newRange);
    if (newRange.to) {
      setIsPickingRangeEnd(false);
      setIsOpened(false);
    }
  };

  const from = dateRange?.from;
  const to = dateRange?.to;
  const isEmpty = isRange ? !from : !date;

  const displayValue = isRange
    ? from
      ? `${format(from, "P")}${to ? ` – ${format(to, "P")}` : " – …"}`
      : null
    : date
      ? format(date, "PPP")
      : null;

  return (
    <Field>
      {label &&
        (typeof label === "string" ? (
          <FieldLabel className="text-sm sm:text-xs" htmlFor={id}>
            {label}
          </FieldLabel>
        ) : (
          label
        ))}
      <input
        type="hidden"
        name={name}
        value={toInputValue(date ?? from)}
        required={required}
      />
      {isRange && endName && (
        <input
          type="hidden"
          name={endName}
          value={toInputValue(to)}
          required={required}
        />
      )}
      <Popover open={isOpened} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            aria-invalid={Boolean(error?.errors.length)}
            variant="outline"
            data-empty={isEmpty}
            className="h-auto w-full justify-start py-2 text-left text-sm font-normal sm:py-1 sm:text-xs data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon />
            {displayValue ?? (
              <span>{isRange ? "Pick a date range" : "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {isRange ? (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handlePickRange}
            />
          ) : (
            <Calendar
              mode="single"
              selected={date}
              onSelect={handlePickDate}
              required
            />
          )}
        </PopoverContent>
      </Popover>
      <FieldError>{error?.errors.join(",\n")}</FieldError>
    </Field>
  );
}
