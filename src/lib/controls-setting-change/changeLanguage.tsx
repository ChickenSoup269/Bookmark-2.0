"use client"
import { createContext, useContext, useState, ReactNode } from "react"

type LanguageType = "en" | "vi"

interface LanguageContextType {
  language: LanguageType
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<LanguageType>("vi") // Default to Vietnamese

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "vi" ? "en" : "vi"))
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
