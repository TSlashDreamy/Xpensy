import { RiFoldersLine as CollectionsIcon } from "@remixicon/react";
import { Suspense } from "react";

import ExpenseCounter from "@/components/expense-counter/expense-counter";
import ExpenseCounterSkeleton from "@/components/expense-counter/expense-counter-skeleton";
import HomeActions from "@/components/home-actions/home-actions";
import HomeActionsSkeleton from "@/components/home-actions/home-actions-skeleton";
import LastExpenses from "@/components/last-expenses/last-expenses";
import LastExpensesSkeleton from "@/components/last-expenses/last-expenses-skeleton";
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
        <Suspense fallback={<HomeActionsSkeleton />}>
          <HomeActions />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<LastExpensesSkeleton />}>
          <LastExpenses />
        </Suspense>
      </div>
    </>
  );
}
