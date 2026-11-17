import FormField from "@/components/form-fields/form-field";
import type { AddExpenseState } from "@/lib/actions/addExpense";

interface ExpenseDescriptionFieldProps {
  formState: AddExpenseState;
}

export default function ExpenseDescriptionField({
  formState,
}: ExpenseDescriptionFieldProps) {
  return (
    <FormField
      id="expenseDescription"
      name="expenseDescription"
      label="Description"
      placeholder="A phone for my girlfriend"
      defaultValue={formState.values?.expenseDescription}
      error={formState.error?.expenseDescription}
    />
  );
}
