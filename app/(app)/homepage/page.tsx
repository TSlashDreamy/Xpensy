import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function Homepage() {
  return (
    <div className="w-full flex flex-col flex-1 items-center gap-2 p-4">
      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre className="w-full max-w-5xl text-xs font-mono p-3 rounded border overflow-auto">
        <Suspense>
          <UserDetails />
        </Suspense>
      </pre>
    </div>
  );
}
