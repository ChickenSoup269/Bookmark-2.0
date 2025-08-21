import "./globals.css"
import { ThemeProvider } from "@/lib/controls-setting-change/theme-provider"
import { FontProvider } from "@/lib/controls-setting-change/changeTextFont"
import { LanguageProvider } from "@/lib/controls-setting-change/changeLanguage"
import { CursorProvider } from "@/lib/CursorContext"
import Navbar from "@/components/ui-layout/Navbar"
import Footer from "@/components/ui-layout/Footer"

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
