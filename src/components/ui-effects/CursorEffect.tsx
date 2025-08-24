"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useCursor } from "@/lib/CursorContext"

interface MousePosition {
  x: number
  y: number
}

export default function CursorEffect() {
  const { isDarkMode } = useTheme()
  const { isCursorEnabled } = useCursor()
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })
  const [smoothPosition, setSmoothPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })
  const [isMoving, setIsMoving] = useState(false)
  const animationRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    if (!isCursorEnabled) return

    const animate = () => {
      setSmoothPosition((prev) => {
        const dx = mousePosition.x - prev.x
        const dy = mousePosition.y - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 0.5) {
          return mousePosition
        }

        // Smooth easing with lerp
        const lerp = 0.15 // Adjust for smoothness (0.1-0.3 works well)
        return {
          x: prev.x + dx * lerp,
          y: prev.y + dy * lerp,
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition, isCursorEnabled])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMoving(true)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set moving to false after movement stops
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false)
      }, 100)
    }

    const handleMouseEnter = () => {
      setIsMoving(true)
    }

    const handleMouseLeave = () => {
      setIsMoving(false)
    }

    if (isCursorEnabled) {
      window.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseenter", handleMouseEnter)
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isCursorEnabled])

  if (!isCursorEnabled) return null

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed w-8 h-8 border-2 rounded-full pointer-events-none z-50 transition-all duration-200 ease-out ${
          isDarkMode
            ? "bg-white/10 border-white backdrop-blur-sm"
            : "bg-black/10 border-black backdrop-blur-sm"
        } ${isMoving ? "scale-100" : "scale-90"}`}
        style={{
          left: smoothPosition.x - 16,
          top: smoothPosition.y - 16,
          transform: `translate3d(0, 0, 0) scale(${
            mousePosition.x > 0 ? (isMoving ? 1 : 0.9) : 0
          })`,
          boxShadow: isDarkMode
            ? `0 0 20px rgba(255, 255, 255, ${
                isMoving ? 0.4 : 0.2
              }), 0 0 40px rgba(255, 255, 255, ${isMoving ? 0.2 : 0.1})`
            : `0 0 20px rgba(0, 0, 0, ${
                isMoving ? 0.4 : 0.2
              }), 0 0 40px rgba(0, 0, 0, ${isMoving ? 0.2 : 0.1})`,
          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
          willChange: "transform",
        }}
      />

      {/* Inner dot */}
      <div
        className={`fixed w-2 h-2 rounded-full pointer-events-none z-51 transition-all duration-100 ease-out ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
          transform: `translate3d(0, 0, 0) scale(${
            mousePosition.x > 0 ? (isMoving ? 1.2 : 1) : 0
          })`,
          willChange: "transform",
        }}
      />

      {/* Trailing effect */}
      <div
        className={`fixed w-12 h-12 border rounded-full pointer-events-none z-48 transition-all duration-500 ease-out ${
          isDarkMode ? "border-white/20" : "border-black/20"
        } ${isMoving ? "scale-100 opacity-30" : "scale-75 opacity-10"}`}
        style={{
          left: smoothPosition.x - 24,
          top: smoothPosition.y - 24,
          transform: `translate3d(0, 0, 0) scale(${
            mousePosition.x > 0 ? (isMoving ? 1 : 0.75) : 0
          })`,
          willChange: "transform",
        }}
      />
    </>
  )
}
