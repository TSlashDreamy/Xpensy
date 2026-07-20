"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface UpdatePasswordState {
  error: string | null;
}

export async function updatePasswordAction(
  _prevState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password"));

  if (!password) {
    return { error: "Password is required" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/homepage");
}
