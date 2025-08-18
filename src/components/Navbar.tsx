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
} from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { collection, query, onSnapshot } from "firebase/firestore"
import Link from "next/link"
import Image from "next/image"

import { usePathname } from "next/navigation"

export default function Navbar() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [folderCount, setFolderCount] = useState(0)
  const pathname = usePathname()
  // Theo dõi trạng thái đăng nhập từ Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setIsProfileOpen(false)
      setIsMenuOpen(false)
    })

    return () => unsubscribe()
  }, [])

  // Đếm số bookmark và folder từ Firestore
  useEffect(() => {
    if (!user) {
      setBookmarkCount(0)
      setFolderCount(0)
      return
    }

    // Lắng nghe bookmark
    const bookmarksQuery = query(collection(db, `users/${user.uid}/bookmarks`))
    const unsubscribeBookmarks = onSnapshot(bookmarksQuery, (snapshot) => {
      setBookmarkCount(snapshot.size)
    })

    // Lắng nghe folder
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
      {/* Main Navigation */}
      <nav className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg z-50">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-white to-pink-50 opacity-50"></div>

        <div className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bookmark className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bookmark Manager
                </h1>
                <p className="text-sm text-gray-500">
                  Organize your digital life
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  {/* Navigation Links */}
                  <div className="flex items-center gap-1 bg-white/50 rounded-2xl p-1">
                    <Link
                      href="/"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ease-in-out ${
                        pathname === "/"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                          : "text-gray-700 hover:bg-white/80 hover:shadow-md"
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span className="font-medium">Trang chủ</span>
                    </Link>

                    <Link
                      href="/bookmarks"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ease-in-out ${
                        pathname === "/bookmarks"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                          : "text-gray-700 hover:bg-white/80 hover:shadow-md"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span className="font-medium">Bookmarks</span>
                    </Link>
                  </div>

                  {/* User Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-3 p-2 bg-white/70 rounded-2xl hover:bg-white/90 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="relative">
                        <Image
                          width={40}
                          height={40}
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.displayName || "User"
                            )}&background=6366f1&color=fff&size=40`
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500">Premium User</p>
                      </div>
                      <Crown className="w-4 h-4 text-yellow-500 hidden lg:block" />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 py-6 animate-in slide-in-from-top-2 duration-300">
                        {/* User Info */}
                        <div className="px-6 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-4">
                            <Image
                              width={40}
                              height={40}
                              src={
                                user.photoURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.displayName || "User"
                                )}&background=6366f1&color=fff&size=60`
                              }
                              alt="Profile"
                              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/20 shadow-lg"
                            />
                            <div>
                              <h3 className="font-bold text-gray-800 text-lg">
                                {user.displayName}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Crown className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-yellow-600 font-medium">
                                  Premium Member
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="px-6 py-4 border-b border-gray-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                              <div className="text-2xl font-bold text-purple-600">
                                {bookmarkCount}
                              </div>
                              <div className="text-xs text-gray-600">
                                Bookmarks
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                              <div className="text-2xl font-bold text-blue-600">
                                {folderCount}
                              </div>
                              <div className="text-xs text-gray-600">
                                Folders
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pt-4">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 font-medium"
                          >
                            <LogOut className="w-5 h-5" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  Đăng nhập với Google
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-5 duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Bookmark className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-800">Menu</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {user ? (
                <>
                  {/* User Info */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                      <Image
                        width={40}
                        height={40}
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName || "User"
                          )}&background=6366f1&color=fff&size=60`
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {user.displayName}
                        </h3>
                        <p className="text-gray-600 text-sm">{user.email}</p>
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
                      className="w-full flex items-center gap-4 p-4 bg-white/70 rounded-2xl hover:bg-white/90 transition-all duration-300 text-left"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        Trang chủ
                      </span>
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bookmark className="w-5 h-5" />
                      <span className="font-medium">Bookmarks</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Chào mừng!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Đăng nhập để quản lý bookmark của bạn
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
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
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </>
  )
}
