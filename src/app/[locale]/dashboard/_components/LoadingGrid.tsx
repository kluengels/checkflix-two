import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingGrid() {
  return (
    <div className="container my-12">
      <div className="grid gap-5 sm:grid-cols-12">
        <Skeleton className="h-[200px] w-full sm:col-span-12" />
        <Skeleton className="h-[400px] w-full sm:col-span-12 xl:col-span-8" />
        <Skeleton className="h-[400px] w-full sm:col-span-12 xl:col-span-4" />
        <Skeleton className="h-[300px] w-full sm:col-span-12 lg:col-span-5" />
        <Skeleton className="h-[300px] w-full sm:col-span-12 lg:col-span-7" />
        <Skeleton className="h-[300px] w-full sm:col-span-6" />
        <Skeleton className="h-[300px] w-full sm:col-span-6" />
        <Skeleton className="h-[200px] w-full sm:col-span-12" />
      </div>
    </div>
  );
}
