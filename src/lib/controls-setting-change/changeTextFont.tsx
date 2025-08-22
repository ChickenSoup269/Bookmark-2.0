"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

interface FontContextType {
  font: string
  toggleFont: () => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedFont = localStorage.getItem("font")
      console.log("Font initialized from localStorage:", storedFont || "normal")
      return storedFont || "normal"
    }
    return "normal"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("font", font)
      console.log("Font saved to localStorage:", font)
    }
  }, [font])

  const toggleFont = () => {
    setFont((prev) => {
      const newFont = prev === "normal" ? "gohu" : "normal"
      console.log("Font toggled to:", newFont)
      return newFont
    })
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
