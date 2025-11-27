"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "./button"

export function HouseFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [country, setCountry] = useState(searchParams.get("country") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")

  const handleApply = () => {
    const params = new URLSearchParams()
    if (country) params.set("country", country)
    if (minPrice) params.set("min_price", minPrice)
    if (maxPrice) params.set("max_price", maxPrice)

    router.push(`/houses?${params.toString()}`)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 h-fit">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Country or City"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-primary"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-primary"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-primary"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleApply} className="w-full mt-2">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

