export function HouseCardSkeleton() {
  return (
    <div className="group block rounded-xl bg-white p-4 shadow-sm border border-gray-100">
      {/* Image Skeleton */}
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-start">
          {/* Title Skeleton */}
          <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />

          {/* Rating Skeleton */}
          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Location Skeleton */}
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />

        {/* Price Skeleton */}
        <div className="mt-1 h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export function HousesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <HouseCardSkeleton key={i} />
      ))}
    </div>
  )
}
