"use client"

import { useState } from "react"
import {
  Home,
  Users,
  Bed,
  Bath,
  CheckCircle,
  Wifi,
  LucideIcon,
  Car,
  Dumbbell,
  Tv,
  Waves,
  Wind,
  Sparkles,
  Droplets,
  Building,
  Building2,
  WashingMachine,
  Flame,
} from "lucide-react"
import { Amenity } from "../definitions"

// Map amenity names to icons (case-insensitive matching)
function getAmenityIcon(amenityName: string): LucideIcon {
  const name = amenityName.toLowerCase()

  // Wi-Fi
  if (name.includes("wi-fi") || name.includes("wifi")) {
    return Wifi
  }

  // Parking
  if (name.includes("parking")) {
    return Car
  }

  // Gym
  if (name.includes("gym") || name.includes("fitness")) {
    return Dumbbell
  }

  // TV
  if (name.includes("tv") || name.includes("television")) {
    return Tv
  }

  // Hot tub
  if (name.includes("hot tub") || name.includes("jacuzzi")) {
    return Waves
  }

  // Pool
  if (name.includes("pool") || name.includes("swimming")) {
    return Waves
  }

  // Air conditioning
  if (
    name.includes("air conditioning") ||
    name.includes("ac") ||
    name.includes("a/c")
  ) {
    return Wind
  }

  // Hair dryer
  if (name.includes("hair dryer") || name.includes("hairdryer")) {
    return Sparkles
  }

  // Hot water
  if (name.includes("hot water")) {
    return Droplets
  }

  // Single level home
  if (name.includes("single level")) {
    return Building
  }

  // Multiple level home
  if (name.includes("multiple level") || name.includes("multi level")) {
    return Building2
  }

  // Washer
  if (
    name.includes("washer") ||
    name.includes("washing machine") ||
    name.includes("laundry")
  ) {
    return WashingMachine
  }

  // Heating
  if (name.includes("heating") || name.includes("heater")) {
    return Flame
  }

  // Default fallback icon
  return CheckCircle
}

interface OffersSectionProps {
  propertyType: string
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities?: Amenity[]
}

export function OffersSection({
  propertyType,
  guests,
  bedrooms,
  beds,
  bathrooms,
  amenities = [],
}: OffersSectionProps) {
  const [showAmenities, setShowAmenities] = useState(false)

  const hasAmenities = amenities && amenities.length > 0

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        What this place offers
      </h2>

      {/* Basic property details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-primary" />
          <span className="text-gray-700">{propertyType}</span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-gray-700">{guests} guests</span>
        </div>
        <div className="flex items-center gap-3">
          <Bed className="w-5 h-5 text-primary" />
          <span className="text-gray-700">
            {bedrooms} bedrooms, {beds} beds
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Bath className="w-5 h-5 text-primary" />
          <span className="text-gray-700">{bathrooms} bathrooms</span>
        </div>
      </div>

      {/* Amenities section - shown when expanded */}
      {hasAmenities && showAmenities && (
        <div
          className="mt-6 pt-6 border-t border-gray-200 transition-all duration-500 ease-out"
          style={{
            opacity: showAmenities ? 1 : 0,
            transform: showAmenities ? "translateY(0)" : "translateY(-1rem)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amenities.map((amenity, index) => {
              const IconComponent = getAmenityIcon(amenity.name)
              return (
                <div
                  key={amenity.id}
                  className="flex items-center gap-3 transition-all duration-300 ease-out"
                  style={{
                    opacity: showAmenities ? 1 : 0,
                    transform: showAmenities
                      ? "translateY(0)"
                      : "translateY(0.5rem)",
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <IconComponent className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-gray-700 text-sm">{amenity.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Show more/less button */}
      {hasAmenities && (
        <button
          onClick={() => setShowAmenities(!showAmenities)}
          className="mt-6 w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary rounded-lg hover:bg-primary/5"
        >
          {showAmenities ? "Show less" : `Show amenities (${amenities.length})`}
        </button>
      )}
    </div>
  )
}
