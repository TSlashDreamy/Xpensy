"use server";

import { isValid, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { DB_MaxNumCap } from "@/lib/supabase/constants";
import { createClient } from "@/lib/supabase/server";

import { SUPABASE_TABLES } from "../supabase/constants";

export interface AddExpenseState {
  error?: {
    expenseAmount?: { errors: string[] };
    expenseDescription?: { errors: string[] };
    expenseCategory?: { errors: string[] };
    expenseCurrency?: { errors: string[] };
    expenseDate?: { errors: string[] };
  };
  message?: string | null;
  values?: {
    expenseAmount?: number;
    expenseDescription?: string;
    expenseCategory?: string;
    expenseCurrency?: string;
    expenseDate?: string | undefined;
  };
  success?: boolean;
}

const FormSchema = z.object({
  expenseAmount: z.number().positive().max(DB_MaxNumCap),
  expenseDescription: z.optional(z.string().max(10000)),
  expenseCategory: z.string().min(2).max(10000),
  expenseCurrency: z.currencyCode(),
  expenseDate: z
    .string()
    .refine((value) => isValid(parseISO(value)), "Invalid date"),
});

export async function addExpenseAction(
  _prevState: AddExpenseState,
  formData: FormData,
): Promise<AddExpenseState> {
  const rawFormFieldsData = {
    expenseAmount: formData.get("expenseAmount"),
    expenseDescription: formData.get("expenseDescription"),
    expenseCategory: formData.get("expenseCategory"),
    expenseCurrency: formData.get("expenseCurrency"),
    expenseDate: formData.get("expenseDate"),
  };

  const formFieldsData = {
    expenseAmount: rawFormFieldsData.expenseAmount
      ? Number.parseFloat(String(rawFormFieldsData.expenseAmount))
      : undefined,
    expenseDescription: rawFormFieldsData.expenseDescription
      ? String(rawFormFieldsData.expenseDescription).trim()
      : undefined,
    expenseCategory: rawFormFieldsData.expenseCategory
      ? String(rawFormFieldsData.expenseCategory).trim()
      : undefined,
    expenseCurrency: rawFormFieldsData.expenseCurrency
      ? String(rawFormFieldsData.expenseCurrency).trim()
      : undefined,
    expenseDate: rawFormFieldsData.expenseDate
      ? String(rawFormFieldsData.expenseDate).trim()
      : undefined,
  };

  const validatedFields = FormSchema.safeParse(formFieldsData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error).properties,
      values: formFieldsData,
      message: null,
      success: false,
    };
  }

  const {
    expenseAmount,
    expenseCategory,
    expenseDate,
    expenseDescription,
    expenseCurrency,
  } = validatedFields.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: {},
      values: formFieldsData,
      message: "We couldn't find a user",
      success: false,
    };
  }

  const { error: creationError } = await supabase
    .from(SUPABASE_TABLES.EXPENSES)
    .insert({
      amount: expenseAmount,
      currency: expenseCurrency,
      description: expenseDescription,
      category: expenseCategory,
      expense_date: expenseDate,
      user_id: user.id,
      // TODO: collection_id should be included when expense is added through collection
      collection_id: null,
    });

  if (creationError) {
    // Log direct postgres error, do not return it
    console.error(creationError.details);

    return {
      error: {},
      values: formFieldsData,
      message: "We couldn't write your info to database. Try again later.",
      success: false,
    };
  }

  revalidatePath("/homepage");

  return { error: {}, values: {}, message: null, success: true };
}
