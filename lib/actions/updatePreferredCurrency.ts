"use server";

import { refresh } from "next/cache";
import { z } from "zod";

import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

export type UpdatePreferredCurrencyResult =
  { success: true } | { success: false; error: string };

/**
 * Persists the currency the user picked in the currency switcher as their
 * profile preference, so every server component can read it.
 */
export async function updatePreferredCurrency(
  currency: string,
): Promise<UpdatePreferredCurrencyResult> {
  const validatedCurrency = z.currencyCode().safeParse(currency);

  if (!validatedCurrency.success) {
    return { success: false, error: "Invalid currency code" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "We couldn't find a user" };
  }

  const { error: updateError } = await supabase
    .from(SUPABASE_TABLES.PROFILES)
    .update({ preferred_currency: validatedCurrency.data })
    .eq("id", user.id);

  if (updateError) {
    // Log direct postgres error, do not return it
    console.error(updateError.details);

    return {
      success: false,
      error: "We couldn't save your currency preference. Try again later.",
    };
  }

  // Re-render the server components of the current route so they pick up the
  // new preference
  refresh();

  return { success: true };
}
