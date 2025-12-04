"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "../login/actions"
import { useFilterModalSafe } from "./filter-modal-context"

export function Header({
  showProfile = false,
  showFilters = false,
}: {
  showProfile?: boolean
  showFilters?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const filterModal = useFilterModalSafe()

  const handleLogout = async () => {
    await logoutUser()
    router.push("/login")
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="w-full py-6 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full container mx-auto px-4">
        <div className="flex justify-between items-center lg:grid lg:grid-cols-[250px_1fr] lg:gap-8 lg:items-center">
          {/* Logo section - aligns with filter */}
          <div className="flex justify-start items-center lg:w-full">
            <Link href="/" className="block">
              <Image
                src="/logo.svg"
                alt="TTTalk Logo"
                width={165}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Profile section - aligns with house cards */}
          <div className="relative flex items-center gap-2 justify-end lg:w-full">
            {/* Mobile filter button */}
            {showFilters && filterModal && (
              <button
                onClick={() => filterModal?.setIsOpen(true)}
                className="lg:hidden flex items-center justify-center px-4 py-2 bg-whitehouses/g67Trn4oAHain3jGwUlm1FLVUt9joEjAkdZ9Mhi2.jpg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </button>
            )}

            {showProfile && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-gray-300 ring-opacity-5 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
