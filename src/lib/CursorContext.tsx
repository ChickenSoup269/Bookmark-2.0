"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface CursorContextType {
  isCursorEnabled: boolean
  toggleCursor: () => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [isCursorEnabled, setIsCursorEnabled] = useState(true)

  const toggleCursor = () => {
    setIsCursorEnabled((prev) => !prev)
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
