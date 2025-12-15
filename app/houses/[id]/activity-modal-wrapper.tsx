"use client"

import { ActivityModal } from "./activity-modal"
import { useActivityModal } from "./activity-modal-context"

interface ActivityModalWrapperProps {
  backendUrl: string
}

export function ActivityModalWrapper({
  backendUrl,
}: ActivityModalWrapperProps) {
  const { selectedActivity, isModalOpen, closeModal } = useActivityModal()

  return (
    <ActivityModal
      activity={selectedActivity}
      isOpen={isModalOpen}
      onClose={closeModal}
      backendUrl={backendUrl}
    />
  )
}
