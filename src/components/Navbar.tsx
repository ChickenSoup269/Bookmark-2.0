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
} from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { collection, query, onSnapshot } from "firebase/firestore"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "@/lib/theme-provider"

export default function Navbar() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [folderCount, setFolderCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
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
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setIsProfileOpen(false)
      setIsMenuOpen(false)
    })

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
    const unsubscribeBookmarks = onSnapshot(bookmarksQuery, (snapshot) => {
      setBookmarkCount(snapshot.size)
    })

    const foldersQuery = query(collection(db, `users/${user.uid}/folders`))
    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      setFolderCount(snapshot.size)
    })

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
      setIsProfileOpen(false)
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      {/* Main Navigation - Sticky */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? `${
                isDarkMode
                  ? "bg-gray-900/90 border-gray-700/30 shadow-2xl shadow-blue-500/10"
                  : "bg-white/80 border-white/20 shadow-2xl shadow-blue-500/5"
              } backdrop-blur-2xl`
            : `${
                isDarkMode
                  ? "bg-gray-900/50 border-gray-800/20"
                  : "bg-white/50 border-white/10"
              } backdrop-blur-xl`
        } border-b`}
      >
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-blue-900/80 opacity-70"
              : "bg-gradient-to-r from-blue-50/80 via-white/80 to-cyan-50/80 opacity-60"
          }`}
        ></div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-4 left-1/4 w-2 h-2 rounded-full animate-pulse ${
              isDarkMode ? "bg-blue-400/30" : "bg-blue-400/40"
            }`}
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className={`absolute top-8 right-1/3 w-1 h-1 rounded-full animate-pulse ${
              isDarkMode ? "bg-cyan-400/30" : "bg-cyan-400/40"
            }`}
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className={`absolute bottom-4 left-1/3 w-1.5 h-1.5 rounded-full animate-pulse ${
              isDarkMode ? "bg-sky-400/30" : "bg-sky-400/40"
            }`}
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand - Enhanced Animation */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div
                  className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                    isScrolled ? "shadow-blue-500/30" : ""
                  }`}
                >
                  <Bookmark className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-2 h-2 text-white animate-pulse" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="hidden md:block">
                <h1
                  className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-700 hover:to-cyan-700`}
                >
                  Bookmark Manager
                </h1>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Organize your digital life
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  {/* Navigation Links */}
                  <div
                    className={`flex items-center gap-1 rounded-2xl p-1 transition-all duration-300 ${
                      isDarkMode ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <Link
                      href="/"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ease-in-out transform hover:scale-105 ${
                        pathname === "/"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                          : `${
                              isDarkMode
                                ? "text-gray-300 hover:bg-gray-700/80"
                                : "text-gray-700 hover:bg-white/80"
                            } hover:shadow-md`
                      }`}
                    >
                      <Home className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
                      <span className="font-medium">Trang chủ</span>
                    </Link>

                    <Link
                      href="/bookmarks"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ease-in-out transform hover:scale-105 ${
                        pathname === "/bookmarks"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                          : `${
                              isDarkMode
                                ? "text-gray-300 hover:bg-gray-700/80"
                                : "text-gray-700 hover:bg-white/80"
                            } hover:shadow-md`
                      }`}
                    >
                      <Bookmark className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
                      <span className="font-medium">Bookmarks</span>
                      {/* {bookmarkCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                          {bookmarkCount}
                        </span>
                      )} */}
                    </Link>
                  </div>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                      isDarkMode
                        ? "bg-gray-700/70 hover:bg-gray-600/70 text-yellow-400"
                        : "bg-white/70 hover:bg-white/90 text-gray-700"
                    } shadow-lg hover:shadow-xl`}
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 transition-all duration-500 rotate-0 hover:rotate-180" />
                    ) : (
                      <Moon className="w-5 h-5 transition-all duration-500 rotate-0 hover:rotate-180" />
                    )}
                  </button>

                  {/* User Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:shadow-md group transform hover:scale-105 ${
                        isDarkMode
                          ? "bg-gray-800/70 hover:bg-gray-700/90"
                          : "bg-white/70 hover:bg-white/90"
                      }`}
                    >
                      <div className="relative">
                        <Image
                          width={40}
                          height={40}
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.displayName || "User"
                            )}&background=3b82f6&color=fff&size=40`
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md transition-all duration-300 group-hover:ring-blue-500"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p
                          className={`font-medium transition-colors duration-300 ${
                            isDarkMode
                              ? "text-gray-200 group-hover:text-blue-400"
                              : "text-gray-800 group-hover:text-blue-600"
                          }`}
                        >
                          {user.displayName}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Premium User
                        </p>
                      </div>
                      <Crown className="w-4 h-4 text-yellow-500 hidden lg:block animate-pulse" />
                    </button>

                    {/* Profile Dropdown - Enhanced */}
                    {isProfileOpen && (
                      <div
                        className={`absolute top-full right-0 mt-2 w-72 rounded-3xl shadow-2xl border py-6 animate-in slide-in-from-top-2 duration-300 ${
                          isDarkMode
                            ? "bg-gray-800/95 backdrop-blur-xl border-gray-700/20"
                            : "bg-white/90 backdrop-blur-xl border-white/20"
                        }`}
                      >
                        {/* User Info */}
                        <div
                          className={`px-6 pb-4 border-b ${
                            isDarkMode ? "border-gray-700" : "border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Image
                                width={60}
                                height={60}
                                src={
                                  user.photoURL ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user.displayName || "User"
                                  )}&background=3b82f6&color=fff&size=60`
                                }
                                alt="Profile"
                                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-lg"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl"></div>
                            </div>
                            <div>
                              <h3
                                className={`font-bold text-lg ${
                                  isDarkMode ? "text-gray-100" : "text-gray-800"
                                }`}
                              >
                                {user.displayName}
                              </h3>
                              <p
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Crown className="w-3 h-3 text-yellow-500 animate-pulse" />
                                <span className="text-xs text-yellow-600 font-medium">
                                  Premium Member
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div
                          className={`px-6 py-4 border-b ${
                            isDarkMode ? "border-gray-700" : "border-gray-100"
                          }`}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div
                              className={`text-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/50"
                                  : "bg-gradient-to-br from-blue-50 to-cyan-50"
                              }`}
                            >
                              <div className="text-2xl font-bold text-blue-600 animate-pulse">
                                {bookmarkCount}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Bookmarks
                              </div>
                            </div>
                            <div
                              className={`text-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                                isDarkMode
                                  ? "bg-gradient-to-br from-sky-900/50 to-indigo-900/50"
                                  : "bg-gradient-to-br from-sky-50 to-indigo-50"
                              }`}
                            >
                              <div className="text-2xl font-bold text-sky-600 animate-pulse">
                                {folderCount}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Folders
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pt-4">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 font-medium transform hover:scale-105"
                          >
                            <LogOut className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Dark Mode Toggle for non-logged users */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                      isDarkMode
                        ? "bg-gray-700/70 hover:bg-gray-600/70 text-yellow-400"
                        : "bg-white/70 hover:bg-white/90 text-gray-700"
                    } shadow-lg hover:shadow-xl`}
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 transition-all duration-500 rotate-0 hover:rotate-180" />
                    ) : (
                      <Moon className="w-5 h-5 transition-all duration-500 rotate-0 hover:rotate-180" />
                    )}
                  </button>

                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 font-medium transform"
                  >
                    <LogIn className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                    Đăng nhập với Google
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "bg-gray-700/70 hover:bg-gray-600/70 text-yellow-400"
                    : "bg-white/70 hover:bg-white/90 text-gray-700"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 transition-all duration-500" />
                ) : (
                  <Moon className="w-5 h-5 transition-all duration-500" />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "bg-gray-800/70 hover:bg-gray-700/90 text-gray-300"
                    : "bg-white/70 hover:bg-white/90 text-gray-700"
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 transition-all duration-300 rotate-180" />
                ) : (
                  <Menu className="w-6 h-6 transition-all duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Mobile Menu - Enhanced */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div
            className={`absolute top-0 right-0 w-80 h-full shadow-2xl animate-in slide-in-from-right-5 duration-300 ${
              isDarkMode ? "bg-gray-900/95" : "bg-white/95"
            } backdrop-blur-xl`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Bookmark className="w-4 h-4 text-white" />
                  </div>
                  <span
                    className={`font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Menu
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2 rounded-xl transition-colors duration-200 ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {user ? (
                <>
                  {/* User Info */}
                  <div
                    className={`rounded-3xl p-6 mb-6 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/50"
                        : "bg-gradient-to-br from-blue-50 to-cyan-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        width={60}
                        height={60}
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName || "User"
                          )}&background=3b82f6&color=fff&size=60`
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                      />
                      <div>
                        <h3
                          className={`font-bold text-lg ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {user.displayName}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Crown className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">
                            Premium
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="space-y-3 mb-8">
                    <Link
                      href="/"
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left transform hover:scale-105 ${
                        isDarkMode
                          ? "bg-gray-800/70 hover:bg-gray-700/90 text-gray-300"
                          : "bg-white/70 hover:bg-white/90 text-gray-700"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="w-5 h-5" />
                      <span className="font-medium">Trang chủ</span>
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bookmark className="w-5 h-5" />
                      <span className="font-medium">Bookmarks</span>
                      {bookmarkCount > 0 && (
                        <span className="ml-auto bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                          {bookmarkCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/50"
                          : "bg-gradient-to-br from-blue-100 to-cyan-100"
                      }`}
                    >
                      <User className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      Chào mừng!
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Đăng nhập để quản lý bookmark của bạn
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    Đăng nhập với Google
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(5deg);
          }
          66% {
            transform: translateY(5px) rotate(-3deg);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
