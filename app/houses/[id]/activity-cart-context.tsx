"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Activity } from "../activities-definitions"

interface ActivityCartContextType {
  activities: Activity[]
  addActivity: (activity: Activity) => void
  removeActivity: (activityId: number) => void
  clearCart: () => void
  isInCart: (activityId: number) => boolean
}

const ActivityCartContext = createContext<ActivityCartContextType | undefined>(
  undefined,
)

export function ActivityCartProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])

  const addActivity = (activity: Activity) => {
    setActivities((prev) => {
      // Check if activity already exists
      if (prev.some((a) => a.id === activity.id)) {
        return prev
      }
      return [...prev, activity]
    })
  }

  const removeActivity = (activityId: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId))
  }

  const clearCart = () => {
    setActivities([])
  }

  const isInCart = (activityId: number) => {
    return activities.some((a) => a.id === activityId)
  }

  return (
    <ActivityCartContext.Provider
      value={{
        activities,
        addActivity,
        removeActivity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </ActivityCartContext.Provider>
  )
}

export function useActivityCart() {
  const context = useContext(ActivityCartContext)
  if (context === undefined) {
    throw new Error("useActivityCart must be used within ActivityCartProvider")
  }
  return context
}
