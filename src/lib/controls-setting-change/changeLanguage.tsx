"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/translations"
import { auth } from "@/lib/firebase"

type Language = keyof typeof translations

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log("LanguageProvider: Starting auth state check")
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log(
        `LanguageProvider: Auth state changed, user: ${
          currentUser ? currentUser.uid : "null"
        }`
      )
      if (currentUser) {
        const savedLanguage = localStorage.getItem("language")
        if (
          savedLanguage &&
          Object.keys(translations).includes(savedLanguage)
        ) {
          setLanguage(savedLanguage as Language)
          console.log(
            `LanguageProvider: Language loaded from localStorage for user ${currentUser.uid}: ${savedLanguage}`
          )
        } else {
          setLanguage("en")
          localStorage.setItem("language", "en")
          console.log(
            `LanguageProvider: Language set to default for user ${currentUser.uid}: en`
          )
        }
      } else {
        setLanguage("en")
        console.log(
          "LanguageProvider: Language set to default (not logged in): en"
        )
      }
      setIsLoading(false)
      console.log(
        "LanguageProvider: Auth state check complete, isLoading: false"
      )
    })
    return () => {
      console.log("LanguageProvider: Cleaning up auth subscription")
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isLoading && auth.currentUser) {
      localStorage.setItem("language", language)
      console.log(
        `LanguageProvider: Language saved to localStorage for user ${auth.currentUser.uid}: ${language}`
      )
    }
  }, [language, isLoading])

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "en" ? "vi" : "en"
      console.log(`LanguageProvider: Toggling language to ${newLanguage}`)
      return newLanguage
    })
  }

  if (isLoading) {
    console.log("LanguageProvider: Still loading, not rendering children")
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
