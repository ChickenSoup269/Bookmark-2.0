"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Link,
  Type,
  FileText,
  Check,
  X,
  Sparkles,
  BookOpen,
  Globe,
  Folder,
  ChevronDown,
} from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { addDoc, collection, query, onSnapshot } from "firebase/firestore"

type Folder = {
  id: string
  title: string
}

export default function BookmarkForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [folderId, setFolderId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const suggestedTags = [
    "code",
    "sáng tạo",
    "giải trí",
    "học tập",
    "công việc",
    "thiết kế",
    "phát triển",
    "khác",
  ]

  // Lấy danh sách folder từ Firestore
  useEffect(() => {
    if (!auth.currentUser) return
    const foldersQuery = query(
      collection(db, `users/${auth.currentUser.uid}/folders`)
    )
    const unsubscribe = onSnapshot(foldersQuery, (snapshot) => {
      try {
        const folderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || `Folder ${doc.id}`,
        }))
        setFolders(folderData)
      } catch (error) {
        console.error("Error fetching folders:", error)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) {
      setError("Vui lòng đăng nhập để thêm bookmark.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/bookmarks`), {
        title,
        url,
        description,
        folderId: folderId || "Other",
        tags,
        createdAt: new Date(),
        favorite: false,
      })

      setTitle("")
      setUrl("")
      setDescription("")
      setFolderId("")
      setTags([])
      setTagInput("")
      setIsTagDropdownOpen(false)
      setError(null)
      setSuccess("Bookmark đã được thêm thành công! ✨")
      setShowForm(false)
      onAdd()

      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Add bookmark error:", error)
      setError("Không thể thêm bookmark. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const isFormValid = title.trim() && url.trim() && validateUrl(url)

  return (
    <div className="relative mb-8">
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="group relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="relative z-10 flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Thêm Bookmark Mới</h3>
              <p className="text-white/80 text-sm">
                Lưu trữ trang web yêu thích của bạn
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-in slide-in-from-top-5 duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Thêm Bookmark Mới
                </h3>
                <p className="text-gray-600">Điền thông tin để lưu trang web</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(false)
                setError(null)
                setSuccess(null)
                setTitle("")
                setUrl("")
                setDescription("")
                setFolderId("")
                setTags([])
                setTagInput("")
                setIsTagDropdownOpen(false)
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="group">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tiêu đề *
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-300" />
                <input
                  id="title"
                  type="text"
                  placeholder="Nhập tiêu đề bookmark..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                  required
                />
                {title && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div className="group">
              <label
                htmlFor="url"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-300" />
                <input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                  required
                />
                {url && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {validateUrl(url) ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {url && !validateUrl(url) && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  URL không hợp lệ
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="group">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Mô tả
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-300" />
                <textarea
                  id="description"
                  placeholder="Mô tả ngắn về trang web này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500 resize-none"
                />
                <div className="absolute right-4 bottom-4 text-xs text-gray-400">
                  {description.length}/200
                </div>
              </div>
            </div>

            {/* Folder Input */}
            <div className="group">
              <label
                htmlFor="folder"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Thư mục
              </label>
              <div className="relative">
                <Folder className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-300" />
                <select
                  id="folder"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700"
                >
                  <option value="">Chọn thư mục (mặc định: Other)</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Input */}
            <div className="group">
              <label
                htmlFor="tags"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tags
              </label>
              <div className="relative">
                <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-300" />
                <input
                  id="tags"
                  type="text"
                  placeholder="Thêm tag tùy chỉnh (nhấn Enter)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      handleAddTag(tagInput.trim())
                    }
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 ${
                      isTagDropdownOpen ? "rotate-180" : ""
                    } transition-transform duration-200`}
                  />
                </button>
              </div>
              {isTagDropdownOpen && (
                <div className="mt-2 bg-white/90 rounded-2xl shadow-lg border border-gray-200 max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-300">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        handleAddTag(tag)
                        setIsTagDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                        tags.includes(tag) ? "bg-blue-100 text-blue-600" : ""
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-600 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setTitle("")
                  setUrl("")
                  setDescription("")
                  setFolderId("")
                  setTags([])
                  setTagInput("")
                  setIsTagDropdownOpen(false)
                  setError(null)
                }}
                className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 ${
                  isFormValid && !isLoading
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Thêm Bookmark
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Progress indicator */}
          <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ${
                title ? "w-1/4" : "w-0"
              } ${title && url && validateUrl(url) ? "w-2/4" : ""} ${
                title && url && validateUrl(url) && description ? "w-3/4" : ""
              } ${
                title &&
                url &&
                validateUrl(url) &&
                description &&
                (folderId || tags.length)
                  ? "w-full"
                  : ""
              }`}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {!title && !url
              ? "Bắt đầu bằng cách nhập tiêu đề và URL"
              : title && !url
              ? "Tiếp tục với URL"
              : title && url && !validateUrl(url)
              ? "URL cần được sửa"
              : title && url && validateUrl(url) && !description
              ? "Tùy chọn: Thêm mô tả, thư mục hoặc tag"
              : title &&
                url &&
                validateUrl(url) &&
                description &&
                !folderId &&
                !tags.length
              ? "Tùy chọn: Thêm thư mục hoặc tag"
              : "Hoàn tất! Sẵn sàng để thêm bookmark"}
          </p>
        </div>
      )}

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-ping animation-delay-1000"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-ping animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-25 animate-ping animation-delay-3000"></div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}
