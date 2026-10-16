import { RiFoldersLine as CollectionsIcon } from "@remixicon/react";
import { Suspense } from "react";

import ExpenseCounter from "@/components/expense-counter/expense-counter";
import ExpenseCounterSkeleton from "@/components/expense-counter/expense-counter-skeleton";
import HomeActions from "@/components/home-actions";
import { Button } from "@/components/ui/button";

export default function Homepage() {
  return (
    <>
      <div className="w-full flex justify-end">
        <Button data-icon="inline-start" variant="secondary">
          <CollectionsIcon /> Personal expenses
        </Button>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <Suspense fallback={<ExpenseCounterSkeleton />}>
          <ExpenseCounter />
        </Suspense>
        <HomeActions />
      </div>
    </>
  );
}
