"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useFilterModal } from "./filter-modal-context"

const PROPERTY_TYPES = ["Apartment", "Dutch homes", "Villa", "Guesthouse"]

export function HouseFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isOpen, setIsOpen } = useFilterModal()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.getAll("property_type") || [],
  )
  // Keeping price for now as it's useful
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "1")
  const [guests, setGuests] = useState(searchParams.get("guests") || "1")
  const [bathrooms, setBathrooms] = useState(
    searchParams.get("bathrooms") || "1",
  )

  const isInitialMount = useRef(true)
  const isUpdatingFromUrl = useRef(false)
  const lastUrlParams = useRef<string>("")
  const lastFilterState = useRef({
    search,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    guests,
    selectedTypes: selectedTypes.join(","),
  })

  // Sync state from URL when URL changes (e.g., when navigating back)
  useEffect(() => {
    const currentUrlParams = searchParams.toString()

    // Skip if URL hasn't actually changed
    if (currentUrlParams === lastUrlParams.current) {
      return
    }

    // This is a URL change from external source (back button, direct navigation)
    // Update lastUrlParams first to prevent re-triggering
    lastUrlParams.current = currentUrlParams

    const urlSearch = searchParams.get("search") || ""
    const urlMinPrice = searchParams.get("min_price") || ""
    const urlMaxPrice = searchParams.get("max_price") || ""
    const urlBedrooms = searchParams.get("bedrooms") || "1"
    const urlGuests = searchParams.get("guests") || "1"
    const urlBathrooms = searchParams.get("bathrooms") || "1"
    const urlPropertyTypes = searchParams.getAll("property_type")

    // Only update state if values differ, and set flag to prevent URL update loop
    let hasChanges = false
    if (urlSearch !== search) {
      hasChanges = true
      setSearch(urlSearch)
    }
    if (urlMinPrice !== minPrice) {
      hasChanges = true
      setMinPrice(urlMinPrice)
    }
    if (urlMaxPrice !== maxPrice) {
      hasChanges = true
      setMaxPrice(urlMaxPrice)
    }
    if (urlBedrooms !== bedrooms) {
      hasChanges = true
      setBedrooms(urlBedrooms)
    }
    if (urlGuests !== guests) {
      hasChanges = true
      setGuests(urlGuests)
    }
    if (urlBathrooms !== bathrooms) {
      hasChanges = true
      setBathrooms(urlBathrooms)
    }
    if (
      urlPropertyTypes.length !== selectedTypes.length ||
      !urlPropertyTypes.every((type) => selectedTypes.includes(type))
    ) {
      hasChanges = true
      setSelectedTypes(urlPropertyTypes)
    }

    // Set flag only if we made changes, to prevent URL update loop
    if (hasChanges) {
      isUpdatingFromUrl.current = true
      // Reset flag after state updates complete
      setTimeout(() => {
        isUpdatingFromUrl.current = false
      }, 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Update URL when filters change
  useEffect(() => {
    // Skip if we're updating from URL to prevent loops
    if (isUpdatingFromUrl.current) {
      return
    }

    // On initial mount, just sync lastUrlParams and mark as done
    if (isInitialMount.current) {
      isInitialMount.current = false
      lastUrlParams.current = searchParams.toString()
      lastFilterState.current = {
        search,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        guests,
        selectedTypes: selectedTypes.join(","),
      }
      return
    }

    const timer = setTimeout(() => {
      // Check if filters actually changed (not just page)
      const currentFilterState = {
        search,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        guests,
        selectedTypes: selectedTypes.join(","),
      }

      const filtersChanged =
        currentFilterState.search !== lastFilterState.current.search ||
        currentFilterState.minPrice !== lastFilterState.current.minPrice ||
        currentFilterState.maxPrice !== lastFilterState.current.maxPrice ||
        currentFilterState.bedrooms !== lastFilterState.current.bedrooms ||
        currentFilterState.bathrooms !== lastFilterState.current.bathrooms ||
        currentFilterState.guests !== lastFilterState.current.guests ||
        currentFilterState.selectedTypes !==
          lastFilterState.current.selectedTypes

      // Only update URL if filters actually changed
      if (!filtersChanged) {
        return
      }

      // Start with existing params to preserve everything (dates, etc.)
      // We intentionally don't include searchParams in dependencies to avoid
      // resetting page on pagination clicks. We only need dates from it.
      const params = new URLSearchParams()

      // Preserve dates from current URL (only non-filter params we care about)
      const startDate = searchParams.get("start_date")
      const endDate = searchParams.get("end_date")
      if (startDate) params.set("start_date", startDate)
      if (endDate) params.set("end_date", endDate)

      // Update filter params
      if (search) {
        params.set("search", search)
      } else {
        params.delete("search")
      }

      if (minPrice) {
        params.set("min_price", minPrice)
      } else {
        params.delete("min_price")
      }

      if (maxPrice) {
        params.set("max_price", maxPrice)
      } else {
        params.delete("max_price")
      }

      if (bedrooms && bedrooms !== "1") {
        params.set("bedrooms", bedrooms)
      } else {
        params.delete("bedrooms")
      }

      if (guests && guests !== "1") {
        params.set("guests", guests)
      } else {
        params.delete("guests")
      }

      if (bathrooms && bathrooms !== "1") {
        params.set("bathrooms", bathrooms)
      } else {
        params.delete("bathrooms")
      }

      // Update property types - remove all first, then add selected ones
      params.delete("property_type")
      selectedTypes.forEach((type) => {
        params.append("property_type", type)
      })

      // Reset to page 1 when filters change
      params.set("page", "1")
      lastFilterState.current = currentFilterState

      const newParamsString = params.toString()

      // Only update if URL actually changed
      if (newParamsString !== searchParams.toString()) {
        lastUrlParams.current = newParamsString
        router.push(`/houses?${newParamsString}`, { scroll: false })
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
    // searchParams is intentionally omitted from dependencies.
    // We only use it to read dates, and including it would cause the effect
    // to run on every URL change (including pagination), resetting page to 1.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    guests,
    selectedTypes,
    router,
  ])

  // Handle handlers...
  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const handleIncrement = (value: string, setter: (value: string) => void) => {
    const val = parseInt(value) || 0
    if (val < 20) {
      setter((val + 1).toString())
    }
  }

  const handleDecrement = (value: string, setter: (value: string) => void) => {
    const val = parseInt(value) || 0
    if (val > 1) {
      setter((val - 1).toString())
    }
  }

  const handlePriceChange = (
    value: string,
    setter: (value: string) => void,
  ) => {
    // Only allow digits (positive numbers)
    const numericValue = value.replace(/[^0-9]/g, "")
    setter(numericValue)
  }

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const filterContent = (
    <div className="space-y-6">
      {/* 1. Input for City or Address */}
      <div>
        <div className="relative">
          <input
            type="text"
            placeholder="City or Address"
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-primary transition-colors text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 2. Property Type Checkboxes */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Property Type</h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-primary checked:bg-primary"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white h-3.5 w-3.5 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Bedrooms and Bathrooms */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Rooms and Guests</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 min-w-[80px]">Guests</label>
            <div className="flex items-center w-fit">
              <button
                type="button"
                className="w-10 h-10 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDecrement(guests, setGuests)}
                disabled={guests === "1"}
              >
                -
              </button>
              <input
                type="text"
                placeholder="Any"
                readOnly
                className="w-12 h-10 border-y border-gray-300 text-center focus:outline-none text-sm cursor-default"
                value={guests}
              />
              <button
                type="button"
                className="w-10 h-10 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleIncrement(guests, setGuests)}
                disabled={(parseInt(guests) || 0) >= 20}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 min-w-[80px]">
              Bedrooms
            </label>
            <div className="flex items-center w-fit">
              <button
                type="button"
                className="w-10 h-10 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDecrement(bedrooms, setBedrooms)}
                disabled={bedrooms === "1"}
              >
                -
              </button>
              <input
                type="text"
                placeholder="Any"
                readOnly
                className="w-12 h-10 border-y border-gray-300 text-center focus:outline-none text-sm cursor-default"
                value={bedrooms}
              />
              <button
                type="button"
                className="w-10 h-10 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleIncrement(bedrooms, setBedrooms)}
                disabled={(parseInt(bedrooms) || 0) >= 20}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 min-w-[80px]">
              Bathrooms
            </label>
            <div className="flex items-center w-fit">
              <button
                type="button"
                className="w-10 h-10 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDecrement(bathrooms, setBathrooms)}
                disabled={bathrooms === "1"}
              >
                -
              </button>
              <input
                type="text"
                placeholder="Any"
                readOnly
                className="w-12 h-10 border-y border-gray-300 text-center focus:outline-none text-sm cursor-default"
                value={bathrooms}
              />
              <button
                type="button"
                className="w-10 h-10 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleIncrement(bathrooms, setBathrooms)}
                disabled={(parseInt(bathrooms) || 0) >= 20}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Range (Kept but styled) */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range (EUR)</h3>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 lg:flex-1 max-w-[100px] lg:max-w-none">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:outline-primary text-base sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={minPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              €
            </span>
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1 lg:flex-1 max-w-[100px] lg:max-w-none">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:outline-primary text-base sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              €
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Modal (Portal) */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-9999 bg-white w-full h-full overflow-y-auto p-4">
            {/* Mobile Header */}
            <div className="flex justify-between items-center lg:hidden mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {filterContent}
          </div>,
          document.body,
        )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 h-fit p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
        {filterContent}
      </div>
    </>
  )
}
