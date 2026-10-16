import {
  RiPieChartLine as LimitIcon,
  RiEyeOffLine as HideIcon,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";

import AddExpense from "./add-expense-component/add-expense-component";

export default function HomeActions() {
  return (
    <div className="flex gap-3">
      <Button className="rounded-full size-10" variant="outline">
        <LimitIcon className="size-4" />
      </Button>
      <AddExpense />
      <Button className="rounded-full size-10" variant="outline">
        <HideIcon className="size-4" />
      </Button>
    </div>
  );
}
