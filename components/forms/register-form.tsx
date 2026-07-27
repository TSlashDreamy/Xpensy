"use client";

import Link from "next/link";
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
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { registerAction, type RegisterState } from "@/lib/actions/register";
import { cn } from "@/lib/utils";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const initialState: RegisterState = { message: null, error: {}, values: {} };
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <FormField
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                label="Email"
                defaultValue={state.values?.email}
                error={state.error?.email}
                required
              />
              <FormField
                id="password"
                name="password"
                type="password"
                label="Password"
                defaultValue={state.values?.password}
                error={state.error?.password}
                required
              />
              <FormField
                id="repeat-password"
                name="repeatPassword"
                type="password"
                label="Repeat Password"
                defaultValue={state.values?.repeatPassword}
                error={state.error?.repeatPassword}
                required
              />
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating an account..." : "Register"}
                </Button>
                <FieldError>{state.message}</FieldError>
              </Field>
            </FieldGroup>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
