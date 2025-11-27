import Image from "next/image"
import Link from "next/link"
import { House } from "../houses/definitions"

interface HouseCardProps {
  house: House
}

export function HouseCard({ house }: HouseCardProps) {
  // Use the first image or a placeholder
  // Payload provides 'image_url' in images array which is already a full URL
  const mainImage =
    house.images && house.images.length > 0
      ? house.images[0].image_url || house.images[0].path
      : "/placeholder-house.jpg"

  // If we fallback to 'path' (e.g. 'houses/filename.jpg'), ensure it's a full URL
  // However, the payload example shows 'image_url' is already absolute: "http://localhost:8080/storage/houses/..."
  // So we prioritize that.
  const imageUrl = mainImage?.startsWith("http")
    ? mainImage
    : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/storage/${mainImage}`

  return (
    <Link
      href={`/houses/${house.id}`}
      className="group block rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={house.title}
          fill
          unoptimized={imageUrl.includes("localhost")} // Disable optimization for localhost to avoid loopback issues
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate pr-2">
            {house.title}
          </h3>
          <div className="flex items-center gap-1">
            <svg
              className="h-4 w-4 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">4.8</span>{" "}
            {/* Placeholder for rating if available */}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {house.city}, {house.country}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-gray-900">
            €{Number(house.price_per_night).toFixed(2)}
          </span>{" "}
          <span className="text-gray-500">night</span>
        </p>
      </div>
    </Link>
  )
}
