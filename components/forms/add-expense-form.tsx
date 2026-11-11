"use client";

import { format } from "date-fns";
import React from "react";

import FormField from "@/components/form-fields/form-field";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { addExpenseAction } from "@/lib/actions/addExpense";
import type { AddExpenseState } from "@/lib/actions/addExpense";
import { getExpenseCategories } from "@/lib/actions/getExpenseCategories";
import type { Currency } from "@/lib/currencies";

import AddExpenseFooter from "../add-expense-component/add-expense-footer";
import CurrencySwitcher from "../currency-switcher";
import ComboboxField from "../form-fields/combobox-field";
import DatePicker from "../form-fields/date-picker";

interface AddExpenseFormProps {
  onSuccess: () => void;
  currencies: Currency[];
  defaultCurrency?: string;
}

export default function AddExpenseForm({
  onSuccess,
  currencies,
  defaultCurrency,
}: AddExpenseFormProps) {
  const [expenseCategories, setExpenseCategories] =
    React.useState<Array<string> | null>(null);
  const initialState: AddExpenseState = {
    message: null,
    error: {},
    values: {},
  };
  const [state, formAction, isPending] = React.useActionState(
    addExpenseAction,
    initialState,
  );

  const todayDate = React.useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  // Currency before fail -> User preference currency -> Default fallback currency
  const initialCurrency =
    state.values?.expenseCurrency ?? defaultCurrency ?? "USD";
  const [currency, setCurrency] = React.useState(initialCurrency);

  React.useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  // Restore the currency the user picked when the server hands back the
  // values of a failed submission
  React.useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  React.useEffect(() => {
    getExpenseCategories().then((data) => {
      setExpenseCategories(data);
    });
  }, []);

  const handleCurrencyChange = React.useCallback((code: string) => {
    setCurrency(code);
  }, []);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div>
          <FormField
            aria-label="Amount"
            id="expenseAmount"
            name="expenseAmount"
            className="h-auto py-0 field-sizing-content bg-transparent! border-none ring-0! text-7xl! font-bold text-center tracking-tighter"
            placeholder="0"
            step="0.01"
            type="number"
            defaultValue={state.values?.expenseAmount}
            error={state.error?.expenseAmount}
            required
          />
          <CurrencySwitcher
            currencies={currencies}
            value={currency}
            onValueChange={handleCurrencyChange}
            name="expenseCurrency"
            variant="symbol"
          />
        </div>
        <FormField
          id="expenseDescription"
          name="expenseDescription"
          label="Description"
          placeholder="A phone for my girlfriend"
          defaultValue={state.values?.expenseDescription}
          error={state.error?.expenseDescription}
        />
        <ComboboxField
          id="expenseCategory"
          name="expenseCategory"
          label="Category"
          list={expenseCategories ?? []}
          creatable
          placeholder="Gift"
          defaultValue={state.values?.expenseCategory}
          error={state.error?.expenseCategory}
          required
        />
        <DatePicker
          id="expenseDate"
          name="expenseDate"
          label="Date"
          defaultValue={state.values?.expenseDate || todayDate}
          error={state.error?.expenseDate}
          required
        />
        <Field>
          <AddExpenseFooter submitting={isPending} />
          <FieldError>{state.message}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  );
}
