"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Activity } from "../activities-definitions"

interface ImageCarouselProps {
  images: Array<{ id: number; url: string }>
  title: string
  activities?: Activity[]
}

export function ImageCarousel({
  images,
  title,
  activities,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showAllActivities, setShowAllActivities] = useState(false)
  // Track which activity items should be visible (for animation)
  const [visibleActivityItems, setVisibleActivityItems] = useState<Set<number>>(
    new Set(),
  )

  // When showAllActivities changes to true, animate new items in with staggered delays
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []

    if (showAllActivities && activities && activities.length > 4) {
      // Stagger the animation of new items
      activities.slice(4).forEach((activity, idx) => {
        const timeoutId = setTimeout(() => {
          setVisibleActivityItems((prev) => new Set([...prev, activity.id]))
        }, idx * 100) // 100ms stagger
        timeoutIds.push(timeoutId)
      })
    } else if (!showAllActivities) {
      // Reset when collapsing
      setVisibleActivityItems(new Set())
    }

    // Cleanup: clear all timeouts on unmount or when dependencies change
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [showAllActivities, activities])

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    }
    if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Auto-play disabled - users can navigate manually

  if (images.length === 0) {
    return (
      <div className="relative w-full aspect-4/3 md:h-[500px] rounded-xl overflow-hidden bg-gray-100">
        <Image
          src="/placeholder-house.jpg"
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Main Image Container */}
      <div
        className="relative aspect-4/3 md:h-[500px] rounded-xl overflow-hidden bg-gray-100 w-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={image.url}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              unoptimized={
                image.url.includes("localhost") || image.url.includes("192.168")
              }
            />
          </div>
        ))}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Activities or Thumbnail Navigation (Desktop only) */}
      {activities && activities.length > 0 ? (
        <div className="hidden md:block mt-6 w-full">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Activities
            </h2>
            <div
              className={`flex w-full mb-8 transition-all duration-300 ${
                showAllActivities ? "flex-wrap" : ""
              }`}
              style={{ gap: "1.5rem" }}
            >
              {(showAllActivities ? activities : activities.slice(0, 4)).map(
                (activity, index) => {
                  const firstImage =
                    activity.images && activity.images.length > 0
                      ? activity.images[0].image_url
                      : "/placeholder-house.jpg"
                  const isNewActivity = index >= 4
                  // New items start hidden, then become visible via state
                  const isVisible =
                    !isNewActivity || visibleActivityItems.has(activity.id)
                  return (
                    <div
                      key={activity.id}
                      className="relative aspect-4/3 rounded-lg overflow-hidden bg-gray-100 group cursor-pointer shrink-0 m-0 shadow-md hover:shadow-lg transition-all duration-500 ease-out"
                      style={{
                        width: "calc((100% - 1.5rem * 3) / 4)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? "translateY(0)"
                          : "translateY(1rem)",
                      }}
                    >
                      <Image
                        src={firstImage}
                        alt={activity.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized={
                          firstImage.includes("localhost") ||
                          firstImage.includes("192.168")
                        }
                      />
                      {/* Activity title overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white text-xs font-medium line-clamp-2">
                            {activity.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
            {activities.length > 4 && (
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary rounded-lg hover:bg-primary/5"
              >
                {showAllActivities
                  ? "Show less"
                  : `Show more (${activities.length - 4} more)`}
              </button>
            )}
          </div>
        </div>
      ) : (
        images.length > 1 && (
          <div className="hidden md:flex md:gap-2 mt-2 w-full">
            {images.slice(0, 4).map((image, index) => {
              // Calculate width: (100% - 3 gaps) / 4 images
              // gap-2 = 0.5rem = 8px, so 3 gaps = 1.5rem = 24px
              return (
                <button
                  key={image.id}
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    index === currentIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{
                    width: "calc((100% - 1.5rem) / 4)",
                  }}
                >
                  <Image
                    src={image.url}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={
                      image.url.includes("localhost") ||
                      image.url.includes("192.168")
                    }
                  />
                </button>
              )
            })}
          </div>
        )
      )}

      {/* Dot Indicators (Mobile) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
