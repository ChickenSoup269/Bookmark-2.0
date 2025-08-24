"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useCursor } from "@/lib/CursorContext"

export default function CursorEffect() {
  const { isDarkMode } = useTheme()
  const { isCursorEnabled } = useCursor()

  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!isCursorEnabled) return

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    let animationFrame: number
    const followMouse = () => {
      // dùng easing để di chuyển dần thay vì nhảy giật
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x - 16}px`
        cursorRef.current.style.top = `${pos.current.y - 16}px`
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x - 8}px`
        dotRef.current.style.top = `${pos.current.y - 8}px`
      }

      animationFrame = requestAnimationFrame(followMouse)
    }
    followMouse()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isCursorEnabled])

  if (!isCursorEnabled) return null

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed w-8 h-8 border-2 rounded-none pointer-events-none z-50 transition-colors duration-300 ease-out
          ${isDarkMode ? "bg-white border-white" : "bg-black border-black"}`}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          boxShadow: isDarkMode
            ? "0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)"
            : "0 0 20px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          transform: `scale(1)`,
        }}
      />
      <div
        ref={dotRef}
        className={`fixed w-4 h-4 border rounded-none pointer-events-none z-49 opacity-30
          ${isDarkMode ? "bg-white border-white" : "bg-black border-black"}`}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          transform: `scale(1)`,
        }}
      />
    </>
  )
}
