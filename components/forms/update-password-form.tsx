"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  updatePasswordAction,
  type UpdatePasswordState,
} from "@/lib/actions/updatePassword";
import { cn } from "@/lib/utils";

import FormInput from "../form-fields/form-input";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const initialState: UpdatePasswordState = {
    message: null,
    error: {},
    values: {},
  };
  const [state, formAction, isPending] = React.useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup className="flex flex-col gap-6">
              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="New password"
                label="New password"
                defaultValue={state.values?.password}
                error={state.error?.password}
                required
              />
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Saving..." : "Save new password"}
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
