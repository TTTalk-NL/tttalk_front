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
    if (filters.country) searchParams.append("country", filters.country)
    if (filters.city) searchParams.append("city", filters.city)
    if (filters.min_price)
      searchParams.append("min_price", filters.min_price.toString())
    if (filters.max_price)
      searchParams.append("max_price", filters.max_price.toString())
    if (filters.guests) searchParams.append("guests", filters.guests.toString())
    if (filters.page) searchParams.append("page", filters.page.toString())
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
