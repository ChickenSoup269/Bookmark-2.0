import "./globals.css"
import { ThemeProvider } from "@/lib/theme-provider"
import { FontProvider } from "@/lib/changeTextFont"
import { LanguageProvider } from "@/lib/changeLanguage"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Bookmark Manager",
  description: "Organize your digital life with AI-powered bookmark management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <FontProvider>
            <LanguageProvider>
              <Navbar />
              {children}
              <Footer />
            </LanguageProvider>
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
