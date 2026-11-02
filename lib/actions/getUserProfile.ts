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
export const getUserProfile = cache(
  async (userId?: string): Promise<UserProfile | null> => {
    const supabase = await createClient();
    let profileId = userId;

    if (!profileId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      profileId = user.id;
    }

    const { data }: { data: UserProfile | null } = await supabase
      .from(SUPABASE_TABLES.PROFILES)
      .select("display_name, avatar_url, preferred_currency")
      .eq("id", profileId)
      .maybeSingle();

    return data;
  },
);
