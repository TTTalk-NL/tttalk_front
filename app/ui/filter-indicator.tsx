"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useFilterModalSafe } from "./filter-modal-context"

export function useFilterIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filterModal = useFilterModalSafe()

  // Check if filters are active
  // Don't check if modal is open (might have temporary values)
  if (filterModal?.isOpen) return false

  // Only check on houses listing page (not detail pages)
  if (pathname !== "/houses") return false

  try {
    // If no query params at all, definitely no filters
    if (searchParams.toString().trim() === "") {
      return false
    }

    // Remove page and date parameters as they're not filters
    const paramsWithoutPage = new URLSearchParams(searchParams)
    paramsWithoutPage.delete("page")
    paramsWithoutPage.delete("start_date")
    paramsWithoutPage.delete("end_date")

    // If only page/date parameters existed, no filters
    if (paramsWithoutPage.toString().trim() === "") {
      return false
    }

    // Now check each filter - be very strict
    const search = paramsWithoutPage.get("search")?.trim()
    if (search && search.length > 0) {
      return true
    }

    const country = paramsWithoutPage.get("country")?.trim()
    if (country && country.length > 0) {
      return true
    }

    const city = paramsWithoutPage.get("city")?.trim()
    if (city && city.length > 0) {
      return true
    }

    const minPrice = paramsWithoutPage.get("min_price")?.trim()
    if (minPrice && minPrice !== "0") {
      const priceNum = Number(minPrice)
      if (!isNaN(priceNum) && priceNum > 0) {
        return true
      }
    }

    const maxPrice = paramsWithoutPage.get("max_price")?.trim()
    if (maxPrice && maxPrice !== "0") {
      const priceNum = Number(maxPrice)
      if (!isNaN(priceNum) && priceNum > 0) {
        return true
      }
    }

    const guestsValue = paramsWithoutPage.get("guests")
    if (guestsValue && guestsValue !== "1") {
      const guestsNum = Number(guestsValue)
      if (!isNaN(guestsNum) && guestsNum > 1) {
        return true
      }
    }

    const bedroomsValue = paramsWithoutPage.get("bedrooms")
    if (bedroomsValue && bedroomsValue !== "1") {
      const bedroomsNum = Number(bedroomsValue)
      if (!isNaN(bedroomsNum) && bedroomsNum > 1) {
        return true
      }
    }

    const bathroomsValue = paramsWithoutPage.get("bathrooms")
    if (bathroomsValue && bathroomsValue !== "1") {
      const bathroomsNum = Number(bathroomsValue)
      if (!isNaN(bathroomsNum) && bathroomsNum > 1) {
        return true
      }
    }

    const propertyTypes = paramsWithoutPage.getAll("property_type")
    if (propertyTypes.length > 0) {
      const hasValidType = propertyTypes.some((type) => type.trim() !== "")
      if (hasValidType) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}
