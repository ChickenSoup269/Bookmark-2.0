"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

type LanguageType = "en" | "vi"

interface LanguageContextType {
  language: LanguageType
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("language")
      console.log(
        "Language initialized from localStorage:",
        storedLanguage || "vi"
      )
      return (storedLanguage as LanguageType) || "vi"
    }
    return "vi"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
      console.log("Language saved to localStorage:", language)
    }
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => {
      const newLanguage = prevLanguage === "vi" ? "en" : "vi"
      console.log("Language toggled to:", newLanguage)
      return newLanguage
    })
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
