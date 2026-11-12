# Supabase Row Level Security (RLS) Architecture & Reference

This document describes the security model, PostgreSQL functions, triggers, and Row Level Security (RLS) policies implemented for **Xpensy**.

**Verified against live Supabase project via MCP on 2026-11-12.**

---

## 1. Design Overview

To ensure data confidentiality, multi-tenant isolation, and high performance across personal and shared collection expenses:

1. **All 7 public schema tables** have RLS enabled:
   - `profiles`
   - `collections`
   - `collection_members`
   - `connections`
   - `collection_invites`
   - `expense_limits`
   - `expenses`

2. **No RLS Policy Recursion:**
   Evaluating membership directly on `collection_members` inside policies targeting `collection_members` causes PostgreSQL infinite recursion errors. We bypass this using `SECURITY DEFINER` helper functions:
   - `public.is_collection_member(_collection_id uuid, _user_id uuid DEFAULT auth.uid())`
   - `public.is_collection_member(target_collection_id uuid)` (single-arg overload, used in some contexts; live definition uses `search_path = ''` and `auth.uid()` directly)
   - `public.is_collection_owner(_collection_id uuid, _user_id uuid DEFAULT auth.uid())`
   - `public.get_invite_by_token(_token uuid)` for secure invite lookup

3. **Performance Optimization:**
   All `auth.uid()` references in RLS policies are wrapped as `(select auth.uid())`, forcing Postgres to evaluate user identity once per query execution plan instead of once per row scanned.

4. **User Profile Provisioning (current state):**
   `public.handle_new_user()` exists as a SECURITY DEFINER trigger function, but there is **no `on_auth_user_created` trigger on `auth.users`** in the live database. Automatic profile creation on signup is therefore not currently wired by DB trigger.

5. **Automatic RLS on new public tables:**
   Event trigger `ensure_rls` (`ddl_command_end`, enabled) calls `public.rls_auto_enable()`, which enables RLS for newly created tables in `public`.

6. **Security advisors (current):** Supabase advisors report public/`authenticated` execute warnings for SECURITY DEFINER functions (`get_invite_by_token`, `handle_new_user`, both `is_collection_member` overloads, `is_collection_owner`, `rls_auto_enable`) and that leaked password protection is disabled. These are environment-level findings to review separately from policy correctness.

---

## 2. Table-by-Table RLS Matrix

| Table                    | SELECT                                                        | INSERT                                               | UPDATE                                                | DELETE                                               |
| ------------------------ | ------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **`profiles`**           | All authenticated users                                       | Own user (`id = auth.uid()`)                         | Own user (`id = auth.uid()`)                          | Own user (`id = auth.uid()`)                         |
| **`collections`**        | Creator or Collection Member                                  | Creator (`created_by = auth.uid()`)                  | Creator or Collection Member                          | Creator (`created_by = auth.uid()`)                  |
| **`collection_members`** | Own row, Collection Member, or Collection Owner               | Self-join, Collection Owner, or Collection Member    | Own row or Collection Owner                           | Own row (leave) or Collection Owner (kick)           |
| **`connections`**        | `user_id` or `connected_user_id`                              | `user_id = auth.uid()`                               | `user_id = auth.uid()`                                | `user_id` or `connected_user_id`                     |
| **`collection_invites`** | Sender, Invitee, Email match, or Collection Member            | Sender & Collection Member                           | Sender, Invitee, Email match, or Collection Owner     | Sender or Collection Owner                           |
| **`expense_limits`**     | `user_id` or Collection Member (if limit has `collection_id`) | `user_id` (and member of collection if specified)    | `user_id`                                             | `user_id`                                            |
| **`expenses`**           | Own user (`user_id`) or Collection Member (if shared)         | Own user (`user_id`) & Collection Member (if shared) | Own user (`user_id`) or Collection Member (if shared) | Own user (`user_id`) or Collection Owner (if shared) |

---

## 3. Helper Functions & Triggers (live)

### `public.is_collection_member` (two-arg, primary)

```sql
CREATE OR REPLACE FUNCTION public.is_collection_member(_collection_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.collection_members
    WHERE collection_id = _collection_id
      AND user_id = _user_id
  );
$function$;
```

### `public.is_collection_member` (single-arg overload)

```sql
CREATE OR REPLACE FUNCTION public.is_collection_member(target_collection_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.collection_members cm
    WHERE cm.collection_id = target_collection_id
      AND cm.user_id = auth.uid()
  );
$function$;
```

### `public.is_collection_owner`

```sql
CREATE OR REPLACE FUNCTION public.is_collection_owner(_collection_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.collections
    WHERE id = _collection_id
      AND created_by = _user_id
  );
$function$;
```

### `public.get_invite_by_token`

```sql
CREATE OR REPLACE FUNCTION public.get_invite_by_token(_token uuid)
RETURNS SETOF collection_invites
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT * FROM public.collection_invites
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > NOW();
$function$;
```

### `public.handle_new_user` (function exists; trigger not installed)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, preferred_currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'USD')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;
```

**Live state:** no trigger on `auth.users` currently calls this function.

### `public.rls_auto_enable` (event trigger function)

```sql
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;
```

**Live event trigger:** `ensure_rls` on `ddl_command_end` executes `public.rls_auto_enable()` (enabled).

---

## 4. Rules & DB helpers

---

-- 1. SECURITY DEFINER HELPER FUNCTIONS (Avoid RLS Recursion & Boost Performance)

---

```sql
-- Helper to check if a user is a member of a collection
CREATE OR REPLACE FUNCTION public.is_collection_member(_collection_id UUID, _user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.collection_members
    WHERE collection_id = _collection_id
      AND user_id = _user_id
  );
$$;
```

```sql
-- Helper to check if a user is the owner/creator of a collection
CREATE OR REPLACE FUNCTION public.is_collection_owner(_collection_id UUID, _user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.collections
    WHERE id = _collection_id
      AND created_by = _user_id
  );
$$;
```

```sql
-- Helper to fetch active invite by token securely
CREATE OR REPLACE FUNCTION public.get_invite_by_token(_token UUID)
RETURNS SETOF public.collection_invites
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.collection_invites
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > NOW();
$$;
```

---

-- 2. AUTH.USERS TRIGGER FOR AUTOMATIC PROFILE CREATION (reference / not installed live)

---

```sql
-- Function exists live as public.handle_new_user(); trigger below is NOT currently present on auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, preferred_currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'USD')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
```

```sql
-- Intended (currently missing in live DB):
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

-- 3. ENABLE RLS ON ALL TABLES

---

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
```

---

-- 4. CLEANUP EXISTING POLICIES

---

```sql
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;
```

---

-- 5. RLS POLICIES FOR profiles

---

```sql
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (id = (select auth.uid()));
```

---

-- 6. RLS POLICIES FOR collections

---

```sql
CREATE POLICY "collections_select"
  ON public.collections FOR SELECT
  TO authenticated
  USING (
    created_by = (select auth.uid())
    OR public.is_collection_member(id, (select auth.uid()))
  );

CREATE POLICY "collections_insert"
  ON public.collections FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (select auth.uid()));

CREATE POLICY "collections_update"
  ON public.collections FOR UPDATE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    OR public.is_collection_member(id, (select auth.uid()))
  )
  WITH CHECK (
    created_by = (select auth.uid())
    OR public.is_collection_member(id, (select auth.uid()))
  );

CREATE POLICY "collections_delete"
  ON public.collections FOR DELETE
  TO authenticated
  USING (created_by = (select auth.uid()));
```

---

-- 7. RLS POLICIES FOR collection_members

---

```sql
CREATE POLICY "collection_members_select"
  ON public.collection_members FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_collection_member(collection_id, (select auth.uid()))
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  );

CREATE POLICY "collection_members_insert"
  ON public.collection_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    OR public.is_collection_owner(collection_id, (select auth.uid()))
    OR public.is_collection_member(collection_id, (select auth.uid()))
  );

CREATE POLICY "collection_members_update"
  ON public.collection_members FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  );

CREATE POLICY "collection_members_delete"
  ON public.collection_members FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  );
```

---

-- 8. RLS POLICIES FOR connections

---

```sql
CREATE POLICY "connections_select"
  ON public.connections FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR connected_user_id = (select auth.uid())
  );

CREATE POLICY "connections_insert"
  ON public.connections FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND user_id <> connected_user_id
  );

CREATE POLICY "connections_update"
  ON public.connections FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "connections_delete"
  ON public.connections FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR connected_user_id = (select auth.uid())
  );
```

---

-- 9. RLS POLICIES FOR collection_invites

---

```sql
CREATE POLICY "collection_invites_select"
  ON public.collection_invites FOR SELECT
  TO authenticated
  USING (
    invited_by = (select auth.uid())
    OR invitee_id = (select auth.uid())
    OR (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'))
    OR public.is_collection_member(collection_id, (select auth.uid()))
  );

CREATE POLICY "collection_invites_insert"
  ON public.collection_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = (select auth.uid())
    AND public.is_collection_member(collection_id, (select auth.uid()))
  );

CREATE POLICY "collection_invites_update"
  ON public.collection_invites FOR UPDATE
  TO authenticated
  USING (
    invited_by = (select auth.uid())
    OR invitee_id = (select auth.uid())
    OR (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'))
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  )
  WITH CHECK (
    invited_by = (select auth.uid())
    OR invitee_id = (select auth.uid())
    OR (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'))
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  );

CREATE POLICY "collection_invites_delete"
  ON public.collection_invites FOR DELETE
  TO authenticated
  USING (
    invited_by = (select auth.uid())
    OR public.is_collection_owner(collection_id, (select auth.uid()))
  );
```

---

-- 10. RLS POLICIES FOR expense_limits

---

```sql
CREATE POLICY "expense_limits_select"
  ON public.expense_limits FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (collection_id IS NOT NULL AND public.is_collection_member(collection_id, (select auth.uid())))
  );

CREATE POLICY "expense_limits_insert"
  ON public.expense_limits FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND (collection_id IS NULL OR public.is_collection_member(collection_id, (select auth.uid())))
  );

CREATE POLICY "expense_limits_update"
  ON public.expense_limits FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "expense_limits_delete"
  ON public.expense_limits FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
```

---

-- 11. RLS POLICIES FOR expenses

---

```sql
CREATE POLICY "expenses_select"
  ON public.expenses FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (collection_id IS NOT NULL AND public.is_collection_member(collection_id, (select auth.uid())))
  );

CREATE POLICY "expenses_insert"
  ON public.expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND (collection_id IS NULL OR public.is_collection_member(collection_id, (select auth.uid())))
  );

CREATE POLICY "expenses_update"
  ON public.expenses FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (collection_id IS NOT NULL AND public.is_collection_member(collection_id, (select auth.uid())))
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR (collection_id IS NOT NULL AND public.is_collection_member(collection_id, (select auth.uid())))
  );

CREATE POLICY "expenses_delete"
  ON public.expenses FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (collection_id IS NOT NULL AND public.is_collection_owner(collection_id, (select auth.uid())))
  );
```
