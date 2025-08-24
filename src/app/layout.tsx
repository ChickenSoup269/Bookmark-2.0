import "./globals.css"
import { ThemeProvider } from "@/lib/controls-setting-change/theme-provider"
import { FontProvider } from "@/lib/controls-setting-change/changeTextFont"
import { LanguageProvider } from "@/lib/controls-setting-change/changeLanguage"
import { CursorProvider } from "@/lib/CursorContext"
import Navbar from "@/components/ui-layout/Navbar"
import Footer from "@/components/ui-layout/Footer"
import { auth } from "@/lib/firebase"

export const metadata = {
  title: "Bookmark Manager",
  description: "Organize your digital life with AI-powered bookmark management",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Reset localStorage for non-logged-in users
  if (typeof window !== "undefined" && !auth.currentUser) {
    localStorage.removeItem("font")
    localStorage.removeItem("language")
    localStorage.removeItem("isDarkMode")
    localStorage.removeItem("isCursorEnabled")
    localStorage.removeItem("isChatbotVisible")
    console.log("RootLayout: localStorage cleared for non-logged-in user")
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <FontProvider>
            <LanguageProvider>
              <CursorProvider>
                <Navbar />
                {children}
                <Footer />
              </CursorProvider>
            </LanguageProvider>
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
