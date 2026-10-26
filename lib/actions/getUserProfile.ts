"use server";

import { cache } from "react";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  display_name: string;
  avatar_url: string | null;
  preferred_currency: string;
}

// Memoized per request, so reading the profile from several components
// results in a single query
export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
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
});
