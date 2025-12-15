import { notFound } from "next/navigation"
import { getHouseById, getActivitiesByUserId } from "../actions"
import { Header } from "@/app/ui/header"
import { BackLink } from "@/app/ui/back-link"
import { DatePicker } from "./date-picker"
import { PriceDisplay } from "./price-display"
import { GuestsSelector } from "./guests-selector"
import { ImageCarousel } from "./image-carousel"
import { ActivitiesSection } from "./activities-section"
import { AboutSection } from "./about-section"
import { OffersSection } from "./offers-section"
import { FavoriteButton } from "./favorite-button"
import { HostedBySection } from "./hosted-by-section"
import { ActivityCartProvider } from "./activity-cart-context"
import { ActivityModalProvider } from "./activity-modal-context"
import { ActivityModalWrapper } from "./activity-modal-wrapper"
import { BookingActivitiesList } from "./booking-activities-list"
import { MapPin, Star } from "lucide-react"

export default async function HouseDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const houseId = parseInt(id)

  const startDate = resolvedSearchParams?.start_date as string | undefined
  const endDate = resolvedSearchParams?.end_date as string | undefined

  if (isNaN(houseId)) {
    notFound()
  }

  const house = await getHouseById(houseId)

  if (!house) {
    notFound()
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

  const sortedImages = house.images
    ? [...house.images].sort((a, b) => a.order - b.order)
    : []

  const getImageUrl = (image: { path?: string; image_url?: string }) => {
    const rawImage = image.image_url || image.path
    if (!rawImage) return "/placeholder-house.jpg"
    if (rawImage.startsWith("http")) return rawImage
    return `${BACKEND}/storage/${rawImage.replace(/^\/+/, "")}`
  }

  const processedImages = sortedImages.map((image) => ({
    id: image.id,
    url: getImageUrl(image),
  }))

  const activitiesResponse = house.created_by?.id
    ? await getActivitiesByUserId(house.created_by.id)
    : null
  const activities = activitiesResponse?.data || []

  return (
    <ActivityCartProvider key={houseId} houseId={houseId}>
      <ActivityModalProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <ActivityModalWrapper backendUrl={BACKEND} />
          <Header showProfile={true} showFilters={false} />

          <main className="grow container mx-auto px-4 py-6 sm:py-8">
            <BackLink className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6" />

            {/* FIX 1: Removed `items-start`. 
           This allows the Grid Items to stretch to the full height of the row(s).
           The Right Column will now stretch to match the combined height of the Left Column items.
        */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* 1. IMAGES (Left Top on Desktop) */}
              <div className="lg:col-start-1">
                <ImageCarousel
                  images={processedImages}
                  title={house.title}
                  activities={activities}
                  backendUrl={BACKEND}
                />
              </div>

              {/* 2. BOOKING CARD (Right Column on Desktop) 
             FIX 2: Added `h-full`.
             FIX 3: Increased `row-span` to ensure it covers all left-side content.
          */}
              <div className="lg:col-start-2 lg:row-start-1 lg:row-span-6 relative z-10 h-full">
                <div className="sticky top-24 space-y-8">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
                    <div className="px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h1 className="text-xl font-bold text-gray-900 flex-1">
                          {house.title}
                        </h1>
                        <FavoriteButton />
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          {house.city}, {house.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          <span className="font-semibold text-sm text-gray-900">
                            4.8
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          (24 reviews)
                        </span>
                      </div>

                      <PriceDisplay
                        pricePerNight={Number(house.price_per_night)}
                      />
                    </div>

                    <div className="px-4 sm:px-8 py-3 sm:py-4 flex flex-col mt-4">
                      <div className="mb-4">
                        <DatePicker
                          initialStartDate={startDate}
                          initialEndDate={endDate}
                          houseId={houseId}
                        />
                      </div>

                      <GuestsSelector maxGuests={house.guests} />

                      <BookingActivitiesList backendUrl={BACKEND} />

                      <div className="mt-4">
                        <button className="w-full bg-primary text-white mb-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                          Reserve
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-0">
                          You won&apos;t be charged yet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. ACTIVITIES (Mobile Only) */}
              <div className="block lg:hidden">
                <ActivitiesSection
                  activities={activities}
                  backendUrl={BACKEND}
                />
              </div>

              {/* 4. OFFERS (Left Column on Desktop) */}
              <div className="lg:col-start-1">
                <OffersSection
                  propertyType={house.property_type}
                  guests={house.guests}
                  bedrooms={house.bedrooms}
                  beds={house.beds}
                  bathrooms={house.bathrooms}
                  amenities={house.amenities}
                />
              </div>

              {/* 5. ABOUT (Left Column on Desktop) */}
              <div className="lg:col-start-1">
                <AboutSection description={house.description || ""} />
              </div>

              {/* 6. HOSTED BY (Left Column on Desktop) */}
              {house.created_by && (
                <div className="lg:col-start-1">
                  <HostedBySection
                    host={house.created_by}
                    backendUrl={BACKEND}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </ActivityModalProvider>
    </ActivityCartProvider>
  )
}
