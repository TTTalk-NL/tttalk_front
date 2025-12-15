"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Activity } from "../activities-definitions"

interface ActivityModalContextType {
  selectedActivity: Activity | null
  isModalOpen: boolean
  openModal: (activity: Activity) => void
  closeModal: () => void
}

const ActivityModalContext = createContext<
  ActivityModalContextType | undefined
>(undefined)

export function ActivityModalProvider({ children }: { children: ReactNode }) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedActivity(null)
  }

  return (
    <ActivityModalContext.Provider
      value={{
        selectedActivity,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ActivityModalContext.Provider>
  )
}

export function useActivityModal() {
  const context = useContext(ActivityModalContext)
  if (context === undefined) {
    throw new Error(
      "useActivityModal must be used within ActivityModalProvider",
    )
  }
  return context
}
