"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { format, parseISO, isValid, addDays } from "date-fns"
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Helper to ensure we always work with YYYY-MM-DD strings for the URL
function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

function getDefaultDates() {
  const tomorrow = addDays(new Date(), 1)
  const checkOut = addDays(tomorrow, 3)

  return {
    startDate: formatDate(tomorrow),
    endDate: formatDate(checkOut),
  }
}

export function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultDates = useMemo(() => getDefaultDates(), [])

  // State holds string values "YYYY-MM-DD"
  const [startDate, setStartDate] = useState<string>(
    searchParams.get("start_date") || defaultDates.startDate,
  )
  const [endDate, setEndDate] = useState<string>(
    searchParams.get("end_date") || defaultDates.endDate,
  )

  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state to URL with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (startDate) params.set("start_date", startDate)
      else params.delete("start_date")

      if (endDate) params.set("end_date", endDate)
      else params.delete("end_date")

      const newUrl = `/houses?${params.toString()}`
      const currentStartDate = searchParams.get("start_date")
      const currentEndDate = searchParams.get("end_date")

      // Only update if dates actually changed
      if (startDate !== currentStartDate || endDate !== currentEndDate) {
        router.push(newUrl, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, router])

  // Helper to convert string state to Date object for the Calendar component
  const getDateObject = (dateString: string) => {
    const date = parseISO(dateString)
    return isValid(date) ? date : undefined
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full max-w-2xl">
      {/* --- START DATE PICKER --- */}
      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 sm:gap-3 bg-white px-4 py-2 sm:py-3 rounded-2xl border transition-all cursor-pointer flex-1 min-w-0 group",
              isStartOpen
                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                : "border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md",
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Check-in
              </span>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {startDate
                  ? format(parseISO(startDate), "MMM dd, yyyy")
                  : "Select Date"}
              </span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-2xl border-none shadow-xl"
          align="start"
        >
          <Calendar
            mode="single"
            selected={getDateObject(startDate)}
            onSelect={(date) => {
              if (date) {
                setStartDate(formatDate(date))
                setIsStartOpen(false) // Close popover after selection
                // Optional: Auto-open end date if it's before start date
                if (endDate && date > parseISO(endDate)) {
                  setIsEndOpen(true)
                }
              }
            }}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            initialFocus
            className="rounded-2xl border border-primary/20 p-4"
            classNames={{
              day_selected:
                "bg-primary text-white hover:bg-primary/90 focus:bg-primary/90",
              day_today: "bg-primary/10 text-primary",
            }}
          />
        </PopoverContent>
      </Popover>

      {/* --- ARROW ICON --- */}
      <div className="flex items-center shrink-0 text-gray-300">
        <ArrowRight className="w-5 h-5" />
      </div>

      {/* --- END DATE PICKER --- */}
      <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 sm:gap-3 bg-white px-4 py-2 sm:py-3 rounded-2xl border transition-all cursor-pointer flex-1 min-w-0 group",
              isEndOpen
                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                : "border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md",
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Check-out
              </span>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {endDate
                  ? format(parseISO(endDate), "MMM dd, yyyy")
                  : "Select Date"}
              </span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-2xl border-none shadow-xl"
          align="end"
        >
          <Calendar
            mode="single"
            selected={getDateObject(endDate)}
            onSelect={(date) => {
              if (date) {
                setEndDate(formatDate(date))
                setIsEndOpen(false)
              }
            }}
            // Disable dates before start date
            disabled={(date) =>
              startDate ? date < parseISO(startDate) : date < new Date()
            }
            initialFocus
            className="rounded-2xl border border-primary/20 p-4"
            classNames={{
              day_selected:
                "bg-primary text-white hover:bg-primary/90 focus:bg-primary/90",
              day_today: "bg-primary/10 text-primary",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
