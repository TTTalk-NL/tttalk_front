import Link from "next/link"
import { Header } from "@/app/ui/header"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showProfile={true} showFilters={false} />
      <main className="grow container mx-auto px-4 py-6 sm:py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">House Not Found</h1>
          <p className="text-gray-600 mb-8">
            The house you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/houses"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </main>
    </div>
  )
}






