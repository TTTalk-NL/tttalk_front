"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  useCallback,
  ReactNode,
} from "react"
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

function getStorageKey(houseId?: number): string {
  return houseId ? `tttalk_activity_cart_${houseId}` : "tttalk_activity_cart"
}

function loadActivitiesFromStorage(houseId?: number): Activity[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const storageKey = getStorageKey(houseId)
    const stored = localStorage.getItem(storageKey)
    if (!stored) {
      return []
    }
    return JSON.parse(stored) as Activity[]
  } catch {
    return []
  }
}

function saveActivitiesToStorage(activities: Activity[], houseId?: number) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const storageKey = getStorageKey(houseId)
    localStorage.setItem(storageKey, JSON.stringify(activities))
  } catch {
    // Ignore storage errors
  }
}

interface ActivityCartProviderProps {
  children: ReactNode
  houseId?: number
}

export function ActivityCartProvider({
  children,
  houseId,
}: ActivityCartProviderProps) {
  const storeRef = useRef<{
    activities: Activity[]
    listeners: Set<() => void>
    isMounted: boolean
  }>({
    activities: [],
    listeners: new Set(),
    isMounted: false,
  })

  // Initialize activities from localStorage on mount
  useEffect(() => {
    storeRef.current.isMounted = true
    storeRef.current.activities = loadActivitiesFromStorage(houseId)
    // Notify listeners that initial state is loaded
    storeRef.current.listeners.forEach((listener) => listener())
  }, [houseId])

  const subscribe = useCallback((listener: () => void) => {
    const store = storeRef.current
    store.listeners.add(listener)
    return () => {
      store.listeners.delete(listener)
    }
  }, [])

  const getSnapshot = useCallback(() => {
    return storeRef.current.activities
  }, [])

  // Use useSyncExternalStore to sync with our internal store
  // Server snapshot is empty array to ensure hydration match
  const activities = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => [], // Server snapshot (empty array for SSR)
  )

  const setActivities = (newActivities: Activity[]) => {
    const store = storeRef.current
    store.activities = newActivities
    if (store.isMounted) {
      saveActivitiesToStorage(newActivities, houseId)
    }
    store.listeners.forEach((listener) => listener())
  }

  const addActivity = (activity: Activity) => {
    const current = storeRef.current.activities
    // Check if activity already exists
    if (current.some((a) => a.id === activity.id)) {
      return
    }
    setActivities([...current, activity])
  }

  const removeActivity = (activityId: number) => {
    const current = storeRef.current.activities
    setActivities(current.filter((a) => a.id !== activityId))
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
