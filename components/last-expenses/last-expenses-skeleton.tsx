import { Skeleton } from "@/components/ui/skeleton";

export default function LastExpensesSkeleton() {
  return (
    <div className="flex flex-col gap-3.5">
      <Skeleton className="h-13 w-lg" />
      <Skeleton className="h-13 w-lg" />
      <Skeleton className="h-13 w-lg" />
    </div>
  );
}
