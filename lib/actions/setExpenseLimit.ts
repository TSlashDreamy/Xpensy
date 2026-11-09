"use server";

import { isValid, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { DB_MaxNumCap } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

import { SUPABASE_TABLES } from "../supabase/constants";

import type { ExpenseLimits } from "../types";

export interface SetExpenseLimitState {
  error?: {
    limitAmount?: { errors: string[] };
    limitStartDate?: { errors: string[] };
    limitEndDate?: { errors: string[] };
    limitCurrency?: { errors: string[] };
  };
  message?: string | null;
  values?: {
    limitAmount?: number;
    limitStartDate?: string | undefined;
    limitEndDate?: string | undefined;
    limitCurrency?: string;
  };
  success?: boolean;
}

const FormSchema = z.object({
  limitAmount: z.number().positive().max(DB_MaxNumCap),
  limitStartDate: z
    .string()
    .refine((value) => isValid(parseISO(value)), "Invalid date"),
  limitEndDate: z
    .string()
    .refine((value) => isValid(parseISO(value)), "Invalid date"),
  limitCurrency: z.currencyCode(),
});

function getAndValidateData(formData: FormData) {
  const rawFormFieldsData = {
    limitAmount: formData.get("limitAmount"),
    limitStartDate: formData.get("limitStartDate"),
    limitEndDate: formData.get("limitEndDate"),
    limitCurrency: formData.get("limitCurrency"),
  };

  const normalizedFormFieldsData = {
    limitAmount: rawFormFieldsData.limitAmount
      ? Number.parseFloat(String(rawFormFieldsData.limitAmount))
      : undefined,
    limitStartDate: rawFormFieldsData.limitStartDate
      ? String(rawFormFieldsData.limitStartDate).trim()
      : undefined,
    limitEndDate: rawFormFieldsData.limitEndDate
      ? String(rawFormFieldsData.limitEndDate).trim()
      : undefined,
    limitCurrency: rawFormFieldsData.limitCurrency
      ? String(rawFormFieldsData.limitCurrency).trim()
      : undefined,
  };

  return {
    normalizedData: normalizedFormFieldsData,
    validatedFields: FormSchema.safeParse(normalizedFormFieldsData),
  };
}

export async function setExpenseLimitAction(
  _prevState: SetExpenseLimitState,
  formData: FormData,
  existingLimitId?: ExpenseLimits["id"],
): Promise<SetExpenseLimitState> {
  const { normalizedData, validatedFields } = getAndValidateData(formData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: normalizedData,
      message: null,
      success: false,
    };
  }

  const { limitAmount, limitCurrency, limitEndDate, limitStartDate } =
    validatedFields.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: {},
      values: normalizedData,
      message: "We couldn't find a user",
      success: false,
    };
  }

  const data = {
    user_id: user.id,
    amount: limitAmount,
    currency: limitCurrency,
    start_date: limitStartDate,
    end_date: limitEndDate,
    // TODO: collection_id should be included when expense is added through collection
    collection_id: null,
  };

  const expenseLimits = supabase.from(SUPABASE_TABLES.EXPENSE_LIMITS);
  const { error: processingError } = existingLimitId
    ? await expenseLimits.update(data).eq("id", existingLimitId)
    : await expenseLimits.insert(data);

  if (processingError) {
    // Log direct postgres error, do not return it
    console.error(processingError.details);

    return {
      error: {},
      values: normalizedData,
      message: "We couldn't write your info to database. Try again later.",
      success: false,
    };
  }

  revalidatePath("/homepage");

  return { error: {}, values: {}, message: null, success: true };
}
