"use server";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

export interface UserExpense {
  id: string;
  amount: number;
  currency: string;
  description: string;
}

type ReturnedData = UserExpense[] | null;

export async function getUserExpenses(limit?: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let query = supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .select("id, amount, currency, description")
    // collection_id === null -> personal expenses
    .filter("collection_id", "is", "null")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit !== undefined) query = query.limit(limit);
  const { data }: { data: ReturnedData } = await query;

  return data;
}
