"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

interface CursorContextType {
  isCursorEnabled: boolean
  toggleCursor: () => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [isCursorEnabled, setIsCursorEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("isCursorEnabled")
      return storedValue !== null ? JSON.parse(storedValue) : true // Default to true as per your code
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isCursorEnabled", JSON.stringify(isCursorEnabled))
      console.log("Cursor enabled saved to localStorage:", isCursorEnabled)

      // Apply cursor effect
      if (isCursorEnabled) {
        document.body.style.cursor = "url('/cursor-custom.png'), auto"
      } else {
        document.body.style.cursor = "auto"
      }
    }
  }, [isCursorEnabled])

  const toggleCursor = () => {
    setIsCursorEnabled((prev) => {
      const newValue = !prev
      console.log("Cursor enabled toggled to:", newValue)
      return newValue
    })
  }

  return (
    <CursorContext.Provider value={{ isCursorEnabled, toggleCursor }}>
      {children}
    </CursorContext.Provider>
  )
}

export const useCursor = () => {
  const context = useContext(CursorContext)
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider")
  }
  return context
}
