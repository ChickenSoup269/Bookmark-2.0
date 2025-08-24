"use client"

import { useState, useEffect, useRef } from "react"
import {
  User,
  Palette,
  Languages,
  Eye,
  LogOut,
  Crown,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import { translations } from "@/lib/translations"
import type { User as FirebaseUser } from "firebase/auth"

interface UserDropdownMenuProps {
  user: FirebaseUser | null
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
  isChatbotVisible: boolean
  toggleChatbot: () => void
}

const ModernToggle = ({
  isOn,
  onToggle,
  label,
  icon: Icon,
  isDarkMode,
  className,
}: {
  isOn: boolean
  onToggle: () => void
  label: string
  icon: React.ComponentType<{ className?: string }>
  isDarkMode: boolean
  className: string
}) => (
  <div
    className={`flex items-center justify-between p-2 border-2 rounded-none transition-all duration-200 steps-4 ${
      isDarkMode
        ? "bg-black border-white text-white"
        : "bg-white border-black text-black"
    }`}
  >
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 pixelated" />
      <span className="font-medium">{label}</span>
    </div>
    <button
      onClick={onToggle}
      className={`${className} w-10 h-5 border-2 rounded-none relative transition-all duration-200 steps-4 ${
        isDarkMode ? "bg-black border-white" : "bg-white border-black"
      }`}
      aria-label={`Toggle ${label}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 border-2 transition-all duration-200 steps-4 ${
          isOn
            ? `left-5 ${
                isDarkMode ? "bg-white border-white" : "bg-black border-black"
              }`
            : `left-0.5 ${
                isDarkMode
                  ? "bg-gray-600 border-white"
                  : "bg-gray-400 border-black"
              }`
        }`}
      />
    </button>
  </div>
)

export default function UserDropdownMenu({
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
  isChatbotVisible,
  toggleChatbot,
}: UserDropdownMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLanguageToggle = () => {
    toggleLanguage()
  }

  const handleFontToggle = () => {
    toggleFont()
  }

  const handleCursorToggle = () => {
    toggleCursor()
  }

  const handleChatbotToggle = () => {
    toggleChatbot()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
          isDarkMode
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        }`}
      >
        {user ? (
          <>
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
          </>
        ) : (
          <User className="w-6 h-6 pixelated" />
        )}
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

                {/* Settings */}
                <div className="pt-3 space-y-2">
                  <ModernToggle
                    isOn={font === "gohu"}
                    onToggle={handleFontToggle}
                    label="Gohu Font"
                    icon={Palette}
                    isDarkMode={isDarkMode}
                    className="font-toggle cursor-pointer"
                  />
                  <ModernToggle
                    isOn={language === "en"}
                    onToggle={handleLanguageToggle}
                    label={language === "en" ? "English" : "Tiếng Việt"}
                    icon={Languages}
                    isDarkMode={isDarkMode}
                    className="language-toggle cursor-pointer"
                  />
                  <ModernToggle
                    isOn={isCursorEnabled}
                    onToggle={handleCursorToggle}
                    label="Cursor Effects"
                    icon={Eye}
                    isDarkMode={isDarkMode}
                    className="cursor-toggle cursor-pointer"
                  />
                  <ModernToggle
                    isOn={isChatbotVisible}
                    onToggle={handleChatbotToggle}
                    label="Chatbot"
                    icon={MessageCircle}
                    isDarkMode={isDarkMode}
                    className="chatbot-toggle cursor-pointer"
                  />
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center cursor-pointer justify-between gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 hover:bg-red-500 ${
                      isDarkMode
                        ? "bg-black border-white text-white"
                        : "bg-white border-black text-black hover:text-white"
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
