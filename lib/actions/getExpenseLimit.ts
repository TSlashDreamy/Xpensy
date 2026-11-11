"use server";

import { createClient } from "@/lib/supabase/server";

import { SUPABASE_TABLES } from "../supabase/constants";

import type { ExpenseLimits } from "../types";

export async function getExpenseLimit(
  collection_id?: string,
): Promise<ExpenseLimits | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const limitQuery = supabase
    .from(SUPABASE_TABLES.EXPENSE_LIMITS)
    .select(
      "id, user_id, amount, currency, start_date, end_date, collection_id",
    )
    .eq("user_id", user.id);

  const { data, error } = collection_id
    ? await limitQuery.eq("collection_id", collection_id).maybeSingle()
    : await limitQuery.is("collection_id", null).maybeSingle();

  if (error) {
    console.error(error.details);
    return null;
  }

  return data;
}
