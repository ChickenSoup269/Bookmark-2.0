"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export default function ScrollToTop({
  isDarkMode,
  isChatbotVisible,
}: {
  isDarkMode: boolean
  isChatbotVisible: boolean
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-4 p-3 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-110 z-50 ${
        isDarkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      } ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"} ${
        isChatbotVisible ? "bottom-18" : "bottom-4"
      }`}
      style={{ transformOrigin: "bottom right" }}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6 pixelated" />
    </button>
  )
}
