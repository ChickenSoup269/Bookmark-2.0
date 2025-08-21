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
  Palette,
  Languages,
  Eye,
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
import { animate } from "animejs"

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

const ProfileDropdown = ({
  user,
  isDarkMode,
  language,
  bookmarkCount,
  folderCount,
  toggleFont,
  toggleLanguage,
  handleLogout,
  font,
  isCursorEnabled,
  toggleCursor,
}: {
  user: FirebaseUser
  isDarkMode: boolean
  language: keyof typeof translations
  bookmarkCount: number
  folderCount: number
  toggleFont: () => void
  toggleLanguage: () => void
  handleLogout: () => void
  font: string
  isCursorEnabled: boolean
  toggleCursor: () => void
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  // Animate toggle actions
  const animateToggle = (target: string) => {
    animate(
      {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        duration: 300,
        easing: "easeInOutQuad",
      },
      target
    )
  }

  const handleLanguageToggle = () => {
    animateToggle(".language-toggle")
    toggleLanguage()
  }

  const handleFontToggle = () => {
    animateToggle(".font-toggle")
    toggleFont()
  }

  const handleCursorToggle = () => {
    animateToggle(".cursor-toggle")
    toggleCursor()
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
          isDarkMode
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        }`}
      >
        <Image
          width={32}
          height={32}
          src={
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.displayName || "User"
            )}&background=${isDarkMode ? "FFFFFF" : "000000"}&color=${
              isDarkMode ? "000000" : "FFFFFF"
            }&size=32`
          }
          alt="Profile"
          className="w-10 h-10 pixelated object-cover border-2 border-current rounded-xl"
        />
        <div className="hidden lg:block text-left">
          <p className="font-medium">{user.displayName}</p>
          <p className="text-xs">{translations[language].premium}</p>
        </div>
        <Crown
          className={`w-3 h-3 animate-pulse hidden lg:block ${
            isDarkMode
              ? "text-black bg-white border border-white"
              : "text-white bg-black border border-black"
          }`}
        />
      </button>
      {isDropdownOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 border-2 shadow-[8px_8px_0_0] rounded-none transition-all duration-200 steps-4 ${
            isDarkMode
              ? "bg-black border-white shadow-white text-white"
              : "bg-white border-black shadow-black text-black"
          }`}
        >
          <div className="p-4">
            {/* User Info */}
            <div className="pb-3 border-b border-current">
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
                  className="w-12 h-12 pixelated object-cover border-2 border-current rounded-4xl"
                />
                <div>
                  <h3 className="font-bold">{user.displayName}</h3>
                  <p className="text-xs">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 border border-current" />
                    <span className="text-xs font-medium">
                      {translations[language].premiumMember}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="py-3 border-b border-current">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 border-2 border-current">
                  <div className="text-xl font-bold animate-pulse">
                    {bookmarkCount}
                  </div>
                  <div className="text-xs">
                    {translations[language].bookmarks}
                  </div>
                </div>
                <div className="text-center p-2 border-2 border-current">
                  <div className="text-xl font-bold animate-pulse">
                    {folderCount}
                  </div>
                  <div className="text-xs">
                    {translations[language].folders}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 space-y-2">
              <button
                onClick={handleFontToggle}
                className={`font-toggle w-full flex items-center justify-between gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black border-white text-white"
                    : "bg-white border-black text-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 pixelated" />
                  {font === "gohu" ? "Normal Font" : "Gohu Font"}
                </div>
              </button>
              <button
                onClick={handleLanguageToggle}
                className={`language-toggle w-full flex items-center justify-between gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black border-white text-white"
                    : "bg-white border-black text-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 pixelated" />
                  {language === "en" ? "Tiếng Việt" : "English"}
                </div>
              </button>
              <button
                onClick={handleCursorToggle}
                className={`cursor-toggle w-full flex items-center justify-between gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black border-white text-white"
                    : "bg-white border-black text-black"
                }`}
                aria-label="Toggle cursor effect"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 pixelated" />
                  {isCursorEnabled ? "Disable Cursor" : "Enable Cursor"}
                </div>
              </button>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-between gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black border-white text-white"
                    : "bg-white border-black text-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 pixelated" />
                  {translations[language].logout}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [bookmarkCount, setBookmarkCount] = useState<number>(0)
  const [folderCount, setFolderCount] = useState<number>(0)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { font, toggleFont } = useFont()
  const { language, toggleLanguage } = useLanguage()
  const { isCursorEnabled, toggleCursor } = useCursor()
  const pathname = usePathname()

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
                  <ProfileDropdown
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
    </>
  )
}
