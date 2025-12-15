"use client"

import { useSearchParams } from "next/navigation"
import { parseISO, isValid, differenceInDays } from "date-fns"
import { useMemo } from "react"
import { useActivityCart } from "./activity-cart-context"

interface PriceDisplayProps {
  pricePerNight: number
}

export function PriceDisplay({ pricePerNight }: PriceDisplayProps) {
  const searchParams = useSearchParams()
  const startDate = searchParams.get("start_date")
  const endDate = searchParams.get("end_date")
  const { activities } = useActivityCart()

  // Calculate activity prices (only activities with prices > 0)
  const { activityTotal, activitiesWithPrice } = useMemo(() => {
    const activitiesWithPrice = activities.filter(
      (activity) => Number(activity.payment_amount) > 0,
    )
    const total = activitiesWithPrice.reduce(
      (sum, activity) => sum + Number(activity.payment_amount),
      0,
    )
    return {
      activityTotal: total,
      activitiesWithPrice: activitiesWithPrice.length,
    }
  }, [activities])

  // Calculate number of days
  const { days, totalPrice, displayKey } = useMemo(() => {
    if (!startDate || !endDate) {
      return { days: null, totalPrice: null, displayKey: "per-night" }
    }

    try {
      const start = parseISO(startDate)
      const end = parseISO(endDate)

      if (!isValid(start) || !isValid(end) || end <= start) {
        return { days: null, totalPrice: null, displayKey: "per-night" }
      }

      const calculatedDays = differenceInDays(end, start)
      if (calculatedDays <= 0) {
        return { days: null, totalPrice: null, displayKey: "per-night" }
      }

      const housePrice = pricePerNight * calculatedDays
      const calculatedPrice = housePrice + activityTotal
      return {
        days: calculatedDays,
        totalPrice: calculatedPrice,
        displayKey: `${calculatedDays}-${calculatedPrice.toFixed(2)}-${activitiesWithPrice}`,
      }
    } catch {
      return { days: null, totalPrice: null, displayKey: "per-night" }
    }
  }, [startDate, endDate, pricePerNight, activityTotal, activitiesWithPrice])

  // If no dates selected, show per night price
  if (!days || !totalPrice) {
    return (
      <div className="flex items-baseline gap-2 mt-4 mb-2">
        <span
          key="per-night-price"
          className="text-2xl font-bold text-primary transition-all duration-300 ease-in-out"
        >
          €{pricePerNight.toFixed(2)}
        </span>
        <span
          key="per-night-label"
          className="text-gray-500 text-sm transition-all duration-300 ease-in-out"
        >
          / night
        </span>
      </div>
    )
  }

  // Show total price for selected days
  const activityText =
    activitiesWithPrice > 0
      ? ` and ${activitiesWithPrice} ${activitiesWithPrice === 1 ? "activity" : "activities"}`
      : ""

  return (
    <div className="flex flex-col gap-1 mt-4 mb-2">
      <div className="flex items-baseline gap-2">
        <span
          key={`price-${displayKey}`}
          className="text-2xl font-bold text-primary inline-block animate-[priceUpdate_0.3s_ease-in-out]"
        >
          €{totalPrice.toFixed(2)}
        </span>
        <span
          key={`days-${displayKey}`}
          className="text-gray-500 text-sm inline-block animate-[priceUpdate_0.3s_ease-in-out]"
        >
          for {days} {days === 1 ? "day" : "days"}
          {activityText}
        </span>
      </div>
    </div>
  )
}
