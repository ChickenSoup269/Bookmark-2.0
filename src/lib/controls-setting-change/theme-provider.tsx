"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/lib/firebase"

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const savedTheme = localStorage.getItem("isDarkMode")
        if (savedTheme) {
          const parsedValue = JSON.parse(savedTheme)
          setIsDarkMode(parsedValue)
          console.log(
            `Theme loaded from localStorage for user ${currentUser.uid}: ${parsedValue}`
          )
        } else {
          setIsDarkMode(false)
          localStorage.setItem("isDarkMode", JSON.stringify(false))
          console.log(`Theme set to default for user ${currentUser.uid}: false`)
        }
      } else {
        setIsDarkMode(false)
        console.log("Theme set to default (not logged in): false")
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (auth.currentUser) {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode))
      console.log(
        `Theme saved to localStorage for user ${auth.currentUser.uid}: ${isDarkMode}`
      )
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
