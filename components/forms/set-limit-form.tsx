"use client";

import {
  RiCheckLine as AcceptIcon,
  RiEdit2Line as UpdateIcon,
  RiDeleteBack2Line as ClearIcon,
} from "@remixicon/react";
import { format, endOfMonth } from "date-fns";
import React from "react";

import FormField from "@/components/form-fields/form-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { clearExpenseLimit } from "@/lib/actions/clearExpenseLimit";
import {
  setExpenseLimitAction,
  type SetExpenseLimitState,
} from "@/lib/actions/setExpenseLimit";
import type { Currency } from "@/lib/currencies";

import CurrencyField from "../form-fields/currency-field";
import DatePicker from "../form-fields/date-picker";

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
  const [isClearing, startClearing] = React.useTransition();
  const [clearError, setClearError] = React.useState<string | null>(null);

  const isMobile = useIsMobile();

  const handleClear = React.useCallback(() => {
    setClearError(null);

    startClearing(async () => {
      const cleared = await clearExpenseLimit();

      if (cleared) {
        onSuccess();
      } else {
        setClearError("We couldn't remove your limit. Try again later.");
      }
    });
  }, [onSuccess]);

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

  const initialAmount = state.values?.limitAmount ?? initialValues?.amount;

  // Currency before fail -> Pre-filled currency -> User preference -> Default fallback currency
  const initialCurrency =
    state.values?.limitCurrency ??
    initialValues?.currency ??
    defaultCurrency ??
    "USD";

  const initialStartDate =
    state.values?.limitStartDate || initialValues?.startDate || todayDate;
  const initialEndDate =
    state.values?.limitEndDate || initialValues?.endDate || endOfMonthDate;

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
              defaultValue={initialAmount}
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
          defaultValue={initialStartDate}
          endDefaultValue={initialEndDate}
          error={dateRangeError}
          required
        />
        <Field>
          <Button
            disabled={isPending || isClearing}
            type="submit"
            size={isMobile ? "touch" : "default"}
          >
            {isPending ? (
              <Spinner data-icon="inline-start" />
            ) : initialValues ? (
              <UpdateIcon />
            ) : (
              <AcceptIcon />
            )}
            {isPending
              ? initialValues
                ? "Updating..."
                : "Saving..."
              : initialValues
                ? "Update limits"
                : "Set limit"}
          </Button>
          {initialValues && (
            <Button
              disabled={isPending || isClearing}
              onClick={handleClear}
              type="button"
              size={isMobile ? "touch" : "default"}
              variant="destructive"
            >
              {isClearing ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <ClearIcon />
              )}
              {isClearing ? "Removing..." : "Remove limit"}
            </Button>
          )}
          <FieldError>{clearError ?? state.message}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  );
}
