"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getDefaultDates() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const checkOut = new Date(tomorrow)
  checkOut.setDate(checkOut.getDate() + 3)

  return {
    startDate: formatDate(tomorrow),
    endDate: formatDate(checkOut),
  }
}

export function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultDates = useMemo(() => getDefaultDates(), [])
  const [startDate, setStartDate] = useState(
    searchParams.get("start_date") || defaultDates.startDate,
  )
  const [endDate, setEndDate] = useState(
    searchParams.get("end_date") || defaultDates.endDate,
  )

  // Initialize URL with default dates if not present
  useEffect(() => {
    const hasStartDate = searchParams.get("start_date")
    const hasEndDate = searchParams.get("end_date")

    if (!hasStartDate || !hasEndDate) {
      const params = new URLSearchParams(searchParams.toString())
      if (!hasStartDate) params.set("start_date", defaultDates.startDate)
      if (!hasEndDate) params.set("end_date", defaultDates.endDate)
      router.replace(`/houses?${params.toString()}`, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (startDate) params.set("start_date", startDate)
      else params.delete("start_date")

      if (endDate) params.set("end_date", endDate)
      else params.delete("end_date")

      router.push(`/houses?${params.toString()}`, { scroll: false })
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, router])

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 py-2 sm:py-3 rounded-lg border border-gray-200 shadow-md hover:border-primary hover:shadow-lg transition-all flex-1 sm:flex-initial min-w-0">
        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
            Check-in
          </label>
          <input
            type="date"
            className="text-xs sm:text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 py-2 sm:py-3 rounded-lg border border-gray-200 shadow-md hover:border-primary hover:shadow-lg transition-all flex-1 sm:flex-initial min-w-0">
        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
            Check-out
          </label>
          <input
            type="date"
            className="text-xs sm:text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </>
  )
}
