# Subagent review of current changes

**Session ID:** ses_ebe7f93a1ffehrV7JKarsmPPAL
**Created:** 10/16/2026, 1:38:17 AM
**Updated:** 10/16/2026, 1:53:54 AM

---

## User

Review our current changes with subagents. Check the correctness, cleanless and edge cases.

---

## Assistant (Plan · Big Pickle · 2.5s)

Let me start by understanding the current changes in the repo. I'll check git status and diff.</think>

**Tool: bash**

**Input:**

```json
{
  "command": "git status && echo \"---DIFF STAT---\" && git diff --stat && echo \"---STAGED---\" && git diff --cached --stat && echo \"---LOG---\" && git log --oneline -10"
}
```

**Output:**

```
On branch FEATURE-homepage-personal
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   .gitignore
	modified:   app/(app)/homepage/layout.tsx
	modified:   app/(app)/homepage/page.tsx
	modified:   app/globals.css
	new file:   components/add-expense-component/add-expense-component.tsx
	new file:   components/add-expense-component/add-expense-footer.tsx
	new file:   components/add-expense-component/add-expense-trigger.tsx
	modified:   components/app-sidebar/app-sidebar.tsx
	new file:   components/app-sidebar/profile-item.tsx
	new file:   components/app-sidebar/sidebar-item-skeleton.tsx
	new file:   components/currency-switcher.tsx
	new file:   components/expense-counter/expense-counter-skeleton.tsx
	new file:   components/expense-counter/expense-counter.tsx
	new file:   components/form-fields/date-picker.tsx
	renamed:    components/forms/form-field.tsx -> components/form-fields/form-input.tsx
	new file:   components/form-fields/types.ts
	new file:   components/forms/add-expense-form.tsx
	modified:   components/forms/create-user-form.tsx
	modified:   components/forms/forgot-password-form.tsx
	modified:   components/forms/login-form.tsx
	modified:   components/forms/register-form.tsx
	modified:   components/forms/update-password-form.tsx
	new file:   components/home-actions.tsx
	modified:   components/ui/button.tsx
	new file:   components/ui/calendar.tsx
	new file:   components/ui/dialog.tsx
	new file:   components/ui/drawer.tsx
	new file:   components/ui/popover.tsx
	new file:   docs/info/MVP-Architecture-Plan.md
	new file:   docs/info/Supabase-RLS-Policies.md
	new file:   docs/info/Xpensy-Database-Schema.md
	new file:   lib/actions/addExpense.ts
	new file:   lib/actions/getUserExpenses.ts
	new file:   lib/actions/getUserProfile.ts
	modified:   package.json
	modified:   pnpm-lock.yaml

---DIFF STAT---
---STAGED---
 .gitignore                                         |   3 -
 app/(app)/homepage/layout.tsx                      |   4 +-
 app/(app)/homepage/page.tsx                        |  37 +-
 app/globals.css                                    |  19 +
 .../add-expense-component.tsx                      |  70 +++
 .../add-expense-component/add-expense-footer.tsx   |  35 ++
 .../add-expense-component/add-expense-trigger.tsx  |  33 ++
 components/app-sidebar/app-sidebar.tsx             |  17 +-
 components/app-sidebar/profile-item.tsx            |  18 +
 components/app-sidebar/sidebar-item-skeleton.tsx   |   5 +
 components/currency-switcher.tsx                   | 101 ++++
 .../expense-counter/expense-counter-skeleton.tsx   |   5 +
 components/expense-counter/expense-counter.tsx     |  17 +
 components/form-fields/date-picker.tsx             |  57 +++
 .../form-field.tsx => form-fields/form-input.tsx}  |  20 +-
 components/form-fields/types.ts                    |   4 +
 components/forms/add-expense-form.tsx              |  89 ++++
 components/forms/create-user-form.tsx              |   9 +-
 components/forms/forgot-password-form.tsx          |   8 +-
 components/forms/login-form.tsx                    |  10 +-
 components/forms/register-form.tsx                 |  12 +-
 components/forms/update-password-form.tsx          |   8 +-
 components/home-actions.tsx                        |  22 +
 components/ui/button.tsx                           |   5 +-
 components/ui/calendar.tsx                         | 223 +++++++++
 components/ui/dialog.tsx                           | 166 +++++++
 components/ui/drawer.tsx                           | 133 ++++++
 components/ui/popover.tsx                          |  88 ++++
 docs/info/MVP-Architecture-Plan.md                 | 183 ++++++++
 docs/info/Supabase-RLS-Policies.md                 | 521 +++++++++++++++++++++
 docs/info/Xpensy-Database-Schema.md                | 274 +++++++++++
 lib/actions/addExpense.ts                          | 101 ++++
 lib/actions/getUserExpenses.ts                     |  27 ++
 lib/actions/getUserProfile.ts                      |  26 +
 package.json                                       |   6 +-
 pnpm-lock.yaml                                     | 401 ++++++++++++----
 36 files changed, 2595 insertions(+), 162 deletions(-)
---LOG---
c81ded7 FEATURE: Creating user record in profiles after preferences page
9a8b279 HOMEPAGE: Added sidebar
8e245ef HOMEPAGE: Added import order lint rule
02e9264 HOMEPAGE: Clean up & migrated to server action
0cdb0f2 HOMEPAGE: Simplified landing
ee96821 HOMEPAGE: Migrated to tailwind 4 & Added app styling
463a57a HOMEPAGE: Created routing groups
430225c FIX: Removed redundant types and fixed uncached data
918164f Merge pull request #25 from TSlashDreamy/INIT-tests-config
afa6b34 INIT: Configured vitest for unit testing. Added pre-push step for husky

```

---

## Assistant (Plan · Big Pickle · 4.3s)

Let me look at the codebase structure and the changes. Let me gather context first. Let me look at the key files. Let me get the full diff of the important logic files and understand the project structure.</think>Let me gather context on the project structure and key changes.

**Tool: bash**

**Input:**

```json
{
  "command": "cat package.json && echo \"---\" && ls -la && echo \"---STRUCTURE---\" && find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/.next/*' | head -60"
}
```

**Output:**

```
{
  "private": true,
  "packageManager": "pnpm@11.0.9",
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "dev": "next dev --webpack",
    "dev:fast": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "prettier": "pnpm exec prettier . --write",
    "prepare": "husky",
    "test": "vitest --run"
  },
  "dependencies": {
    "@base-ui/react": "^1.6.0",
    "@radix-ui/react-checkbox": "^1.3.1",
    "@radix-ui/react-dropdown-menu": "^2.1.14",
    "@radix-ui/react-label": "^2.1.6",
    "@radix-ui/react-slot": "^1.2.2",
    "@remixicon/react": "^4.9.0",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cn": "^0.2.6",
    "date-fns": "^4.4.0",
    "next": "latest",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.6.2",
    "react": "^19.0.0",
    "react-day-picker": "^10.0.2",
    "react-dom": "^19.0.0",
    "shadcn": "^4.13.1",
    "tailwind-merge": "^3.3.0",
    "vaul": "^1.1.2",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4.3.3",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^9",
    "eslint-config-next": "15.3.1",
    "eslint-plugin-import": "^2.32.0",
    "husky": "^9.1.7",
    "jsdom": "^29.1.1",
    "postcss": "^8",
    "prettier": "3.9.4",
    "tailwindcss": "^4.3.3",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5",
    "vitest": "^4.1.10"
  }
}
---
total 1584
drwxr-xr-x@ 33 tslashdreamy  staff    1056 Oct 15 23:34 .
drwx------+  9 tslashdreamy  staff     288 Oct 12 22:33 ..
drwxr-xr-x@  2 tslashdreamy  staff      64 Jul  7 01:41 .cursor
-rw-r--r--@  1 tslashdreamy  staff    8196 Aug 24 01:30 .DS_Store
-rw-r--r--@  1 tslashdreamy  staff     150 Jul  7 00:43 .env
-rw-r--r--@  1 tslashdreamy  staff     233 Jul  5 01:49 .env.example
drwxr-xr-x@ 17 tslashdreamy  staff     544 Oct 16 01:38 .git
-rw-r--r--@  1 tslashdreamy  staff     491 Oct 14 00:55 .gitignore
drwxr-xr-x@  5 tslashdreamy  staff     160 Jul 14 01:23 .husky
drwxr-xr-x@ 25 tslashdreamy  staff     800 Jul 22 22:27 .next
-rw-r--r--@  1 tslashdreamy  staff     169 Jul  8 01:03 .prettierignore
drwxr-xr-x@  7 tslashdreamy  staff     224 Jul 21 01:36 app
drwxr-xr-x@ 15 tslashdreamy  staff     480 Oct 16 00:31 components
-rw-r--r--@  1 tslashdreamy  staff     520 Jul 21 01:36 components.json
drwxr-xr-x@  5 tslashdreamy  staff     160 Jul 27 22:11 docs
-rw-r--r--@  1 tslashdreamy  staff    1844 Jul 21 01:36 eslint.config.mjs
drwxr-xr-x@  3 tslashdreamy  staff      96 Jul 21 01:36 hooks
drwxr-xr-x@  5 tslashdreamy  staff     160 Jul 22 23:54 lib
-rw-r--r--@  1 tslashdreamy  staff   35149 Jul  5 01:49 LICENSE
-rw-r--r--@  1 tslashdreamy  staff     251 Jul 22 22:34 next-env.d.ts
-rw-r--r--@  1 tslashdreamy  staff     130 Jul  5 01:49 next.config.ts
drwxr-xr-x@ 42 tslashdreamy  staff    1344 Oct 15 01:12 node_modules
-rw-r--r--@  1 tslashdreamy  staff    1729 Oct 15 01:12 package.json
-rw-r--r--@  1 tslashdreamy  staff  354183 Oct 15 01:12 pnpm-lock.yaml
-rw-r--r--@  1 tslashdreamy  staff      49 Jul  5 01:49 pnpm-workspace.yaml
-rw-r--r--@  1 tslashdreamy  staff     146 Jul 21 01:36 postcss.config.mjs
-rw-r--r--@  1 tslashdreamy  staff     625 Jul 27 22:35 proxy.ts
drwxr-xr-x@  3 tslashdreamy  staff      96 Jul 22 00:31 public
-rw-r--r--@  1 tslashdreamy  staff     719 Jul 14 01:22 tsconfig.json
-rw-r--r--@  1 tslashdreamy  staff  336471 Aug 24 00:10 tsconfig.tsbuildinfo
-rw-r--r--@  1 tslashdreamy  staff      93 Jul 14 01:22 vitest-env.d.ts
-rw-r--r--@  1 tslashdreamy  staff     268 Jul 21 01:36 vitest.config.mts
-rw-r--r--@  1 tslashdreamy  staff      43 Jul 14 01:22 vitest.setup.ts
---STRUCTURE---
.
./.husky
./.husky/_
./.cursor
./app
./app/(app)
./app/(app)/homepage
./app/(landing)
./app/(landing)/auth
./app/(landing)/auth/register
./app/(landing)/auth/register/preferences
./app/(landing)/auth/register/success
./app/(landing)/auth/update-password
./app/(landing)/auth/forgot-password
./app/(landing)/auth/callback
./app/(landing)/auth/error
./app/(landing)/auth/error/__tests__
./app/(landing)/auth/login
./node_modules
./docs
./docs/info
./docs/assets
./.next
./components
./components/ui
./components/app-sidebar
./components/forms
./components/expense-counter
./components/form-fields
./components/add-expense-component
./public
./hooks
./lib
./lib/supabase
./lib/actions
./.git

```

---

## Assistant (Plan · Big Pickle · 1.7s)

Let me read the key changed files. I'll dispatch subagents to review different areas in parallel. But first, let me gather the diffs myself. Let me read the important logic files.

Let me read the new/changed files in full. Let me get the git diff for modified files and read the new files.</think>Let me read the core new logic files and diffs in parallel.

**Tool: bash**

**Input:**

```json
{
  "command": "git diff --cached -- app/ components/ lib/ .gitignore | head -1200"
}
```

**Output:**

```
diff --git a/.gitignore b/.gitignore
index b26acc5..f1631b0 100644
--- a/.gitignore
+++ b/.gitignore
@@ -40,6 +40,3 @@ yarn-error.log*
 # typescript
 *.tsbuildinfo
 next-env.d.ts
-
-# docs
-/docs/info
diff --git a/app/(app)/homepage/layout.tsx b/app/(app)/homepage/layout.tsx
index f091e53..1afe3a1 100644
--- a/app/(app)/homepage/layout.tsx
+++ b/app/(app)/homepage/layout.tsx
@@ -9,9 +9,7 @@ export default function ProtectedLayout({
   return (
     <SidebarProvider defaultOpen={false}>
       <AppSidebar />
-      <main className="min-h-screen w-full flex flex-col items-center">
-        {children}
-      </main>
+      <main className="m-12 w-full">{children}</main>
     </SidebarProvider>
   );
 }
diff --git a/app/(app)/homepage/page.tsx b/app/(app)/homepage/page.tsx
index 5519824..1ebddc9 100644
--- a/app/(app)/homepage/page.tsx
+++ b/app/(app)/homepage/page.tsx
@@ -1,28 +1,25 @@
-import { redirect } from "next/navigation";
+import { RiFoldersLine as CollectionsIcon } from "@remixicon/react";
 import { Suspense } from "react";

-import { createClient } from "@/lib/supabase/server";
-
-async function UserDetails() {
-  const supabase = await createClient();
-  const { data, error } = await supabase.auth.getClaims();
-
-  if (error || !data?.claims) {
-    redirect("/auth/login");
-  }
-
-  return JSON.stringify(data.claims, null, 2);
-}
+import ExpenseCounter from "@/components/expense-counter/expense-counter";
+import ExpenseCounterSkeleton from "@/components/expense-counter/expense-counter-skeleton";
+import HomeActions from "@/components/home-actions";
+import { Button } from "@/components/ui/button";

 export default function Homepage() {
   return (
-    <div className="w-full flex flex-col flex-1 items-center gap-2 p-4">
-      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
-      <pre className="w-full max-w-5xl text-xs font-mono p-3 rounded border overflow-auto">
-        <Suspense>
-          <UserDetails />
+    <>
+      <div className="w-full flex justify-end">
+        <Button data-icon="inline-start" variant="secondary">
+          <CollectionsIcon /> Personal expenses
+        </Button>
+      </div>
+      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
+        <Suspense fallback={<ExpenseCounterSkeleton />}>
+          <ExpenseCounter />
         </Suspense>
-      </pre>
-    </div>
+        <HomeActions />
+      </div>
+    </>
   );
 }
diff --git a/app/globals.css b/app/globals.css
index cb9a8a3..a721c5b 100644
--- a/app/globals.css
+++ b/app/globals.css
@@ -57,6 +57,11 @@ body {
   --radius-2xl: calc(var(--radius) * 1.8);
   --radius-3xl: calc(var(--radius) * 2.2);
   --radius-4xl: calc(var(--radius) * 2.6);
+
+  --text-counter: 3rem;
+  --text-counter--line-height: 1em;
+  --text-counter--font-weight: bolder;
+  --text-counter--letter-spacing: -1.2%;
 }

 :root {
@@ -166,3 +171,17 @@ body {
   --sidebar-border: oklch(1 0 0 / 10%);
   --sidebar-ring: oklch(0.556 0 0);
 }
+
+/* Overrides */
+/* Chrome, Safari, Edge, Opera */
+input::-webkit-outer-spin-button,
+input::-webkit-inner-spin-button {
+  -webkit-appearance: none;
+  margin: 0;
+}
+
+/* Firefox */
+input[type=number] {
+  -moz-appearance: textfield;
+  appearance: textfield;
+}
diff --git a/components/add-expense-component/add-expense-component.tsx b/components/add-expense-component/add-expense-component.tsx
new file mode 100644
index 0000000..5972e28
--- /dev/null
+++ b/components/add-expense-component/add-expense-component.tsx
@@ -0,0 +1,70 @@
+"use client";
+
+import React from "react";
+
+import {
+  Dialog,
+  DialogContent,
+  DialogDescription,
+  DialogHeader,
+  DialogTitle,
+} from "@/components/ui/dialog";
+import {
+  Drawer,
+  DrawerContent,
+  DrawerDescription,
+  DrawerHeader,
+  DrawerTitle,
+} from "@/components/ui/drawer";
+import { useIsMobile } from "@/hooks/use-mobile";
+
+import AddExpenseTrigger from "./add-expense-trigger";
+import AddExpenseForm from "../forms/add-expense-form";
+
+export default function AddExpense() {
+  const [isOpened, setIsOpened] = React.useState(false);
+  const isMobile = useIsMobile();
+
+  const handleSuccess = React.useCallback(() => setIsOpened(false), []);
+
+  if (isMobile) {
+    return (
+      <Drawer open={isOpened} onOpenChange={setIsOpened}>
+        <AddExpenseTrigger isMobileView />
+        <DrawerContent>
+          <div className="mx-auto w-full max-w-sm">
+            <DrawerHeader>
+              <DrawerTitle>Add expense</DrawerTitle>
+              <DrawerDescription>
+                Enter the amount and pick a currency
+              </DrawerDescription>
+            </DrawerHeader>
+
+            <div className="px-4 flex flex-col items-center justify-center text-center">
+              <div className="w-full">
+                <AddExpenseForm isMobileView onSuccess={handleSuccess} />
+              </div>
+            </div>
+          </div>
+        </DrawerContent>
+      </Drawer>
+    );
+  }
+
+  return (
+    <Dialog open={isOpened} onOpenChange={setIsOpened}>
+      <AddExpenseTrigger />
+      <DialogContent>
+        <DialogHeader>
+          <DialogTitle>Add expense</DialogTitle>
+          <DialogDescription>
+            Enter the amount and pick a currency
+          </DialogDescription>
+        </DialogHeader>
+        <div className="text-center">
+          <AddExpenseForm onSuccess={handleSuccess} />
+        </div>
+      </DialogContent>
+    </Dialog>
+  );
+}
diff --git a/components/add-expense-component/add-expense-footer.tsx b/components/add-expense-component/add-expense-footer.tsx
new file mode 100644
index 0000000..ab88636
--- /dev/null
+++ b/components/add-expense-component/add-expense-footer.tsx
@@ -0,0 +1,35 @@
+import { Button } from "@/components/ui/button";
+import { DialogClose, DialogFooter } from "@/components/ui/dialog";
+import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
+
+interface AddExpenseFooterProps {
+  isAdding: boolean;
+  isMobileView: boolean;
+}
+
+export default function AddExpenseFooter({ isAdding, isMobileView }: AddExpenseFooterProps) {
+
+  if (isMobileView) {
+    return (
+      <DrawerFooter className="px-0">
+        <Button type="submit" className="w-full" disabled={isAdding}>
+          {isAdding ? "Saving..." : "Add"}
+        </Button>
+        <DrawerClose asChild>
+          <Button variant="outline">Cancel</Button>
+        </DrawerClose>
+      </DrawerFooter>
+    );
+  }
+
+  return (
+    <DialogFooter>
+      <Button type="submit" disabled={isAdding}>
+        {isAdding ? "Saving..." : "Add"}
+      </Button>
+      <DialogClose asChild>
+        <Button variant="outline">Cancel</Button>
+      </DialogClose>
+    </DialogFooter>
+  );
+}
diff --git a/components/add-expense-component/add-expense-trigger.tsx b/components/add-expense-component/add-expense-trigger.tsx
new file mode 100644
index 0000000..7aa4499
--- /dev/null
+++ b/components/add-expense-component/add-expense-trigger.tsx
@@ -0,0 +1,33 @@
+"use client";
+
+import { RiAddLine as AddIcon } from "@remixicon/react";
+
+import { Button } from "@/components/ui/button";
+import { DialogTrigger } from "@/components/ui/dialog";
+import { DrawerTrigger } from "@/components/ui/drawer";
+
+interface AddExpenseTriggerProps {
+  isMobileView?: boolean;
+}
+
+export default function AddExpenseTrigger({
+  isMobileView,
+}: AddExpenseTriggerProps) {
+  if (isMobileView) {
+    return (
+      <DrawerTrigger asChild>
+        <Button className="rounded-full size-10" variant="outline">
+          <AddIcon className="size-4" />
+        </Button>
+      </DrawerTrigger>
+    );
+  }
+
+  return (
+    <DialogTrigger asChild>
+      <Button className="rounded-full size-10" variant="outline">
+        <AddIcon className="size-4" />
+      </Button>
+    </DialogTrigger>
+  );
+}
diff --git a/components/app-sidebar/app-sidebar.tsx b/components/app-sidebar/app-sidebar.tsx
index bc6b3dc..4cb20d5 100644
--- a/components/app-sidebar/app-sidebar.tsx
+++ b/components/app-sidebar/app-sidebar.tsx
@@ -1,5 +1,6 @@
-import { RiUser2Fill, RiSettings3Line as SettingsIcon } from "@remixicon/react";
+import { RiSettings3Line as SettingsIcon } from "@remixicon/react";
 import Link from "next/link";
+import { Suspense } from "react";

 import {
   Sidebar,
@@ -15,10 +16,12 @@ import {
 } from "@/components/ui/sidebar";

 import { sidebarMenuItems } from "./constants";
-import { ThemeSwitcher } from "../theme-switcher";
 import { NavigationLink } from "./navigation-link";
+import ProfileItem from "./profile-item";
+import { ThemeSwitcher } from "../theme-switcher";
+import SidebarItemSkeleton from "./sidebar-item-skeleton";

-export function AppSidebar() {
+export async function AppSidebar() {
   return (
     <Sidebar collapsible="icon">
       <SidebarHeader>
@@ -54,11 +57,9 @@ export function AppSidebar() {
               </Link>
             </SidebarMenuButton>
           </SidebarMenuItem>
-          <SidebarMenuItem>
-            <SidebarMenuButton>
-              <RiUser2Fill /> Username
-            </SidebarMenuButton>
-          </SidebarMenuItem>
+          <Suspense fallback={<SidebarItemSkeleton />}>
+            <ProfileItem />
+          </Suspense>
           {/* TODO: Remove theme switcher */}
           <ThemeSwitcher />
         </SidebarMenu>
diff --git a/components/app-sidebar/profile-item.tsx b/components/app-sidebar/profile-item.tsx
new file mode 100644
index 0000000..b73e50e
--- /dev/null
+++ b/components/app-sidebar/profile-item.tsx
@@ -0,0 +1,18 @@
+import { RiUser2Fill as UserIcon } from "@remixicon/react";
+
+import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
+import { getUserProfile } from "@/lib/actions/getUserProfile";
+
+export default async function ProfileItem() {
+  const profile = await getUserProfile();
+
+  if (!profile) return;
+
+  return (
+    <SidebarMenuItem>
+      <SidebarMenuButton>
+        <UserIcon /> {profile.display_name}
+      </SidebarMenuButton>
+    </SidebarMenuItem>
+  );
+}
diff --git a/components/app-sidebar/sidebar-item-skeleton.tsx b/components/app-sidebar/sidebar-item-skeleton.tsx
new file mode 100644
index 0000000..84530ea
--- /dev/null
+++ b/components/app-sidebar/sidebar-item-skeleton.tsx
@@ -0,0 +1,5 @@
+import { Skeleton } from "@/components/ui/skeleton";
+
+export default function SidebarItemSkeleton() {
+  return <Skeleton className="h-8 w-full" />;
+}
diff --git a/components/currency-switcher.tsx b/components/currency-switcher.tsx
new file mode 100644
index 0000000..e0d78a7
--- /dev/null
+++ b/components/currency-switcher.tsx
@@ -0,0 +1,101 @@
+"use client";
+
+import React from "react";
+
+import { Button } from "@/components/ui/button";
+import {
+  DropdownMenu,
+  DropdownMenuContent,
+  DropdownMenuRadioGroup,
+  DropdownMenuRadioItem,
+  DropdownMenuTrigger,
+} from "@/components/ui/dropdown-menu";
+
+// TODO: Replace mocked list with an external API
+export const mockedCurrencyList = {
+  USD: { symbol: "$", flag: "🇺🇸" },
+  UAH: { symbol: "₴", flag: "🇺🇦" },
+  EUR: { symbol: "€", flag: "🇪🇺" },
+  RUB: { symbol: "₽", flag: "🇷🇺" },
+};
+
+export type CurrencyCode = keyof typeof mockedCurrencyList;
+
+interface CurrencySwitcherProps {
+  variant?: "symbol" | "code" | "flag";
+  name?: string;
+  defaultValue?: string;
+  onCurrencyChange?: (currency: CurrencyCode) => void;
+}
+
+const isCurrencyCode = (value: string): value is CurrencyCode =>
+  value in mockedCurrencyList;
+
+export function CurrencySwitcher({
+  variant = "symbol",
+  name,
+  defaultValue,
+  onCurrencyChange,
+}: CurrencySwitcherProps) {
+  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
+
+  const presentation = React.useMemo(() => {
+    switch (variant) {
+      case "code":
+        return (
+          <span className="text-[0.70rem] text-muted-foreground uppercase">
+            {currency}
+          </span>
+        );
+      case "symbol":
+        return (
+          <span className="text-2xl">
+            {mockedCurrencyList[currency].symbol}
+          </span>
+        );
+      case "flag":
+        return mockedCurrencyList[currency].flag;
+      default:
+        throw new Error(`${variant} is not a supported currency variant`);
+    }
+  }, [variant, currency]);
+
+  const setNewCurrency = (selectedCurrency: string) => {
+    if (isCurrencyCode(selectedCurrency)) {
+      setCurrency(selectedCurrency);
+
+      if (onCurrencyChange) onCurrencyChange(selectedCurrency);
+    }
+  };
+
+  return (
+    <>
+      <input type="hidden" name={name} value={currency} defaultValue={defaultValue} />
+      <DropdownMenu>
+        <DropdownMenuTrigger asChild>
+          <Button variant="ghost" size="icon-xl">
+            {presentation}
+          </Button>
+        </DropdownMenuTrigger>
+        <DropdownMenuContent className="w-content" align="start">
+          <DropdownMenuRadioGroup
+            value={currency}
+            onValueChange={setNewCurrency}
+          >
+            {Object.entries(mockedCurrencyList).map(
+              ([currencyCode, currencyDetails]) => (
+                <DropdownMenuRadioItem
+                  className="flex gap-2"
+                  key={currencyCode}
+                  value={currencyCode}
+                >
+                  <span>{`${currencyDetails.flag} ${currencyCode}`}</span>
+                </DropdownMenuRadioItem>
+              ),
+            )}
+          </DropdownMenuRadioGroup>
+        </DropdownMenuContent>
+      </DropdownMenu>
+    </>
+  );
+}
diff --git a/components/expense-counter/expense-counter-skeleton.tsx b/components/expense-counter/expense-counter-skeleton.tsx
new file mode 100644
index 0000000..776f3d4
--- /dev/null
+++ b/components/expense-counter/expense-counter-skeleton.tsx
@@ -0,0 +1,5 @@
+import { Skeleton } from "@/components/ui/skeleton";
+
+export default function ExpenseCounterSkeleton() {
+  return <Skeleton className="h-11 w-2xs" />;
+}
diff --git a/components/expense-counter/expense-counter.tsx b/components/expense-counter/expense-counter.tsx
new file mode 100644
index 0000000..f74bb5e
--- /dev/null
+++ b/components/expense-counter/expense-counter.tsx
@@ -0,0 +1,17 @@
+import { getUserExpenses } from "@/lib/actions/getUserExpenses";
+
+import { CurrencySwitcher } from "../currency-switcher";
+
+export default async function ExpenseCounter() {
+  const expensesData = await getUserExpenses();
+
+  // TODO: This is not enough. We should convert currency and only then sum everything
+  const expenses = expensesData?.reduce((expensesSum, currentExpense) => expensesSum + currentExpense.amount, 0) || 0;
+
+  return (
+    <div className="flex items-center gap-1">
+      <CurrencySwitcher />
+      <span className="text-counter">{expenses}</span>
+    </div>
+  );
+}
diff --git a/components/form-fields/date-picker.tsx b/components/form-fields/date-picker.tsx
new file mode 100644
index 0000000..6a62d88
--- /dev/null
+++ b/components/form-fields/date-picker.tsx
@@ -0,0 +1,57 @@
+"use client";
+
+import { RiCalendar2Line as CalendarIcon } from "@remixicon/react";
+import { format } from "date-fns/format";
+import React from "react";
+
+import { Button } from "@/components/ui/button";
+import { Calendar } from "@/components/ui/calendar";
+import {
+  Popover,
+  PopoverContent,
+  PopoverTrigger,
+} from "@/components/ui/popover";
+
+import FormInput from "./form-input";
+
+import type { FormFieldProps } from "./types";
+
+export function DatePicker({
+  error,
+  label,
+  id,
+  defaultValue,
+  ...other
+}: FormFieldProps) {
+  const [date, setDate] = React.useState<Date | undefined>(() =>
+    defaultValue ? new Date(String(defaultValue)) : undefined,
+  );
+
+  return (
+    <div>
+      <FormInput
+        type="hidden"
+        defaultValue={date ? format(date, "yyyy-MM-dd") : undefined}
+        error={error}
+        id={id}
+        label={label}
+        {...other}
+      />
+      <Popover>
+        <PopoverTrigger asChild>
+          <Button
+            variant="outline"
+            data-empty={!date}
+            className="w-full mt-2 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
+          >
+            <CalendarIcon />
+            {date ? format(date, "PPP") : <span>Pick a date</span>}
+          </Button>
+        </PopoverTrigger>
+        <PopoverContent className="w-auto p-0">
+          <Calendar mode="single" selected={date} onSelect={setDate} />
+        </PopoverContent>
+      </Popover>
+    </div>
+  );
+}
diff --git a/components/forms/form-field.tsx b/components/form-fields/form-input.tsx
similarity index 50%
rename from components/forms/form-field.tsx
rename to components/form-fields/form-input.tsx
index d3f30b5..0053823 100644
--- a/components/forms/form-field.tsx
+++ b/components/form-fields/form-input.tsx
@@ -1,14 +1,9 @@
-import React from "react";
-
 import { Field, FieldError, FieldLabel } from "@/components/ui/field";
 import { Input } from "@/components/ui/input";

-interface FormFieldProps extends React.ComponentProps<"input"> {
-  error: { errors: string[] } | undefined;
-  label: string | React.ReactElement;
-}
+import type { FormFieldProps } from "./types";

-export default function FormField({
+export default function FormInput({
   error,
   label,
   id,
@@ -16,11 +11,12 @@ export default function FormField({
 }: FormFieldProps) {
   return (
     <Field>
-      {typeof label === "string" ? (
-        <FieldLabel htmlFor={id}>{label}</FieldLabel>
-      ) : (
-        label
-      )}
+      {label &&
+        (typeof label === "string" ? (
+          <FieldLabel htmlFor={id}>{label}</FieldLabel>
+        ) : (
+          label
+        ))}
       <Input aria-invalid={Boolean(error?.errors.length)} {...other} />
       <FieldError>{error?.errors.join(",\n")}</FieldError>
     </Field>
diff --git a/components/form-fields/types.ts b/components/form-fields/types.ts
new file mode 100644
index 0000000..c197b48
--- /dev/null
+++ b/components/form-fields/types.ts
@@ -0,0 +1,4 @@
+export interface FormFieldProps extends React.ComponentProps<"input"> {
+  error: { errors: string[] } | undefined;
+  label?: string | React.ReactElement;
+}
diff --git a/components/forms/add-expense-form.tsx b/components/forms/add-expense-form.tsx
new file mode 100644
index 0000000..2b2d7ee
--- /dev/null
+++ b/components/forms/add-expense-form.tsx
@@ -0,0 +1,89 @@
+"use client";
+
+import React from "react";
+
+import FormInput from "@/components/form-fields/form-input";
+import { Field, FieldError, FieldGroup } from "@/components/ui/field";
+import { addExpenseAction } from "@/lib/actions/addExpense";
+import type { AddExpenseState } from "@/lib/actions/addExpense";
+
+import AddExpenseFooter from "../add-expense-component/add-expense-footer";
+import { CurrencySwitcher } from "../currency-switcher";
+import { DatePicker } from "../form-fields/date-picker";
+
+interface AddExpenseFormProps {
+  onSuccess: () => void;
+  isMobileView?: boolean;
+}
+
+export default function AddExpenseForm({
+  onSuccess,
+  isMobileView = false,
+}: AddExpenseFormProps) {
+  const initialState: AddExpenseState = {
+    message: null,
+    error: {},
+    values: {},
+  };
+  const [state, formAction, isPending] = React.useActionState(
+    addExpenseAction,
+    initialState,
+  );
+
+  React.useEffect(() => {
+    if (state.success) onSuccess();
+  }, [state, onSuccess]);
+
+  return (
+    <form action={formAction}>
+      <FieldGroup>
+        <div>
+          <FormInput
+            id="expenseAmount"
+            name="expenseAmount"
+            className="h-auto py-0 field-sizing-content bg-transparent! border-none ring-0! text-7xl! font-bold text-center tracking-tighter"
+            placeholder="0"
+            type="number"
+            defaultValue={state.values?.expenseAmount}
+            error={state.error?.expenseAmount}
+            required
+          />
+          <CurrencySwitcher
+            name="expenseCurrency"
+            defaultValue={state.values?.expenseCurrency}
+            variant="symbol"
+          />
+        </div>
+        <FormInput
+          id="expenseDescription"
+          name="expenseDescription"
+          label="Description"
+          placeholder="A phone for my girlfriend"
+          defaultValue={state.values?.expenseDescription}
+          error={state.error?.expenseDescription}
+        />
+        <FormInput
+          id="expenseCategory"
+          name="expenseCategory"
+          label="Category"
+          placeholder="Gift"
+          defaultValue={state.values?.expenseCategory}
+          error={state.error?.expenseCategory}
+          required
+        />
+        <DatePicker
+          id="expenseDate"
+          name="expenseDate"
+          label="Date"
+          defaultValue={state.values?.expenseDate?.toDateString()}
+          error={state.error?.expenseDate}
+          required
+        />
+        <Field>
+          <AddExpenseFooter isMobileView={isMobileView} isAdding={isPending} />
+          <FieldError>{state.message}</FieldError>
+        </Field>
+      </FieldGroup>
+    </form>
+  );
+}
diff --git a/components/forms/create-user-form.tsx b/components/forms/create-user-form.tsx
index 1e7fd4b..f72919b 100644
--- a/components/forms/create-user-form.tsx
+++ b/components/forms/create-user-form.tsx
@@ -1,8 +1,8 @@
 "use client";

-import { useActionState } from "react";
+import React from "react";

-import FormField from "@/components/forms/form-field";
+import FormInput from "@/components/form-fields/form-input";
 import { Button } from "@/components/ui/button";
 import {
   Card,
@@ -35,13 +35,14 @@ export function CreateUserForm({
   className,
   ...props
 }: React.ComponentPropsWithoutRef<"div">) {
+  // TODO: Replace temp currency with a list from an external API
   const tempItems = ["USD", "UAH", "RUB"];
   const initialState: CreateUserState = {
     message: null,
     error: {},
     values: {},
   };
-  const [state, formAction, isPending] = useActionState(
+  const [state, formAction, isPending] = React.useActionState(
     createUserAction,
     initialState,
   );
@@ -59,7 +60,7 @@ export function CreateUserForm({
         <CardContent>
           <form action={formAction}>
             <FieldGroup>
-              <FormField
+              <FormInput
                 id="display-name"
                 name="display_name"
                 type="text"
diff --git a/components/forms/forgot-password-form.tsx b/components/forms/forgot-password-form.tsx
index 6fde6de..27c9f11 100644
--- a/components/forms/forgot-password-form.tsx
+++ b/components/forms/forgot-password-form.tsx
@@ -1,7 +1,7 @@
 "use client";

 import Link from "next/link";
-import { useActionState } from "react";
+import React from "react";

 import { Button } from "@/components/ui/button";
 import {
@@ -18,7 +18,7 @@ import {
 } from "@/lib/actions/resetPassword";
 import { cn } from "@/lib/utils";

-import FormField from "./form-field";
+import FormInput from "../form-fields/form-input";

 export function ForgotPasswordForm({
   className,
@@ -30,7 +30,7 @@ export function ForgotPasswordForm({
     values: {},
     success: false,
   };
-  const [state, formAction, isPending] = useActionState(
+  const [state, formAction, isPending] = React.useActionState(
     resetPasswordAction,
     initialState,
   );
@@ -62,7 +62,7 @@ export function ForgotPasswordForm({
           <CardContent>
             <form action={formAction}>
               <FieldGroup>
-                <FormField
+                <FormInput
                   id="email"
                   name="email"
                   type="email"
diff --git a/components/forms/login-form.tsx b/components/forms/login-form.tsx
index a69818e..d2d2667 100644
--- a/components/forms/login-form.tsx
+++ b/components/forms/login-form.tsx
@@ -1,9 +1,9 @@
 "use client";

 import Link from "next/link";
-import { useActionState } from "react";
+import React from "react";

-import FormField from "@/components/forms/form-field";
+import FormInput from "@/components/form-fields/form-input";
 import { Button } from "@/components/ui/button";
 import {
   Card,
@@ -26,7 +26,7 @@ export function LoginForm({
   ...props
 }: React.ComponentPropsWithoutRef<"div">) {
   const initialState: LoginState = { message: null, error: {}, values: {} };
-  const [state, formAction, isPending] = useActionState(
+  const [state, formAction, isPending] = React.useActionState(
     loginAction,
     initialState,
   );
@@ -43,7 +43,7 @@ export function LoginForm({
         <CardContent>
           <form action={formAction}>
             <FieldGroup>
-              <FormField
+              <FormInput
                 id="email"
                 name="email"
                 type="email"
@@ -53,7 +53,7 @@ export function LoginForm({
                 error={state.error?.email}
                 required
               />
-              <FormField
+              <FormInput
                 id="password"
                 name="password"
                 type="password"
diff --git a/components/forms/register-form.tsx b/components/forms/register-form.tsx
index eea0857..33a8cf9 100644
--- a/components/forms/register-form.tsx
+++ b/components/forms/register-form.tsx
@@ -1,9 +1,9 @@
 "use client";

 import Link from "next/link";
-import { useActionState } from "react";
+import React from "react";

-import FormField from "@/components/forms/form-field";
+import FormInput from "@/components/form-fields/form-input";
 import { Button } from "@/components/ui/button";
 import {
   Card,
@@ -21,7 +21,7 @@ export function RegisterForm({
   ...props
 }: React.ComponentPropsWithoutRef<"div">) {
   const initialState: RegisterState = { message: null, error: {}, values: {} };
-  const [state, formAction, isPending] = useActionState(
+  const [state, formAction, isPending] = React.useActionState(
     registerAction,
     initialState,
   );
@@ -36,7 +36,7 @@ export function RegisterForm({
         <CardContent>
           <form action={formAction}>
             <FieldGroup>
-              <FormField
+              <FormInput
                 id="email"
                 name="email"
                 type="email"
@@ -46,7 +46,7 @@ export function RegisterForm({
                 error={state.error?.email}
                 required
               />
-              <FormField
+              <FormInput
                 id="password"
                 name="password"
                 type="password"
@@ -55,7 +55,7 @@ export function RegisterForm({
                 error={state.error?.password}
                 required
               />
-              <FormField
+              <FormInput
                 id="repeat-password"
                 name="repeatPassword"
                 type="password"
diff --git a/components/forms/update-password-form.tsx b/components/forms/update-password-form.tsx
index 5307cb8..3f710f4 100644
--- a/components/forms/update-password-form.tsx
+++ b/components/forms/update-password-form.tsx
@@ -1,6 +1,6 @@
 "use client";

-import { useActionState } from "react";
+import React from "react";

 import { Button } from "@/components/ui/button";
 import {
@@ -17,7 +17,7 @@ import {
 } from "@/lib/actions/updatePassword";
 import { cn } from "@/lib/utils";

-import FormField from "./form-field";
+import FormInput from "../form-fields/form-input";

 export function UpdatePasswordForm({
   className,
@@ -28,7 +28,7 @@ export function UpdatePasswordForm({
     error: {},
     values: {},
   };
-  const [state, formAction, isPending] = useActionState(
+  const [state, formAction, isPending] = React.useActionState(
     updatePasswordAction,
     initialState,
   );
@@ -45,7 +45,7 @@ export function UpdatePasswordForm({
         <CardContent>
           <form action={formAction}>
             <FieldGroup className="flex flex-col gap-6">
-              <FormField
+              <FormInput
                 id="password"
                 name="password"
                 type="password"
diff --git a/components/home-actions.tsx b/components/home-actions.tsx
new file mode 100644
index 0000000..0b53ccc
--- /dev/null
+++ b/components/home-actions.tsx
@@ -0,0 +1,22 @@
+import {
+  RiPieChartLine as LimitIcon,
+  RiEyeOffLine as HideIcon,
+} from "@remixicon/react";
+
+import { Button } from "@/components/ui/button";
+
+import AddExpense from "./add-expense-component/add-expense-component";
+
+export default function HomeActions() {
+  return (
+    <div className="flex gap-3">
+      <Button className="rounded-full size-10" variant="outline">
+        <LimitIcon className="size-4" />
+      </Button>
+      <AddExpense />
+      <Button className="rounded-full size-10" variant="outline">
+        <HideIcon className="size-4" />
+      </Button>
+    </div>
+  );
+}
diff --git a/components/ui/button.tsx b/components/ui/button.tsx
index 766a580..f462542 100644
--- a/components/ui/button.tsx
+++ b/components/ui/button.tsx
@@ -5,7 +5,7 @@ import * as React from "react";
 import { cn } from "@/lib/utils";

 const buttonVariants = cva(
-  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
+  "cursor-pointer group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
   {
     variants: {
       variant: {
@@ -15,7 +15,7 @@ const buttonVariants = cva(
         secondary:
           "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
         ghost:
-          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
+          "border-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
         destructive:
           "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
         link: "text-primary underline-offset-4 hover:underline",
@@ -30,6 +30,7 @@ const buttonVariants = cva(
         "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
         "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
         "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
+        "icon-xl": "size-10 [&_svg:not([class*='size-'])]:size-8",
       },
     },
     defaultVariants: {
diff --git a/components/ui/calendar.tsx b/components/ui/calendar.tsx
new file mode 100644
index 0000000..f5487d8
--- /dev/null
+++ b/components/ui/calendar.tsx
@@ -0,0 +1,223 @@
+"use client"
+
+import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowDownSLine } from "@remixicon/react"
+import { cn } from "cn"
+import * as React from "react"
+import {
+  DayPicker,
+  getDefaultClassNames,
+  type DayButton,
+  type Locale,
+} from "react-day-picker"
+
+import { Button, buttonVariants } from "@/components/ui/button"
+
+
+function Calendar({
+  className,
+  classNames,
+  showOutsideDays = true,
+  captionLayout = "label",
+  buttonVariant = "ghost",
+  locale,
+  formatters,
+  components,
+  ...props
+}: React.ComponentProps<typeof DayPicker> & {
+  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
+}) {
+  const defaultClassNames = getDefaultClassNames()
+
+  return (
+    <DayPicker
+      showOutsideDays={showOutsideDays}
+      className={cn(
+        "group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(6)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
+        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
+        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
+        className
+      )}
+      captionLayout={captionLayout}
+      locale={locale}
+      formatters={{
+        formatMonthDropdown: (date) =>
+          date.toLocaleString(locale?.code, { month: "short" }),
+        ...formatters,
+      }}
+      classNames={{
+        root: cn("w-fit", defaultClassNames.root),
+        months: cn(
+          "relative flex flex-col gap-4 md:flex-row",
+          defaultClassNames.months
+        ),
+        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
+        nav: cn(
+          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
+          defaultClassNames.nav
+        ),
+        button_previous: cn(
+          buttonVariants({ variant: buttonVariant }),
+          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
+          defaultClassNames.button_previous
+        ),
+        button_next: cn(
+          buttonVariants({ variant: buttonVariant }),
+          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
+          defaultClassNames.button_next
+        ),
+        month_caption: cn(
+          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
+          defaultClassNames.month_caption
+        ),
+        dropdowns: cn(
+          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
+          defaultClassNames.dropdowns
+        ),
+        dropdown_root: cn(
+          "relative rounded-(--cell-radius)",
+          defaultClassNames.dropdown_root
+        ),
+        dropdown: cn(
+          "absolute inset-0 bg-popover opacity-0",
+          defaultClassNames.dropdown
+        ),
+        caption_label: cn(
+          "font-medium select-none",
+          captionLayout === "label"
+            ? "text-sm"
+            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
+          defaultClassNames.caption_label
+        ),
+        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
+        weekdays: cn("flex", defaultClassNames.weekdays),
+        weekday: cn(
+          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
+          defaultClassNames.weekday
+        ),
+        week: cn("mt-2 flex w-full", defaultClassNames.week),
+        week_number_header: cn(
+          "w-(--cell-size) select-none",
+          defaultClassNames.week_number_header
+        ),
+        week_number: cn(
+          "text-[0.8rem] text-muted-foreground select-none",
+          defaultClassNames.week_number
+        ),
+        day: cn(
+          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
+          props.showWeekNumber
+            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
+            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
+          defaultClassNames.day
+        ),
+        range_start: cn(
+          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
+          defaultClassNames.range_start
+        ),
+        range_middle: cn("rounded-none", defaultClassNames.range_middle),
+        range_end: cn(
+          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
+          defaultClassNames.range_end
+        ),
+        today: cn(
+          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
+          defaultClassNames.today
+        ),
+        outside: cn(
+          "text-muted-foreground aria-selected:text-muted-foreground",
+          defaultClassNames.outside
+        ),
+        disabled: cn(
+          "text-muted-foreground opacity-50",
+          defaultClassNames.disabled
+        ),
+        hidden: cn("invisible", defaultClassNames.hidden),
+        ...classNames,
+      }}
+      components={{
+        Root: ({ className, rootRef, ...props }) => {
+          return (
+            <div
+              data-slot="calendar"
+              ref={rootRef}
+              className={cn(className)}
+              {...props}
+            />
+          )
+        },
+        Chevron: ({ className, orientation, ...props }) => {
+          if (orientation === "left") {
+            return (
+              <RiArrowLeftSLine className={cn("size-4", className)} {...props} />
+            )
+          }
+
+          if (orientation === "right") {
+            return (
+              <RiArrowRightSLine className={cn("size-4", className)} {...props} />
+            )
+          }
+
+          return (
+            <RiArrowDownSLine className={cn("size-4", className)} {...props} />
+          )
+        },
+        DayButton: ({ ...props }) => (
+          <CalendarDayButton locale={locale} {...props} />
+        ),
+        WeekNumber: ({ children, ...props }) => {
+          return (
+            <td {...props}>
+              <div className="flex size-(--cell-size) items-center justify-center text-center">
+                {children}
+              </div>
+            </td>
+          )
+        },
+        ...components,
+      }}
+      {...props}
+    />
+  )
+}
+
+function CalendarDayButton({
+  className,
+  day,
+  modifiers,
+  locale,
+  ...props
+}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
+  const defaultClassNames = getDefaultClassNames()
+
+  const ref = React.useRef<HTMLButtonElement>(null)
+  React.useEffect(() => {
+    if (modifiers.focused) ref.current?.focus()
+  }, [modifiers.focused])
+
+  return (
+    <Button
+      ref={ref}
+      variant="ghost"
+      size="icon"
+      data-day={day.date.toLocaleDateString(locale?.code)}
+      data-selected-single={
+        modifiers.selected &&
+        !modifiers.range_start &&
+        !modifiers.range_end &&
+        !modifiers.range_middle
+      }
+      data-range-start={modifiers.range_start}
+      data-range-end={modifiers.range_end}
+      data-range-middle={modifiers.range_middle}
+      className={cn(
+        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
+        defaultClassNames.day,
+        className
+      )}
+      {...props}
+    />
+  )
+}
+
+export { Calendar, CalendarDayButton }
diff --git a/components/ui/dialog.tsx b/components/ui/dialog.tsx
new file mode 100644
index 0000000..201498b
--- /dev/null
+++ b/components/ui/dialog.tsx

```

---

## Assistant (Plan · Big Pickle · 2.4s)

Let me see the rest of the diff, particularly the lib/actions files which are the most important logic.</think>Let me read the server actions and remaining files in full.

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts"
}
```

**Output:**

```
<path>/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts</path>
<type>file</type>
<content>
1: "use server";
2:
3: import { revalidatePath } from "next/cache";
4: import { z } from "zod";
5:
6: import { createClient } from "@/lib/supabase/server";
7:
8: import { SUPABASE_TABLES } from "../supabase/constants";
9:
10: export interface AddExpenseState {
11:   error?: {
12:     expenseAmount?: { errors: string[] };
13:     expenseDescription?: { errors: string[] };
14:     expenseCategory?: { errors: string[] };
15:     expenseCurrency?: { errors: string[] };
16:     expenseDate?: { errors: string[] };
17:   };
18:   message?: string | null;
19:   values?: {
20:     expenseAmount?: number;
21:     expenseDescription?: string;
22:     expenseCategory?: string;
23:     expenseCurrency?: string;
24:     expenseDate?: Date | undefined;
25:   };
26:   success?: boolean;
27: }
28:
29: const FormSchema = z.object({
30:   expenseAmount: z.number().positive().max(Number.MAX_SAFE_INTEGER),
31:   expenseDescription: z.exactOptional(z.string().max(10000)),
32:   expenseCategory: z.string().min(2).max(10000),
33:   expenseCurrency: z.currencyCode(),
34:   expenseDate: z.date(),
35: });
36:
37: export async function addExpenseAction(
38:   _prevState: AddExpenseState,
39:   formData: FormData,
40: ): Promise<AddExpenseState> {
41:   const rawDate = formData.get("expenseDate");
42:   const formFieldsData = {
43:     expenseAmount: Number(formData.get("expenseAmount")),
44:     expenseDescription: String(formData.get("expenseDescription")),
45:     expenseCategory: String(formData.get("expenseCategory")),
46:     expenseCurrency: String(formData.get("expenseCurrency")),
47:     expenseDate: rawDate ? new Date(String(rawDate)) : undefined,
48:   };
49:
50:   const validatedFields = FormSchema.safeParse(formFieldsData);
51:
52:   if (!validatedFields.success) {
53:     return {
54:       error: z.treeifyError(validatedFields.error).properties,
55:       values: formFieldsData,
56:       success: false,
57:     };
58:   }
59:
60:   const {
61:     expenseAmount,
62:     expenseCategory,
63:     expenseDate,
64:     expenseDescription,
65:     expenseCurrency,
66:   } = validatedFields.data;
67:   const supabase = await createClient();
68:   const {
69:     data: { user },
70:   } = await supabase.auth.getUser();
71:
72:   if (!user) {
73:     return { message: "We couldn't find a user", success: false };
74:   }
75:
76:   // TODO: collection_id should be included when expense is added through collection
77:
78:   const { error: creationError } = await supabase
79:     .from(SUPABASE_TABLES.EXPENSES)
80:     .insert({
81:       amount: expenseAmount,
82:       currency: expenseCurrency,
83:       description: expenseDescription,
84:       category: expenseCategory,
85:       expense_date: expenseDate,
86:       user_id: user.id,
87:       collection_id: undefined,
88:     });
89:
90:   if (creationError) {
91:     return {
92:       message: creationError.details,
93:       values: formFieldsData,
94:       success: false,
95:     };
96:   }
97:
98:   revalidatePath("/homepage")
99:
100:   return { error: {}, success: true };
101: }

(End of file - total 101 lines)
</content>
```

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/tslashdreamy/Documents/Xpensy/lib/actions/getUserExpenses.ts"
}
```

**Output:**

```
<path>/Users/tslashdreamy/Documents/Xpensy/lib/actions/getUserExpenses.ts</path>
<type>file</type>
<content>
1: "use server";
2:
3: import { SUPABASE_TABLES } from "@/lib/supabase/constants";
4: import { createClient } from "@/lib/supabase/server";
5:
6: interface UserExpense {
7:   amount: number;
8:   currency: string;
9:   description: string;
10: }
11:
12: type ReturnedData = UserExpense[] | null;
13:
14: export async function getUserExpenses() {
15:   const supabase = await createClient();
16:   const {
17:     data: { user },
18:   } = await supabase.auth.getUser();
19:   if (!user) return null;
20:
21:   const { data }: { data: ReturnedData } = await supabase
22:     .from(SUPABASE_TABLES.EXPENSES)
23:     .select("amount, currency, description")
24:     .eq("user_id", user.id);
25:
26:   return data;
27: }

(End of file - total 27 lines)
</content>
```

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/tslashdreamy/Documents/Xpensy/lib/actions/getUserProfile.ts"
}
```

**Output:**

```
<path>/Users/tslashdreamy/Documents/Xpensy/lib/actions/getUserProfile.ts</path>
<type>file</type>
<content>
1: "use server";
2:
3: import { SUPABASE_TABLES } from "@/lib/supabase/constants";
4: import { createClient } from "@/lib/supabase/server";
5:
6: interface UserProfile {
7:   display_name: string;
8:   avatar_url: string | null;
9:   preferred_currency: string;
10: }
11:
12: export async function getUserProfile() {
13:   const supabase = await createClient();
14:   const {
15:     data: { user },
16:   } = await supabase.auth.getUser();
17:   if (!user) return null;
18:
19:   const { data }: { data: UserProfile | null } = await supabase
20:     .from(SUPABASE_TABLES.PROFILES)
21:     .select("display_name, avatar_url, preferred_currency")
22:     .eq("id", user.id)
23:     .single();
24:
25:   return data;
26: }

(End of file - total 26 lines)
</content>
```

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/tslashdreamy/Documents/Xpensy/app/(app)/homepage/layout.tsx"
}
```

**Output:**

```
<path>/Users/tslashdreamy/Documents/Xpensy/app/(app)/homepage/layout.tsx</path>
<type>file</type>
<content>
1: import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
2: import { SidebarProvider } from "@/components/ui/sidebar";
3:
4: export default function ProtectedLayout({
5:   children,
6: }: Readonly<{
7:   children: React.ReactNode;
8: }>) {
9:   return (
10:     <SidebarProvider defaultOpen={false}>
11:       <AppSidebar />
12:       <main className="m-12 w-full">{children}</main>
13:     </SidebarProvider>
14:   );
15: }

(End of file - total 15 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 6.6s)

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/tslashdreamy/Documents/Xpensy/docs/info/Xpensy-Database-Schema.md | head -200"
}
```

**Error:**

```
File not found: /Users/tslashdreamy/Documents/Xpensy/docs/info/Xpensy-Database-Schema.md | head -200

Did you mean one of these?
/Users/tslashdreamy/Documents/Xpensy/docs/info/Xpensy-Database-Schema.md
```

---

## Assistant (Plan · Big Pickle · 6.1s)

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/tslashdreamy/Documents/Xpensy/docs/info/Xpensy-Database-Schema.md"
}
```

**Output:**

````
<path>/Users/tslashdreamy/Documents/Xpensy/docs/info/Xpensy-Database-Schema.md</path>
<type>file</type>
<content>
1: # Database Schema (PostgreSQL / Supabase)
2:
3: To support seamless switching between private solo expenses and collaborative collections, the schema minimizes complex splitting arithmetic and handles multi-tenancy via a **nullable relational relationship** on the `expenses` table. A **`connections`** contact list lets users manage people in-app and invite them to collections without relying on email links alone.
4:
5: > [!NOTE]
6: > **The entire architecture relies on one clever trick:** instead of separating your personal expenses and group expenses into two different tables, they live in the exact same table (`expenses`).
7: > Whether an expense is private or shared depends entirely on whether it is linked to a **Collection**.
8:
9:
10: ## 1. `profiles` Table (The Users)
11:
12: | Name | Type | Constraints |
13: |------|------|-------------|
14: | `id` | `uuid` | Primary |
15: | `display_name` | `text` |  |
16: | `avatar_url` | `text` |  Nullable |
17: | `preferred_currency` | `bpchar` |  |
18: | `updated_at` | `timestamptz` |  |
19:
20: Supabase handles core authentication (emails, passwords, tokens) in a hidden, secure internal schema (`auth.users`). However, you cannot easily join tables to that internal schema.
21:
22: - Why it’s here: The `public.profiles` table acts as a bridge. It mirrors the users from Supabase Auth so you can store public-facing data like `display_name` or an `avatar_url`.
23: - The Connection: The `id` is a `UUID` that explicitly references `auth.users(id)`. When a user deletes their account, `ON DELETE CASCADE` ensures their profile is cleaned up automatically.
24:
25: ```sql
26: -- 1. PROFILES (Extends Supabase Auth)
27: CREATE TABLE public.profiles (
28:     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
29:     display_name TEXT NOT NULL,
30:     avatar_url TEXT,
31:     preferred_currency CHAR(3) NOT NULL DEFAULT 'USD', -- ISO 4217,
32:     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
33: );
34: ```
35:
36: ## 2. `collections` Table (The Shared Spaces)
37:
38: | Name | Type | Constraints |
39: |------|------|-------------|
40: | `id` | `uuid` | Primary |
41: | `name` | `text` |  |
42: | `created_at` | `timestamptz` |  |
43: | `created_by` | `uuid` |  |
44:
45:
46: A "Collection" is simply a container for shared expenses (e.g., "Apartment Bills", "Road Trip").
47:
48: - Why it’s here: It acts as the anchor for groups. It keeps track of the name of the collection, when it was made, and who created it (created_by).
49: - If you are just tracking personal expenses, you don't even need to touch this table.
50:
51: ```sql
52: -- 2. COLLECTIONS (Shared Groups)
53: CREATE TABLE public.collections (
54:     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
55:     name TEXT NOT NULL,
56:     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
57:     created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT
58: );
59: ```
60:
61: ## 3. collection_members Table (The Access Control)
62:
63: | Name | Type | Constraints |
64: |------|------|-------------|
65: | `collection_id` | `uuid` | Primary |
66: | `user_id` | `uuid` | Primary |
67: | `joined_at` | `timestamptz` |  |
68: | `is_pinned` | `bool` |  |
69: | `pinned_at` | `timestamptz` |  Nullable |
70:
71: This is a **Join Table** (or junction table) that handles a Many-to-Many relationship. A single user can be a member of multiple collections, and a single Collection can have multiple users.
72:
73: - Why it’s here: It lists who has permission to view or add expenses to a specific Collection.
74: - The Structure: It pairs a `collection_id` with a `user_id`. By setting the `PRIMARY KEY` to be the combination of both columns (`collection_id`, `user_id`), you guarantee a user cannot accidentally be added to the exact same Collection twice.
75:
76: ```sql
77: -- 3. COLLECTION MEMBERS (Many-to-Many Join Table)
78: CREATE TABLE public.collection_members (
79:     collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
80:     user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
81:     joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
82:     is_pinned BOOLEAN NOT NULL DEFAULT false,
83:     pinned_at TIMESTAMP WITH TIME ZONE, -- helps sort pinned collections on the home page
84:     PRIMARY KEY (collection_id, user_id)
85: );
86: ```
87:
88: ## 4. `connections` Table (The Contact List)
89:
90: | Name | Type | Constraints |
91: |------|------|-------------|
92: | `user_id` | `uuid` | Primary |
93: | `connected_user_id` | `uuid` | Primary |
94: | `created_at` | `timestamptz` |  |
95:
96: A **personal contact list** for the Connections page. Each row links the current user (`user_id`) to another Xpensy user (`connected_user_id`) they want to keep handy for shared collections.
97:
98: - Why it’s here: Lets users add, remove, and browse people in-app instead of re-entering emails every time they invite someone to a collection.
99: - The Structure: Composite `PRIMARY KEY (user_id, connected_user_id)` prevents duplicate contacts. The `CHECK (user_id <> connected_user_id)` constraint blocks self-links.
100: - Invites: From Connections, the app creates a `collection_invites` row with `invite_source = 'connection'` and `invitee_id` set — no email link required.
101:
102: ```sql
103: -- 4. CONNECTIONS (Personal contact list — used on the Connections page)
104: CREATE TABLE public.connections (
105:     user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
106:     connected_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
107:     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
108:     PRIMARY KEY (user_id, connected_user_id),
109:     CHECK (user_id <> connected_user_id)
110: );
111: ```
112:
113: ## 5. `collection_invites` Table (Invitations)
114:
115: | Name | Type | Constraints |
116: |------|------|-------------|
117: | `id` | `uuid` | Primary |
118: | `collection_id` | `uuid` |  |
119: | `invited_by` | `uuid` |  |
120: | `invite_source` | `text` |  |
121: | `email` | `text` |  Nullable |
122: | `invitee_id` | `uuid` |  Nullable |
123: | `status` | `text` |  |
124: | `token` | `uuid` |  Unique |
125: | `expires_at` | `timestamptz` |  |
126: | `accepted_at` | `timestamptz` |  Nullable |
127: | `accepted_by` | `uuid` |  Nullable |
128: | `created_at` | `timestamptz` |  |
129:
130: Tracks pending and resolved invitations to join a collection. Supports **two paths** into the same table:
131:
132: - **Email** (`invite_source = 'email'`): `email` is required; share `/invite/[token]` with someone who may not have an account yet.
133: - **Connection** (`invite_source = 'connection'`): `invitee_id` is required; sent from the Connections page to an existing contact.
134:
135: - Why it’s here: Bridges the gap between “I created a collection” and “this person is a member.” Accepting an invite inserts a `collection_members` row and marks the invite `accepted`.
136: - Lifecycle: `status` moves through `pending` → `accepted` | `declined` | `expired` | `cancelled`. `expires_at` defaults to seven days after creation.
137: - Uniqueness: Partial unique indexes ensure at most one active `pending` invite per email or per `invitee_id` per collection.
138:
139: ```sql
140: -- 5. COLLECTION INVITES (Email link OR in-app invite to an existing connection)
141: CREATE TABLE public.collection_invites (
142:     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
143:     collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
144:     invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
145:     invite_source TEXT NOT NULL DEFAULT 'email'
146:         CHECK (invite_source IN ('email', 'connection')),
147:     email TEXT CHECK (email IS NULL OR email = lower(email)), -- required for email invites
148:     invitee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- required for in-app / connection invites
149:     status TEXT NOT NULL DEFAULT 'pending'
150:         CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
151:     token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE, -- email path: /invite/[token]; in-app path: optional deep link
152:     expires_at TIMESTAMP WITH TIME ZONE NOT NULL
153:         DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '7 days'),
154:     accepted_at TIMESTAMP WITH TIME ZONE,
155:     accepted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
156:     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
157:     CHECK (
158:         (invite_source = 'email' AND email IS NOT NULL AND invitee_id IS NULL)
159:         OR (invite_source = 'connection' AND invitee_id IS NOT NULL)
160:     )
161: );
162:
163: -- One active pending invite per email or per user per collection
164: CREATE UNIQUE INDEX collection_invites_pending_email_unique
165:     ON public.collection_invites (collection_id, email)
166:     WHERE status = 'pending' AND email IS NOT NULL;
167:
168: CREATE UNIQUE INDEX collection_invites_pending_invitee_unique
169:     ON public.collection_invites (collection_id, invitee_id)
170:     WHERE status = 'pending' AND invitee_id IS NOT NULL;
171: ```
172:
173: ## 6. `expense_limits` Table (Spending Caps)
174:
175: | Name | Type | Constraints |
176: |------|------|-------------|
177: | `id` | `uuid` | Primary |
178: | `user_id` | `uuid` |  |
179: | `amount` | `numeric` |  |
180: | `currency` | `bpchar` |  |
181: | `start_date` | `date` |  |
182: | `end_date` | `date` |  |
183: | `collection_id` | `uuid` |  Nullable |
184: | `created_at` | `timestamptz` |  |
185:
186: Defines **budget limits** over a date range — the backing store for “set limits for expenses with start and end date” on the home page.
187:
188: - Why it’s here: Lets users cap spending for a period without hard-coding rules in the app layer. Limits are always owned by a `user_id`; optional `collection_id` narrows scope to a specific collection (omit it for a personal limit).
189: - The Structure: `amount` uses `NUMERIC(12, 2)` (same as `expenses`). `end_date` must be on or after `start_date`.
190: - Querying: Compare summed `expenses` in the window (filtered by `user_id`, and optionally `collection_id`) against `amount` to show progress or warnings.
191:
192: ```sql
193: -- 6. EXPENSE LIMITS TABLE (Consider whether limits are always personal (`user_id` only) or can apply to a collection `collection_id`)
194: CREATE TABLE public.expense_limits (
195:       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
196:       user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
197:       amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
198:       currency CHAR(3) NOT NULL DEFAULT 'USD',
199:       start_date DATE NOT NULL,
200:       end_date DATE NOT NULL CHECK (end_date >= start_date),
201:       collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE, -- NULL = personal limit
202:       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
203:   );
204: ```
205:
206: ## 7. expenses Table (The Ledger)
207:
208: | Name | Type | Constraints |
209: |------|------|-------------|
210: | `id` | `uuid` | Primary |
211: | `amount` | `numeric` |  |
212: | `currency` | `bpchar` |  |
213: | `description` | `text` |  |
214: | `category` | `text` |  |
215: | `expense_date` | `date` |  |
216: | `user_id` | `uuid` |  |
217: | `collection_id` | `uuid` |  Nullable |
218: | `created_at` | `timestamptz` |  |
219:
220: This is the heart of Xpesny. It records every financial transaction.
221:
222: - `amount NUMERIC(12, 2)`: Crucial detail. Never use floating-point numbers (`float`, `real`) for money because computers suffer from rounding errors with decimals (e.g., `0.1 + 0.2` becoming `0.30000000000000004`). `NUMERIC(12,2)` guarantees exact decimal precision up to 12 digits total, with 2 decimal places.
223: - `user_id`: Tracks exactly who created/paid the expense, regardless of whether it's solo or shared.
224: - `collection_id (Nullable)`: **This is the secret sauce**. If a user adds a personal expense (like buying a coffee), `collection_id` is saved as `NULL`. If a user adds an expense to a shared Collection (like buying groceries for the house), `collection_id` stores the specific ID of that Collection.
225:
226: ```sql
227: -- 7. EXPENSES (Solo if collection_id is NULL)
228: CREATE TABLE public.expenses (
229:     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
230:     amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
231:     currency CHAR(3) NOT NULL DEFAULT 'USD', -- ISO 4217
232:     description TEXT NOT NULL,
233:     category TEXT NOT NULL DEFAULT 'General',
234:     expense_date DATE NOT NULL,
235:     user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
236:     collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE, -- NULL means Personal/Solo
237:     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
238: );
239: ```
240:
241: ## DB Schema vizualization
242:
243: ![Xpensy DB Schema vizualization](https://raw.githubusercontent.com/TSlashDreamy/Xpensy/f99304a556e19fced07bb0ae5a752c42ab1c0770/docs/assets/db-schema-vizualization.svg)
244:
245: # How the UI Queries This Data
246: Because the database is normalized this way, writing the frontend logic becomes incredibly clean. You only need two primary queries to power the whole application:
247:
248: ## Case A: The Personal Dashboard
249: When a user opens their private dashboard, you want to show only their personal solo expenses.
250:
251: ```sql
252: SELECT * FROM expenses
253: WHERE user_id = 'current_user_id'
254:   AND collection_id IS NULL; -- Filters out any group expenses
255: ```
256:
257: ## Case B: Inside a Specific "Collection"
258: When a user clicks on their "Trip to Georgia" Collection, you want to show all expenses associated with that Collection, regardless of who paid for it.
259:
260: ```sql
261: SELECT * FROM expenses
262: WHERE collection_id = 'georgia_collection_id'; -- Shows everyone's additions to this Collection
263: ```
264:
265: # The Security Layer (Row Level Security - RLS)
266: Because PostgreSQL is running inside Supabase, security rules are applied directly on all tables. For example, the `expenses` table policy ensures:
267:
268: "Allow a user to read a row only if `expenses.user_id` matches their own ID OR if `expenses.collection_id` matches a Collection they belong to."
269:
270: To prevent circular RLS policy recursion and ensure high performance, security checks use `SECURITY DEFINER` helper functions (`is_collection_member`, `is_collection_owner`) and cached `(select auth.uid())` subqueries.
271:
272: The complete production RLS migration is located at:
273: `supabase/migrations/20260904000000_rewrite_rls_policies.sql`
274:

(End of file - total 274 lines)
</content>
````

---

## Assistant (Plan · Big Pickle · 833.7s)

Let me use subagents to review the changes thoroughly. I'll delegate different areas to focus on correctness, cleanliness, and edge cases.

**Tool: task**

**Input:**

```json
{
  "description": "Review server actions",
  "prompt": "Review the server actions in lib/actions/ for correctness, cleanliness, and edge cases. Look at:\n- addExpense.ts: Zod validation (especially z.currencyCode() - does it exist in zod v4? Also handling of optional description with exactOptional), error handling, types, database operations, revalidation\n- getUserExpenses.ts: typing (data: ReturnedData with inline type), null handling\n- getUserProfile.ts: error handling, .single() behavior\n\nCheck for security issues (no user input sanitization beyond zod), proper error messages, type safety, and potential edge cases. Focus on correctness.\n\nAlso note: zod v4 has different APIs. Let us verify. The form uses z.currencyCode() and z.treeifyError - these need to be valid. Also look up the schema. Return a detailed review.",
  "subagent_type": "explore"
}
```

**Output:**

````
<task id="ses_ebe7e8050ffeDo5YbEViphyMAf" state="completed">
<task_result>
Good. `z.currencyCode()` error message is "Invalid currency code". Fine.

Now I have all I need. Let me write up the review.

Let me make sure line references are accurate.

addExpense.ts:
- line 30: amount
- line 31: description exactOptional
- line 32: category
- line 33: currency
- line 34: date
- lines 41-48: formFieldsData
- line 43: Number
- line 44: String(description)
- line 45: String(category)
- line 47: date parse
- line 54: treeifyError properties
- line 73: no user message
- lines 78-88: insert
- line 87: collection_id undefined
- line 92: creationError.details
- line 98: revalidatePath no semicolon
- line 100: success

Also note `values: formFieldsData` line 55/93 passes `expenseDate` as Date, while type allows Date | undefined. On line 78 form uses `.toDateString()`.

getUserExpenses.ts:
- line 12: ReturnedData
- line 21: inline type
- line 23: select
- line 24: eq user_id

getUserProfile.ts:
- line 19: inline type
- line 23: single

Let me write it.

I'll structure:
1. Summary / zod v4 verification verdict
2. addExpense.ts (validation, coercion bugs, DB bounds, error handling, types, revalidation)
3. getUserExpenses.ts
4. getUserProfile.ts
5. Cross-cutting security
6. Prioritized action list

Keep it detailed but readable. Include exact line refs and recommended fixes.

I should be careful to state the type-check result: only unrelated error, so these files compile.

Let me write.</think>I have everything I need. Here's the detailed review.

---

# Server Actions Review: `lib/actions/`

## Verification method
- Confirmed installed version: **zod 4.6.7** (`node_modules/zod/package.json`).
- Ran `pnpm exec tsc --noEmit --incremental false` — the **only** error is a pre-existing, unrelated one in generated Next types (`.next/types/validator.ts` referencing a missing `app/(landing)/auth/confirm/route.js`). All three action files type-check cleanly.
- Read the actual zod v4 implementation, the consumers (`add-expense-form.tsx`, `expense-counter.tsx`, `profile-item.tsx`), and the DB schema/RLS docs.

---

## 1. zod v4 API verification (the specific asks)

| API | Exists in 4.6.7? | Verdict |
|---|---|---|
| `z.currencyCode()` | ✅ Yes — `v4/classic/schemas.d.ts:333`, regex in `v4/core/regexes.js:70` | Valid. It's an ISO 4217 format validator for **uppercase** 3-letter codes. All four mocked currencies (`USD`, `UAH`, `EUR`, `RUB`) are in the list. Error message resolves to `"Invalid currency code"` (`v4/locales/en.js:41,97`). Good. |
| `z.treeifyError()` | ✅ Yes — `v4/core/errors.d.ts:189`, re-exported in `v4/classic/external.d.ts:10` | Valid and used correctly. For an object schema it returns `{ errors: string[]; properties?: { [K]: { errors: string[] } } }`. `.properties` field entries match the `AddExpenseState.error` shape (`{ errors: string[] }`). Type-checks. |
| `z.exactOptional()` | ✅ Yes — `v4/classic/schemas.d.ts:654` | Exists, **but is misused here** — see below. Its parse simply delegates to the inner type with *no* `undefined` short-circuit (`v4/core/schemas.js:2129-2139`). It permits an **absent key only**; an explicit `undefined` value runs `z.string()` and **fails**. This differs from `z.optional()`, which accepts explicit `undefined`. |

So the form will not crash on these APIs. The real problems are in *how* they're fed.

---

## 2. `addExpense.ts` — correctness issues

### 2a. 🔴 `String(formData.get(...))` produces literal `"null"` and defeats `exactOptional`
Lines 44–45:
```ts
expenseDescription: String(formData.get("expenseDescription")),
expenseCategory: String(formData.get("expenseCategory")),
````

`FormData.get()` returns `null` for an absent field. `String(null) === "null"`. Consequences:

- **Description absent →** stored in DB as the literal text `"null"` (passes `max(10000)`; DB `description TEXT NOT NULL` accepts it). Silent data corruption.
- **Category absent →** becomes `"null"` (length 4), which **passes `.min(2)`** — so the "required" category validation is bypassed whenever the key is simply missing. `"null"` is stored as a category. This is the most concrete validation hole.
- **`exactOptional` is a no-op** because the value is _never_ `undefined`. And if you later "fix" this by passing the raw `undefined`, `z.exactOptional(z.string())` will **reject** it (per the implementation above). The intent and the mechanism are at odds.

**Fix:** don't blanket-`String()`; branch on presence, and prefer `optional()`/`nullish()` semantics that match intent:

```ts
const desc = formData.get("expenseDescription");
expenseDescription: typeof desc === "string" ? desc.trim() : undefined,
```

Also guard `FormDataEntryValue` being a `File` (`String(file) === "[object File]"`, length 13, passes `min(2)` for category). A `typeof === "string"` check handles both.

### 2b. 🟠 No trimming — whitespace bypasses `.min(2)`

`expenseCategory: "  "` (two spaces) has length 2 and passes `.min(2)`, storing blank input. Add `.trim()` (and apply it before validation, as above). Description likewise.

### 2c. 🟠 Validation bounds don't match the DB column

Line 30: `z.number().positive().max(Number.MAX_SAFE_INTEGER)`.

- DB is `amount NUMERIC(12, 2)` → max **9,999,999,999.99** (schema doc §7). Values in `(1e10, 9e15]` pass zod but fail at Postgres with a numeric-overflow error, surfacing as `creationError.details` (see 2e).
- `.max(MAX_SAFE_INTEGER)` also does not enforce **2 decimals**; the DB silently rounds, so validation output diverges from stored value.
- Recommend: `.positive().max(9_999_999_999.99).multipleOf(0.01)` (or refine to 2 dp).

### 2d. 🟡 `String()` means description can never be `NULL`, and `exactOptional` adds nothing

Because `"null"`/`""` is always a string, the `description NOT NULL` column is always satisfied, but you can never store a true absent/NULL description. Decide semantics explicitly (see DB: `description TEXT NOT NULL`, so omission should probably default to `""` or be required).

### 2e. 🔴 Error handling leaks internal DB details / can show empty message

Line 92: `message: creationError.details`.

- `PostgrestError.details` is frequently `null`, in which case the user sees an empty error message while `message`/`hint` hold the real info.
- `details` can contain constraint/column/schema names — **information disclosure** to the client.
- The architecture doc (`MVP-Architecture-Plan.md:141-144`) explicitly does the right thing: `console.error` server-side, return a generic message. Follow that.

```ts
console.error("addExpense insert failed:", creationError);
return {
  message: "Couldn't save the expense. Please try again.",
  values: formFieldsData,
  success: false,
};
```

### 2f. 🟠 `values: formFieldsData` can return `NaN` to the UI

Line 43 `Number(formData.get("expenseAmount"))` → `NaN` for garbage input. It fails validation (`z.number()` rejects NaN, core `schemas.js:642`), but then `values.expenseAmount = NaN` is returned and rendered via `defaultValue={state.values?.expenseAmount}`, showing `NaN` in the amount field. Sanitize the value sent back.

### 2g. 🟡 Date handling / timezone off-by-one on the error repopulation path

- Line 47 parses `new Date(String(rawDate))`. DatePicker submits `yyyy-MM-dd` (`date-picker.tsx:34`), which JS parses as **UTC** midnight. Insert-to-`DATE` is fine.
- But on validation error the form does `state.values?.expenseDate?.toDateString()` (`add-expense-form.tsx:78`), and `toDateString()` uses the **server's local timezone**. On a server with a negative UTC offset, UTC-midnight Oct 16 formats as Oct 15 → the date picker repopulates the wrong day. Format from UTC parts (e.g., `date.toISOString().slice(0,10)`) instead of `toDateString()`.
- `z.date()` does reject `Invalid Date` (core `schemas.js:806`), so a malformed date is caught — good.

### 2h. 🟡 `collection_id: undefined` is pointless

Line 87. `JSON.stringify` drops `undefined` keys, so it's silently omitted (which does yield `NULL`). It reads like intent though; either omit the property entirely or use `null` explicitly. The `// TODO` (line 76) is tracked, fine.

### 2i. 🟡 Types / cleanliness

- `AddExpenseState.error` (lines 11–17) hand-duplicates `FormFieldProps["error"]` from `components/form-fields/types.ts:2`. Extract a shared `{ errors: string[] }` alias to avoid drift.
- `expenseDate?: Date | undefined` (line 24) — the `| undefined` is redundant since `exactOptionalPropertyTypes` is not enabled (`tsconfig.json`). Harmless.
- Line 98 `revalidatePath("/homepage")` is **missing a semicolon**; Prettier/lint (husky hooks are configured) should catch it.
- `revalidatePath("/homepage")` is the only invalidation. Correct for the counter if it lives on `/homepage`, but there's no invalidation of any collection view once `collection_id` support lands. Consider `revalidatePath` at the layout/route level.

### 2j. ✅ Good

- Auth via `supabase.auth.getUser()` (server-verified), and `user_id` is taken from `user.id` — not user input. Consistent with the RLS insert policy (`user_id = auth.uid()`).

---

## 3. `getUserExpenses.ts` — typing & null handling

### 3a. 🟠 The inline type annotation is a lie that hides errors

Line 21:

```ts
const { data }: { data: ReturnedData } = await supabase...
```

This asserts the entire `PostgrestResponse` is `{ data: ReturnedData }`, discarding `error`, `count`, `status`, `statusText`. TypeScript can no longer help you handle failures, and the annotation will silently keep "compiling" if the query shape changes. With no generated DB types (there is **no `database.types.ts`**, and `createClient` is unparameterized), `data` is effectively `any`, so this annotation provides no real safety.

**Fix:** destructure `{ data, error }`, handle `error`, and either generate Supabase types (`supabase gen types typescript`) or validate at runtime with zod.

### 3b. 🟠 No error handling — conflates "no data" and "query failed"

If the query fails, `data` is `null` and the function returns `null`; `ExpenseCounter` then renders `0` (`expense-counter.tsx:9`). A failed fetch is indistinguishable from an empty ledger. Return a discriminated result (`{ ok: true, data } | { ok: false, error }`) or let the error propagate.

### 3c. 🟠 Missing `collection_id IS NULL` filter

Line 24 only filters `.eq("user_id", user.id)`. The schema doc's "Case A: Personal Dashboard" explicitly specifies `WHERE user_id = ... AND collection_id IS NULL`. As written, the counter **sums the user's collection/shared expenses too**. If the counter is intended to be personal (it appears to be, per the doc), add `.is("collection_id", null)`. If "all my expenses" is intended, that's fine — but it contradicts the documented dashboard semantics and deserves a deliberate decision/comment.

### 3d. 🟡 `amount` runtime type

I verified PostgREST returns `numeric` as a JSON **number** (not a string) — see PostgREST issues #2586 / #498. So `expensesSum + currentExpense.amount` (line 9) won't string-concatenate. However this relies on runtime serialization rather than types; generating DB types would pin `amount: number` and remove the risk. The manual `UserExpense` interface duplicates the schema, which will drift.

### 3e. 🟡 `"use server"` on a query

Any exported async function in a `"use server"` module becomes a **client-callable endpoint**. `getUserExpenses` is only invoked from a Server Component (`ExpenseCounter`), so it's an unnecessary action surface. It's auth-guarded and RLS-scoped, so low risk, but query helpers are better placed in a non-`"use server"` module.

---

## 4. `getUserProfile.ts` — error handling & `.single()`

### 4a. 🟠 `.single()` errors are ignored

Line 23: `.single()`. Per PostgREST/postgrest-js, a singular request with **zero** rows returns `406` / `code: "PGRST116"`, `data: null`, and a non-null `error`. The code destructures only `data` and ignores `error`, so:

- A genuinely missing profile (e.g., the `handle_new_user` trigger not yet deployed — it's still unchecked in the roadmap, `MVP-Architecture-Plan.md:162`) silently returns `null`, and `ProfileItem` renders nothing (`profile-item.tsx:9`). Silent failure.
- Real errors (network, RLS) are likewise swallowed.

**Fix:** inspect `error`; distinguish `PGRST116` (no row → treat as absent) from other errors. If a missing profile is a valid state, `.maybeSingle()` expresses intent better and avoids the 406 semantics entirely.

### 4b. 🟠 Same inline-type lie

Line 19: `{ data }: { data: UserProfile | null }` hides `error` (same pattern as 3a).

### 4c. 🟡 `preferred_currency` is fetched but unused

The `profiles` schema has `preferred_currency CHAR(3)`, and this action selects it, but `ProfileItem` only uses `display_name`, and `AddExpenseForm` defaults to `USD` in `CurrencySwitcher` (`currency-switcher.tsx:40`) rather than the user's preference. The field is dead data end-to-end.

---

## 5. Cross-cutting security & edge cases

- **SQL injection:** not a concern. supabase-js → PostgREST uses parameterized queries. Zod here is _validation_, not sanitization; that framing is fine.
- **XSS:** no `dangerouslySetInnerHTML` anywhere in the repo; React escapes rendered `description`/`category`/`display_name`. Low risk. But stored text isn't trimmed/normalized (control chars, zero-width chars) — add `.trim()` at minimum.
- **Secrets/authorization:** server client uses `NEXT_PUBLIC_SUPABASE_*` publishable/anon keys, not a service-role key; RLS enforces ownership. Correct.
- **Auth:** all three actions call `supabase.auth.getUser()` (server-verified) before touching data. Good.
- **Information disclosure:** `creationError.details` returned to the client (2e). Also consider `error.message` from auth actions (register/login) — those surface provider messages directly; usually acceptable, but raw DB details are not.
- **Abuse/DoS:** `addExpenseAction` has no rate limiting or idempotency. RLS constrains _what_ a user can insert (their own rows), not _how often_. Worth noting for a public POST endpoint.
- **zod v3→v4 migration gotcha:** the architecture doc still shows zod v3 syntax (`errorMap: () => ({ message })`, `MVP-Architecture-Plan.md:55`). In v4 that's `{ error: "..." }` (as `register.ts:24` correctly uses). If someone copies the doc's schema, it won't behave. Not in the three files, but adjacent.

---

## 6. Prioritized action list

1. **Fix `String(formData.get())` coercion** (2a) — prevents literal `"null"` being stored and closes the category `min(2)` bypass. Add `.trim()` (2b).
2. **Stop returning `creationError.details`** (2e) — log server-side, return a generic message.
3. **Align `amount` bounds with `NUMERIC(12,2)`** and enforce 2 dp (2c).
4. **Handle Supabase `error`** in `getUserExpenses` and `getUserProfile`; replace the deceiving inline-type annotations with real destructuring (3a/3b, 4a/4b).
5. **Decide/fix `collection_id IS NULL` filter** in `getUserExpenses` (3c).
6. **Fix server-TZ `toDateString()` date repopulation** (2g).
7. Generate `database.types.ts` and parameterize `createClient<Database>()` — removes the need for hand-written interfaces and inline-type lies.
8. Minor: missing semicolon (2i), redundant `| undefined`, reuse the shared error type, stop sending `NaN` in `values` (2f), move query helpers out of `"use server"` modules (3e).

**Bottom line:** `z.currencyCode()` and `z.treeifyError()` are valid zod v4 APIs and the three files compile. `z.exactOptional()` exists but is being used ineffectively — the `String()` coercion guarantees it never sees `undefined`, and it would actually reject `undefined` if you corrected the coercion. The most impactful correctness bugs are the `"null"` string injection (validation bypass + data corruption), the raw DB error leakage, the DB/zod amount mismatch, and the ignored Supabase errors in the two read helpers.
</task_result>
</task>

````

**Tool: task**

**Input:**
```json
{
  "description": "Review expense form components",
  "prompt": "Review the expense form and related components. Files:\n- components/forms/add-expense-form.tsx\n- components/add-expense-component/*\n- components/form-fields/date-picker.tsx\n- components/form-fields/form-input.tsx (refactored)\n- components/currency-switcher.tsx\n- components/expense-counter/*\n\nCheck correctness (form validation flow with useActionState, state handling), UX, accessibility, edge cases (invalid dates, number formatting, NaN from Number(formData.get)), component props/types, reusability. Also check the DatePicker - when defaultValue is passed as string, they do new Date(String(defaultValue)) and then format to yyyy-MM-dd; make sure this is correct.\n\nAlso the expense-counter sums expenses - it just adds numbers, no currency conversion. The TODO mentions this. Is that acceptable? Note it.\n\nCleanliness and any potential bugs. Return detailed review.",
  "subagent_type": "explore"
}
````

**Output:**

````
<task id="ses_ebe7dc84dffemow9ZXLmBIgDkO" state="completed">
<task_result>
I've completed a thorough review. Here are my findings.

---

# Review: Add Expense flow

Reviewed files:
- `/Users/tslashdreamy/Documents/Xpensy/components/forms/add-expense-form.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/add-expense-component/*`
- `/Users/tslashdreamy/Documents/Xpensy/components/form-fields/date-picker.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/form-fields/form-input.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/form-fields/types.ts`
- `/Users/tslashdreamy/Documents/Xpensy/components/currency-switcher.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/expense-counter/*`
- plus supporting: `/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts`, `getUserExpenses.ts`, `components/ui/field.tsx`, `components/ui/input.tsx`

Good news first: the Zod v4 APIs are real (`z.currencyCode()` and `z.treeifyError()` both exist in `zod@4.6.7`), `size="icon-xl"` is a valid button variant, Radix `DialogClose`/`DrawerClose`/day-picker cells render `type="button"` (so the Cancel/day buttons won't accidentally submit), and the FormInput refactor is behavior-preserving for existing consumers (login/register/forgot/update-password/create-user all still match the type).

## Critical bugs

### 1. `CurrencySwitcher` ignores `defaultValue` and sets both `value` and `defaultValue` — selected currency is lost after a failed submit
`/Users/tslashdreamy/Documents/Xpensy/components/currency-switcher.tsx:40,73`

```tsx
const [currency, setCurrency] = React.useState<CurrencyCode>("USD"); // ignores defaultValue
...
<input type="hidden" name={name} value={currency} defaultValue={defaultValue} />
````

- State is always initialized to `"USD"`, so the `defaultValue` prop passed from the form (`state.values?.expenseCurrency`) is dead code. Pick EUR, submit an invalid amount, and the currency silently resets to USD on re-render — the user may not notice and resubmit in the wrong currency.
- Passing both `value` and `defaultValue` triggers a React dev warning ("contains an input … with both value and defaultValue props") whenever `defaultValue` is defined (i.e., after any validation failure). Verified against the installed `react-dom` source (`checkControlledValueProps` / input `updateInput`).
- Fix: initialize from the default with a guard, and drop `defaultValue` on the hidden input:
  ```tsx
  const [currency, setCurrency] = React.useState<CurrencyCode>(() =>
    defaultValue && isCurrencyCode(defaultValue) ? defaultValue : "USD",
  );
  ...
  <input type="hidden" name={name} value={currency} />
  ```

### 2. Empty amount becomes `0` and is injected into the empty field after a failed submit

`/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts:43` + `/Users/tslashdreamy/Documents/Xpensy/components/forms/add-expense-form.tsx:47`

```ts
expenseAmount: Number(formData.get("expenseAmount")),  // Number("") === 0
```

If the user leaves the amount blank and submits, the server returns `values.expenseAmount = 0`. Because the (untouched) amount input is not "dirty", React applies the new `defaultValue` and the field visibly becomes `0`. So after an error the user is confronted with a `0` they never typed. It's also semantically wrong — empty should be "missing", not zero. Fix in the action:

```ts
const rawAmount = formData.get("expenseAmount");
expenseAmount:
  rawAmount === null || rawAmount === "" ? undefined : Number(rawAmount),
```

This also gives a proper "Required" style error instead of a `positive()` failure.

### 3. `String(formData.get(...))` yields the literal `"null"` for absent fields

`/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts:44-46`

`String(null)` is `"null"`, so any field not present in the FormData would be stored as the string `"null"` (e.g. `expenseCategory` is required and `min(2)` would happily accept `"null"`). Today the inputs are always rendered so this is latent, but it's a classic trap. Use `formData.get("x")?.toString() ?? ""` (or `String(... ?? "")`). Also note `expenseDescription` (an `exactOptional`) is effectively always present as `""`, so `exactOptional` never does anything here.

### 4. Amount validation range doesn't match the DB column

`/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts:30`

`z.number().positive().max(Number.MAX_SAFE_INTEGER)` allows ~9.007e15, but the column is `NUMERIC(12,2)` (max `9999999999.99`, per `/Users/tslashdreamy/Documents/Xpensy/docs/info/Xpensy-Database-Schema.md:222`). An amount above 10 integer digits passes validation, then the insert fails with a raw Postgres overflow error surfaced via `creationError.details`. There's also no 2-decimal enforcement (`step` is unset on the number input), so `1.999` silently rounds in Postgres. Add `max(9_999_999_999.99)` and a 2-decimal refinement, and set `step="0.01"` on the input.

### 5. Currency validation is more permissive than the app supports

`/Users/tslashdreamy/Documents/Xpensy/lib/actions/addExpense.ts:33` uses generic ISO-4217 `z.currencyCode()`, but the app only renders/symbolizes the 4 codes in `mockedCurrencyList` (`/Users/tslashdreamy/Documents/Xpensy/components/currency-switcher.tsx:15`). A crafted request can store e.g. `GBP`, which the UI cannot display. Validate against the supported set (`z.enum(Object.keys(mockedCurrencyList))`) or a shared constant.

## `DatePicker` — direct answer to your question

`/Users/tslashdreamy/Documents/Xpensy/components/form-fields/date-picker.tsx:26-28,34`

```tsx
const [date, setDate] = React.useState<Date | undefined>(() =>
  defaultValue ? new Date(String(defaultValue)) : undefined,
);
```

`new Date(String(defaultValue))` **does parse** the string it currently receives, but the whole approach is wrong/fragile:

- **The value it receives is timezone-lossy.** The form passes `state.values?.expenseDate?.toDateString()` (`add-expense-form.tsx:78`), e.g. `"Mon Oct 16 2026"` (local). The server built that Date from `new Date("2026-10-16")` (`addExpense.ts:47`), which JS parses as **UTC midnight**. `.toDateString()` renders in **local** time, so for any user behind UTC the round trip yields the _previous_ day (a `-1 day` shift). It's only lossless for UTC/TZ-ahead users.
- **`new Date(arbitraryString)` is implementation-dependent.** It is not guaranteed for non-ISO formats like `toDateString()` output, and if it produces an `Invalid Date`, that object is **truthy**, so `date` is treated as selected and `format(date, "PPP")` throws `RangeError: Invalid time value`.
- **It's effectively dead code in the current flow anyway.** `useState` initializers run only on mount, and `AddExpenseForm` does not unmount on a failed action — the DatePicker keeps its own `date` state. So the `defaultValue` the form computes is ignored after mount; the round-trip never actually seeds the field. It only "works" because the component state persists. The moment the DatePicker is remounted (key change, moving state up, closing/reopening if state were hoisted), the timezone bug becomes real.

Recommendation: keep dates as `yyyy-MM-dd` everywhere end-to-end, and parse deterministically:

```tsx
import { parseISO, isValid, format } from "date-fns";
const [date, setDate] = React.useState<Date | undefined>(() => {
  if (!defaultValue) return undefined;
  const d = parseISO(String(defaultValue).slice(0, 10));
  return isValid(d) ? d : undefined;
});
```

and in the form pass `state.values?.expenseDate` formatted to `yyyy-MM-dd` rather than `.toDateString()`.

Other DatePicker issues:

- The value is communicated through an **uncontrolled hidden input whose `defaultValue` changes**. This does work (hidden inputs are never "dirty", so React's `setDefaultValue` updates the DOM `value`), but it's subtle and easy to break. A hidden `<input value={...} readOnly />` (React does not warn for `hidden`/readOnly) would be clearer and self-documenting.
- `required` on a hidden input is **ignored** by the browser, so the date has no client-side required validation — only the server catches it.
- DayPicker single-mode is not `required`, so clicking the already-selected day clears the date, producing `""` on submit. Fine because of server validation, but worth adding `required` to the `Calendar`.

## Expense counter — direct answer to your question

`/Users/tslashdreamy/Documents/Xpensy/components/expense-counter/expense-counter.tsx:8-9`

```tsx
// TODO: This is not enough. We should convert currency and only then sum everything
const expenses = expensesData?.reduce((sum, e) => sum + e.amount, 0) || 0;
```

**Is summing mixed currencies acceptable?** Only as a clearly-documented, short-lived MVP stub — not for anything user-facing. In a finance app this is a correctness bug: `100 USD + 100 UAH = 200` is meaningless, and the number is presented as a single total with a currency symbol. The existing `CurrencySwitcher` next to it makes it _worse_: it looks like a control for the total but does nothing (it doesn't convert, and it isn't even wired to the sum). Notes:

- The displayed currency symbol is just the switcher's own default (`USD`), unrelated to the actual rows summed.
- Floating-point artifacts are possible: PostgREST serializes `numeric` as a JSON number (confirmed via PostgREST issue #2586), so `0.1 + 0.2` can render `0.30000000000000004`. Render with `Intl.NumberFormat`/`toFixed(2)` (or sum integer cents).
- `getUserExpenses` (`/Users/tslashdreamy/Documents/Xpensy/lib/actions/getUserExpenses.ts`) selects `amount, currency, description` but only `amount` is used, and it does **not** filter `collection_id IS NULL`. Since the homepage is the _personal_ view, shared collection expenses are being counted into the personal total. It also pulls every row and reduces in JS — an aggregate (or at least `select("amount")`) would be more appropriate.
- `|| 0` should be `?? 0` (it also masks `NaN`).

Suggested shape: group by currency and render one total per currency, or convert with an FX rate and label the target currency. If you keep the naive sum as a stopgap, at least remove the misleading interactive switcher and format the number.

## Medium issues

- **`CurrencySwitcher` currency errors are never surfaced.** The form never passes an error into the switcher, so `state.error?.expenseCurrency` is silently dropped (`add-expense-form.tsx:51-55`).
- **`AddExpenseForm` recreates `initialState` each render** (`add-expense-form.tsx:23-27`). Harmless (only read on mount) but should be a module-level constant for clarity.
- **`FormFieldProps.error` is required** (`/Users/tslashdreamy/Documents/Xpensy/components/form-fields/types.ts:2`). For a reusable field it should be optional (`error?`), otherwise every consumer must always pass it.
- **`Field` never gets `data-invalid`.** `FormInput` sets `aria-invalid` on the `<input>` only, so the `Field` variant `data-[invalid=true]:text-destructive` (`/Users/tslashdreamy/Documents/Xpensy/components/ui/field.tsx:55`) never activates and the label won't turn red. Set `data-invalid={Boolean(error?.errors.length)}` on `<Field>`.
- **Errors bypass `FieldError`'s structured API.** `FormInput` passes a joined string as `children` (`form-input.tsx:21`) instead of the `errors={[...]}` prop, so multi-error dedup/list rendering (`field.tsx:176-209`) is unused and multiple messages render as comma/newline text.
- **No `aria-describedby`** linking the input to its error text. `role="alert"` in `FieldError` partially mitigates, but neither the input nor the error has a shared `id`. Also `aria-invalid` is spread before `{...other}`, so a caller could accidentally override it.
- **`add-expense-component.tsx` renders a `Dialog` on the server/first client render, then swaps to `Drawer`** after `useIsMobile`'s effect runs (`/Users/tslashdreamy/Documents/Xpensy/components/add-expense-component/add-expense-component.tsx:26,30`). On mobile this can flash the dialog. No hydration mismatch (both initial renders are `false`), but consider `return null` until mounted or a CSS-driven switch.
- **`expenseCurrency` accepts more than the UI offers** (see critical #5), and inversely there's no error UI for it.
- **Maybe `NaN` warning:** `Number(...)` can produce `NaN` for odd number-input values (`"1e"`), and `defaultValue={NaN}` makes React warn "Received NaN for the `defaultValue` attribute." Low probability due to `type="number"`, but the empty-string fix in #2 removes the common path and you should coerce defensively.

## Accessibility

- **Amount input has no label** — only `placeholder="0"` (`add-expense-form.tsx:41-50`). Add a visually hidden `<FieldLabel>` or `aria-label="Amount"`.
- **Icon-only buttons have no accessible name:** `AddExpenseTrigger` (`add-expense-trigger.tsx:19-31`) and `HomeActions` limit/hide buttons (`home-actions.tsx:13-18`) render only an icon. Add `sr-only` text or `aria-label`.
- **Currency button is symbol-only** (`currency-switcher.tsx:76`): it announces `$`/flag emoji with no meaning/label. Add `aria-label={`Currency: ${currency}`}` and a label for the radio group.
- **Date field label points at a hidden input.** `FieldLabel htmlFor={id}` targets the hidden input (`date-picker.tsx:32-39`), so the visible "Date" label isn't associated with the actual interactive button. Give the popover trigger an `aria-label`/`id`.
- Field-level error color never triggers (see medium above), which is also an accessibility/visual cue gap.

## Cleanliness / nits

- `/Users/tslashdreamy/Documents/Xpensy/components/add-expense-component/add-expense-footer.tsx:10` has a long line and a stray leading blank line; it isn't Prettier-clean despite the repo having Prettier + lint hooks.
- `/Users/tslashdreamy/Documents/Xpensy/components/ui/calendar.tsx:3` imports `cn` from the `"cn"` package, while every other UI file (including `button.tsx` it imports) uses `@/lib/utils`. Both exist in `package.json`, so this mixes two different merge engines — pick one for consistency.
- `CurrencySwitcher`'s `default` branch `throw new Error(...)` (`currency-switcher.tsx:58-59`) is unreachable given the union type; the TS `never` check is enough, or just return `null`.
- `getUserExpenses` types `amount: number` / `description: string` by hand without generated DB types; it's an unchecked assertion. Adding Supabase-generated types would catch column/nullability drift.

## Suggested priority order

1. CurrencySwitcher default restoration + duplicate controlled/uncontrolled props (#1).

- Empty amount → `0` injection and `String(null)` (`addExpense.ts` #2/#3).
- DatePicker `yyyy-MM-dd` + `parseISO` end-to-end, removing `.toDateString()` (DatePicker section).
- Decide on the counter: group/convert or clearly mark as unavailable; add `collection_id IS NULL` filter and number formatting.
- Tighten currency + amount validation to match the DB/UI, then the a11y and FormInput polish items.

Overall the structure is reasonable and the `useActionState` wiring (`isPending` disables submit, success effect closes the modal, error round-trip of values) is mostly sound. The main things I'd block on are the currency-reset bug, the empty-amount `0` injection, and the date timezone semantics — plus deciding what the counter should actually mean.
</task_result>
</task>

````

**Tool: task**

**Input:**
```json
{
  "description": "Review homepage and app structure changes",
  "prompt": "Review app/(app)/homepage/page.tsx and layout.tsx changes. Also app-sidebar changes (profile-item, skeleton), home-actions.tsx.\n\nCheck if the changes make sense. Homepage now shows expense counter with Suspense, uses server components correctly. ProfileItem is async server component fetching profile. \n\nLook for any issues with loading states, error boundaries (no explicit error boundaries but Suspense is used). Also check auth - homepage previously redirected if no auth; now it just renders - does ExpenseCounter/getUserExpenses handle unauthenticated state properly? They return null if no user. Does ExpenseCounter handle null data correctly? Let us look.\n\nAlso layout changed main padding from flex wrapper to m-12 w-full. Verify styling is correct.\n\nReturn review focused on correctness, edge cases, cleanliness.",
  "subagent_type": "explore"
}
````

**Output:**

```
<task id="ses_ebe7d8e57ffeF9p3hfWVKBrhTl" state="completed">
<task_result>
This is a solid refactor that moves to server components + Suspense. Overall direction is good. A few correctness/edge-case notes:

## Homepage (`app/(app)/homepage/page.tsx`)

- **Good**: Uses Suspense around `ExpenseCounter` with a dedicated skeleton. Component is a server component, data fetching stays server-side.
- **Auth change**: The page no longer redirects when unauthenticated (previous behavior removed). With current code, if signed out:
  - `getUserExpenses()` returns `null` (see below), so ExpenseCounter renders total `0`. That’s safe and won’t crash. But is zero the intended UX (vs redirect to auth/home)? If `(app)` routes are meant to be protected, ensure protection is enforced elsewhere (middleware/parent layout). If not, consider showing an empty/CTA state.
- **Loading**: Skeleton `h-11 w-2xs` is reasonable; the centered layout (`justify-center items-center gap-4`) works well with the counter + actions.
- **Minor**: The "Personal expenses" button is icon-start only (no text shown except the label text). Looks fine stylistically. Consider `aria-label` if it becomes icon-only in other contexts.
- **Structure**: The split (top-right button, centered content) is clean.

## Homepage layout (`app/(app)/homepage/layout.tsx`)

- **Change**: `main` went from flex wrapper to `m-12 w-full`.
  - If the previous wrapper provided `flex flex-col h-full/min-h-screen`, moving margin to `main` and dropping flex can break vertical centering in the page (the page uses `w-full h-full` on its inner container). `h-full` needs a parent with explicit height. With `m-12` (margin) and `w-full` only, `h-full` may not behave as intended in all viewport sizes.
  - Suggest either keep `main` as `flex flex-col flex-1 min-h-svh p-12` (or `m-12`) or ensure the page doesn’t rely on `h-full`. Also consider responsive margins (`m-6 sm:m-8 md:m-12`).
- **Correctness**: SidebarProvider + AppSidebar structure is correct for the new sidebar. No auth logic here (fine).

## ExpenseCounter (`components/expense-counter/expense-counter.tsx`)

- **Null handling**: `expensesData?.reduce(...) || 0` correctly handles `null` and `[]`. Good.
- **Auth**: `getUserExpenses` returns `null` if no user. So signed-out users see `0`. This matches the "just render" approach. No crash.
- **Data shape**: Only `amount, currency, description` are selected. The TODO about currency conversion is still valid.
- **Edge cases**: If expenses contain negative amounts (refunds) or very large numbers, formatting not addressed. Also floating point sums. Not blocking.
- **Cleanliness**: Server component, minimal. Good.

## getUserExpenses (`lib/actions/getUserExpenses.ts`)

- **Auth gate**: Early return `null` if unauthenticated. Correct.
- **Query**: Filters by `user_id` and selects minimal columns. Good.
- **Type safety**: `ReturnedData` typed; `data` cast is fine.
- **Note**: On DB errors, Supabase may return `{ data: null, error }` and this function returns `null` silently (swallows error). That’s acceptable with current UX (shows 0). If you want better observability, consider logging or throwing so an ErrorBoundary can surface it. Not required given Suspense-only setup.

## ProfileItem (`components/app-sidebar/profile-item.tsx`)

- **Async server component**: Fetches profile server-side and Suspense-wrapped in sidebar. Correct.
- **Null handling**: `if (!profile) return;` renders nothing when unauthenticated or profile missing. That creates an empty slot in the footer menu. UX: could show a "Sign in" item or skip rendering the whole menu item. Also returning `undefined` is fine in React but `return null` is clearer.
- **Edge case**: If profile exists but `display_name` is empty, it will render empty text. Consider fallback (e.g., email or "Profile").
- **Cleanliness**: Minimal. Good.

## AppSidebar (`components/app-sidebar/app-sidebar.tsx`)

- **Suspense**: Correctly wraps `ProfileItem` with `SidebarItemSkeleton`. The skeleton height `h-8 w-full` is reasonable for a menu button.
- **Async component**: Declared `async function AppSidebar()` but does not `await` anything. Remove `async` to avoid unnecessary async boundary semantics.
- **Structure**: Nav items mapped correctly; Settings link uses `asChild` with Next Link. Good.
- **Minor**: "TODO: Remove theme switcher" noted. Fine.
- **A11y**: SidebarTrigger is a button; icons paired with text where present. Good.

## HomeActions (`components/home-actions.tsx`)

- **Composition**: Clean split of actions. `AddExpense` is a separate component (client) which is fine.
- **Icon buttons**: Limit/Hide are icon-only (`size-10`, rounded-full). No accessible label. Add `aria-label` (or `title`) for screen readers.
- **Styling**: Consistent with outline variant and circle shape.

## Loading states / Error boundaries

- **Loading**: Suspense is used for async server components (ExpenseCounter, ProfileItem). This is correct for App Router.
- **Errors**: No `ErrorBoundary` components. If a server action throws during render (e.g., DB error), the error will bubble to the nearest error boundary (or root). For better UX, consider a small error boundary around `ExpenseCounter` (show "Unable to load total" fallback) and/or around `ProfileItem`. Not critical, but worth noting.
- **Hydration/CSR**: All new data-fetching pieces are server components except `AddExpense`/`CurrencySwitcher`/`ThemeSwitcher` which are interactive - that's fine.

## Recommendations (non-blocking)

1. In `ProfileItem`, return `null` explicitly and consider fallback when `display_name` missing.
2. Remove `async` from `AppSidebar` (no awaits).
3. Add `aria-label` to icon-only buttons in `HomeActions`.
4. Verify homepage height with the new layout (avoid `h-full` dependency or add flex to main).
5. Optionally add ErrorBoundaries around Suspense boundaries to handle thrown errors gracefully.

Overall, the changes are correct. The main thing to watch is the layout height change and the UX for unauthenticated users (0 total vs redirect). Everything else is tidy.
</task_result>
</task>
```

**Tool: task**

**Input:**

```json
{
  "description": "Review new UI primitives and styling",
  "prompt": "Review new UI components: components/ui/calendar.tsx, dialog.tsx, drawer.tsx, popover.tsx, and changes to button.tsx, globals.css.\n\nCheck correctness - these look like shadcn-style components. Look for any obvious bugs, imports (calendar.tsx imports from \"cn\" not \"@/lib/utils\" - that might be an issue?), TypeScript correctness, accessibility. Also globals.css adds number input spinner hiding and custom counter text token.\n\nCheck for cleanliness and best practices. Also button.tsx adds cursor-pointer and icon-xl and changes ghost variant. Are these correct? Return review.",
  "subagent_type": "explore"
}
```

**Output:**

````
<task id="ses_ebe7d8070ffe4k6ub40Gp1TNzT" state="completed">
<task_result>
`in-data-[...]` is not a custom variant in shadcn css and not found in tailwind dist (grep maybe failed due to minified). Tailwind v4 does support `in-data-*` as a "in-*" variant combined with data attribute: `in-data-[slot=...]` means "when a parent has data-slot=...". Tailwind v4 does have `in-*` variants (e.g. `in-focus`?). Actually Tailwind v4 has `in-*` variant that applies when the element is a descendant of the matched state: `in-data-[...]:`. Yes, Tailwind v4.0 introduced `in-*` variant (opposite of `group-*`). E.g., `in-hover:`. And `in-data-[state=open]:`. So `in-data-[slot=card-content]:bg-transparent` is valid Tailwind v4. Good. The grep didn't find because minified. Fine.

Now `bg-background`: used in sidebar (pre-existing) and field.tsx (pre-existing). So it's already used and presumably "works" visually? If `--background` is a gradient, `background-color: linear-gradient(...)` is invalid, so bg-background is a no-op. Hmm, but maybe Tailwind's `bg-*` for a theme color maps to `background-color`. So yes invalid. Unless... Actually maybe the intent: since body already has bg-background and body uses `@apply bg-background` too. If it's invalid there, the gradient wouldn't apply. But the `:root` sets `--background` and body has `@apply bg-background text-foreground`. If invalid, background-color wouldn't be set. But maybe the gradient never displayed? This is a pre-existing concern outside the diff. However, since calendar.tsx (new) uses bg-background, and the user asked about correctness, I should note it as a latent issue: defining `--background` as a gradient breaks the `bg-background` utility (invalid background-color). It's worth mentioning but as a pre-existing/root-cause observation, not a bug introduced by calendar per se (calendar just inherits the pattern used elsewhere).

Hmm, but wait: is it possible Tailwind detects that `--background` is not a color and generates `background-image`? No, Tailwind always emits `background-color` for `bg-*` color utilities. So invalid.

Actually, let me reconsider: maybe Tailwind's `@theme inline` with `--color-background: var(--background)` where `--background` is a gradient. When generating `.bg-background { background-color: var(--color-background) }`, and `--color-background` = `var(--background)` which resolves to the gradient string. `background-color: linear-gradient(...)` invalid → the declaration is dropped. So body background gradient would not apply. This seems like a real pre-existing bug. But not in scope; I'll mention briefly under observations.

Now, the number spinner CSS: Note that `input::-webkit-inner-spin-button` with bare `input` — fine. But best practice uses `[type="number"]`. Both work because pseudo only exists on number inputs. Fine.

Let me now also check the `docs` mention? no.

Let me also verify `button.tsx` `active:not-aria-[haspopup]:translate-y-px` — valid Tailwind v4 syntax `not-aria-[haspopup]`? Tailwind v4 has `not-*` variant combined with `aria-*`. `not-aria-[haspopup]` means `:not([aria-haspopup])`. Hmm, `aria-haspopup` is an attribute selector with no value → `[aria-haspopup]`. Valid. Not part of diff anyway.

Now compose the review. Let me structure:

1. Summary
2. The `cn` import question (resolved: it's a real shadcn package, intentional; but inconsistency)
3. Bugs: letter-spacing %, currency-switcher (adjacent)
4. Accessibility
5. TypeScript
6. Style/cleanliness (semicolons, double blank lines, prettier)
7. Button changes assessment
8. globals.css assessment
9. Minor nits
10. Recommendations

Let me be accurate and cite line numbers.

Let me double-check the dialog.tsx issue: `DialogContent` renders `DialogPrimitive.Close asChild` wrapping a `Button`. The button contains `<RiCloseLine />` and sr-only span. Good.

Another potential issue: In dialog.tsx, `DialogOverlay` has `isolate` and `z-50`, content `z-50`. Fine.

Drawer: `DrawerContent` uses `text-popover-foreground` but background uses `before:bg-popover`. Fine. The drawer overlay doesn't have `duration-100` while dialog does; minor inconsistency.

DrawerTitle uses `text-foreground`, DrawerDescription `text-muted-foreground`. Fine.

PopoverTitle: renders div typed as h2. Note.

PopoverContent default `align="center"` and `sideOffset={4}`. Fine.

Now, accessibility: PopoverContent has no `role` (Radix handles). Fine.

One a11y concern: Dialog content uses `outline-none` (not `outline-hidden`); with keyboard focus the dialog content itself gets no visible outline, but focus goes inside. Radix focuses content or first focusable; if content is focusable and outline-none, no visible focus indicator. shadcn latest uses `outline-hidden` which preserves focus-visible ring in forced-colors. Minor. Actually `outline-none` in Tailwind v4 sets `outline-style: none`, which removes outline even in forced-colors, harming Windows High Contrast users. `outline-hidden` is the accessible choice. Popover uses `outline-hidden`; dialog uses `outline-none`. Inconsistent; recommend `outline-hidden`.

Also the calendar day focus ring uses `group-data-[focused=true]/day:ring-[3px]` — good focus visibility.

Let me verify calendar root `Root` component: `({ className, rootRef, ...props })` — react-day-picker v10 Root custom component receives `rootRef`? Let me check shared.d.ts CustomComponents Root signature. Probably `rootRef`. Fine since shadcn template.

Now, a subtle TS issue: `Calendar` props type `React.ComponentProps<typeof DayPicker> & { buttonVariant?: ... }` and `buttonVariant` is destructured out so not passed to DayPicker. Good. `components` destructured and spread into `components={{... , ...components}}`. Good.

Another: `formatters` prop spread after `formatMonthDropdown` so user can override; fine.

`getDefaultClassNames()` called twice (once in Calendar, once in CalendarDayButton) — fine, cheap.

The `CalendarDayButton` `locale` prop type `Partial<Locale>`. `date.toLocaleDateString(locale?.code)` fine.

Now, the `Locale` type from react-day-picker has `code`. Good.

Potential bug in calendar: line 107 `[&:last-child[data-selected=true]_button]` etc. These reference `data-selected=true` on the `<td>` (day cell), not the button. rdp sets `data-selected="true"` on the day cell. Fine, template.

Now, does react-day-picker v10 use `data-selected="true"`? SelectionState enum maps class names but data attributes? shadcn relies on it. Probably fine since shadcn updated.

I think the review is robust. Let me also mention that `cn` from "cn" package is not a type-only concern; it's tree-shakeable.

Let me also note: importing both `cn` implementations means bundle includes both `cn` package AND clsx+tailwind-merge (via lib/utils). Slight bundle duplication. Recommend migrating remaining files or keeping one. Minor.

Now, let me double check whether `cn` package is a devDependency or dependency — it's in dependencies (line 27). Good. pnpm-lock updated.

Also `@base-ui/react` is a dependency; some components maybe use it. Not relevant.

Let me write the review now. I should return file paths as absolute.

Actually, I want to verify the letter-spacing claim isn't wrong: does CSS allow percentage letter-spacing? Let me double check quickly mentally. MDN letter-spacing: `normal | <length>`. Percentages not listed. Confirmed. Some sources: "letter-spacing does not accept percentages". Yes.

Also `--text-counter--letter-spacing: -1.2%` might be intended as percentage-based tracking, but invalid. Recommend `-0.012em` (1.2% of 3rem = 0.036rem = 0.012em) or a plain length.

Now write.

Let me also confirm double blank lines in calendar/dialog as formatting nit. Yes lines 13-15 and 8-10.

Also note calendar line 4 and dialog line 4 and drawer line 3 and popover line 3 all use `from "cn"` without semicolon while button uses `@/lib/utils` with semicolon.

One more: eslint import/order alphabetize would flag? Let's re-verify calendar external imports order: "@remixicon/react", "cn", "react", "react-day-picker". eslint-plugin-import alphabetize case-insensitive ascending: "@remixicon/react" — leading '@' has char code 64, less than letters, so first. "cn" < "react" < "react-day-picker". Good. Then blank line, internal @/components. Good. So lint passes.

But wait: `import * as React from "react"` and `import { DayPicker } from "react-day-picker"` — "react" vs "react-day-picker": is "react" a prefix; "react" < "react-day-picker". Good.

dialog: "@remixicon/react", "cn", "radix-ui", "react". Good.
drawer: "cn", "react", "vaul". Good.
popover: "cn", "radix-ui", "react". Good.

Now, one nuance: import/order groups puts `type` last. In calendar, `type DayButton, type Locale` are inline specifiers within a value import (`import { DayPicker, getDefaultClassNames, type DayButton, type Locale }`), so the whole import is in external group. Good.

Now final answer. I'll be thorough but organized. Include severity levels.

Let me note the adjacent bug in currency-switcher patch (value+defaultValue) since it's part of same feature branch and relates to these components (uses icon-xl). I'll include under "Adjacent" clearly marked out-of-scope.

Also the input line 73 both value and defaultValue: React will warn. Also `value={currency}` makes it controlled hidden input; `defaultValue` ignored. Remove defaultValue or handle.

Let me finalize.

I should double-check: is there an existing prettier config in an editorconfig? No editorconfig found. OK.

Also, the pre-commit hook's `git add .` would stage everything. Since files are already staged but unformatted, either hook not run or `--no-verify`. Note.

Let me write the final review.</think>I have enough context. Here's my review.

---

# UI Component Review

Reviewed (all absolute paths):
- `/Users/tslashdreamy/Documents/Xpensy/components/ui/calendar.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/ui/dialog.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/ui/drawer.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/ui/popover.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/components/ui/button.tsx`
- `/Users/tslashdreamy/Documents/Xpensy/app/globals.css`

## TL;DR

The components are faithful, current shadcn "radix-mira" outputs and are largely correct. `data-open:`/`data-closed:`, `in-data-[...]`, `radix-ui` unified imports, and the unified `cn` package all check out against the installed versions. There is **one real CSS bug** (`letter-spacing: -1.2%`), a **style-consistency problem** (files not run through the project's own Prettier), and a handful of minor accessibility/type nits. One adjacent bug in `currency-switcher.tsx` (same branch, uses your new `icon-xl`) is worth fixing too.

---

## 1. The `cn` import from `"cn"` — not a bug

Your instinct was reasonable, but `import { cn } from "cn"` is correct here:

- `cn` is a real dependency in `package.json` (`"cn": "^0.2.6"`), resolved at `node_modules/cn`.
- It is the **official shadcn class-merge engine** (`github.com/shadcn-ui/cn`, maintained by shadcn + aidenybai), a drop-in replacement for `clsx` + `tailwind-merge`. It exports `{ cn }` with the same variadic API (verified in `node_modules/cn/dist/index.d.ts`).
- `components.json` `aliases.utils` is still `@/lib/utils`, but the latest shadcn registry emits `cn` directly.

One caveat — **inconsistency**: only these four new files import from `"cn"`. `button.tsx` and ~20 other files still import from `@/lib/utils` (the old `clsx` + `tailwind-merge` wrapper). Both work and produce equivalent output, but you now ship **two merge engines** in the bundle. Either migrate everything (`npx shadcn@latest migrate cn`) or keep the `@/lib/utils` convention. Direct `"cn"` is the forward-looking choice; just be deliberate. `lib/utils.ts` can't be simply deleted because it also exports `hasEnvVars`.

## 2. Real bug — invalid `letter-spacing` in `globals.css`

`/Users/tslashdreamy/Documents/Xpensy/app/globals.css:64`

```css
--text-counter--letter-spacing: -1.2%;
````

CSS `letter-spacing` accepts `normal | <length>` only — **percentages are invalid**. Tailwind v4 will emit `letter-spacing: -1.2%` for `.text-counter` (`expense-counter.tsx:14`), and the browser will silently drop the declaration. The intended tracking never applies. Use a length, e.g. `-0.012em` (1.2% of 3rem ≈ 0.012em) or `-0.02em`.

The rest of the token block is valid and idiomatic v4: `--text-counter`, `--text-counter--line-height`, `--text-counter--font-weight` are the correct `--text-*` namespace modifiers.

## 3. `globals.css` spinner override — works, minor concerns

`globals.css:175-187`. Functionally correct (both WebKit and Firefox paths covered; unquoted `input[type=number]` is valid CSS). Two notes:

- It sits **outside any `@layer`**. Unlayered CSS beats Tailwind's layered utilities, so you can no longer re-enable spinners per-input with a utility class. Wrapping in `@layer base` would restore normal cascade expectations.
- Scoping to `input[type="number"]::-webkit-inner-spin-button` is the more conventional/self-documenting form (the current selectors are harmless since the pseudo-elements only exist on number inputs).

## 4. `button.tsx` changes — all correct

- **`cursor-pointer`** (`button.tsx:8`): correct and necessary — Tailwind v4's preflight sets buttons to `cursor: default`, so this restores pointer UX. This is what current shadcn does.
- **`icon-xl`** (`button.tsx:33`): `size-10` with `size-8` icons is proportional (2.5rem / 2rem). Consistent with the other icon sizes. Good.
- **ghost `border-0`** (`button.tsx:18`): fine. Ghost previously relied on the base `border border-transparent`; adding `border-0` zeroes the width. Because the component is rendered through `cn(buttonVariants(...))` (`button.tsx:60`) — i.e. through `twMerge` — `border-0` correctly wins over base `border`. Note: calling `buttonVariants()` **without** `cn` (raw class string) leaves both `border` and `border-0` present; in practice `buttonVariants` is only consumed through `cn`, including in `calendar.tsx:58-67`, so this is fine.

## 5. Accessibility

Overall good: dialog's close control is a real `Button` with an `sr-only` "Close" label (`dialog.tsx:72-82`); dialogs/drawers/popovers use Radix primitives, so roles, focus trapping and Esc handling are inherited; calendar day focus ring is visible (`calendar.tsx:214`).

Minor:

- `dialog.tsx:65` uses `outline-none`, while `popover.tsx:32` uses `outline-hidden`. In Tailwind v4 `outline-none` sets `outline-style: none`, which strips focus outlines even in Windows High Contrast / forced-colors mode. Prefer `outline-hidden` (the current shadcn choice) for consistency and forced-colors safety.
- `DrawerOverlay` (`drawer.tsx:39`) omits the `duration-100` that `DialogOverlay` (`dialog.tsx:43`) has. Cosmetic inconsistency.

## 6. TypeScript

No type errors found. Specifically checked:

- `import { ..., type DayButton } from "react-day-picker"` + `React.ComponentProps<typeof DayButton>` (`calendar.tsx:9,190`) is legal — the `type` modifier only affects emit, and `typeof` resolves in type space.
- `radix-ui` unified package does export `Dialog`, `Popover`, `Slot` (verified `node_modules/radix-ui/dist/index.d.ts:18,38,54`).
- `react-day-picker@10.0.2` still exposes `showWeekNumber` (`props.d.ts:201`) and the class-name keys used (`button_previous`, `button_next`, `month_caption`, `dropdown_root`, `week_number_header`, etc. — `UI.d.ts`).
- `data-open:`/`data-closed:` variants are **not** built into Radix (react-dialog 1.1.19 only emits `data-state`). They are custom variants defined by `@import "shadcn/tailwind.css"` (`node_modules/shadcn/dist/tailwind.css:28-40`), which globals.css imports. So the markup is correct — but be aware these components now **depend on that CSS import**; removing it silently breaks all dialog/drawer/popover animations.

Nit: `PopoverTitle` (`popover.tsx:57-65`) is typed `React.ComponentProps<"h2">` but renders a `<div>`. It works, but the prop types describe an `h2` that never exists. Either render an actual heading element or type it `React.ComponentProps<"div">`.

## 7. Cleanliness / best practices

- **Not Prettier-formatted.** The repo has no Prettier config, so `prettier` uses defaults (`semi: true`, double quotes), and every existing UI file uses semicolons (`card.tsx:1`, `button.tsx`, etc.). The four new files omit semicolons, e.g. `calendar.tsx:4`, `dialog.tsx:4`, `drawer.tsx:3`, `popover.tsx:3`. The `pre-commit` hook runs `pnpm prettier` (`prettier . --write`), so these files were staged without that hook running (or with `--no-verify`). They will be churned the next time anyone commits. Run `pnpm prettier` before finalizing.
- **Double blank lines** after the import block: `calendar.tsx:14-15`, `dialog.tsx:9-10`. Prettier would collapse these.
- Import ordering matches the `import/order` rule in `eslint.config.mjs` (external alphabetical, blank line, then `@/` internal). Good.

## 8. Adjacent bug (out of scope, same branch)

`/Users/tslashdreamy/Documents/Xpensy/components/currency-switcher.tsx:73`

```tsx
<input type="hidden" name={name} value={currency} defaultValue={defaultValue} />
```

Passing both `value` and `defaultValue` to the same input triggers React's "both value and defaultValue props" warning; `defaultValue` is ignored. Since `value={currency}` is state-driven (controlled), drop `defaultValue`, or use `defaultValue` and apply `name` for uncontrolled form usage. This file also consumes the new `size="icon-xl"`, so it's part of the same component work.

---

## Suggested fixes (priority order)

1. **`globals.css:64`** — replace `-1.2%` with a length (`-0.012em`). _(real bug)_
2. **Run `pnpm prettier`** across the four new files (semicolons + blank lines). _(consistency with repo tooling)_
3. **`dialog.tsx:65`** — `outline-none` → `outline-hidden`. _(a11y / consistency)_
4. **`currency-switcher.tsx:73`** — remove the conflicting `defaultValue`. _(React warning)_
5. Decide on one `cn` source (`"cn"` vs `@/lib/utils`) and migrate or standardize.
6. Optional: wrap the spinner override in `@layer base`; retype `PopoverTitle` to a `div`/heading; align drawer overlay transition duration.

No blocking correctness issues in `calendar.tsx`/`dialog.tsx`/`drawer.tsx`/`popover.tsx` beyond the above; the `data-open`/`data-closed` and `cn` patterns are intentional and valid for this stack.
</task_result>
</task>

```

---

## Assistant (Plan · Big Pickle · 79.0s)

Let me synthesize all the reviews I've gathered. The reviews from the subagents are comprehensive. Let me look for the most critical issues that need attention - there are some real bugs. Let me summarize the findings clearly.

Key issues to highlight:
1. **Critical**: `CurrencySwitcher` ignores `defaultValue` and can reset currency after failed form submission (add-expense-component review) - also both value and defaultValue on hidden input
2. **Critical**: In `addExpense.ts`, `Number(formData.get())` on empty string gives 0; `String(formData.get())` gives "null" for absent fields - causes data corruption/validation bypass
3. **Critical**: Amount validation max doesn't match DB (NUMERIC(12,2) max 9.99e9 vs Number.MAX_SAFE_INTEGER) and no 2-decimal enforcement
4. **Critical**: Returning `creationError.details` leaks DB internals
5. **Important**: DatePicker date round-trip issue (toDateString vs UTC parsing)
6. **Important**: getUserExpenses doesn't filter collection_id IS NULL but is used for "personal" total; also swallows errors
7. **Important**: globals.css has invalid `letter-spacing: -1.2%`
8. **Minor**: Prettier formatting (missing semicolons), a11y issues (icon-only buttons, no labels)

But the user asked to "review" - in plan mode I just need to present the plan/findings. Let me structure this clearly with prioritized action items.Let me provide a comprehensive review summary. I've analyzed all the changes. Here are the findings:

## Summary

The changes introduce a functional expense entry flow (modal/drawer), homepage UI, sidebar profile display, and several new UI primitives. Overall the architecture is sound (server components + Suspense + server actions + zod v4). However, there are several correctness issues, mostly around form data coercion, validation bounds, error handling, and a few minor UI bugs.

## Critical Issues (blockers)

### 1. addExpense.ts - Data coercion bugs
**File**: `lib/actions/addExpense.ts:43-46`

- `Number(formData.get("expenseAmount"))` with empty string returns `0` → after a failed validation, the form repopulates the amount field with `0` (user never typed this).
- `String(formData.get("expenseDescription"))` / `String(formData.get("expenseCategory"))` return `"null"` when the field is absent → can silently corrupt data and bypasses validation intent. Also `z.exactOptional` is ineffective here.
- Fix: check for `null`/`""` before coercing; trim strings; use `typeof === "string"` guard.

### 2. addExpense.ts - Validation doesn't match DB
**File**: `lib/actions/addExpense.ts:30,33`

- `max(Number.MAX_SAFE_INTEGER)` allows values > `NUMERIC(12,2)` max (`9,999,999,999.99`) → will pass zod but fail at Postgres with overflow. Add `max(9_999_999_999.99)` and consider `multipleOf(0.01)`.
- `z.currencyCode()` accepts any ISO-4217 code, but UI only supports 4 currencies. Validate against the supported set or a shared constant to avoid storing un-displayable values.

### 3. addExpense.ts - Error leakage
**File**: `lib/actions/addExpense.ts:92`

- Returns `creationError.details` directly to client. Can be `null` (empty message) and may leak schema/constraint details. Log server-side, return generic message.

### 4. CurrencySwitcher - resets state after failed submit
**File**: `components/currency-switcher.tsx:40,73`

- State initialized to `"USD"`, ignores `defaultValue` from form state. After validation failure, currency silently resets to USD.
- Hidden input has both `value` and `defaultValue` (React warning). Make controlled properly (init from `defaultValue` with guard, drop `defaultValue`).

## Important Issues

### 5. Date handling (timezone/roundtrip)
**Files**: `components/form-fields/date-picker.tsx:26-28,34`, `components/forms/add-expense-form.tsx:78`, `lib/actions/addExpense.ts:47`

- Form passes `state.values?.expenseDate?.toDateString()` back to DatePicker. Server created Date from `"YYYY-MM-DD"` (UTC midnight). `toDateString()` uses server local TZ → can shift to previous day on repopulation.
- DatePicker state ignores `defaultValue` after mount (it’s the component’s own state). Also `new Date(String(defaultValue))` with arbitrary string is fragile.
- Fix: pass `yyyy-MM-dd` end-to-end (use `toISOString().slice(0,10)` or `format(date,'yyyy-MM-dd')`), parse with `parseISO` and validate `isValid`.

### 6. Expense counter semantics
**Files**: `components/expense-counter/expense-counter.tsx:8-9`, `lib/actions/getUserExpenses.ts:21-24`

- Sums mixed currencies with `+` → meaningless total (e.g., 100 USD + 100 UAH = 200). The adjacent CurrencySwitcher doesn’t convert.
- `getUserExpenses` does not filter `collection_id IS NULL` but the counter is shown on the "personal" homepage — shared expenses are included. Either filter for personal or clarify the scope.
- Swallows Supabase errors (returns `null` → renders `0`). Distinguish "no data" vs "query failed".
- Also use `?? 0` instead of `|| 0`.

### 7. Profile query ignores errors
**File**: `lib/actions/getUserProfile.ts:19-23`

- Uses `.single()` but ignores `error`. Returns `null` for missing profile and for actual errors. Distinguish `PGRST116` (no row) from real failures; consider `.maybeSingle()`.

### 8. CSS bug
**File**: `app/globals.css:64`

- `--text-counter--letter-spacing: -1.2%` is invalid CSS (percentages not allowed for `letter-spacing`). Browser drops it. Use `-0.012em` or similar length.

## Minor Issues

### 9. Formatting / tooling
**Files**: `components/ui/calendar.tsx`, `dialog.tsx`, `drawer.tsx`, `popover.tsx`

- Missing semicolons; extra blank lines. Repo has Prettier configured (hook runs `prettier --write`). These files weren’t formatted. Run `pnpm prettier` to avoid churn.

### 10. Accessibility
**Files**: `components/add-expense-component/add-expense-trigger.tsx`, `components/home-actions.tsx`, `components/currency-switcher.tsx`, `components/forms/add-expense-form.tsx`

- Icon-only buttons have no accessible names (Add, Limit, Hide). Add `aria-label`/`title`.
- Amount input has no visible label (only placeholder). Add `<FieldLabel>` or `aria-label="Amount"`.
- Currency button announces only symbol/flag with no context. Add `aria-label` like `Currency: USD`.
- Form errors on currency are never rendered (not passed to CurrencySwitcher). Wire `state.error?.expenseCurrency`.
- `dialog.tsx:65` uses `outline-none` instead of `outline-hidden` (forced-colors a11y consistency).

### 11. Cleanliness nits
- `components/ui/calendar.tsx:4` imports `cn` from `"cn"` while most files import from `@/lib/utils`. Both work; pick one for consistency (reduces bundle duplication).
- `components/app-sidebar/app-sidebar.tsx` is declared `async` but has no `await`. Remove `async`.
- `ProfileItem` returns `undefined` when no profile; prefer `null`.
- `FormFieldProps.error` is required but could be optional for reusable field.
- Missing semicolon in `lib/actions/addExpense.ts:98` (cosmetic).

## Positive Notes

- zod v4 APIs (`currencyCode()`, `treeifyError()`, `exactOptional()`) are valid in v4.6.7 (the last point is just misapplied given current coercion).
- TypeScript compiles cleanly aside from pre-existing generated types.
- Good use of Suspense + server components, responsive modal/drawer split, and `useActionState` wiring.
- UI primitives follow shadcn patterns and use Radix correctly.
- Auth handled server-side via `supabase.auth.getUser()` before DB ops.
- Schema/RLS docs added provide useful context.

## Recommended Priority

1. Fix coercion in `addExpense.ts` (empty string → 0, "null" strings).
2. Fix CurrencySwitcher controlled/uncontrolled + defaultValue.
3. Tighten validation bounds (amount max/precision, currency allowlist).
4. Stop leaking DB error details.
5. Fix date formatting roundtrip (pass `yyyy-MM-dd` consistently).
6. Decide on expense counter scope (personal vs all; mixed-currency semantics) and error handling.
7. Fix globals.css `letter-spacing` length.
8. Run Prettier; add basic a11y labels.

All changes are localized and testable. No architectural blockers once the coercion/validation issues are addressed.

---

```
