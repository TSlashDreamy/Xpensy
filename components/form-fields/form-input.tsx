import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { FormFieldProps } from "./types";

export default function FormInput({
  error,
  label,
  id,
  ...other
}: FormFieldProps) {
  return (
    <Field>
      {label &&
        (typeof label === "string" ? (
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
        ) : (
          label
        ))}
      <Input aria-invalid={Boolean(error?.errors.length)} {...other} />
      <FieldError>{error?.errors.join(",\n")}</FieldError>
    </Field>
  );
}
