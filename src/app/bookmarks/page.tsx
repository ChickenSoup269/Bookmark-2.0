"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import BookmarkManager from "@/components/BookmarkManager"
import BookmarkForm from "@/components/ui-controls/add"

export default function Bookmarks() {
  const router = useRouter()
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
    <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 overflow-hidden">
      <BookmarkForm
        onAdd={function (): void {
          throw new Error("Function not implemented.")
        }}
      />
      <BookmarkManager />
    </div>
  )
}
