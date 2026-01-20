import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Spotlight Skeleton */}
      <Skeleton className="w-full aspect-[16/6] rounded-lg" />

      {/* Trending Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-end gap-3">
                <Skeleton className="h-16 w-12" />
                <Skeleton className="h-40 w-28" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-12">
          {/* Columns Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="w-12 h-16 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid-cards">
              {Array.from({ length: 12 }).map((_, i) => (
                 <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-4 w-4/5" />
                 </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-3 space-y-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
