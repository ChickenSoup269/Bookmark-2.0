"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FontContextType {
  font: string
  toggleFont: () => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState<string>("normal")

  const toggleFont = () => {
    const newFont = font === "normal" ? "gohu" : "normal"
    setFont(newFont)
    console.log("Font toggled to:", newFont) // Debug the new state
  }

  return (
    <FontContext.Provider value={{ font, toggleFont }}>
      {children}
    </FontContext.Provider>
  )
}

export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error("useFont must be used within a FontProvider")
  }
  return context
}
