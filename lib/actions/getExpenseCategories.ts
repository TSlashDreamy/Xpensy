"use server";

import { createClient } from "@/lib/supabase/server";

import { SUPABASE_TABLES } from "../supabase/constants";

/**
 * Used to get categories of the current user
 */
export async function getExpenseCategories(): Promise<string[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .select("category")
    .eq("user_id", user.id);

  const categories = (data ?? [])
    .map((row) => row.category)
    .filter((category): category is string => Boolean(category));

  return Array.from(new Set(categories));
}
