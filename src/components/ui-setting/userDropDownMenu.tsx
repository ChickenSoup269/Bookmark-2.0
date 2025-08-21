"use client"

import { useState, useEffect } from "react"
import { User, LogOut, Palette, Languages, Eye, Crown } from "lucide-react"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useFont } from "@/lib/controls-setting-change/changeTextFont"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"
import { translations } from "@/lib/translations"
import Image from "next/image"
import { User as FirebaseUser } from "firebase/auth"
import {
  collection,
  query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import anime from "animejs"

interface UserDropdownMenuProps {
  user: FirebaseUser | null
  isCursorEnabled: boolean
  toggleCursor: () => void
  handleLogout: () => void
}

export default function UserDropdownMenu({
  user,
  isCursorEnabled,
  toggleCursor,
  handleLogout,
}: UserDropdownMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [folderCount, setFolderCount] = useState(0)
  const { isDarkMode } = useTheme()
  const { font, toggleFont } = useFont()
  const { language, toggleLanguage } = useLanguage - hyphenated - language

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

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

  // Animate toggle actions
  const animateToggle = (target: string) => {
    anime({
      targets: target,
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      duration: 300,
      easing: "easeInOutQuad",
    })
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
        className={`p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
          isDarkMode
            ? "bg-black border-white text-white"
            : "bg-white border-black text-black"
        }`}
      >
        <User className="w-6 h-6 pixelated" />
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
            {user ? (
              <>
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
                        )}&background=${
                          isDarkMode ? "FFFFFF" : "000000"
                        }&color=${isDarkMode ? "000000" : "FFFFFF"}&size=48`
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
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">
                  {translations[language].welcome}
                </h3>
                <p className="text-xs mb-4">
                  {language === "en"
                    ? "Sign in to manage your bookmarks"
                    : "Đăng nhập để quản lý bookmark của bạn"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
