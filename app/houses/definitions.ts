export interface HouseImage {
  id: number
  house_id: number
  path: string
  order: number
  image_url?: string // Added based on payload
}

export interface House {
  id: number
  title: string
  description: string
  country: string
  city: string
  address: string
  price_per_night: string // Changed from number to string based on payload "10.00"
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  images: HouseImage[]
}

// New Pagination Interface based on Laravel's standard pagination
export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
  path: string
}

export interface HousesResponse {
  data: House[]
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
  // Allow for custom success/message fields if the wrapper adds them, though payload shows direct pagination object
  success?: boolean
  message?: string
}

export interface HousesFilter {
  search?: string // Combined City or Address
  country?: string
  city?: string
  min_price?: number
  max_price?: number
  guests?: number
  bedrooms?: number
  bathrooms?: number
  page?: number
  property_type?: string[] // Array of selected property types
}
