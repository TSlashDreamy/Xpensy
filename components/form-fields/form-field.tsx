import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { FormFieldProps } from "./types";

export default function FormField({
  error,
  label,
  id,
  ...other
}: FormFieldProps) {
  return (
    <Field>
      {label &&
        (typeof label === "string" ? (
          <FieldLabel className="text-sm sm:text-xs" htmlFor={id}>
            {label}
          </FieldLabel>
        ) : (
          label
        ))}
      <Input
        className="h-auto py-2 text-sm sm:text-xs sm:py-1"
        aria-invalid={Boolean(error?.errors.length)}
        {...other}
      />
      <FieldError>{error?.errors.join(",\n")}</FieldError>
    </Field>
  );
}
