import CurrencyField from "@/components/form-fields/currency-field";
import type { SetExpenseLimitState } from "@/lib/actions/setExpenseLimit";
import type { Currency } from "@/lib/currencies";

import type { LimitValues } from "../set-limit-form";

interface LimitCurrencyFieldProps {
  defaultCurrency?: string;
  formState: SetExpenseLimitState;
  currencies: Currency[];
  initialValues?: LimitValues;
}

export default function LimitCurrencyField({
  defaultCurrency,
  formState,
  currencies,
  initialValues,
}: LimitCurrencyFieldProps) {
  // Currency saved by form (before fail) -> Pre-filled currency -> User preference -> Default fallback currency
  const initialCurrency =
    formState.values?.limitCurrency ??
    initialValues?.currency ??
    defaultCurrency ??
    "USD";

  return (
    <CurrencyField
      currencies={currencies}
      id="limitCurrency"
      name="limitCurrency"
      defaultValue={initialCurrency}
      error={formState.error?.limitCurrency}
      className="size-9 sm:size-7"
    />
  );
}
