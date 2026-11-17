"use client";

import React from "react";

import { FieldGroup } from "@/components/ui/field";
import {
  setExpenseLimitAction,
  type SetExpenseLimitState,
} from "@/lib/actions/setExpenseLimit";
import type { Currency } from "@/lib/currencies";

import LimitAmountField from "./components/limit-amount-field";
import LimitCurrencyField from "./components/limit-currency-field";
import LimitDateField from "./components/limit-date-field";
import LimitFormActions from "./components/limit-form-actions";

export type LimitValues = {
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
} | null;

interface SetLimitFormProps {
  onSuccess: () => void;
  currencies: Currency[];
  defaultCurrency?: string;
  initialValues?: LimitValues;
}

export default function SetLimitForm({
  onSuccess,
  currencies,
  defaultCurrency,
  initialValues,
}: SetLimitFormProps) {
  const initialState: SetExpenseLimitState = {
    message: null,
    error: {},
    values: {},
  };
  const [state, formAction, isPending] = React.useActionState(
    setExpenseLimitAction,
    initialState,
  );

  React.useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div>
          <div className="flex items-end gap-1 sm:gap-2">
            <LimitAmountField formState={state} initialValues={initialValues} />
            <LimitCurrencyField
              currencies={currencies}
              formState={state}
              defaultCurrency={defaultCurrency}
              initialValues={initialValues}
            />
          </div>
        </div>
        <LimitDateField formState={state} initialValues={initialValues} />
        <LimitFormActions
          formState={state}
          isPending={isPending}
          onSuccess={onSuccess}
          initialValues={initialValues}
        />
      </FieldGroup>
    </form>
  );
}
