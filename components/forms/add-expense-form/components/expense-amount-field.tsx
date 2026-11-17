import FormField from "@/components/form-fields/form-field";
import type { AddExpenseState } from "@/lib/actions/addExpense";

interface ExpenseAmountFieldProps {
  formState: AddExpenseState;
}

export default function ExpenseAmountField({
  formState,
}: ExpenseAmountFieldProps) {
  return (
    <FormField
      aria-label="Amount"
      id="expenseAmount"
      name="expenseAmount"
      className="h-auto py-0 field-sizing-content bg-transparent! border-none ring-0! text-7xl! font-bold text-center tracking-tighter"
      placeholder="0"
      step="0.01"
      type="number"
      defaultValue={formState.values?.expenseAmount}
      error={formState.error?.expenseAmount}
      required
    />
  );
}
