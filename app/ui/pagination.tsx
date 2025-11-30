"use client"

import Link from "next/link"
import { useSearchParams, usePathname } from "next/navigation"
import clsx from "clsx"

interface PaginationProps {
  currentPage: number
  lastPage: number
}

export function Pagination({ currentPage, lastPage }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Don't render if there's only one page
  if (lastPage <= 1) return null

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex gap-2">
        {/* Previous Button */}
        <PaginationLink
          href={createPageURL(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          &laquo; Previous
        </PaginationLink>

        {/* Page Numbers */}
        {/* Simple implementation: just show current, prev, next or range. 
            For large ranges, a more complex logic is needed. 
            Here we show all if pages < 7, or a simplified view. */}
        
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => {
          // Logic to truncate can be added here if needed. 
          // For now, displaying all pages if count is small, or simplified range.
          if (
            lastPage > 7 &&
            page !== 1 &&
            page !== lastPage &&
            (page < currentPage - 1 || page > currentPage + 1)
          ) {
            if (page === currentPage - 2 || page === currentPage + 2) {
               return <span key={page} className="px-3 py-2">...</span>
            }
            return null
          }

          return (
            <PaginationLink
              key={page}
              href={createPageURL(page)}
              active={page === currentPage}
            >
              {page}
            </PaginationLink>
          )
        })}

        {/* Next Button */}
        <PaginationLink
          href={createPageURL(currentPage + 1)}
          disabled={currentPage >= lastPage}
        >
          Next &raquo;
        </PaginationLink>
      </nav>
    </div>
  )
}

interface PaginationLinkProps extends React.ComponentProps<typeof Link> {
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}

function PaginationLink({
  active,
  disabled,
  className,
  href,
  children,
  ...props
}: PaginationLinkProps) {
  if (disabled) {
    return (
      <span
        className={clsx(
          "px-3 py-2 rounded-md text-sm font-medium text-gray-400 border border-gray-200 cursor-not-allowed",
          className
        )}
      >
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={clsx(
        "px-3 py-2 rounded-md text-sm font-medium border transition-colors",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

