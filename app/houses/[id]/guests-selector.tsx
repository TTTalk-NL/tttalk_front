"use client"

import { useState } from "react"

interface GuestsSelectorProps {
  maxGuests?: number
  initialAdults?: number
  initialChildren?: number
}

export function GuestsSelector({
  maxGuests,
  initialAdults = 1,
  initialChildren = 0,
}: GuestsSelectorProps) {
  const [adults, setAdults] = useState(initialAdults)
  const [children, setChildren] = useState(initialChildren)

  const totalGuests = adults + children
  const canAddAdults = !maxGuests || totalGuests < maxGuests
  const canAddChildren = !maxGuests || totalGuests < maxGuests

  const handleAdultsChange = (delta: number) => {
    const newAdults = Math.max(1, adults + delta) // Minimum 1 adult
    if (!maxGuests || newAdults + children <= maxGuests) {
      setAdults(newAdults)
    }
  }

  const handleChildrenChange = (delta: number) => {
    const newChildren = Math.max(0, children + delta) // Minimum 0 children
    if (!maxGuests || adults + newChildren <= maxGuests) {
      setChildren(newChildren)
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-primary transition-colors mt-4 mb-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        Guests
      </p>
      <div className="flex flex-col sm:flex-row sm:gap-4">
        {/* Adults */}
        <div className="flex items-center justify-between sm:flex-1">
          <div>
            <p className="text-sm text-gray-900 font-medium">Adults</p>
            <p className="text-xs text-gray-500">Ages 13+</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAdultsChange(-1)
              }}
              disabled={adults <= 1}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {adults}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAdultsChange(1)
              }}
              disabled={
                !canAddAdults || !!(maxGuests && totalGuests >= maxGuests)
              }
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Divider - only visible on mobile */}
        <div className="border-t border-gray-200 my-2 sm:hidden"></div>

        {/* Children */}
        <div className="flex items-center justify-between sm:flex-1 sm:border-l sm:border-gray-200 sm:pl-4">
          <div>
            <p className="text-sm text-gray-900 font-medium">Children</p>
            <p className="text-xs text-gray-500">Ages 2-12</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleChildrenChange(-1)
              }}
              disabled={children <= 0}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {children}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleChildrenChange(1)
              }}
              disabled={
                !canAddChildren || !!(maxGuests && totalGuests >= maxGuests)
              }
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
