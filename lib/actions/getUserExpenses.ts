"use server";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

interface UserExpense {
  amount: number;
  currency: string;
  description: string;
}

type ReturnedData = UserExpense[] | null;

export async function getUserExpenses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data }: { data: ReturnedData } = await supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .select("amount, currency, description")
    // collection_id === null -> personal expenses
    .filter("collection_id", "is", "null")
    .eq("user_id", user.id);

  return data;
}
