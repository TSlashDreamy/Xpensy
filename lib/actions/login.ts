"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: {
    email?: { errors: string[] };
    password?: { errors: string[] };
  };
  message?: string | null;
  values?: { email?: string; password?: string };
}

const FormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(9, { error: "Password must be at least 9 characters" }),
});

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const formFieldsData = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };

  const validatedFields = FormSchema.safeParse(formFieldsData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: formFieldsData,
    };
  }

  const { email, password } = validatedFields.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message, values: { email: formFieldsData.email } };
  }

  redirect("/homepage");
}
