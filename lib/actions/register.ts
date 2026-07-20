"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

interface RegisterState {
  error: string | null;
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const repeatPassword = String(formData.get("repeatPassword"));

  if (!email || !password || !repeatPassword) {
    return { error: "Email, password and repeat password are required" };
  }

  if (password !== repeatPassword) {
    return { error: "Passwords do not match" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/homepage`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/register-success");
}
