# Database Schema (PostgreSQL / Supabase)

To support seamless switching between private solo expenses and collaborative collections, the schema minimizes complex splitting arithmetic and handles multi-tenancy via a **nullable relational relationship** on the `expenses` table. A **`connections`** contact list lets users manage people in-app and invite them to collections without relying on email links alone.

> [!NOTE]
> **The entire architecture relies on one clever trick:** instead of separating your personal expenses and group expenses into two different tables, they live in the exact same table (`expenses`).
> Whether an expense is private or shared depends entirely on whether it is linked to a **Collection**.

## Current live architecture snapshot (verified via Supabase MCP, 2026-11-12)

- **Public schema tables:** `profiles`, `collections`, `collection_members`, `connections`, `collection_invites`, `expense_limits`, `expenses` (7 tables). RLS is enabled on all of them.
- **Extensions:** `pg_stat_statements` (1.11), `pgcrypto` (1.3), `plpgsql` (1.0), `supabase_vault` (0.3.1), `uuid-ossp` (1.1).
- **Storage:** no buckets configured (`storage.buckets` empty).
- **Edge Functions:** none detected.
- **Public helper/event functions:** `get_invite_by_token(uuid)`, `handle_new_user()`, `is_collection_member(_collection_id uuid, _user_id uuid DEFAULT auth.uid())`, `is_collection_member(target_collection_id uuid)` (overload), `is_collection_owner(_collection_id uuid, _user_id uuid DEFAULT auth.uid())`, `rls_auto_enable()`.
- **Triggers/event triggers:** no triggers on public tables or on `auth.users`; database event trigger `ensure_rls` (ddl_command_end, enabled) calls `public.rls_auto_enable()` to enable RLS on new tables created in `public`.
- **Notable security advisors (current):** `anon_security_definer_function_executable` and `authenticated_security_definer_function_executable` warnings for public SECURITY DEFINER functions (`get_invite_by_token`, `handle_new_user`, both `is_collection_member` overloads, `is_collection_owner`, `rls_auto_enable`); `auth_leaked_password_protection` is disabled. Review execute privileges and enable leaked password protection as appropriate for your threat model.

## 1. `profiles` Table (The Users)

| Name                 | Type          | Constraints |
| -------------------- | ------------- | ----------- |
| `id`                 | `uuid`        | Primary     |
| `display_name`       | `text`        |             |
| `avatar_url`         | `text`        | Nullable    |
| `preferred_currency` | `bpchar`      |             |
| `updated_at`         | `timestamptz` |             |

Supabase handles core authentication (emails, passwords, tokens) in a hidden, secure internal schema (`auth.users`). However, you cannot easily join tables to that internal schema.

- Why it’s here: The `public.profiles` table acts as a bridge. It mirrors the users from Supabase Auth so you can store public-facing data like `display_name` or an `avatar_url`.
- The Connection: The `id` is a `UUID` that explicitly references `auth.users(id)`. When a user deletes their account, `ON DELETE CASCADE` ensures their profile is cleaned up automatically.

```sql
-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_currency CHAR(3) NOT NULL DEFAULT 'USD', -- ISO 4217,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## 2. `collections` Table (The Shared Spaces)

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `id`         | `uuid`        | Primary     |
| `name`       | `text`        |             |
| `created_at` | `timestamptz` |             |
| `created_by` | `uuid`        |             |

A "Collection" is simply a container for shared expenses (e.g., "Apartment Bills", "Road Trip").

- Why it’s here: It acts as the anchor for groups. It keeps track of the name of the collection, when it was made, and who created it (created_by).
- If you are just tracking personal expenses, you don't even need to touch this table.

```sql
-- 2. COLLECTIONS (Shared Groups)
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT
);
```

## 3. collection_members Table (The Access Control)

| Name            | Type          | Constraints |
| --------------- | ------------- | ----------- |
| `collection_id` | `uuid`        | Primary     |
| `user_id`       | `uuid`        | Primary     |
| `joined_at`     | `timestamptz` |             |
| `is_pinned`     | `bool`        |             |
| `pinned_at`     | `timestamptz` | Nullable    |

This is a **Join Table** (or junction table) that handles a Many-to-Many relationship. A single user can be a member of multiple collections, and a single Collection can have multiple users.

- Why it’s here: It lists who has permission to view or add expenses to a specific Collection.
- The Structure: It pairs a `collection_id` with a `user_id`. By setting the `PRIMARY KEY` to be the combination of both columns (`collection_id`, `user_id`), you guarantee a user cannot accidentally be added to the exact same Collection twice.

```sql
-- 3. COLLECTION MEMBERS (Many-to-Many Join Table)
CREATE TABLE public.collection_members (
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    pinned_at TIMESTAMP WITH TIME ZONE, -- helps sort pinned collections on the home page
    PRIMARY KEY (collection_id, user_id)
);
```

## 4. `connections` Table (The Contact List)

| Name                | Type          | Constraints |
| ------------------- | ------------- | ----------- |
| `user_id`           | `uuid`        | Primary     |
| `connected_user_id` | `uuid`        | Primary     |
| `created_at`        | `timestamptz` |             |

A **personal contact list** for the Connections page. Each row links the current user (`user_id`) to another Xpensy user (`connected_user_id`) they want to keep handy for shared collections.

- Why it’s here: Lets users add, remove, and browse people in-app instead of re-entering emails every time they invite someone to a collection.
- The Structure: Composite `PRIMARY KEY (user_id, connected_user_id)` prevents duplicate contacts. The `CHECK (user_id <> connected_user_id)` constraint blocks self-links.
- Invites: From Connections, the app creates a `collection_invites` row with `invite_source = 'connection'` and `invitee_id` set — no email link required.

```sql
-- 4. CONNECTIONS (Personal contact list — used on the Connections page)
CREATE TABLE public.connections (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, connected_user_id),
    CHECK (user_id <> connected_user_id)
);
```

## 5. `collection_invites` Table (Invitations)

| Name            | Type          | Constraints |
| --------------- | ------------- | ----------- |
| `id`            | `uuid`        | Primary     |
| `collection_id` | `uuid`        |             |
| `invited_by`    | `uuid`        |             |
| `invite_source` | `text`        |             |
| `email`         | `text`        | Nullable    |
| `invitee_id`    | `uuid`        | Nullable    |
| `status`        | `text`        |             |
| `token`         | `uuid`        | Unique      |
| `expires_at`    | `timestamptz` |             |
| `accepted_at`   | `timestamptz` | Nullable    |
| `accepted_by`   | `uuid`        | Nullable    |
| `created_at`    | `timestamptz` |             |

Tracks pending and resolved invitations to join a collection. Supports **two paths** into the same table:

- **Email** (`invite_source = 'email'`): `email` is required; share `/invite/[token]` with someone who may not have an account yet.
- **Connection** (`invite_source = 'connection'`): `invitee_id` is required; sent from the Connections page to an existing contact.

- Why it’s here: Bridges the gap between “I created a collection” and “this person is a member.” Accepting an invite inserts a `collection_members` row and marks the invite `accepted`.
- Lifecycle: `status` moves through `pending` → `accepted` | `declined` | `expired` | `cancelled`. `expires_at` defaults to seven days after creation.
- Uniqueness: Partial unique indexes ensure at most one active `pending` invite per email or per `invitee_id` per collection.

```sql
-- 5. COLLECTION INVITES (Email link OR in-app invite to an existing connection)
CREATE TABLE public.collection_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invite_source TEXT NOT NULL DEFAULT 'email'
        CHECK (invite_source IN ('email', 'connection')),
    email TEXT CHECK (email IS NULL OR email = lower(email)), -- required for email invites
    invitee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- required for in-app / connection invites
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
    token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE, -- email path: /invite/[token]; in-app path: optional deep link
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE,
    accepted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CHECK (
        (invite_source = 'email' AND email IS NOT NULL AND invitee_id IS NULL)
        OR (invite_source = 'connection' AND invitee_id IS NOT NULL)
    )
);

-- One active pending invite per email or per user per collection
CREATE UNIQUE INDEX collection_invites_pending_email_unique
    ON public.collection_invites (collection_id, email)
    WHERE status = 'pending' AND email IS NOT NULL;

CREATE UNIQUE INDEX collection_invites_pending_invitee_unique
    ON public.collection_invites (collection_id, invitee_id)
    WHERE status = 'pending' AND invitee_id IS NOT NULL;
```

## 6. `expense_limits` Table (Spending Caps)

| Name            | Type          | Constraints |
| --------------- | ------------- | ----------- |
| `id`            | `uuid`        | Primary     |
| `user_id`       | `uuid`        |             |
| `amount`        | `numeric`     |             |
| `currency`      | `bpchar`      |             |
| `start_date`    | `date`        |             |
| `end_date`      | `date`        |             |
| `collection_id` | `uuid`        | Nullable    |
| `created_at`    | `timestamptz` |             |

Defines **budget limits** over a date range — the backing store for “set limits for expenses with start and end date” on the home page.

- Why it’s here: Lets users cap spending for a period without hard-coding rules in the app layer. Limits are always owned by a `user_id`; optional `collection_id` narrows scope to a specific collection (omit it for a personal limit).
- The Structure: `amount` uses `NUMERIC(12, 2)` (same as `expenses`). `end_date` must be on or after `start_date`.
- Querying: Compare summed `expenses` in the window (filtered by `user_id`, and optionally `collection_id`) against `amount` to show progress or warnings.

```sql
-- 6. EXPENSE LIMITS TABLE (Consider whether limits are always personal (`user_id` only) or can apply to a collection `collection_id`)
CREATE TABLE public.expense_limits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
      currency CHAR(3) NOT NULL DEFAULT 'USD',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL CHECK (end_date >= start_date),
      collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE, -- NULL = personal limit
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );
```

**One limit per user/collection:** `expense_limits` enforces a single row per scope:

- `expense_limits_personal_unique` — unique `user_id` where `collection_id IS NULL`.
- `expense_limits_collection_unique` — unique `(user_id, collection_id)` where `collection_id IS NOT NULL`.

## 7. expenses Table (The Ledger)

| Name            | Type          | Constraints                                        |
| --------------- | ------------- | -------------------------------------------------- |
| `id`            | `uuid`        | Primary, default `gen_random_uuid()`               |
| `amount`        | `numeric`     | NOT NULL, `CHECK (amount > 0)`                     |
| `currency`      | `bpchar(3)`   | NOT NULL, default `'USD'`                          |
| `description`   | `text`        | NOT NULL                                           |
| `category`      | `text`        | NOT NULL, default `'General'`                      |
| `expense_date`  | `date`        | NOT NULL                                           |
| `user_id`       | `uuid`        | NOT NULL, FK → `profiles(id)` ON DELETE CASCADE    |
| `collection_id` | `uuid`        | Nullable, FK → `collections(id)` ON DELETE CASCADE |
| `created_at`    | `timestamptz` | NOT NULL, default `timezone('utc', now())`         |

This is the heart of Xpensy. It records every financial transaction.

- `amount NUMERIC(12, 2)`: Crucial detail. Never use floating-point numbers (`float`, `real`) for money because computers suffer from rounding errors with decimals (e.g., `0.1 + 0.2` becoming `0.30000000000000004`). `NUMERIC(12,2)` guarantees exact decimal precision.
- `expense_date`: required for every expense (the live schema has no default).
- `user_id`: Tracks exactly who created/paid the expense, regardless of whether it's solo or shared.
- `collection_id (Nullable)`: **This is the secret sauce**. If a user adds a personal expense (like buying a coffee), `collection_id` is saved as `NULL`. If a user adds an expense to a shared Collection (like buying groceries for the house), `collection_id` stores the specific ID of that Collection.

```sql
-- 7. EXPENSES (Solo if collection_id is NULL)
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL DEFAULT 'USD', -- ISO 4217
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    expense_date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE, -- NULL means Personal/Solo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Constraints & indexes (live, verified 2026-11-12)

- **Primary keys:** `profiles(id)`, `collections(id)`, `collection_members(collection_id,user_id)`, `connections(user_id,connected_user_id)`, `collection_invites(id)`, `expense_limits(id)`, `expenses(id)`.
- **Foreign keys:** `profiles.id → auth.users.id ON DELETE CASCADE`; `collections.created_by → profiles.id ON DELETE RESTRICT`; `collection_members.collection_id → collections.id ON DELETE CASCADE`; `collection_members.user_id → profiles.id ON DELETE CASCADE`; `connections.user_id/connected_user_id → profiles.id ON DELETE CASCADE`; `collection_invites.collection_id → collections.id ON DELETE CASCADE`; `collection_invites.invited_by/invitee_id → profiles.id ON DELETE CASCADE`; `collection_invites.accepted_by → profiles.id ON DELETE SET NULL`; `expense_limits.user_id → profiles.id ON DELETE CASCADE`; `expense_limits.collection_id → collections.id ON DELETE CASCADE`; `expenses.user_id → profiles.id ON DELETE CASCADE`; `expenses.collection_id → collections.id ON DELETE CASCADE`.
- **Checks:** `expenses.amount > 0`, `expense_limits.amount > 0`, `expense_limits.end_date >= start_date`, `connections.user_id <> connected_user_id`, `collection_invites` enforces `invite_source/status` enums and source-specific field combinations, `collection_invites.email` lowercased when present.
- **Unique/partial indexes:** `collection_invites.token` unique; `collection_invites_pending_email_unique` on `(collection_id,email)` where `status='pending' AND email IS NOT NULL`; `collection_invites_pending_invitee_unique` on `(collection_id,invitee_id)` where `status='pending' AND invitee_id IS NOT NULL`; `expense_limits_personal_unique` on `(user_id)` where `collection_id IS NULL`; `expense_limits_collection_unique` on `(user_id,collection_id)` where `collection_id IS NOT NULL`.

## DB Schema vizualization

![Xpensy DB Schema vizualization](https://raw.githubusercontent.com/TSlashDreamy/Xpensy/f99304a556e19fced07bb0ae5a752c42ab1c0770/docs/assets/db-schema-vizualization.svg)

# How the UI Queries This Data

Because the database is normalized this way, writing the frontend logic becomes incredibly clean. You only need two primary queries to power the whole application:

## Case A: The Personal Dashboard

When a user opens their private dashboard, you want to show only their personal solo expenses.

```sql
SELECT * FROM expenses
WHERE user_id = 'current_user_id'
  AND collection_id IS NULL; -- Filters out any group expenses
```

## Case B: Inside a Specific "Collection"

When a user clicks on their "Trip to Georgia" Collection, you want to show all expenses associated with that Collection, regardless of who paid for it.

```sql
SELECT * FROM expenses
WHERE collection_id = 'georgia_collection_id'; -- Shows everyone's additions to this Collection
```

# The Security Layer (Row Level Security - RLS)

Because PostgreSQL is running inside Supabase, security rules are applied directly on all tables. For example, the `expenses` table policy ensures:

"Allow a user to read a row only if `expenses.user_id` matches their own ID OR if `expenses.collection_id` matches a Collection they belong to."

To prevent circular RLS policy recursion and ensure high performance, security checks use `SECURITY DEFINER` helper functions (`is_collection_member`, `is_collection_owner`) and cached `(select auth.uid())` subqueries.

**Verified live details (2026-11-12):**

- RLS is enabled on all 7 public tables.
- Public helper functions present: `is_collection_member(_collection_id uuid, _user_id uuid DEFAULT auth.uid())`, `is_collection_member(target_collection_id uuid)` (overload), `is_collection_owner(_collection_id uuid, _user_id uuid DEFAULT auth.uid())`, `get_invite_by_token(_token uuid)`.
- `public.handle_new_user()` exists but there is currently **no trigger** on `auth.users`; profile provisioning on signup is not wired by trigger in the live database.
- Event trigger `ensure_rls` calls `public.rls_auto_enable()` to auto-enable RLS for new tables created in `public`.
- See [Supabase-RLS-Policies.md](./Supabase-RLS-Policies.md) for the full policy matrix and definitions.
- This repository does not currently contain a `supabase/migrations/` directory; the previously referenced migration path `supabase/migrations/20260904000000_rewrite_rls_policies.sql` is not present in-repo.
