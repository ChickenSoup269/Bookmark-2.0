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
import { useTheme } from "@/lib/controls-setting-change/theme-provider"

type Folder = {
  id: string
  title: string
  color?: string
}

export default function BookmarkForm({ onAdd }: { onAdd: () => void }) {
  const { isDarkMode } = useTheme()
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

  // Mock data cho demo
  useEffect(() => {
    setFolders([
      { id: "1", title: "Development", color: "#3B82F6" },
      { id: "2", title: "Design", color: "#EF4444" },
      { id: "3", title: "Learning", color: "#22C55E" },
    ])
  }, [])

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !validateUrl(url)) {
      setError("Vui lòng điền đầy đủ thông tin hợp lệ.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
        <div
          className={`mb-6 p-4 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-top-2 duration-200 steps-4 ${
            isDarkMode
              ? "bg-black text-white border-white shadow-white"
              : "bg-white text-black border-black shadow-black"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 border-2 flex items-center justify-center ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Check className="w-4 h-4 pixelated" />
            </div>
            <p className="font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div
          className={`mb-6 p-4 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-top-2 duration-200 steps-4 ${
            isDarkMode
              ? "bg-black text-white border-white shadow-white"
              : "bg-white text-black border-black shadow-black"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 border-2 flex items-center justify-center ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <X className="w-4 h-4 pixelated" />
            </div>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={`group relative w-full p-6 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 hover:scale-105 ${
            isDarkMode
              ? "bg-black text-white border-white shadow-white"
              : "bg-white text-black border-black shadow-black"
          }`}
        >
          <div
            className={`absolute top-4 right-4 transition-opacity duration-200 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            <Sparkles className="w-6 h-6 pixelated" />
          </div>
          <div className="relative z-10 flex items-center justify-center gap-4">
            <div
              className={`w-12 h-12 border-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Plus
                className={`w-6 h-6 pixelated group-hover:rotate-90 transition-transform duration-200 steps-4 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Thêm Bookmark Mới</h3>
              <p className="text-sm">Lưu trữ trang web yêu thích của bạn</p>
            </div>
          </div>
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div
          className={`p-8 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-top-5 duration-200 steps-4 ${
            isDarkMode
              ? "bg-black text-white border-white shadow-white"
              : "bg-white text-black border-black shadow-black"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 border-2 flex items-center justify-center ${
                  isDarkMode ? "bg-black border-white" : "bg-white border-black"
                }`}
              >
                <BookOpen className="w-6 h-6 pixelated" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Thêm Bookmark Mới</h3>
                <p>Điền thông tin để lưu trang web</p>
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
              className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <X className="w-6 h-6 pixelated" />
            </button>
          </div>

          <form className="space-y-6">
            {/* Title Input */}
            <div className="group">
              <label
                htmlFor="title"
                className="block text-sm font-semibold mb-2"
              >
                Tiêu đề *
              </label>
              <div className="relative">
                <Type
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pixelated ${
                    isDarkMode ? "text-white" : "text-black"
                  } group-focus-within:text-purple-500`}
                />
                <input
                  id="title"
                  type="text"
                  placeholder="Nhập tiêu đề bookmark..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black text-white border-white placeholder-gray-400"
                      : "bg-white text-black border-black placeholder-gray-500"
                  }`}
                  required
                />
                {title && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500 pixelated" />
                  </div>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div className="group">
              <label htmlFor="url" className="block text-sm font-semibold mb-2">
                URL *
              </label>
              <div className="relative">
                <Globe
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pixelated ${
                    isDarkMode ? "text-white" : "text-black"
                  } group-focus-within:text-purple-500`}
                />
                <input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black text-white border-white placeholder-gray-400"
                      : "bg-white text-black border-black placeholder-gray-500"
                  }`}
                  required
                />
                {url && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {validateUrl(url) ? (
                      <Check className="w-5 h-5 text-green-500 pixelated" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 pixelated" />
                    )}
                  </div>
                )}
              </div>
              {url && !validateUrl(url) && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <X className="w-4 h-4 pixelated" />
                  URL không hợp lệ
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="group">
              <label
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
              >
                Mô tả
              </label>
              <div className="relative">
                <FileText
                  className={`absolute left-4 top-4 w-5 h-5 pixelated ${
                    isDarkMode ? "text-white" : "text-black"
                  } group-focus-within:text-purple-500`}
                />
                <textarea
                  id="description"
                  placeholder="Mô tả ngắn về trang web này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className={`w-full pl-12 pr-4 py-4 border-2 focus:outline-none transition-all duration-200 steps-4 resize-none ${
                    isDarkMode
                      ? "bg-black text-white border-white placeholder-gray-400"
                      : "bg-white text-black border-black placeholder-gray-500"
                  }`}
                />
                <div
                  className={`absolute right-4 bottom-4 text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {description.length}/200
                </div>
              </div>
            </div>

            {/* Folder Input */}
            <div className="group">
              <label
                htmlFor="folder"
                className="block text-sm font-semibold mb-2"
              >
                Thư mục
              </label>
              <div className="relative">
                <Folder
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pixelated ${
                    isDarkMode ? "text-white" : "text-black"
                  } group-focus-within:text-purple-500`}
                />
                <select
                  id="folder"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className={`w-full pl-12 pr-10 py-4 border-2 focus:outline-none transition-all duration-200 steps-4 appearance-none ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <option value="">Chọn thư mục (mặc định: Other)</option>
                  {folders.map((folder) => (
                    <option
                      key={folder.id}
                      value={folder.id}
                      className="flex items-center"
                    >
                      <span
                        className="mr-2 w-4 h-4 inline-block"
                        style={{ backgroundColor: folder.color }}
                      ></span>
                      {folder.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pixelated pointer-events-none ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>
            </div>

            {/* Tags Input */}
            <div className="group">
              <label
                htmlFor="tags"
                className="block text-sm font-semibold mb-2"
              >
                Tags
              </label>
              <div className="relative">
                <Link
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pixelated ${
                    isDarkMode ? "text-white" : "text-black"
                  } group-focus-within:text-purple-500`}
                />
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
                  className={`w-full pl-12 pr-12 py-4 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black text-white border-white placeholder-gray-400"
                      : "bg-white text-black border-black placeholder-gray-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black border-white"
                      : "bg-white border-black"
                  }`}
                >
                  <ChevronDown
                    className={`w-5 h-5 pixelated ${
                      isTagDropdownOpen ? "rotate-180" : ""
                    } transition-transform duration-200 steps-4`}
                  />
                </button>
              </div>
              {isTagDropdownOpen && (
                <div
                  className={`mt-2 border-2 shadow-[8px_8px_0_0] max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black border-white shadow-white"
                      : "bg-white border-black shadow-black"
                  }`}
                >
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        handleAddTag(tag)
                        setIsTagDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 steps-4 ${
                        tags.includes(tag)
                          ? isDarkMode
                            ? "bg-white text-black"
                            : "bg-black text-white"
                          : isDarkMode
                          ? "bg-black text-white hover:bg-white hover:text-black"
                          : "bg-white text-black hover:bg-black hover:text-white"
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
                    className={`text-xs px-2 py-1 border-2 flex items-center gap-1 ${
                      isDarkMode
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:scale-110 transition-all duration-200 steps-4"
                    >
                      <X className="w-3 h-3 pixelated" />
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
                className={`flex-1 py-4 px-6 border-2 hover:scale-105 transition-all duration-200 steps-4 font-semibold ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={isLoading}
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                onClick={handleSubmit}
                className={`flex-1 py-4 px-6 border-2 hover:scale-105 transition-all duration-200 steps-4 font-semibold flex items-center justify-center gap-3 ${
                  isFormValid && !isLoading
                    ? isDarkMode
                      ? "bg-white text-black border-white"
                      : "bg-black text-white border-black"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div
                      className={`w-5 h-5 border-2 border-t-transparent animate-spin ${
                        isDarkMode
                          ? "border-white"
                          : "border-black border-t-black"
                      }`}
                    ></div>
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 pixelated" />
                    Thêm Bookmark
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Progress indicator */}
          <div className="mt-6 h-2 border-2 overflow-hidden">
            <div
              className={`h-full bg-purple-500 transition-all duration-200 steps-4`}
              style={{
                width: `${
                  title
                    ? title && url && validateUrl(url)
                      ? title && url && validateUrl(url) && description
                        ? title &&
                          url &&
                          validateUrl(url) &&
                          description &&
                          (folderId || tags.length)
                          ? "100%"
                          : "75%"
                        : "50%"
                      : "25%"
                    : "0%"
                }`,
              }}
            ></div>
          </div>
          <p className="text-xs text-center mt-2">
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
    </div>
  )
}
