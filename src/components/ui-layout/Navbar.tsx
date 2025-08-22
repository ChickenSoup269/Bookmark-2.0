"use client"

import { useState, useEffect } from "react"
import {
  LogIn,
  LogOut,
  User,
  Bookmark,
  Sparkles,
  Menu,
  X,
  Home,
  Crown,
  Sun,
  Moon,
  Languages,
  ChevronUp,
  MessageCircle,
} from "lucide-react"
import { auth } from "@/lib/firebase"
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from "firebase/auth"
import {
  collection,
  query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useFont } from "@/lib/controls-setting-change/changeTextFont"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"
import { useCursor } from "@/lib/CursorContext"
import { translations } from "@/lib/translations"
import UserDropdownMenu from "@/components/ui-setting/userDropDownMenu"

// Components
const BrandLogo = ({
  isDarkMode,
  language,
}: {
  isDarkMode: boolean
  language: keyof typeof translations
}) => (
  <div className="flex items-center gap-3">
    <div className="relative group">
      <div
        className={`w-8 h-8 border-2 flex items-center justify-center ${
          isDarkMode
            ? "bg-white text-black border-white"
            : "bg-black text-white border-black"
        }`}
      >
        <Bookmark className="w-5 h-5 pixelated" />
      </div>
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center animate-bounce ${
          isDarkMode
            ? "bg-black border border-white text-white"
            : "bg-white border border-black text-black"
        }`}
      >
        <Sparkles className="w-2 h-2 pixelated" />
      </div>
    </div>
    <div className="hidden md:block">
      <h1 className="text-xl font-bold">{translations[language].brandTitle}</h1>
      <p className="text-xs">{translations[language].brandSubtitle}</p>
    </div>
  </div>
)

const DesktopNavLinks = ({
  pathname,
  isDarkMode,
  language,
  bookmarkCount,
}: {
  pathname: string
  isDarkMode: boolean
  language: keyof typeof translations
  bookmarkCount: number
}) => (
  <div
    className={`flex items-center gap-1 p-1 border-2 ${
      isDarkMode ? "bg-black border-white" : "bg-white border-black"
    }`}
  >
    <Link
      href="/"
      className={`flex items-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
        pathname === "/"
          ? isDarkMode
            ? "bg-white text-black border-white"
            : "bg-black text-white border-black"
          : isDarkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      }`}
    >
      <Home className="w-4 h-4 pixelated" />
      <span className="font-medium">{translations[language].home}</span>
    </Link>
    <Link
      href="/bookmarks"
      className={`flex items-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
        pathname === "/bookmarks"
          ? isDarkMode
            ? "bg-white text-black border-white"
            : "bg-black text-white border-black"
          : isDarkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      }`}
    >
      <Bookmark className="w-4 h-4 pixelated" />
      <span className="font-medium">{translations[language].bookmarks}</span>
      {bookmarkCount > 0 && (
        <span
          className={`text-xs px-2 py-0.5 border rounded animate-pulse ${
            isDarkMode
              ? "bg-black text-white border-white"
              : "bg-white text-black border-black"
          }`}
        >
          {bookmarkCount}
        </span>
      )}
    </Link>
  </div>
)

const MobileMenu = ({
  user,
  isDarkMode,
  language,
  bookmarkCount,
  setIsMenuOpen,
  handleLogin,
  handleLogout,
  toggleLanguage,
  pathname,
}: {
  user: FirebaseUser | null
  isDarkMode: boolean
  language: keyof typeof translations
  bookmarkCount: number
  setIsMenuOpen: (value: boolean) => void
  handleLogin: () => void
  handleLogout: () => void
  toggleLanguage: () => void
  pathname: string
}) => (
  <div className="fixed inset-0 z-40 md:hidden">
    <div
      className={`absolute inset-0 ${
        isDarkMode ? "bg-white/50" : "bg-black/50"
      }`}
      onClick={() => setIsMenuOpen(false)}
    />
    <div
      className={`absolute top-0 right-0 w-64 h-full border-2 shadow-[8px_8px_0_0] p-4 animate-in slide-in-from-right-5 duration-200 steps-4 ${
        isDarkMode
          ? "bg-black text-white border-white shadow-white"
          : "bg-white text-black border-black shadow-black"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 border-2 flex items-center justify-center ${
                isDarkMode
                  ? "bg-white text-black border-white"
                  : "bg-black text-white border-black"
              }`}
            >
              <Bookmark className="w-4 h-4 pixelated" />
            </div>
            <span className="font-bold">{translations[language].menu}</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className={`p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
              isDarkMode
                ? "bg-black text-white border-white"
                : "bg-white text-black border-black"
            }`}
          >
            <X className="w-4 h-4 pixelated" />
          </button>
        </div>

        {user ? (
          <>
            <div
              className={`p-4 border-2 mb-6 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <Image
                  width={48}
                  height={48}
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.displayName || "User"
                    )}&background=${isDarkMode ? "FFFFFF" : "000000"}&color=${
                      isDarkMode ? "000000" : "FFFFFF"
                    }&size=48`
                  }
                  alt="Profile"
                  className="w-12 h-12 pixelated object-cover border-2 border-current"
                />
                <div>
                  <h3 className="font-bold">{user.displayName}</h3>
                  <p className="text-xs">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 border border-current" />
                    <span className="text-xs font-medium">
                      {translations[language].premium}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Link
                href="/"
                className={`w-full flex items-center gap-3 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? pathname === "/"
                      ? "bg-white text-black border-white"
                      : "bg-black text-white border-white"
                    : pathname === "/"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 pixelated" />
                <span className="font-medium">
                  {translations[language].home}
                </span>
              </Link>
              <Link
                href="/bookmarks"
                className={`w-full flex items-center gap-3 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? pathname === "/bookmarks"
                      ? "bg-white text-black border-white"
                      : "bg-black text-white border-white"
                    : pathname === "/bookmarks"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark className="w-4 h-4 pixelated" />
                <span className="font-medium">
                  {translations[language].bookmarks}
                </span>
                {bookmarkCount > 0 && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 border rounded ${
                      isDarkMode
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            </div>

            <LanguageToggle
              isDarkMode={isDarkMode}
              language={language}
              toggleLanguage={() => {
                toggleLanguage()
                setIsMenuOpen(false)
              }}
            />
            <button
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className={`w-full flex items-center justify-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                isDarkMode
                  ? "bg-black text-white border-white"
                  : "bg-white text-black border-black"
              }`}
            >
              <LogOut className="w-4 h-4 pixelated" />
              {translations[language].logout}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div
              className={`text-center p-4 border-2 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <div
                className={`w-16 h-16 border-2 flex items-center justify-center mx-auto mb-3 ${
                  isDarkMode
                    ? "bg-white text-black border-white"
                    : "bg-black text-white border-black"
                }`}
              >
                <User className="w-8 h-8 pixelated" />
              </div>
              <h3 className="text-lg font-bold">
                {translations[language].welcome}
              </h3>
              <p className="text-xs">
                {language === "en"
                  ? "Sign in to manage your bookmarks"
                  : "Đăng nhập để quản lý bookmark của bạn"}
              </p>
            </div>
            <button
              onClick={() => {
                handleLogin()
                setIsMenuOpen(false)
              }}
              className={`w-full flex items-center justify-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                isDarkMode
                  ? "bg-black text-white border-white"
                  : "bg-white text-black border-black"
              }`}
            >
              <LogIn className="w-4 h-4 pixelated" />
              {translations[language].login}
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)

const ThemeToggle = ({
  isDarkMode,
  toggleDarkMode,
}: {
  isDarkMode: boolean
  toggleDarkMode: () => void
}) => (
  <button
    onClick={toggleDarkMode}
    className={`p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
      isDarkMode
        ? "bg-black text-white border-white"
        : "bg-white text-black border-black"
    }`}
  >
    {isDarkMode ? (
      <Sun className="w-4 h-4 pixelated" />
    ) : (
      <Moon className="w-4 h-4 pixelated" />
    )}
  </button>
)

const LanguageToggle = ({
  isDarkMode,
  language,
  toggleLanguage,
}: {
  isDarkMode: boolean
  language: keyof typeof translations
  toggleLanguage: () => void
}) => (
  <button
    onClick={toggleLanguage}
    className={`w-full flex items-center justify-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
      isDarkMode
        ? "bg-black text-white border-white"
        : "bg-white text-black border-black"
    }`}
  >
    <Languages className="w-4 h-4 pixelated" />
    {language === "en" ? "Tiếng Việt" : "English"}
  </button>
)

const ScrollToTopButton = ({
  isDarkMode,
  isChatOpen,
}: {
  isDarkMode: boolean
  isChatOpen: boolean
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-4 p-3 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-110 z-50 ${
        isDarkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      } ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"} ${
        isChatOpen ? "bottom-20" : "bottom-12"
      }`}
      style={{ transformOrigin: "bottom right" }}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6 pixelated" />
    </button>
  )
}

const ChatbotButton = ({
  isDarkMode,
  isChatOpen,
  setIsChatOpen,
  isChatbotVisible,
  language,
}: {
  isDarkMode: boolean
  isChatOpen: boolean
  setIsChatOpen: (value: boolean) => void
  isChatbotVisible: boolean
  language: keyof typeof translations
}) => {
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  if (!isChatbotVisible) return null

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 p-3 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-110 z-50 ${
          isDarkMode
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        }`}
        aria-label="Toggle chatbot"
      >
        <MessageCircle className="w-6 h-6 pixelated" />
      </button>
      {isChatOpen && (
        <div
          className={`fixed bottom-16 right-4 w-80 h-96 border-2 shadow-[8px_8px_0_0] rounded-none transition-all duration-200 steps-4 z-50 ${
            isDarkMode
              ? "bg-black border-white shadow-white text-white"
              : "bg-white border-black shadow-black text-black"
          } animate-in slide-in-from-bottom-5`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Chatbot</h3>
              <button
                onClick={toggleChat}
                className={`p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                <X className="w-4 h-4 pixelated" />
              </button>
            </div>
            <div className="flex-1 border-2 p-2 overflow-y-auto">
              <p className="text-sm">
                {isDarkMode
                  ? translations[language].chatWelcomeDark
                  : translations[language].chatWelcomeLight}
              </p>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className={`flex-1 p-2 border-2 rounded-none text-sm ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
              />
              <button
                className={`p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [bookmarkCount, setBookmarkCount] = useState<number>(0)
  const [folderCount, setFolderCount] = useState<number>(0)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [isChatbotVisible, setIsChatbotVisible] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("isChatbotVisible")
      console.log(
        "Chatbot visibility initialized from localStorage:",
        storedValue || "true"
      )
      return storedValue !== null ? JSON.parse(storedValue) : true
    }
    return true
  })

  const { isDarkMode, toggleDarkMode } = useTheme()
  const { font, toggleFont } = useFont()
  const { language, toggleLanguage } = useLanguage()
  const { isCursorEnabled, toggleCursor } = useCursor()
  const pathname = usePathname()

  // Save isChatbotVisible to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isChatbotVisible", JSON.stringify(isChatbotVisible))
      console.log("Chatbot visibility saved to localStorage:", isChatbotVisible)
    }
  }, [isChatbotVisible])

  // Scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser: FirebaseUser | null) => {
        setUser(currentUser)
        setIsMenuOpen(false)
      }
    )
    return () => unsubscribe()
  }, [])

  // Count bookmarks and folders
  useEffect(() => {
    if (!user) {
      setBookmarkCount(0)
      setFolderCount(0)
      return
    }

    const bookmarksQuery = query(collection(db, `users/${user.uid}/bookmarks`))
    const unsubscribeBookmarks = onSnapshot(
      bookmarksQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setBookmarkCount(snapshot.size)
      }
    )

    const foldersQuery = query(collection(db, `users/${user.uid}/folders`))
    const unsubscribeFolders = onSnapshot(
      foldersQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setFolderCount(snapshot.size)
      }
    )

    return () => {
      unsubscribeBookmarks()
      unsubscribeFolders()
    }
  }, [user])

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => {
      const newValue = !prev
      console.log("Chatbot visibility toggled to:", newValue)
      return newValue
    })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 steps-4 ${
          font === "gohu" ? "font-gohu" : "font-normal"
        } ${
          isDarkMode
            ? isScrolled
              ? "bg-black text-white border-2 border-white shadow-[8px_8px_0_0_#fff]"
              : "bg-black text-white border-2 border-white"
            : isScrolled
            ? "bg-white text-black border-2 border-black shadow-[8px_8px_0_0_#000]"
            : "bg-white text-black border-2 border-black"
        }`}
      >
        <div className="relative z-10 container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <BrandLogo isDarkMode={isDarkMode} language={language} />
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <DesktopNavLinks
                    pathname={pathname}
                    isDarkMode={isDarkMode}
                    language={language}
                    bookmarkCount={bookmarkCount}
                  />
                  <ThemeToggle
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                  <UserDropdownMenu
                    user={user}
                    isDarkMode={isDarkMode}
                    language={language}
                    bookmarkCount={bookmarkCount}
                    folderCount={folderCount}
                    toggleFont={toggleFont}
                    toggleLanguage={toggleLanguage}
                    handleLogout={handleLogout}
                    font={font}
                    isCursorEnabled={isCursorEnabled}
                    toggleCursor={toggleCursor}
                    isChatbotVisible={isChatbotVisible}
                    toggleChatbot={toggleChatbot}
                  />
                </>
              ) : (
                <>
                  <ThemeToggle
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                  <button
                    onClick={handleLogin}
                    className={`flex items-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                      isDarkMode
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    <LogIn className="w-4 h-4 pixelated" />
                    {translations[language].login}
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 pixelated" />
                ) : (
                  <Menu className="w-5 h-5 pixelated" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
      {isMenuOpen && (
        <MobileMenu
          user={user}
          isDarkMode={isDarkMode}
          language={language}
          bookmarkCount={bookmarkCount}
          setIsMenuOpen={setIsMenuOpen}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          toggleLanguage={toggleLanguage}
          pathname={pathname}
        />
      )}
      <ScrollToTopButton isDarkMode={isDarkMode} isChatOpen={isChatOpen} />
      <ChatbotButton
        isDarkMode={isDarkMode}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isChatbotVisible={isChatbotVisible}
        language={language}
      />
    </>
  )
}
