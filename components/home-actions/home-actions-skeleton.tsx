import { Skeleton } from "@/components/ui/skeleton";

export default function HomeActionsSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="rounded-full size-10" />
      <Skeleton className="rounded-full size-10" />
      <Skeleton className="rounded-full size-10" />
    </div>
  );
}
