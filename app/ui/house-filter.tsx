"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Guesthouse", "Hotel"]

export function HouseFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.getAll("property_type") || [],
  )
  // Keeping price for now as it's useful
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "1")
  const [bathrooms, setBathrooms] = useState(
    searchParams.get("bathrooms") || "1",
  )

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (minPrice) params.set("min_price", minPrice)
      if (maxPrice) params.set("max_price", maxPrice)
      if (bedrooms) params.set("bedrooms", bedrooms)
      if (bathrooms) params.set("bathrooms", bathrooms)
      selectedTypes.forEach((type) => {
        params.append("property_type", type)
      })
      router.push(`/houses?${params.toString()}`)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [search, minPrice, maxPrice, bedrooms, bathrooms, selectedTypes, router])

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

  const [isOpen, setIsOpen] = useState(false)

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
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-primary transition-colors"
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
        <h3 className="font-medium text-gray-900 mb-3">
          Bedrooms and Bathrooms
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Bedrooms</label>
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
                className="w-20 h-10 border-y border-gray-300 text-center focus:outline-none text-sm cursor-default"
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
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
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
                className="w-20 h-10 border-y border-gray-300 text-center focus:outline-none text-sm cursor-default"
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
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-primary text-sm"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-primary text-sm"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full justify-center"
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
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
          Filters
        </button>
      </div>

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
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 h-fit p-4">
        {filterContent}
      </div>
    </>
  )
}
