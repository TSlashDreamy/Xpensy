"use client";

import { format } from "date-fns";
import React from "react";

import DatePicker from "@/components/form-fields/date-picker";
import type { AddExpenseState } from "@/lib/actions/addExpense";

interface ExpenseDateFieldProps {
  formState: AddExpenseState;
}

export default function ExpenseDateField({ formState }: ExpenseDateFieldProps) {
  const todayDate = React.useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  return (
    <DatePicker
      id="expenseDate"
      name="expenseDate"
      label="Date"
      defaultValue={formState.values?.expenseDate || todayDate}
      error={formState.error?.expenseDate}
      required
    />
  );
}
