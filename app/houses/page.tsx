import { Suspense } from "react"
import { Header } from "../ui/header"
import { HouseCard } from "../ui/house-card"
import { HouseFilter } from "../ui/house-filter"
import { DateFilter } from "../ui/date-filter"
import { Pagination } from "../ui/pagination"
import { FilterModalProvider } from "../ui/filter-modal-context"
import { getHouses } from "./actions"
import { HousesFilter } from "./definitions"

export default async function HousesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  const filters: HousesFilter = {
    search: searchParams?.search as string,
    country: searchParams?.country as string,
    min_price: searchParams?.min_price
      ? Number(searchParams.min_price)
      : undefined,
    max_price: searchParams?.max_price
      ? Number(searchParams.max_price)
      : undefined,
    guests: searchParams?.guests ? Number(searchParams.guests) : undefined,
    bedrooms: searchParams?.bedrooms
      ? Number(searchParams.bedrooms)
      : undefined,
    bathrooms: searchParams?.bathrooms
      ? Number(searchParams.bathrooms)
      : undefined,
    start_date: searchParams?.start_date as string,
    end_date: searchParams?.end_date as string,
    page: searchParams?.page ? Number(searchParams.page) : 1,
    // Handle property_type which can be string or string[]
    property_type: searchParams?.property_type
      ? Array.isArray(searchParams.property_type)
        ? searchParams.property_type
        : [searchParams.property_type]
      : undefined,
  }

  // success/message might be undefined if using direct pagination response,
  // but we updated definitions to include optional success/message.
  // Since getHouses now returns { ...data, success: true }, we can check success.
  const response = await getHouses(filters)

  const houses = response.data || []
  const isSuccess = response.success !== false // Assume success unless explicitly false

  return (
    <FilterModalProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header showProfile={true} showFilters={true} />

        <main className="grow container mx-auto px-4 py-0 sm:py-8 relative">
          <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-8">
            {/* Filters Section */}
            <aside className="w-full">
              <div className="sticky top-24 lg:top-[calc(4rem+1.5rem)]">
                <Suspense fallback={<div>Loading filters...</div>}>
                  <HouseFilter />
                </Suspense>
              </div>
            </aside>

            {/* Houses Grid Section */}
            <div className="w-full">
              <div className="mb-6 w-full overflow-hidden">
                <div className="flex justify-start sm:justify-center items-center gap-2 sm:gap-6 w-full min-w-0">
                  <Suspense fallback={null}>
                    <DateFilter />
                  </Suspense>
                </div>
              </div>

              {!isSuccess ? (
                <div className="text-center py-10 text-red-500">
                  <p>Error: {response.message || "Failed to load houses"}</p>
                </div>
              ) : houses.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <h3 className="text-xl font-medium">No houses found</h3>
                  <p className="mt-2">Try adjusting your search filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {houses.map((house) => (
                      <HouseCard key={house.id} house={house} />
                    ))}
                  </div>

                  <div className="mt-8">
                    <Pagination
                      currentPage={response.current_page}
                      lastPage={response.last_page}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </FilterModalProvider>
  )
}
