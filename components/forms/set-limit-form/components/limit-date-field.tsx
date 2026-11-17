"use client";

import { endOfMonth, format } from "date-fns";
import React from "react";

import DatePicker from "@/components/form-fields/date-picker";
import type { SetExpenseLimitState } from "@/lib/actions/setExpenseLimit";

import type { LimitValues } from "../set-limit-form";

interface LimitDateFieldProps {
  formState: SetExpenseLimitState;
  initialValues?: LimitValues;
}

export default function LimitDateField({
  formState,
  initialValues,
}: LimitDateFieldProps) {
  const { todayDate, endOfMonthDate } = React.useMemo(() => {
    const today = new Date();

    return {
      todayDate: format(today, "yyyy-MM-dd"),
      endOfMonthDate: format(endOfMonth(today), "yyyy-MM-dd"),
    };
  }, []);

  const dateRangeError = React.useMemo(() => {
    const errors = [
      ...(formState.error?.limitStartDate?.errors ?? []),
      ...(formState.error?.limitEndDate?.errors ?? []),
    ];
    return errors.length ? { errors } : undefined;
  }, [formState.error?.limitStartDate, formState.error?.limitEndDate]);

  const initialStartDate =
    formState.values?.limitStartDate || initialValues?.startDate || todayDate;
  const initialEndDate =
    formState.values?.limitEndDate || initialValues?.endDate || endOfMonthDate;

  return (
    <DatePicker
      id="limitDateRange"
      name="limitStartDate"
      endName="limitEndDate"
      label="Limit period"
      defaultValue={initialStartDate}
      endDefaultValue={initialEndDate}
      error={dateRangeError}
      range
      required
    />
  );
}
