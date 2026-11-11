"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { SUPABASE_TABLES } from "../supabase/constants";

export async function clearExpenseLimit(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const collectionId: string | null = null; // TODO: use the collection id when collection-aware entry lands

  const expenseLimits = supabase.from(SUPABASE_TABLES.EXPENSE_LIMITS);

  const deleteQuery = expenseLimits.delete().eq("user_id", user.id);

  const { error } = collectionId
    ? await deleteQuery.eq("collection_id", collectionId)
    : await deleteQuery.is("collection_id", null);

  if (error) {
    // Log direct postgres error, do not return it
    console.error(error.details);

    return false;
  }

  revalidatePath("/homepage");

  return true;
}
