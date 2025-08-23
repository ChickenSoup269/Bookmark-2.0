"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import BookmarkManager from "@/components/BookmarkManager"

export default function Bookmarks() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      }
      setLoading(false)
    })
    return unsubscribe
  }, [router])

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>

  return (
    <div
      className={`relative p-4 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 ${
        isDarkMode
          ? "bg-black text-white border-white shadow-white"
          : "bg-white text-black border-black shadow-black"
      }`}
    >
      <BookmarkManager />
    </div>
  )
}
