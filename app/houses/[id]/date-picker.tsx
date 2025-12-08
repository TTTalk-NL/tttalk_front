"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { format, parseISO, isValid } from "date-fns"
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

interface DatePickerProps {
  initialStartDate?: string
  initialEndDate?: string
  houseId: number
}

export function DatePicker({
  initialStartDate,
  initialEndDate,
  houseId,
}: DatePickerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State holds string values "YYYY-MM-DD"
  const [startDate, setStartDate] = useState<string>(initialStartDate || "")
  const [endDate, setEndDate] = useState<string>(initialEndDate || "")

  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  // Sync state to URL when dates change
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (startDate) params.set("start_date", startDate)
      else params.delete("start_date")

      if (endDate) params.set("end_date", endDate)
      else params.delete("end_date")

      const newUrl = `/houses/${houseId}?${params.toString()}`
      const currentStartDate = searchParams.get("start_date")
      const currentEndDate = searchParams.get("end_date")

      // Only update if dates actually changed
      if (startDate !== currentStartDate || endDate !== currentEndDate) {
        router.push(newUrl, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, router, houseId])

  // Helper to convert string state to Date object for the Calendar component
  const getDateObject = (dateString: string) => {
    if (!dateString) return undefined
    const date = parseISO(dateString)
    return isValid(date) ? date : undefined
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 w-full">
      {/* --- START DATE PICKER --- */}
      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 sm:gap-3 bg-white px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border transition-all cursor-pointer flex-1 min-w-0 group",
              isStartOpen
                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                : "border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Check-in
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 sm:truncate">
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
              "flex items-center gap-1.5 sm:gap-3 bg-white px-2 sm:px-4 py-2 sm:py-3 rounded-2xl border transition-all cursor-pointer flex-1 min-w-0 group",
              isEndOpen
                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                : "border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md",
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Check-out
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 sm:truncate">
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
            // Disable dates before start date (or before today if no start date)
            disabled={(date) =>
              startDate
                ? date < parseISO(startDate)
                : date < new Date(new Date().setHours(0, 0, 0, 0))
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
