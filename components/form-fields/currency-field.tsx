"use client";

import React from "react";

import CurrencySwitcher from "@/components/currency-switcher";
import type { Currency } from "@/lib/currencies";

import FormField from "./form-field";

import type { FormFieldProps } from "./types";

interface CurrencyFieldProps {
  className?: string;
  currencies: Currency[];
  defaultValue: string;
  error: FormFieldProps["error"];
  id: string;
  label?: FormFieldProps["label"];
  name: string;
  variant?: "symbol" | "code" | "flag";
}

/**
 * Form field wrapper around CurrencySwitcher. Owns the selected currency so
 * forms don't have to, and mirrors it into a hidden input for submission.
 */
export default function CurrencyField({
  className,
  currencies,
  defaultValue,
  error,
  id,
  label,
  name,
  variant = "symbol",
}: CurrencyFieldProps) {
  const [currency, setCurrency] = React.useState(defaultValue);

  // Restore the currency the user picked when the server hands back the
  // values of a failed submission.
  React.useEffect(() => {
    setCurrency(defaultValue);
  }, [defaultValue]);

  return (
    <div>
      <FormField
        type="hidden"
        value={currency}
        readOnly
        error={error}
        id={id}
        label={label}
        name={name}
      />
      <CurrencySwitcher
        currencies={currencies}
        value={currency}
        onValueChange={setCurrency}
        variant={variant}
        className={className}
      />
    </div>
  );
}
