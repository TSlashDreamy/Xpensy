"use server";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

interface UserProfile {
  display_name: string;
  avatar_url: string | null;
  preferred_currency: string;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data }: { data: UserProfile | null } = await supabase
    .from(SUPABASE_TABLES.PROFILES)
    .select("display_name, avatar_url, preferred_currency")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}
