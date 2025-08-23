"use client"

import { useState } from "react"
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
import { collection, addDoc } from "firebase/firestore"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"

type Folder = {
  id: string
  title: string
  color?: string
}

export default function BookmarkForm({
  onAdd,
  folders,
}: {
  onAdd: () => void
  folders: Folder[]
}) {
  const { isDarkMode } = useTheme()
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [folderId, setFolderId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
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

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !validateUrl(url)) {
      setError("Vui lòng điền đầy đủ thông tin hợp lệ.")
      return
    }

    if (!auth.currentUser) {
      setError("Bạn cần đăng nhập để thêm bookmark.")
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
      onAdd()

      setTimeout(() => {
        setSuccess(null)
        setShowForm(false)
      }, 2000)
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

  const handleClose = () => {
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
  }

  const isFormValid = title.trim() && url.trim() && validateUrl(url)

  return (
    <div className="relative mr-2">
      {/* Toggle Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={`group px-4 py-2 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 hover:scale-105 ${
            isDarkMode
              ? "bg-black text-white border-white shadow-white"
              : "bg-white text-black border-black shadow-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 border-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Plus
                className={`w-3 h-3 pixelated group-hover:rotate-90 transition-transform duration-200 steps-4 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </div>
            <span className="text-base font-semibold">Thêm Bookmark</span>
            <Sparkles
              className={`w-3 h-3 pixelated ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            />
          </div>
        </button>
      )}

      {/* Modal */}
      {showForm && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 transition-all duration-200 steps-4 ${
              isDarkMode ? "bg-black/50" : "bg-gray-500/50"
            }`}
            onClick={handleClose}
          ></div>

          {/* Form Modal */}
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md max-h-[90vh] overflow-y-auto p-4 border-2 shadow-[8px_8px_0_0] animate-in zoom-in-50 duration-200 steps-4 ${
              isDarkMode
                ? "bg-black text-white border-white shadow-white"
                : "bg-white text-black border-black shadow-black"
            }`}
          >
            {/* Success/Error Messages */}
            {success && (
              <div
                className={`mb-4 p-2 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-top-2 duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white shadow-white"
                    : "bg-white text-black border-black shadow-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 border-2 flex items-center justify-center ${
                      isDarkMode
                        ? "bg-black border-white"
                        : "bg-white border-black"
                    }`}
                  >
                    <Check className="w-3 h-3 pixelated" />
                  </div>
                  <p className="font-medium text-xs">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div
                className={`mb-4 p-2 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-top-2 duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white shadow-white"
                    : "bg-white text-black border-black shadow-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 border-2 flex items-center justify-center ${
                      isDarkMode
                        ? "bg-black border-white"
                        : "bg-white border-black"
                    }`}
                  >
                    <X className="w-3 h-3 pixelated" />
                  </div>
                  <p className="font-medium text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Form Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 border-2 flex items-center justify-center ${
                    isDarkMode
                      ? "bg-black border-white"
                      : "bg-white border-black"
                  }`}
                >
                  <BookOpen className="w-4 h-4 pixelated" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Thêm Bookmark Mới</h3>
                  <p className="text-base">Điền thông tin để lưu trang web</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                  isDarkMode ? "bg-black border-white" : "bg-white border-black"
                }`}
              >
                <X className="w-4 h-4 pixelated" />
              </button>
            </div>

            {/* Form Content */}
            <form className="space-y-4">
              {/* Title Input */}
              <div className="group">
                <label
                  htmlFor="title"
                  className="block text-base font-semibold mb-1"
                >
                  Tiêu đề *
                </label>
                <div className="relative">
                  <Type
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-purple-500`}
                  />
                  <input
                    id="title"
                    type="text"
                    placeholder="Nhập tiêu đề bookmark..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 text-base ${
                      isDarkMode
                        ? "bg-black text-white border-white placeholder-gray-400"
                        : "bg-white text-black border-black placeholder-gray-500"
                    }`}
                    required
                  />
                  {title && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="w-4 h-4 text-green-500 pixelated" />
                    </div>
                  )}
                </div>
              </div>

              {/* URL Input */}
              <div className="group">
                <label
                  htmlFor="url"
                  className="block text-base font-semibold mb-1"
                >
                  URL *
                </label>
                <div className="relative">
                  <Globe
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-purple-500`}
                  />
                  <input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 text-base ${
                      isDarkMode
                        ? "bg-black text-white border-white placeholder-gray-400"
                        : "bg-white text-black border-black placeholder-gray-500"
                    }`}
                    required
                  />
                  {url && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validateUrl(url) ? (
                        <Check className="w-4 h-4 text-green-500 pixelated" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 pixelated" />
                      )}
                    </div>
                  )}
                </div>
                {url && !validateUrl(url) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X className="w-3 h-3 pixelated" />
                    URL không hợp lệ
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div className="group">
                <label
                  htmlFor="description"
                  className="block text-base font-semibold mb-1"
                >
                  Mô tả
                </label>
                <div className="relative">
                  <FileText
                    className={`absolute left-3 top-3 w-4 h-4 pixelated ${
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
                    className={`w-full pl-10 pr-3 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 text-base resize-none ${
                      isDarkMode
                        ? "bg-black text-white border-white placeholder-gray-400"
                        : "bg-white text-black border-black placeholder-gray-500"
                    }`}
                  />
                  <div
                    className={`absolute right-3 bottom-3 text-xs ${
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
                  className="block text-base font-semibold mb-1"
                >
                  Thư mục
                </label>
                <div className="relative">
                  <Folder
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-purple-500`}
                  />
                  <select
                    id="folder"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className={`w-full pl-10 pr-8 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 text-base appearance-none ${
                      isDarkMode
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    <option value="">Chọn thư mục (mặc định: Other)</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated pointer-events-none ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div className="group">
                <label
                  htmlFor="tags"
                  className="block text-base font-semibold mb-1"
                >
                  Tags
                </label>
                <div className="relative">
                  <Link
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
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
                    className={`w-full pl-10 pr-8 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 text-base ${
                      isDarkMode
                        ? "bg-black text-white border-white placeholder-gray-400"
                        : "bg-white text-black border-black placeholder-gray-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                      isDarkMode
                        ? "bg-black border-white"
                        : "bg-white border-black"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 pixelated ${
                        isTagDropdownOpen ? "rotate-180" : ""
                      } transition-transform duration-200 steps-4`}
                    />
                  </button>
                </div>
                {isTagDropdownOpen && (
                  <div
                    className={`mt-1 border-2 shadow-[8px_8px_0_0] max-h-32 overflow-y-auto animate-in slide-in-from-top-2 duration-200 steps-4 ${
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
                        className={`w-full text-left px-3 py-1 text-xs transition-all duration-200 steps-4 ${
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
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-1.5 py-0.5 border-2 flex items-center gap-0.5 ${
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
                        <X className="w-2 h-2 pixelated" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`flex-1 py-2 px-4 border-2 hover:scale-105 transition-all duration-200 steps-4 font-semibold text-base ${
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
                  className={`flex-1 py-2 px-4 border-2 hover:scale-105 transition-all duration-200 steps-4 font-semibold text-base flex items-center justify-center gap-2 ${
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
                        className={`w-4 h-4 border-2 border-t-transparent animate-spin ${
                          isDarkMode
                            ? "border-white"
                            : "border-black border-t-black"
                        }`}
                      ></div>
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 pixelated" />
                      Thêm Bookmark
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Progress indicator */}
            <div className="mt-4 h-1.5 border-2 overflow-hidden">
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
            <p
              className={`text-xs text-center mt-1 leading-tight ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
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
        </>
      )}
    </div>
  )
}
