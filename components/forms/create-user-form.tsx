"use client";

import { useActionState } from "react";

import FormField from "@/components/forms/form-field";
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
import { cn } from "@/lib/utils";

export function CreateUserForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const tempItems = ["USD", "UAH", "RUB"];
  const initialState: CreateUserState = {
    message: null,
    error: {},
    values: {},
  };
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialState,
  );

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
                <FieldLabel htmlFor="password">Preffered currency</FieldLabel>
                <Combobox items={tempItems}>
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
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
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
