"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { addFavorite, removeFavorite } from "../actions"

interface FavoriteButtonProps {
  houseId: number
  initialIsFavorite: boolean
}

export function FavoriteButton({
  houseId,
  initialIsFavorite,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Sync with prop changes (e.g., after refresh)
  useEffect(() => {
    setIsFavorite(initialIsFavorite)
  }, [initialIsFavorite])

  const handleFavoriteClick = async () => {
    if (isLoading) return

    // Optimistic update
    const previousState = isFavorite
    setIsFavorite(!previousState)
    setIsLoading(true)

    try {
      const result = isFavorite
        ? await removeFavorite(houseId)
        : await addFavorite(houseId)

      if (!result.success) {
        // Revert on error
        setIsFavorite(previousState)
        console.error("Error updating favorite:", result.message)
        return
      }

      // Refresh to get updated state from backend
      router.refresh()
    } catch (error) {
      console.error("Error updating favorite:", error)
      // Revert on error
      setIsFavorite(previousState)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFavoriteClick}
      className={`p-1 rounded-full transition-colors hover:bg-gray-100 ${
        isFavorite ? "text-primary" : "text-gray-400 hover:text-primary"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isFavorite ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  )
}
