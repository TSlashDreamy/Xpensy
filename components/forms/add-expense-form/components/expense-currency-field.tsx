import CurrencyField from "@/components/form-fields/currency-field";
import type { AddExpenseState } from "@/lib/actions/addExpense";
import type { Currency } from "@/lib/currencies";

interface ExpenseCurrencyFieldProps {
  currencies: Currency[];
  defaultCurrency?: string;
  formState: AddExpenseState;
}

export default function ExpenseCurrencyField({
  currencies,
  defaultCurrency,
  formState,
}: ExpenseCurrencyFieldProps) {
  // Currency saved by form (before fail) -> User preference currency -> Default fallback currency
  const initialCurrency =
    formState.values?.expenseCurrency ?? defaultCurrency ?? "USD";

  return (
    <CurrencyField
      currencies={currencies}
      id="expenseCurrency"
      name="expenseCurrency"
      defaultValue={initialCurrency}
      error={formState.error?.expenseCurrency}
      variant="symbol"
    />
  );
}
