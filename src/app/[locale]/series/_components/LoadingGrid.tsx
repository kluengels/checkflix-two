import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function LoadingGrid() {
  return (
    <div className="container my-12">
      <Skeleton className="my-2 h-[40px] w-[300px]" />
      <Skeleton className="my-2 h-[400px] w-full" />
      <Skeleton className="my-2 h-[40px] w-[300px]" />
      <Skeleton className="my-2 h-[80px] w-[500px]" />

      <div className="my-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {ten.map((i) => (
          <Card key={i} className="">
            <CardContent className="rounded-none">
              <Skeleton className="my-2 h-[200px] flex-grow" />
              <Skeleton className="my-2 h-[20px] flex-grow" />
              <Skeleton className="my-2 h-[10px] flex-grow" />
              <Skeleton className="my-2 h-[15px] flex-grow" />
              <Skeleton className="my-2 h-[10px] flex-grow" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
