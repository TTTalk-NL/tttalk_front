export interface ActivityImage {
  id: number
  activity_id: number
  image_url: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: number
  user_id: number
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  payment_amount: string
  is_active: boolean
  created_at: string
  updated_at: string
  images: ActivityImage[]
}

export interface ActivitiesResponse {
  current_page: number
  data: Activity[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

