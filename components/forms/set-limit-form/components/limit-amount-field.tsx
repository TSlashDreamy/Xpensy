import FormField from "@/components/form-fields/form-field";
import type { SetExpenseLimitState } from "@/lib/actions/setExpenseLimit";

import type { LimitValues } from "../set-limit-form";

interface LimitAmountFieldProps {
  formState: SetExpenseLimitState;
  initialValues?: LimitValues;
}

export default function LimitAmountField({
  formState,
  initialValues,
}: LimitAmountFieldProps) {
  const initialAmount = formState.values?.limitAmount ?? initialValues?.amount;

  return (
    <FormField
      aria-label="Limit amount"
      id="limitAmount"
      name="limitAmount"
      label="Amount"
      placeholder="0"
      step="0.01"
      type="number"
      defaultValue={initialAmount}
      error={formState.error?.limitAmount}
      className="h-9 sm:h-7 text-sm sm:text-xs"
      required
    />
  );
}
