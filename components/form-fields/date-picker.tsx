"use client";

import { RiCalendar2Line as CalendarIcon } from "@remixicon/react";
import { isValid, parseISO } from "date-fns";
import { format } from "date-fns/format";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import FormInput from "./form-input";

import type { FormFieldProps } from "./types";

function parseDefaultDate(
  value: FormFieldProps["defaultValue"],
): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(String(value).slice(0, 10));
  return isValid(parsed) ? parsed : undefined;
}

export function DatePicker({
  error,
  label,
  id,
  defaultValue,
  ...other
}: FormFieldProps) {
  const [date, setDate] = React.useState<Date | undefined>(() =>
    parseDefaultDate(defaultValue),
  );

  React.useEffect(() => {
    setDate(parseDefaultDate(defaultValue));
  }, [defaultValue]);

  return (
    <div>
      <FormInput
        type="hidden"
        defaultValue={date ? format(date, "yyyy-MM-dd") : undefined}
        error={error}
        id={id}
        label={label}
        {...other}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-full mt-2 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
