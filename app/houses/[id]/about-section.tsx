"use client"

import { useState, useRef, useEffect } from "react"

interface AboutSectionProps {
  description: string
}

export function AboutSection({ description }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (textRef.current && !isExpanded) {
      // Check if content is truncated by comparing scrollHeight to clientHeight
      const isTruncated =
        textRef.current.scrollHeight > textRef.current.clientHeight
      setShowButton(isTruncated)
    } else if (isExpanded) {
      // When expanded, always show the button (as "Show less")
      setShowButton(true)
    }
  }, [description, isExpanded])

  if (!description) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          About this place
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          No description available.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        About this place
      </h2>
      <div className="prose prose-gray max-w-none">
        <p
          ref={textRef}
          className={`text-gray-600 leading-relaxed whitespace-pre-line transition-all duration-300 ${
            isExpanded ? "" : "line-clamp-10"
          }`}
        >
          {description}
        </p>
      </div>
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}
