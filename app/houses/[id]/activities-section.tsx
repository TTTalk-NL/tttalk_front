"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Activity } from "../activities-definitions"
import { useActivityModal } from "./activity-modal-context"

interface ActivitiesSectionProps {
  activities: Activity[]
  backendUrl?: string
}

export function ActivitiesSection({
  activities,
  backendUrl = "http://localhost:8080",
}: ActivitiesSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const { openModal } = useActivityModal()
  // Track which items should be visible (for animation)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

  // When showAll changes to true, animate new items in with staggered delays
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []

    if (showAll && activities.length > 4) {
      // Stagger the animation of new items
      activities.slice(4).forEach((activity, idx) => {
        const timeoutId = setTimeout(() => {
          setVisibleItems((prev) => new Set([...prev, activity.id]))
        }, idx * 100) // 100ms stagger
        timeoutIds.push(timeoutId)
      })
    } else if (!showAll) {
      // Reset when collapsing
      setVisibleItems(new Set())
    }

    // Cleanup: clear all timeouts on unmount or when dependencies change
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [showAll, activities])

  if (!activities || activities.length === 0) {
    return null
  }

  const displayedActivities = showAll ? activities : activities.slice(0, 4)
  const hasMore = activities.length > 4

  return (
    <div className="md:hidden w-full">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activities</h2>
        <div className="grid grid-cols-2 mb-8" style={{ gap: "0.75rem" }}>
          {displayedActivities.map((activity, index) => {
            const firstImage =
              activity.images && activity.images.length > 0
                ? activity.images[0].image_url
                : "/placeholder-house.jpg"
            const isNewActivity = index >= 4
            // New items start hidden, then become visible via state
            const isVisible = !isNewActivity || visibleItems.has(activity.id)

            return (
              <div
                key={activity.id}
                onClick={() => openModal(activity)}
                className="relative w-full rounded-lg overflow-hidden bg-gray-100 group cursor-pointer m-0 transition-all duration-500 ease-out"
                style={{
                  aspectRatio: "4/3",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(1rem)",
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
          })}
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary rounded-lg hover:bg-primary/5"
          >
            {showAll
              ? "Show less"
              : `Show more (${activities.length - 4} more)`}
          </button>
        )}
      </div>
    </div>
  )
}
