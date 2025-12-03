"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FilterModalContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const FilterModalContext = createContext<FilterModalContextType | undefined>(
  undefined,
)

export function FilterModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FilterModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </FilterModalContext.Provider>
  )
}

export function useFilterModal() {
  const context = useContext(FilterModalContext)
  return context
}

