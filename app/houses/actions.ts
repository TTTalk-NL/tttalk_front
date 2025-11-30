"use server"

import { cookies } from "next/headers"
import { HousesResponse, HousesFilter } from "./definitions"

export async function getHouses(
  filters?: HousesFilter,
): Promise<HousesResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

  // Build query string from filters
  const searchParams = new URLSearchParams()
  if (filters) {
    // Mapped "search" to "city" for now as per previous logic, or use a generic search param if backend supports it
    // If backend supports 'address' or generic 'q', use that. Assuming 'city' acts as partial search or we send both.
    // For now, sending 'search' as 'city' to keep it simple unless backend is updated.
    // OR: if filters.search is present, maybe send it as 'city' or 'address' or a new 'q' param.
    // Let's assume we map 'search' to 'city' for now to maintain partial compatibility,
    // but ideally this should be a 'search' param on backend.
    if (filters.search) searchParams.append("city", filters.search)

    // Keep other filters
    if (filters.country) searchParams.append("country", filters.country)
    if (filters.city && !filters.search) searchParams.append("city", filters.city) // Avoid duplicate if search is used
    
    if (filters.min_price)
      searchParams.append("min_price", filters.min_price.toString())
    if (filters.max_price)
      searchParams.append("max_price", filters.max_price.toString())
    if (filters.guests) searchParams.append("guests", filters.guests.toString())
    if (filters.bedrooms)
      searchParams.append("bedrooms", filters.bedrooms.toString())
    if (filters.bathrooms)
      searchParams.append("bathrooms", filters.bathrooms.toString())
    if (filters.page) searchParams.append("page", filters.page.toString())
    
    if (filters.property_type && filters.property_type.length > 0) {
        // Append property_type[] array convention usually expected by PHP/Laravel
        filters.property_type.forEach(type => {
            searchParams.append("property_type[]", type)
        })
    }
  }

  const queryString = searchParams.toString()
  const endpoint = `/traveller/houses${queryString ? `?${queryString}` : ""}`

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Error fetching houses: ${response.status}`)
      // Return empty pagination structure on error
      return {
        data: [],
        current_page: 1,
        from: null,
        last_page: 1,
        per_page: 10,
        to: null,
        total: 0,
        success: false,
        message: `Error fetching houses: ${response.status}`,
      }
    }

    const data = await response.json()

    // Directly return the data as it matches the HousesResponse interface (Laravel pagination)
    return {
      ...data,
      success: true,
    }
  } catch (error) {
    console.error("Fetch Houses Error:", error)
    return {
      data: [],
      current_page: 1,
      from: null,
      last_page: 1,
      per_page: 10,
      to: null,
      total: 0,
      success: false,
      message: "Failed to fetch houses",
    }
  }
}
