import React from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.ComponentProps<"input"> {
  error: { errors: string[] } | undefined;
  label: string | React.ReactElement;
}

export default function FormField({
  error,
  label,
  id,
  ...other
}: FormFieldProps) {
  return (
    <Field>
      {typeof label === "string" ? (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      ) : (
        label
      )}
      <Input aria-invalid={Boolean(error?.errors.length)} {...other} />
      <FieldError>{error?.errors.join(",\n")}</FieldError>
    </Field>
  );
}
