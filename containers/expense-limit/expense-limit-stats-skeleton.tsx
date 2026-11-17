import { Skeleton } from "@/components/ui/skeleton";

export default function ExpenseLimitStatsSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="h-5 w-28 shrink-0 rounded-full" />
      <Skeleton className="h-5 w-28 shrink-0 rounded-full" />
    </div>
  );
}
