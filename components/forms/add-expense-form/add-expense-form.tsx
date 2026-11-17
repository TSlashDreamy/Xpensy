"use client";

import React from "react";

import { FieldGroup } from "@/components/ui/field";
import { addExpenseAction } from "@/lib/actions/addExpense";
import type { AddExpenseState } from "@/lib/actions/addExpense";
import type { Currency } from "@/lib/currencies";

import ExpenseAmountField from "./components/expense-amount-field";
import ExpenseCategoryField from "./components/expense-category-field";
import ExpenseCurrencyField from "./components/expense-currency-field";
import ExpenseDateField from "./components/expense-date-field";
import ExpenseDescriptionField from "./components/expense-description-field";
import ExpenseFormActions from "./components/expense-form-actions";

interface AddExpenseFormProps {
  onSuccess: () => void;
  currencies: Currency[];
  defaultCurrency?: string;
  expenseCategories: string[];
}

export default function AddExpenseForm({
  onSuccess,
  currencies,
  defaultCurrency,
  expenseCategories,
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
          <ExpenseAmountField formState={state} />
          <ExpenseCurrencyField
            currencies={currencies}
            formState={state}
            defaultCurrency={defaultCurrency}
          />
        </div>
        <ExpenseDescriptionField formState={state} />
        <ExpenseCategoryField
          formState={state}
          categories={expenseCategories}
        />
        <ExpenseDateField formState={state} />
        <ExpenseFormActions formState={state} isPending={isPending} />
      </FieldGroup>
    </form>
  );
}
