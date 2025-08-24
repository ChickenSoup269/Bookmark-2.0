"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/lib/firebase"

interface FontContextType {
  font: string
  toggleFont: () => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<string>("normal")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log("FontProvider: Starting auth state check")
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log(
        `FontProvider: Auth state changed, user: ${
          currentUser ? currentUser.uid : "null"
        }`
      )
      if (currentUser) {
        const savedFont = localStorage.getItem("font")
        if (savedFont && ["normal", "gohu"].includes(savedFont)) {
          setFont(savedFont)
          console.log(
            `FontProvider: Font loaded from localStorage for user ${currentUser.uid}: ${savedFont}`
          )
        } else {
          setFont("normal")
          localStorage.setItem("font", "normal")
          console.log(
            `FontProvider: Font set to default for user ${currentUser.uid}: normal`
          )
        }
      } else {
        setFont("normal")
        console.log("FontProvider: Font set to default (not logged in): normal")
      }
      setIsLoading(false)
      console.log("FontProvider: Auth state check complete, isLoading: false")
    })
    return () => {
      console.log("FontProvider: Cleaning up auth subscription")
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isLoading && auth.currentUser) {
      localStorage.setItem("font", font)
      console.log(
        `FontProvider: Font saved to localStorage for user ${auth.currentUser.uid}: ${font}`
      )
    }
  }, [font, isLoading])

  const toggleFont = () => {
    setFont((prev) => {
      const newFont = prev === "normal" ? "gohu" : "normal"
      console.log(`FontProvider: Toggling font to ${newFont}`)
      return newFont
    })
  }

  if (isLoading) {
    console.log("FontProvider: Still loading, not rendering children")
    return null
  }

  return (
    <FontContext.Provider value={{ font, toggleFont }}>
      {children}
    </FontContext.Provider>
  )
}

export function useFont() {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error("useFont must be used within a FontProvider")
  }
  return context
}
