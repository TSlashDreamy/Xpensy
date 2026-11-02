import {
  RiFoldersLine as CollectionsIcon,
  RiHistoryLine as HistoryIcon,
} from "@remixicon/react";
import { Suspense } from "react";

import ExpenseCounter from "@/components/expense-counter/expense-counter";
import ExpenseCounterSkeleton from "@/components/expense-counter/expense-counter-skeleton";
import HomeActions from "@/components/home-actions/home-actions";
import HomeActionsSkeleton from "@/components/home-actions/home-actions-skeleton";
import LastExpenses from "@/components/last-expenses/last-expenses";
import LastExpensesSkeleton from "@/components/last-expenses/last-expenses-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Homepage() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="w-full flex justify-end">
        <Button data-icon="inline-start" variant="secondary">
          <CollectionsIcon /> Personal expenses
        </Button>
      </div>
      <div className="min-h-0 w-full flex flex-1 flex-col justify-center items-center gap-4">
        <Suspense fallback={<ExpenseCounterSkeleton />}>
          <ExpenseCounter />
        </Suspense>
        <Suspense fallback={<HomeActionsSkeleton />}>
          <HomeActions />
        </Suspense>
      </div>
      <div className="-mb-12 h-30 flex flex-col items-center gap-3.5 shrink-0 overflow-hidden">
        <Badge variant="secondary">
          <HistoryIcon />
          Latest expenses
        </Badge>
        <Suspense fallback={<LastExpensesSkeleton />}>
          <LastExpenses />
        </Suspense>
      </div>
    </div>
  );
}
