"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Check,
} from "lucide-react"
import { format } from "date-fns"
import { Activity } from "../activities-definitions"
import { useActivityCart } from "./activity-cart-context"

interface ActivityModalProps {
  activity: Activity | null
  isOpen: boolean
  onClose: () => void
  backendUrl: string
}

export function ActivityModal({
  activity,
  isOpen,
  onClose,
  backendUrl,
}: ActivityModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addActivity, isInCart } = useActivityCart()

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen || !activity) {
    return null
  }

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder-house.jpg"
    if (imageUrl.startsWith("http")) return imageUrl
    return `${backendUrl}/storage/${imageUrl.replace(/^\/+/, "")}`
  }

  const images =
    activity.images && activity.images.length > 0
      ? activity.images.map((img) => getImageUrl(img.image_url))
      : ["/placeholder-house.jpg"]

  const price = Number(activity.payment_amount)
  const isFree = price === 0

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleAddToCart = () => {
    if (activity) {
      addActivity(activity)
    }
  }

  const isActivityInCart = activity ? isInCart(activity.id) : false

  const formatTime = (timeString: string) => {
    try {
      // Handle time strings in format "HH:mm:ss" or "HH:mm"
      if (timeString.includes(":")) {
        const parts = timeString.split(":")
        return `${parts[0]}:${parts[1]}`
      }
      const date = new Date(timeString)
      return format(date, "HH:mm")
    } catch {
      // If it's already in HH:mm format, return as is
      return timeString.split(":").slice(0, 2).join(":")
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center z-10">
          <div className="flex-1 flex justify-center min-w-0 px-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2 text-center">
              {activity.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors -mr-2"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative w-full aspect-video bg-gray-100">
          {images.length > 0 && (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={activity.title}
                fill
                className="object-cover"
                unoptimized={
                  images[currentImageIndex].includes("localhost") ||
                  images[currentImageIndex].includes("192.168") ||
                  images[currentImageIndex].startsWith("http://")
                }
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Time and Location Info */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col gap-3">
            {/* Time */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatTime(activity.start_time)} -{" "}
                  {formatTime(activity.end_time)}
                </p>
              </div>
            </div>

            {/* Location */}
            {activity.location && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {activity.description}
          </p>
        </div>

        {/* Add to Cart Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
            {isFree ? "Free" : `€${price.toFixed(2)}`}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isActivityInCart}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              isActivityInCart
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {isActivityInCart ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              "Add to cart"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
