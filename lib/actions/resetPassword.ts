"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export interface ResetPasswordState {
  error?: {
    email?: { errors: string[] };
  };
  message?: string | null;
  values?: { email?: string };
  success: boolean;
}

const FormSchema = z.object({
  email: z.email(),
});

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const formFieldsData = {
    email: String(formData.get("email")),
  };

  const validatedFields = FormSchema.safeParse(formFieldsData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: formFieldsData,
      success: false,
    };
  }

  const { email } = validatedFields.data;
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/update-password`,
  });

  if (error) {
    return { message: error.message, success: false };
  }

  return { error: {}, success: true };
}
