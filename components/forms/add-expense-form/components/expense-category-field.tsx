import ComboboxField from "@/components/form-fields/combobox-field";
import type { AddExpenseState } from "@/lib/actions/addExpense";

interface ExpenseCategoryFieldProps {
  formState: AddExpenseState;
  categories: string[];
}

export default function ExpenseCategoryField({
  formState,
  categories,
}: ExpenseCategoryFieldProps) {
  return (
    <ComboboxField
      id="expenseCategory"
      name="expenseCategory"
      label="Category"
      list={categories}
      creatable
      placeholder="Gift"
      defaultValue={formState.values?.expenseCategory}
      error={formState.error?.expenseCategory}
      required
    />
  );
}
