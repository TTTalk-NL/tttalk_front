import { Header } from "../ui/header"
import { HousesGridSkeleton } from "../ui/skeletons"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showProfile={true} />

      <main className="grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-8">
          {/* Filters Skeleton Placeholder */}
          <aside className="w-full">
            <div className="sticky top-24">
              <div className="bg-white p-4 rounded-lg border border-gray-200 h-[300px] animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-6" />
                <div className="space-y-6">
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </aside>

          {/* Houses Grid Loading State */}
          <div className="w-full">
            <HousesGridSkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}
