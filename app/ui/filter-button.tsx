"use client"

import { useFilterModalSafe } from "./filter-modal-context"
import { useFilterIndicator } from "./filter-indicator"

export function FilterButton({
  filterModal,
}: {
  filterModal: ReturnType<typeof useFilterModalSafe>
}) {
  const hasFilters = useFilterIndicator()

  return (
    <button
      onClick={() => filterModal?.setIsOpen(true)}
      className="lg:hidden flex items-center justify-center px-4 py-2 bg-whitehouses/g67Trn4oAHain3jGwUlm1FLVUt9joEjAkdZ9Mhi2.jpg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-5 h-5 ${hasFilters ? "text-primary" : "text-gray-700"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
        />
      </svg>
    </button>
  )
}
