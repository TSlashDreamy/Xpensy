"use client";

import React from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import FormField from "./form-field";

import type { FormFieldProps } from "./types";

interface ComboboxInputProps extends Omit<FormFieldProps, "list"> {
  list: Array<string>;
  creatable?: boolean;
}

function isSameOption(a: string, b: string) {
  return a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();
}

export default function ComboboxField({
  list,
  placeholder,
  defaultValue,
  error,
  id,
  label,
  creatable = false,
  ...other
}: ComboboxInputProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    typeof defaultValue === "string" && defaultValue.length > 0
      ? defaultValue
      : null,
  );
  const [createdOptions, setCreatedOptions] = React.useState<Array<string>>(
    () =>
      creatable &&
      typeof defaultValue === "string" &&
      defaultValue.length > 0 &&
      !list.some((item) => isSameOption(item, defaultValue))
        ? [defaultValue]
        : [],
  );
  const [query, setQuery] = React.useState("");

  const options = React.useMemo(() => {
    const seen = new Set<string>();
    const merged: string[] = [];

    for (const option of [...list, ...createdOptions]) {
      const key = option.trim().toLocaleLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(option);
    }

    return merged;
  }, [list, createdOptions]);

  const trimmedQuery = query.trim();
  const createOption =
    creatable &&
    trimmedQuery.length > 0 &&
    !options.some((option) => isSameOption(option, trimmedQuery))
      ? trimmedQuery
      : null;

  const items = React.useMemo(
    () => (createOption ? [...options, createOption] : options),
    [options, createOption],
  );

  const handleValueChange = (value: string | null) => {
    if (creatable && value && !list.some((item) => isSameOption(item, value))) {
      setCreatedOptions((prev) =>
        prev.some((item) => isSameOption(item, value))
          ? prev
          : [...prev, value],
      );
    }
    setSelectedOption(value);
  };

  return (
    <div>
      <FormField
        type="hidden"
        value={selectedOption ?? ""}
        readOnly
        error={error}
        id={id}
        label={label}
        {...other}
      />
      <Combobox
        items={items}
        value={selectedOption}
        onValueChange={handleValueChange}
        onInputValueChange={setQuery}
        autoHighlight={creatable}
      >
        <ComboboxInput
          aria-invalid={Boolean(error?.errors.length)}
          className="mt-2"
          placeholder={placeholder}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {creatable
              ? "No suggestions. Keep typing to use your own."
              : "No items found."}
          </ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="py-2 text-sm sm:text-xs sm:py-1"
              >
                {item === createOption ? `Create "${item}"` : item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
