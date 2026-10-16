"use client";

import React from "react";

import FormInput from "@/components/form-fields/form-input";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { addExpenseAction } from "@/lib/actions/addExpense";
import type { AddExpenseState } from "@/lib/actions/addExpense";

import AddExpenseFooter from "../add-expense-component/add-expense-footer";
import { CurrencySwitcher } from "../currency-switcher";
import { DatePicker } from "../form-fields/date-picker";

interface AddExpenseFormProps {
  onSuccess: () => void;
  isMobileView?: boolean;
}

export default function AddExpenseForm({
  onSuccess,
  isMobileView = false,
}: AddExpenseFormProps) {
  const initialState: AddExpenseState = {
    message: null,
    error: {},
    values: {},
  };
  const [state, formAction, isPending] = React.useActionState(
    addExpenseAction,
    initialState,
  );

  React.useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div>
          <FormInput
            aria-label="Amount"
            id="expenseAmount"
            name="expenseAmount"
            className="h-auto py-0 field-sizing-content bg-transparent! border-none ring-0! text-7xl! font-bold text-center tracking-tighter"
            placeholder="0"
            type="number"
            defaultValue={state.values?.expenseAmount}
            error={state.error?.expenseAmount}
            required
          />
          <CurrencySwitcher
            name="expenseCurrency"
            defaultValue={state.values?.expenseCurrency}
            variant="symbol"
          />
        </div>
        <FormInput
          id="expenseDescription"
          name="expenseDescription"
          label="Description"
          placeholder="A phone for my girlfriend"
          defaultValue={state.values?.expenseDescription}
          error={state.error?.expenseDescription}
        />
        <FormInput
          id="expenseCategory"
          name="expenseCategory"
          label="Category"
          placeholder="Gift"
          defaultValue={state.values?.expenseCategory}
          error={state.error?.expenseCategory}
          required
        />
        <DatePicker
          id="expenseDate"
          name="expenseDate"
          label="Date"
          defaultValue={state.values?.expenseDate}
          error={state.error?.expenseDate}
          required
        />
        <Field>
          <AddExpenseFooter isMobileView={isMobileView} isAdding={isPending} />
          <FieldError>{state.message}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  );
}
