# Xpensy — MVP Architecture & Implementation Plan

Welcome to the architectural specification and implementation roadmap for **Xpesny**, a modern expense tracking application optimized for both individual use and shared micro-groups called **"collections"**.

This document outlines the core technical architecture, relational database schema, validation layer, and procedural execution roadmap for the Minimum Viable Product (MVP).

---

## 1. Tech Stack & Infrastructure

- **Frontend & Meta-Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend-as-a-Service (BaaS):** Supabase (Postgres Database, GoTrue Auth, Postgres Changes for Real-time WebSockets)
- **Validation Layer:** Zod (Runtime type-checking and form sanitation)

---

## 2. Database Schema (PostgreSQL / Supabase)

See [Xpensy-Database-Schema.md](./Xpensy-Database-Schema.md) for the canonical schema and the **current live architecture snapshot (verified via Supabase MCP, 2026-11-12)**.

Key live facts:

- Public tables: `profiles`, `collections`, `collection_members`, `connections`, `collection_invites`, `expense_limits`, `expenses`.
- RLS enabled on all public tables; `ensure_rls` event trigger auto-enables RLS for new public tables.
- No storage buckets and no edge functions detected.
- `handle_new_user()` exists but no `on_auth_user_created` trigger is installed on `auth.users` in the live DB.

## 3. Data Validation & Schema Definition (Zod)

This Zod schema performs deep sanitation. It transforms the client-side string inputs (typical of standard web form fields) into structured, strict primitives suitable for a database transaction.

```ts
// src/lib/validations/expense.ts
import { z } from "zod";

export const expenseCategories = [
  "Food & Drinks",
  "Rent & Utilities",
  "Entertainment",
  "Transport",
  "Shopping",
  "General",
] as const;

export const createExpenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Amount must be greater than 0"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(100, "Description cannot exceed 100 characters")
    .trim(),

  category: z.enum(expenseCategories, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),

  currency: z.string().length(3).default("USD"), // ISO 4217
  expenseDate: z.string().min(1, "Expense date is required"), // YYYY-MM-DD (DATE in DB)

  collectionId: z
    .string()
    .uuid("Invalid Collection reference")
    .nullable()
    .optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
```

## 4. Next.js Server Action Implementation

The Next.js Server Action executes exclusively on the server side, acting as a secure gateway that applies Zod schemas, extracts authentication states safely via cookies, and directly provisions data into Supabase.

```ts
// src/app/actions/expenses.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server"; // Standard Supabase SSR client setup
import { createExpenseSchema } from "@/lib/validations/expense";

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function createExpenseAction(
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Verify User Session Security
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: "Unauthorized. Please log in." };
  }

  // 2. Extract Data & Apply Schema Boundaries
  const rawFields = {
    amount: formData.get("amount"),
    description: formData.get("description"),
    category: formData.get("category"),
    currency: formData.get("currency") || "USD",
    expenseDate: formData.get("expenseDate"), // required by live schema (date)
    collectionId: formData.get("collectionId") || null,
  };

  const validationResult = createExpenseSchema.safeParse(rawFields);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // 3. Optional Multi-tenant Check (If adding to a shared collection)
  if (validatedData.collectionId) {
    const { data: participation, error: membershipError } = await supabase
      .from("collection_members")
      .select("collection_id")
      .eq("collection_id", validatedData.collectionId)
      .eq("user_id", user.id)
      .single();

    if (membershipError || !participation) {
      return {
        success: false,
        message: "Access Denied: You are not a member of this collection.",
      };
    }
  }

  // 4. Data Layer Insertion
  const { error: dbError } = await supabase.from("expenses").insert({
    amount: validatedData.amount,
    description: validatedData.description,
    category: validatedData.category,
    currency: validatedData.currency,
    expense_date: validatedData.expenseDate,
    user_id: user.id,
    collection_id: validatedData.collectionId || null,
  });

  if (dbError) {
    console.error("Database Error:", dbError);
    return {
      success: false,
      message: "Failed to persist ledger transaction to database.",
    };
  }

  // 5. Invalidate Router Caches to Force UI Update
  revalidatePath("/dashboard");
  if (validatedData.collectionId) {
    revalidatePath(`/collections/${validatedData.collectionId}`);
  }

  return { success: true, message: "Expense recorded successfully." };
}
```

## 5. Development Phases Roadmap

### Phase 1: Environment Setup & Foundation

- [x] Initialize Next.js app with --typescript and Tailwind configuration.
- [x] Spin up Supabase local environment / remote instance.
- [x] Deploy table migrations and enable Row Level Security (RLS).
- [~] `public.handle_new_user()` exists in the live DB, but the `on_auth_user_created` trigger on `auth.users` is **not installed** (verified 2026-11-12). Install/verify the trigger to auto-provision `public.profiles` on signup.

### Phase 2: Core Authentication

- [ ] Integrate @supabase/ssr middleware to manage sessions across server/client components.
- [ ] Construct custom Auth pages (Sign In, Magic Link distribution).
- [ ] Implement an onboarding user profile edit page (display_name).

### Phase 3: Individual Tracking Engine (Solo Mode)

- [ ] Render primary user Dashboard view fetching expenses where collection_id IS NULL.
- [ ] Incorporate form tracking paired with our Zod-validated createExpenseAction.
- [ ] Render transaction log lists with date grouping metrics.

### Phase 4: Shared Collaborative "collections"

- [ ] Implement "New collection Setup" mechanics (auto-creates row and inputs user as explicit member).
- [ ] Build invite flow: email invites via `collection_invites` (`invite_source = 'email'`), share `/invite/[token]` link; in-app invites from Connections (`invite_source = 'connection'`, `invitee_id` set) — accept → insert `collection_members` and mark invite `accepted`.
- [ ] Setup collection routes (/collections/[id]) filtering expenses strictly mapping back to that parent ID.

### Phase 5: Connections

- [ ] Build Connections page: list `connections` for the current user (join `profiles` for display_name / avatar).
- [ ] Add/remove connections (`INSERT` / `DELETE` on `connections`; prevent self-links via CHECK).
- [ ] Invite a connection to a collection from the Connections page (create `collection_invites` row with `invite_source = 'connection'`).
- [ ] Surface pending in-app collection invites for the logged-in user (`invitee_id = auth.uid()`).

### Phase 6: Real-time Synchronizations

- [ ] Attach supabase.channel() client hooks on the shared collection views.
- [ ] Implement real-time listeners appending additions automatically into browser views.
- [ ] Apply optimistic state rendering patterns to prevent latency feedback.
