"use client";

import React from "react";

import FormField from "@/components/form-fields/form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  createUserAction,
  type CreateUserState,
} from "@/lib/actions/createUser";
import type { Currency } from "@/lib/currencies";
import { getCurrencyFlag } from "@/lib/currency-flag";
import { matchesCurrencyQuery } from "@/lib/currency-search";
import { cn } from "@/lib/utils";


interface CreateUserFormProps {
  currencies: Currency[];
  className?: string;
}

export function CreateUserForm({
  currencies,
  className,
  ...props
}: CreateUserFormProps) {
  const initialState: CreateUserState = {
    message: null,
    error: {},
    values: {},
  };
  const [state, formAction, isPending] = React.useActionState(
    createUserAction,
    initialState,
  );

  // Restore the currency the user picked when the server hands back the
  // values of a failed submission
  const restoredCurrency =
    currencies.find(({ code }) => code === state.values?.preferred_currency) ??
    null;
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency | null>(restoredCurrency);

  React.useEffect(() => {
    setSelectedCurrency(restoredCurrency);
  }, [restoredCurrency]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Getting started</CardTitle>
          <CardDescription>
            Enter your nickname and choose preffered currency to personalize
            your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <FormField
                id="display-name"
                name="display_name"
                type="text"
                placeholder="A_HumanBeing"
                label="Nickname"
                defaultValue={state.values?.display_name}
                error={state.error?.display_name}
                required
              />
              <Field>
                <FieldLabel htmlFor="preferred_currency">
                  Preffered currency
                </FieldLabel>
                <Combobox
                  items={currencies}
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                  itemToStringLabel={(currency: Currency) => currency.code}
                  itemToStringValue={(currency: Currency) => currency.code}
                  filter={matchesCurrencyQuery}
                >
                  <ComboboxInput
                    aria-invalid={Boolean(
                      state.error?.preferred_currency?.errors.length,
                    )}
                    id="preferred_currency"
                    name="preferred_currency"
                    placeholder="Select your preffered currency"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No currency found.</ComboboxEmpty>
                    <ComboboxList>
                      {(currency: Currency) => (
                        <ComboboxItem key={currency.code} value={currency}>
                          <span>{getCurrencyFlag(currency)}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">
                            {currency.name}
                          </span>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError>
                  {state.error?.preferred_currency?.errors.join(",\n")}
                </FieldError>
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Saving..." : "Save preferences"}
                </Button>
                <FieldError>{state.message}</FieldError>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
