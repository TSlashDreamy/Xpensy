"use server";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

export interface LatestExpense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  category: string;
  expense_date: string;
  user_id: string;
}

export interface ExpenseUser {
  display_name: string;
  avatar_url: string | null;
}

export interface GroupedExpenses {
  user: ExpenseUser | null;
  expenses: LatestExpense[];
}

interface LatestGroupedExpensesOptions {
  limit?: number;
}

interface LatestExpenseRow extends LatestExpense {
  profiles: ExpenseUser | ExpenseUser[] | null;
}

export async function getLatestGroupedExpenses({
  limit,
}: LatestGroupedExpensesOptions = {}): Promise<GroupedExpenses[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let query = supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .select(
      "id, amount, currency, description, category, expense_date, user_id, profiles(display_name, avatar_url)",
    )
    .eq("user_id", user.id)
    // collection_id === null -> personal expenses
    .filter("collection_id", "is", "null")
    .order("created_at", { ascending: false });

  if (limit !== undefined) query = query.limit(limit);

  const { data }: { data: LatestExpenseRow[] | null } = await query;
  if (!data?.length) return [];

  const groupedExpenses = new Map<string, GroupedExpenses>();

  for (const { profiles, ...expense } of data) {
    const group = groupedExpenses.get(expense.user_id);

    if (group) {
      if (limit === undefined || group.expenses.length < limit) {
        group.expenses.push(expense);
      }
      continue;
    }

    groupedExpenses.set(expense.user_id, {
      user: Array.isArray(profiles) ? (profiles[0] ?? null) : profiles,
      expenses: [expense],
    });
  }

  return Array.from(groupedExpenses.values());
}
