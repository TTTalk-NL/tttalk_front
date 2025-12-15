"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, MouseEvent, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { House } from "../houses/definitions"
import { addFavorite, removeFavorite } from "../houses/actions"

interface HouseCardProps {
  house: House
}

export function HouseCard({ house }: HouseCardProps) {
  const [isFavorite, setIsFavorite] = useState(house.is_favorite || false)
  const [isLoading, setIsLoading] = useState(false)
  const [hostname, setHostname] = useState("")
  const searchParams = useSearchParams()

  // Sync with prop changes (e.g., after refresh)
  useEffect(() => {
    setIsFavorite(house.is_favorite || false)
  }, [house.is_favorite])

  /**
   * Backend base URL for images.
   */
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

  /**
   * Extract the main image from payload
   */
  const rawImage =
    house.images?.[0]?.image_url || house.images?.[0]?.path || null

  /**
   * Normalize URL base logic
   */
  let imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND}/storage/${rawImage.replace(/^\/+/, "")}`
    : "/placeholder-house.jpg"

  // Fix hydration mismatch: Access window only in useEffect
  useEffect(() => {
    // Use setTimeout to avoid synchronous state update warning
    const timer = setTimeout(() => {
      setHostname(window.location.hostname)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Apply hostname replacement only if we have a hostname (client-side)
  if (hostname && imageUrl.includes("localhost")) {
    imageUrl = imageUrl.replace("localhost", hostname)
  }

  /**
   * Disable optimization for localhost and LAN IPs
   */
  const disableOptimization =
    imageUrl.includes("192.168.50.204") ||
    imageUrl.includes("localhost") ||
    (hostname ? imageUrl.includes(hostname) : false)

  /**
   * Handle favorite toggle without navigating
   */
  const handleFavoriteClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading) return

    // Optimistic update
    const previousState = isFavorite
    setIsFavorite(!previousState)
    setIsLoading(true)

    try {
      const result = isFavorite
        ? await removeFavorite(house.id)
        : await addFavorite(house.id)

      if (!result.success) {
        // Revert on error
        setIsFavorite(previousState)
        console.error("Error updating favorite:", result.message)
      }
    } catch (error) {
      console.error("Error updating favorite:", error)
      // Revert on error
      setIsFavorite(previousState)
    } finally {
      setIsLoading(false)
    }
  }

  // Build URL preserving all filter parameters
  const buildHouseUrl = () => {
    const baseUrl = `/houses/${house.id}`
    const params = new URLSearchParams()

    // Preserve all filter params from the current URL
    const filterParams = [
      "search",
      "min_price",
      "max_price",
      "bedrooms",
      "guests",
      "bathrooms",
      "start_date",
      "end_date",
      "property_type",
    ]

    filterParams.forEach((param) => {
      const values = searchParams.getAll(param)
      if (values.length > 0) {
        values.forEach((value) => {
          params.append(param, value)
        })
      }
    })

    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  return (
    <Link
      href={buildHouseUrl()}
      className="group block rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={house.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized={disableOptimization}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 relative">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 w-full pr-8">
            {/* Price */}
            <p className="text-xl font-bold text-primary">
              €{Number(house.price_per_night).toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">
                / night
              </span>
            </p>

            {/* Title */}
            <h3 className="font-medium text-gray-900 line-clamp-1">
              {house.title}
            </h3>

            {/* Location */}
            <p className="text-sm text-gray-500">
              {house.city}, {house.address}
            </p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute right-0 top-1 p-1 rounded-full transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
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
        </div>
      </div>
    </Link>
  )
}
