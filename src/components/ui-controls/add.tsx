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
  Bookmark,
  Globe,
  Folder,
  ChevronDown,
  Trash,
} from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"
import { useFont } from "@/lib/controls-setting-change/changeTextFont"
import { translations } from "@/lib/translations"

type Folder = {
  id: string
  title: string
  color?: string
}

type Bookmark = {
  id: string
  title?: string
  url?: string
  description?: string
  folderId?: string
  tags?: string[]
  createdAt?: { toMillis: () => number }
  timestamp?: string
  favorite?: boolean
  favicon?: string
  [key: string]: unknown
}

type Props = {
  onAdd: () => void
  folders: Folder[]
  bookmarks: Bookmark[]
}

const DuplicateUrlPopup = ({
  isDarkMode,
  language,
  font,
  onClose,
}: {
  isDarkMode: boolean
  language: keyof typeof translations
  font: string
  onClose: () => void
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200 steps-4 ${
        isDarkMode ? "bg-black/50" : "bg-gray-500/50"
      }`}
    >
      <div
        className={`p-8 max-w-md w-full border-2 shadow-[8px_8px_0_0] animate-in zoom-in-95 duration-200 steps-4 ${
          font === "gohu" ? "font-gohu" : "font-normal"
        } ${
          isDarkMode
            ? "bg-black text-white border-white shadow-white"
            : "bg-white text-black border-black shadow-black"
        }`}
      >
        <h3 className="text-2xl font-bold mb-6">
          {translations[language].duplicateUrl || "Duplicate URL"}
        </h3>
        <p className="mb-6">
          {translations[language].duplicateUrl ||
            "Bookmark with this URL already exists!"}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`flex items-center justify-center gap-2 py-3 px-6 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
              isDarkMode
                ? "bg-black text-white border-white"
                : "bg-white text-black border-black"
            }`}
          >
            {translations[language].ok || "OK"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookmarkForm({ onAdd, folders, bookmarks }: Props) {
  const { isDarkMode } = useTheme()
  const { language } = useLanguage()
  const { font } = useFont()
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
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false)

  const suggestedTags = translations[language].bookmarkForm?.suggestedTags || [
    "code",
    "sáng tạo",
    "giải trí",
    "học tập",
    "công việc",
    "thiết kế",
    "phát triển",
    "khác",
  ]

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`
    } catch {
      return "/images/default-favicon.png"
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !validateUrl(url)) {
      setError(
        translations[language].bookmarkForm?.errors?.invalidFields ||
          "Vui lòng điền đầy đủ thông tin hợp lệ."
      )
      return
    }

    if (!auth.currentUser) {
      setError(
        translations[language].bookmarkForm?.errors?.notLoggedIn ||
          "Bạn cần đăng nhập để thêm bookmark."
      )
      return
    }

    // Kiểm tra URL trùng lặp
    const isDuplicate = bookmarks.some(
      (bookmark) => bookmark.url?.toLowerCase() === url.trim().toLowerCase()
    )
    if (isDuplicate) {
      setShowDuplicatePopup(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const faviconUrl = getFaviconUrl(url)
      await addDoc(collection(db, `users/${auth.currentUser.uid}/bookmarks`), {
        title,
        url,
        description,
        folderId: folderId || "Other",
        tags,
        createdAt: new Date(),
        favorite: false,
        favicon: faviconUrl,
      })

      setTitle("")
      setUrl("")
      setDescription("")
      setFolderId("")
      setTags([])
      setTagInput("")
      setIsTagDropdownOpen(false)
      setError(null)
      setSuccess(
        translations[language].bookmarkForm?.success ||
          "Bookmark đã được thêm thành công! ✨"
      )
      onAdd()

      setTimeout(() => {
        setSuccess(null)
        setShowForm(false)
      }, 2000)
    } catch (error) {
      console.error("Add bookmark error:", error)
      setError(
        translations[language].bookmarkForm?.errors?.failedToAdd ||
          "Không thể thêm bookmark. Vui lòng thử lại."
      )
    } finally {
      setIsLoading(false)
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

  const handleClearAll = () => {
    setTitle("")
    setUrl("")
    setDescription("")
    setFolderId("")
    setTags([])
    setTagInput("")
    setIsTagDropdownOpen(false)
    setError(null)
    setSuccess(null)
  }

  const handleClose = () => {
    handleClearAll()
    setShowForm(false)
  }

  const isFormValid = title.trim() && url.trim() && validateUrl(url)

  return (
    <div className="relative mr-2">
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
            <span className="text-base font-semibold">
              {translations[language].bookmarkForm?.addBookmark ||
                "Thêm Bookmark"}
            </span>
            <Sparkles
              className={`w-3 h-3 pixelated ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            />
          </div>
        </button>
      )}

      {showForm && (
        <>
          <div
            className={`fixed inset-0 z-40 transition-all duration-200 steps-4 ${
              isDarkMode ? "bg-black/50" : "bg-gray-500/50"
            }`}
            onClick={handleClose}
          ></div>

          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md max-h-[90vh] overflow-y-auto p-4 border-2 shadow-[8px_8px_0_0] animate-in zoom-in-50 duration-200 steps-4 mt-10 ${
              font === "gohu" ? "font-gohu" : "font-normal"
            } ${
              isDarkMode
                ? "bg-black text-white border-white shadow-white"
                : "bg-white text-black border-black shadow-black"
            }`}
          >
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

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 border-2 flex items-center justify-center ${
                    isDarkMode
                      ? "bg-black border-white"
                      : "bg-white border-black"
                  }`}
                >
                  <Bookmark className="w-4 h-4 pixelated" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {translations[language].bookmarkForm?.title ||
                      "Thêm Bookmark Mới"}
                  </h3>
                  <p className="text-base">
                    {translations[language].bookmarkForm?.subtitle ||
                      "Điền thông tin để lưu trang web"}
                  </p>
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

            <form className="space-y-4">
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="title"
                    className="block text-base font-semibold"
                  >
                    {translations[language].bookmarkForm?.titleLabel ||
                      "Tiêu đề *"}
                  </label>
                  {title && (
                    <button
                      type="button"
                      onClick={() => setTitle("")}
                      className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                        isDarkMode
                          ? "bg-black border-white"
                          : "bg-white border-black"
                      }`}
                    >
                      <X className="w-3 h-3 pixelated" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Type
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-blue-600`}
                  />
                  <input
                    id="title"
                    type="text"
                    placeholder={
                      translations[language].bookmarkForm?.titlePlaceholder ||
                      "Nhập tiêu đề bookmark..."
                    }
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

              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="url"
                    className="block text-base font-semibold"
                  >
                    {translations[language].bookmarkForm?.urlLabel || "URL *"}
                  </label>
                  {url && (
                    <button
                      type="button"
                      onClick={() => setUrl("")}
                      className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                        isDarkMode
                          ? "bg-black border-white"
                          : "bg-white border-black"
                      }`}
                    >
                      <X className="w-3 h-3 pixelated" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Globe
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-blue-600`}
                  />
                  <input
                    id="url"
                    type="url"
                    placeholder={
                      translations[language].bookmarkForm?.urlPlaceholder ||
                      "https://example.com"
                    }
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
                    {translations[language].bookmarkForm?.errors?.invalidUrl ||
                      "URL không hợp lệ"}
                  </p>
                )}
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="description"
                    className="block text-base font-semibold"
                  >
                    {translations[language].bookmarkForm?.descriptionLabel ||
                      "Mô tả"}
                  </label>
                  {description && (
                    <button
                      type="button"
                      onClick={() => setDescription("")}
                      className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                        isDarkMode
                          ? "bg-black border-white"
                          : "bg-white border-black"
                      }`}
                    >
                      <X className="w-3 h-3 pixelated" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <FileText
                    className={`absolute left-3 top-3 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-blue-600`}
                  />
                  <textarea
                    id="description"
                    placeholder={
                      translations[language].bookmarkForm
                        ?.descriptionPlaceholder ||
                      "Mô tả ngắn về trang web này..."
                    }
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

              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="folder"
                    className="block text-base font-semibold"
                  >
                    {translations[language].bookmarkForm?.folderLabel ||
                      "Thư mục"}
                  </label>
                  {folderId && (
                    <button
                      type="button"
                      onClick={() => setFolderId("")}
                      className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                        isDarkMode
                          ? "bg-black border-white"
                          : "bg-white border-black"
                      }`}
                    >
                      <X className="w-3 h-3 pixelated" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Folder
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-blue-600`}
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
                    <option value="">
                      {translations[language].bookmarkForm?.folderPlaceholder ||
                        "Chọn thư mục (mặc định: Other)"}
                    </option>
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

              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="tags"
                    className="block text-base font-semibold"
                  >
                    {translations[language].bookmarkForm?.tagsLabel || "Tags"}
                  </label>
                  {tags.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTags([])}
                      className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                        isDarkMode
                          ? "bg-black border-white"
                          : "bg-white border-black"
                      }`}
                    >
                      <X className="w-3 h-3 pixelated" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Link
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pixelated ${
                      isDarkMode ? "text-white" : "text-black"
                    } group-focus-within:text-blue-600`}
                  />
                  <input
                    id="tags"
                    type="text"
                    placeholder={
                      translations[language].bookmarkForm?.tagsPlaceholder ||
                      "Thêm tag tùy chỉnh (nhấn Enter)..."
                    }
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
                  {translations[language].bookmarkForm?.cancel || "Hủy"}
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className={`flex-1 py-2 px-4 border-2 hover:scale-105 transition-all duration-200 steps-4 font-semibold text-base flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={isLoading}
                >
                  <Trash className="w-4 h-4 pixelated" />
                  {translations[language].clearAll || "Xóa hết"}
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
                      {translations[language].bookmarkForm?.adding ||
                        "Đang thêm..."}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 pixelated" />
                      {translations[language].bookmarkForm?.addBookmarkShort ||
                        "Thêm Bookmark"}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 h-1.5 border-2 overflow-hidden">
              <div
                className={`h-full bg-green-600 transition-all duration-200 steps-4`}
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
              {translations[language].bookmarkForm?.progressMessages?.[
                !title && !url
                  ? "start"
                  : title && !url
                  ? "url"
                  : title && url && !validateUrl(url)
                  ? "invalidUrl"
                  : title && url && validateUrl(url) && !description
                  ? "optionalFields"
                  : title &&
                    url &&
                    validateUrl(url) &&
                    description &&
                    !folderId &&
                    !tags.length
                  ? "optionalFolderOrTags"
                  : "ready"
              ] ||
                (!title && !url
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
                  : "Hoàn tất! Sẵn sàng để thêm bookmark")}
            </p>
          </div>
        </>
      )}

      {showDuplicatePopup && (
        <DuplicateUrlPopup
          isDarkMode={isDarkMode}
          language={language}
          font={font}
          onClose={() => setShowDuplicatePopup(false)}
        />
      )}
    </div>
  )
}
