"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export interface UpdatePasswordState {
  error?: {
    password?: { errors: string[] };
  };
  message?: string | null;
  values?: { password?: string };
}

const FormSchema = z.object({
  password: z
    .string()
    .min(9, { error: "Password must be at least 9 characters" }),
});

export async function updatePasswordAction(
  _prevState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const formFieldsData = {
    password: String(formData.get("password")),
  };

  const validatedFields = FormSchema.safeParse(formFieldsData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: formFieldsData,
    };
  }

  const { password } = validatedFields.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { message: error.message };
  }

  redirect("/homepage");
}
