"use server"

import { cookies } from "next/headers"
import { HousesResponse, HousesFilter, House } from "./definitions"
import { ActivitiesResponse } from "./activities-definitions"

export async function getHouses(
  filters?: HousesFilter,
): Promise<HousesResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

  // Build query string from filters
  const searchParams = new URLSearchParams()
  if (filters) {
    if (filters.search) searchParams.append("search", filters.search)

    // Keep other filters
    if (filters.country) searchParams.append("country", filters.country)
    if (filters.city) searchParams.append("city", filters.city)

    if (filters.min_price)
      searchParams.append("min_price", filters.min_price.toString())
    if (filters.max_price)
      searchParams.append("max_price", filters.max_price.toString())
    if (filters.guests) searchParams.append("guests", filters.guests.toString())
    if (filters.bedrooms)
      searchParams.append("bedrooms", filters.bedrooms.toString())
    if (filters.bathrooms)
      searchParams.append("bathrooms", filters.bathrooms.toString())
    if (filters.start_date)
      searchParams.append("start_date", filters.start_date)
    if (filters.end_date) searchParams.append("end_date", filters.end_date)
    if (filters.page) searchParams.append("page", filters.page.toString())

    if (filters.property_type && filters.property_type.length > 0) {
      // Append property_type[] array convention usually expected by PHP/Laravel
      filters.property_type.forEach((type) => {
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

export async function getHouseById(id: number): Promise<House | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

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

    const response = await fetch(`${baseUrl}/traveller/houses/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Error fetching house: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error("Fetch House Error:", error)
    return null
  }
}

export async function getActivitiesByUserId(
  userId: number,
): Promise<ActivitiesResponse | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

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

    const response = await fetch(
      `${baseUrl}/traveller/activities/user/${userId}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error(`Error fetching activities: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Fetch Activities Error:", error)
    return null
  }
}

export async function addFavorite(houseId: number): Promise<{
  success: boolean
  message?: string
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

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

    const response = await fetch(
      `${baseUrl}/traveller/houses/${houseId}/favorite`,
      {
        method: "POST",
        headers,
        cache: "no-store",
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: errorData.message || "Failed to add favorite",
      }
    }

    const data = await response.json()
    return {
      success: true,
      message: data.message || "House added to favorites successfully",
    }
  } catch (error) {
    console.error("Add Favorite Error:", error)
    return {
      success: false,
      message: "An error occurred while adding the house to favorites",
    }
  }
}

export async function removeFavorite(houseId: number): Promise<{
  success: boolean
  message?: string
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

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

    const response = await fetch(
      `${baseUrl}/traveller/houses/${houseId}/unfavorite`,
      {
        method: "POST",
        headers,
        cache: "no-store",
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: errorData.message || "Failed to remove favorite",
      }
    }

    const data = await response.json()
    return {
      success: true,
      message: data.message || "House removed from favorites successfully",
    }
  } catch (error) {
    console.error("Remove Favorite Error:", error)
    return {
      success: false,
      message: "An error occurred while removing the house from favorites",
    }
  }
}
