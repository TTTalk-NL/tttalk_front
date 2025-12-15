"use client"

import Image from "next/image"
import { X, Clock } from "lucide-react"
import { useActivityCart } from "./activity-cart-context"
import { Activity } from "../activities-definitions"
import { useActivityModal } from "./activity-modal-context"

interface BookingActivitiesListProps {
  backendUrl?: string
}

export function BookingActivitiesList({
  backendUrl = "http://localhost:8080",
}: BookingActivitiesListProps) {
  const { activities, removeActivity } = useActivityCart()
  const { openModal } = useActivityModal()

  if (activities.length === 0) {
    return null
  }

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return "/placeholder-house.jpg"
    if (imageUrl.startsWith("http")) return imageUrl
    return `${backendUrl}/storage/${imageUrl.replace(/^\/+/, "")}`
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Added Activities
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {activities.map((activity) => {
          const price = Number(activity.payment_amount)
          const isFree = price === 0
          const firstImage =
            activity.images && activity.images.length > 0
              ? getImageUrl(activity.images[0].image_url)
              : "/placeholder-house.jpg"

          return (
            <div
              key={activity.id}
              onClick={(e) => {
                // Don't open modal if clicking the remove button
                if ((e.target as HTMLElement).closest("button[aria-label]")) {
                  return
                }
                openModal(activity)
              }}
              className="group relative shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all min-w-[160px] max-w-[160px] cursor-pointer active:scale-95"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                  src={firstImage}
                  alt={activity.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="160px"
                  unoptimized={
                    firstImage.includes("localhost") ||
                    firstImage.includes("192.168") ||
                    firstImage.startsWith("http://")
                  }
                />
                {/* Price badge overlay */}
                <div className="absolute top-1.5 left-1.5 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-primary shadow-sm">
                    {isFree ? "Free" : `€${price.toFixed(2)}`}
                  </span>
                </div>
                {/* Remove button - aligned with chip */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeActivity(activity.id)
                  }}
                  className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  aria-label="Remove activity"
                >
                  <X className="w-3 h-3 text-gray-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-1.5">
                <h4 className="text-xs font-semibold text-gray-900 line-clamp-1 mb-1 leading-tight">
                  {activity.title}
                </h4>
                {activity.start_time && activity.end_time && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock className="w-2.5 h-2.5" />
                    <span>
                      {activity.start_time.split(":").slice(0, 2).join(":")} -{" "}
                      {activity.end_time.split(":").slice(0, 2).join(":")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
