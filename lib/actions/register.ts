"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export interface RegisterState {
  error?: {
    email?: { errors: string[] };
    password?: { errors: string[] };
    repeatPassword?: { errors: string[] };
  };
  message?: string | null;
  values?: { email?: string; password?: string; repeatPassword?: string };
}

const FormSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(9, { error: "Password must be at least 9 characters" }),
    repeatPassword: z
      .string()
      .min(9, { error: "Password must be at least 9 characters" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: "Passwords do not match",
    path: ["repeatPassword"],
  });

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const formFieldsData = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    repeatPassword: String(formData.get("repeatPassword")),
  };

  const validatedFields = FormSchema.safeParse(formFieldsData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: formFieldsData,
    };
  }

  const { email, password } = validatedFields.data;
  const headersList = await headers();
  const origin = headersList.get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/auth/register/preferences`,
    },
  });

  if (error) {
    return { message: error.message, values: validatedFields.data };
  }

  redirect("/auth/register/success");
}
