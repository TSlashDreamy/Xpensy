"use client";

import { RiCheckLine as AcceptIcon } from "@remixicon/react";
import { format, endOfMonth } from "date-fns";
import React from "react";

import FormField from "@/components/form-fields/form-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  setExpenseLimitAction,
  type SetExpenseLimitState,
} from "@/lib/actions/setExpenseLimit";
import type { Currency } from "@/lib/currencies";

import CurrencyField from "../form-fields/currency-field";
import DatePicker from "../form-fields/date-picker";

interface SetLimitFormProps {
  onSuccess: () => void;
  currencies: Currency[];
  defaultCurrency?: string;
}

export default function SetLimitForm({
  onSuccess,
  currencies,
  defaultCurrency,
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

  const { todayDate, endOfMonthDate } = React.useMemo(() => {
    const today = new Date();

    return {
      todayDate: format(today, "yyyy-MM-dd"),
      endOfMonthDate: format(endOfMonth(today), "yyyy-MM-dd"),
    };
  }, []);

  const dateRangeError = React.useMemo(() => {
    const errors = [
      ...(state.error?.limitStartDate?.errors ?? []),
      ...(state.error?.limitEndDate?.errors ?? []),
    ];
    return errors.length ? { errors } : undefined;
  }, [state.error?.limitStartDate, state.error?.limitEndDate]);

  React.useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  // Currency before fail -> User preference currency -> Default fallback currency
  const initialCurrency =
    state.values?.limitCurrency ?? defaultCurrency ?? "USD";

  return (
    <form action={formAction}>
      <FieldGroup>
        <div>
          <div className="flex items-end gap-1 sm:gap-2">
            <FormField
              aria-label="Limit amount"
              id="limitAmount"
              name="limitAmount"
              label="Amount"
              placeholder="0"
              step="0.01"
              type="number"
              defaultValue={state.values?.limitAmount}
              error={state.error?.limitAmount}
              className="h-9 sm:h-7 text-sm sm:text-xs"
              required
            />
            <CurrencyField
              currencies={currencies}
              id="limitCurrency"
              name="limitCurrency"
              defaultValue={initialCurrency}
              error={state.error?.limitCurrency}
              className="size-9 sm:size-7"
            />
          </div>
        </div>
        <DatePicker
          id="limitDateRange"
          name="limitStartDate"
          endName="limitEndDate"
          range
          label="Limit period"
          defaultValue={state.values?.limitStartDate || todayDate}
          endDefaultValue={state.values?.limitEndDate || endOfMonthDate}
          error={dateRangeError}
          required
        />
        <Field>
          <Button
            type="submit"
            className="rounded-2xl h-auto py-2.5 px-6 text-sm"
            disabled={isPending}
          >
            <AcceptIcon />
            {isPending ? "Saving..." : "Set limit"}
          </Button>
          <FieldError>{state.message}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  );
}
