"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface BackLinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
  useBrowserBack?: boolean
}

export function BackLink({
  href,
  children,
  className,
  useBrowserBack = true,
}: BackLinkProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Build URL with preserved filters if href is provided or browser back isn't used
  const buildUrlWithFilters = () => {
    if (href) return href

    const params = new URLSearchParams()

    // Preserve all filter-related params from current URL
    const filterParams = [
      "search",
      "min_price",
      "max_price",
      "bedrooms",
      "guests",
      "bathrooms",
      "start_date",
      "end_date",
      "page",
    ]

    filterParams.forEach((key) => {
      const value = searchParams.get(key)
      if (value) {
        params.set(key, value)
      }
    })

    // Handle property_type array
    const propertyTypes = searchParams.getAll("property_type")
    propertyTypes.forEach((type) => {
      params.append("property_type", type)
    })

    const queryString = params.toString()
    return queryString ? `/houses?${queryString}` : "/houses"
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Use browser back if enabled (preserves all query params from history)
    if (useBrowserBack) {
      e.preventDefault()
      router.back()
      return
    }
    // Let the default Link behavior handle it
  }

  const defaultHref = buildUrlWithFilters()
  const linkContent = children || (
    <>
      <ArrowLeft className="w-4 h-4" />
      <span>Back to listings</span>
    </>
  )

  return (
    <Link href={defaultHref} onClick={handleClick} className={className}>
      {linkContent}
    </Link>
  )
}
