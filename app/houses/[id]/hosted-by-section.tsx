import Image from "next/image"
import { HouseOwner } from "../definitions"

interface HostedBySectionProps {
  host: HouseOwner
  backendUrl: string
}

export function HostedBySection({ host, backendUrl }: HostedBySectionProps) {
  const getPhotoUrl = () => {
    const rawPhoto = host.photo_url || host.photo
    if (!rawPhoto) return null
    if (rawPhoto.startsWith("http")) return rawPhoto
    return `${backendUrl}/storage/${rawPhoto.replace(/^\/+/, "")}`
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const photoUrl = getPhotoUrl()
  const hasPhoto = photoUrl !== null

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Hosted by</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
          {hasPhoto ? (
            <Image
              src={photoUrl}
              alt={host.name}
              fill
              className="object-cover"
              sizes="64px"
              unoptimized={
                photoUrl.includes("localhost") ||
                photoUrl.includes("192.168") ||
                photoUrl.startsWith("http://")
              }
            />
          ) : (
            <span className="text-primary font-semibold text-lg">
              {getInitials(host.name)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-base">{host.name}</p>
          {host.city && (
            <p className="text-sm text-gray-500 mt-1">{host.city}</p>
          )}
        </div>
      </div>
    </div>
  )
}
