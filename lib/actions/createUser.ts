"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

import { SUPABASE_TABLES } from "../supabase/constants";

export interface CreateUserState {
  error?: {
    display_name?: { errors: string[] };
    preferred_currency?: { errors: string[] };
  };
  message?: string | null;
  values?: { display_name?: string; preferred_currency?: string };
}

const FormSchema = z.object({
  display_name: z
    .string()
    .max(17, { error: "Nickname must be 17 characters or less" }),
  preferred_currency: z
    .string()
    .length(3, { error: "Currency code must have 3 characters only" }),
});

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const formFieldsData = {
    display_name: String(formData.get("display_name")),
    preferred_currency: String(formData.get("preferred_currency")),
  };

  const validatedFields = FormSchema.safeParse(formFieldsData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: formFieldsData,
    };
  }

  const { display_name, preferred_currency } = validatedFields.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "User not found after register" };
  }

  const { error: creationError } = await supabase
    .from(SUPABASE_TABLES.PROFILES)
    .insert({
      id: user.id,
      display_name,
      preferred_currency,
    });

  if (creationError) {
    return { message: creationError.details, values: formFieldsData };
  }

  redirect("/homepage");
}
