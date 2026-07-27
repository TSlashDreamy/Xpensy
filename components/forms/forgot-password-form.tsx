"use client";

import Link from "next/link";
import { useActionState } from "react";

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
  resetPasswordAction,
  type ResetPasswordState,
} from "@/lib/actions/resetPassword";
import { cn } from "@/lib/utils";

import FormField from "./form-field";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const initialState: ResetPasswordState = {
    message: null,
    error: {},
    values: {},
    success: false,
  };
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {state.success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <FieldGroup>
                <FormField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="yourEmail@xpensy.com"
                  label="Email"
                  defaultValue={state.values?.email}
                  error={state.error?.email}
                  required
                />
                <Field>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Sending..." : "Send reset email"}
                  </Button>
                  <FieldError>{state.message}</FieldError>
                </Field>
              </FieldGroup>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
