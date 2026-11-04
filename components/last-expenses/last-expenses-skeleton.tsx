import { Skeleton } from "@/components/ui/skeleton";

export default function LastExpensesSkeleton() {
  return (
    <div className="h-30 flex flex-col items-center gap-3.5 shrink-0 overflow-hidden">
      <Skeleton className="h-5 w-28 shrink-0 rounded-full" />
      <Skeleton className="h-13 w-lg shrink-0" />
      <Skeleton className="h-13 w-lg shrink-0" />
      <Skeleton className="h-13 w-lg shrink-0" />
    </div>
  );
}
