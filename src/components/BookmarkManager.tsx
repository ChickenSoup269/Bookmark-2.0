"use client"

import { useState, useEffect } from "react"
import {
  Search,
  FolderPlus,
  Grid,
  List,
  Filter,
  Star,
  ExternalLink,
  Edit3,
  Folder,
  X,
  Check,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import { db, auth } from "@/lib/firebase"
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/navigation"
import BookmarkForm from "@/components/ui-controls/add"
import DeleteFolder from "@/components/ui-controls/DeleteFolder"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"
import { useFont } from "@/lib/controls-setting-change/changeTextFont"
import { translations } from "@/lib/translations"
import CursorEffect from "@/components/ui-effects/CursorEffect"

type Bookmark = {
  id: string
  title?: string
  url?: string
  description?: string
  folderId?: string
  tags?: string[]
  createdAt?: { toMillis: () => number }
  favorite?: boolean
  favicon?: string
  [key: string]: unknown
}

type Folder = {
  id: string
  title: string
  color?: string
}

// Bảng màu preset
const colorPalette = [
  "#EF4444", // Đỏ tươi
  "#F97316", // Cam sáng
  "#FACC15", // Vàng tươi
  "#22C55E", // Xanh lá sáng
  "#3B82F6", // Xanh dương sáng
  "#8B5CF6", // Tím sáng
  "#EC4899", // Hồng tươi
  "#14B8A6", // Ngọc/Teal
  "#6B7280", // Xám trung tính
]

export default function BookmarkManager() {
  const { isDarkMode } = useTheme()
  const { language } = useLanguage()
  const { font } = useFont()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [search, setSearch] = useState("")
  const [showCheckboxes, setShowCheckboxes] = useState(false)
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([])
  const [renameBookmarkId, setRenameBookmarkId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [addToFolderBookmarkId, setAddToFolderBookmarkId] = useState<
    string | null
  >(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("#6B7280")
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      }
    })
    return () => unsubscribe()
  }, [router])

  // Lấy bookmark và thư mục từ Firestore
  useEffect(() => {
    if (!auth.currentUser) return

    const bookmarksQuery = query(
      collection(db, `users/${auth.currentUser.uid}/bookmarks`)
    )
    const unsubscribeBookmarks = onSnapshot(bookmarksQuery, (snapshot) => {
      const bookmarkData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bookmark[]
      setBookmarks(bookmarkData)
    })

    const foldersQuery = query(
      collection(db, `users/${auth.currentUser.uid}/folders`)
    )
    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      const folderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || `Folder ${doc.id}`,
        color: doc.data().color || "#6B7280",
      }))
      setFolders(folderData)
    })

    return () => {
      unsubscribeBookmarks()
      unsubscribeFolders()
    }
  }, [])

  const handleSort = (bookmarks: Bookmark[]) => {
    if (sortBy === "new") {
      return [...bookmarks].sort(
        (a, b) =>
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
      )
    }
    if (sortBy === "old") {
      return [...bookmarks].sort(
        (a, b) =>
          (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
      )
    }
    if (sortBy === "a-z") {
      return [...bookmarks].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      )
    }
    if (sortBy === "z-a") {
      return [...bookmarks].sort((a, b) =>
        (b.title || "").localeCompare(b.title || "")
      )
    }
    if (sortBy === "favorites") {
      return [...bookmarks].sort(
        (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)
      )
    }
    return bookmarks
  }

  const filteredBookmarks = bookmarks
    .filter((bm) => (selectedFolder ? bm.folderId === selectedFolder : true))
    .filter(
      (bm) =>
        bm.title?.toLowerCase().includes(search.toLowerCase()) ||
        bm.url?.toLowerCase().includes(search.toLowerCase()) ||
        bm.description?.toLowerCase().includes(search.toLowerCase())
    )

  const sortedBookmarks = handleSort(filteredBookmarks)

  const handleRenameSave = async () => {
    if (!renameBookmarkId || !auth.currentUser) return
    try {
      await updateDoc(
        doc(db, `users/${auth.currentUser.uid}/bookmarks`, renameBookmarkId),
        {
          title: renameValue,
        }
      )
      setRenameBookmarkId(null)
      setRenameValue("")
    } catch (error) {
      console.error("Error renaming bookmark:", error)
    }
  }

  const handleAddToFolderSave = async () => {
    if (!addToFolderBookmarkId || !auth.currentUser) return
    let folderId = selectedFolder || "Other"
    if (newFolderName) {
      const newFolderRef = await addDoc(
        collection(db, `users/${auth.currentUser.uid}/folders`),
        {
          title: newFolderName,
          color: newFolderColor,
          createdAt: new Date(),
        }
      )
      folderId = newFolderRef.id
    }
    try {
      await updateDoc(
        doc(
          db,
          `users/${auth.currentUser.uid}/bookmarks`,
          addToFolderBookmarkId
        ),
        {
          folderId,
        }
      )
      setAddToFolderBookmarkId(null)
      setNewFolderName("")
      setNewFolderColor("#6B7280")
    } catch (error) {
      console.error("Error moving bookmark to folder:", error)
    }
  }

  const handleCreateFolder = async () => {
    if (!auth.currentUser || !newFolderName) return
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/folders`), {
        title: newFolderName,
        color: newFolderColor,
        createdAt: new Date(),
      })
      setNewFolderName("")
      setNewFolderColor("#6B7280")
      setShowCreateFolder(false)
    } catch (error) {
      console.error("Error creating folder:", error)
    }
  }

  const toggleFavorite = async (id: string) => {
    if (!auth.currentUser) return
    try {
      const bookmark = bookmarks.find((bm) => bm.id === id)
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/bookmarks`, id), {
        favorite: !bookmark?.favorite,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    if (
      !auth.currentUser ||
      !confirm(
        translations[language].confirmDeleteBookmark ||
          "Are you sure you want to delete this bookmark?"
      )
    )
      return
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/bookmarks`, id))
    } catch (error) {
      console.error("Error deleting bookmark:", error)
    }
  }

  const getFolderColor = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId)
    const color = folder?.color || "#6B7280"
    const luminance = (r: number, g: number, b: number) =>
      0.299 * r + 0.587 * g + 0.114 * b
    const hex = color.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const textColor = luminance(r, g, b) > 128 ? "#000000" : "#FFFFFF"
    return { background: color, text: textColor }
  }

  const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
    const folderColor = getFolderColor(bookmark.folderId || "Other")
    return (
      <div
        className={`relative p-4 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 hover:scale-105 ${
          isDarkMode
            ? "bg-black text-white border-white shadow-white"
            : "bg-white text-black border-black shadow-black"
        }`}
      >
        {showCheckboxes && (
          <div className="absolute -top-2 -right-2">
            <input
              type="checkbox"
              checked={selectedBookmarks.includes(bookmark.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedBookmarks([...selectedBookmarks, bookmark.id])
                } else {
                  setSelectedBookmarks(
                    selectedBookmarks.filter((id) => id !== bookmark.id)
                  )
                }
              }}
              className={`w-5 h-5 border-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-black border-white checked:bg-white checked:border-white"
                  : "bg-white border-black checked:bg-black checked:border-black"
              }`}
            />
          </div>
        )}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {bookmark.favicon && (
                  <Image
                    width={40}
                    height={40}
                    src={bookmark.favicon}
                    alt={`${bookmark.title} favicon`}
                    className="w-6 h-6"
                    onError={(e) =>
                      (e.currentTarget.src = "/images/default-favicon.png")
                    } // Fallback nếu favicon không tải được
                  />
                )}
                {bookmark.favorite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current pixelated" />
                )}
                <span
                  className="text-xs font-medium px-2 py-1 border-2"
                  style={{
                    background: folderColor.background,
                    color: folderColor.text,
                    borderColor: isDarkMode ? "white" : "black",
                  }}
                >
                  {folders.find((f) => f.id === bookmark.folderId)?.title ||
                    translations[language].otherFolder ||
                    "Other"}
                </span>
              </div>
              <h3 className="font-semibold line-clamp-2">{bookmark.title}</h3>
            </div>
            <button
              onClick={() => toggleFavorite(bookmark.id)}
              className="p-1 hover:scale-110 transition-all duration-200 steps-4"
            >
              <Star
                className={`w-5 h-5 pixelated ${
                  bookmark.favorite
                    ? "text-yellow-500 fill-current"
                    : isDarkMode
                    ? "text-white"
                    : "text-black"
                }`}
              />
            </button>
          </div>
          <p className="text-sm mb-2 line-clamp-2">{bookmark.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {bookmark.tags?.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 border-2"
                style={{
                  background: folderColor.background,
                  color: folderColor.text,
                  borderColor: isDarkMode ? "white" : "black",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200 steps-4"
            >
              <span className="text-sm font-medium">
                {translations[language].visit || "Visit"}
              </span>
              <ExternalLink className="w-4 h-4 pixelated" />
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRenameBookmarkId(bookmark.id)
                  setRenameValue(bookmark.title || "")
                }}
                className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                  isDarkMode ? "bg-black border-white" : "bg-white border-black"
                }`}
              >
                <Edit3 className="w-4 h-4 pixelated" />
              </button>
              <button
                onClick={() => setAddToFolderBookmarkId(bookmark.id)}
                className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                  isDarkMode ? "bg-black border-white" : "bg-white border-black"
                }`}
              >
                <Folder className="w-4 h-4 pixelated" />
              </button>
              <button
                onClick={() => handleDeleteBookmark(bookmark.id)}
                className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                  isDarkMode ? "bg-black border-white" : "bg-white border-black"
                }`}
              >
                <Trash2 className="w-4 h-4 text-red-600 pixelated" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const BookmarkListItem = ({ bookmark }: { bookmark: Bookmark }) => {
    const folderColor = getFolderColor(bookmark.folderId || "Other")
    return (
      <div
        className={`relative p-4 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 hover:scale-105 ${
          isDarkMode
            ? "bg-black text-white border-white shadow-white"
            : "bg-white text-black border-black shadow-black"
        }`}
      >
        <div className="flex items-center gap-4">
          {showCheckboxes && (
            <input
              type="checkbox"
              checked={selectedBookmarks.includes(bookmark.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedBookmarks([...selectedBookmarks, bookmark.id])
                } else {
                  setSelectedBookmarks(
                    selectedBookmarks.filter((id) => id !== bookmark.id)
                  )
                }
              }}
              className={`w-4 h-4 border-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-black border-white checked:bg-white checked:border-white"
                  : "bg-white border-black checked:bg-black checked:border-black"
              }`}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {bookmark.favicon && (
                <Image
                  width={40}
                  height={40}
                  src={bookmark.favicon}
                  alt={`${bookmark.title} favicon`}
                  className="w-6 h-6 pixelated"
                  onError={(e) =>
                    (e.currentTarget.src = "/images/default-favicon.png")
                  }
                />
              )}
              {bookmark.favorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current pixelated" />
              )}
              <h3 className="font-medium truncate">{bookmark.title}</h3>
              <span
                className="text-xs px-2 py-1 border-2"
                style={{
                  background: folderColor.background,
                  color: folderColor.text,
                  borderColor: isDarkMode ? "white" : "black",
                }}
              >
                {folders.find((f) => f.id === bookmark.folderId)?.title ||
                  translations[language].otherFolder ||
                  "Other"}
              </span>
            </div>
            <p className="text-sm truncate">{bookmark.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {bookmark.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 border-2"
                  style={{
                    background: folderColor.background,
                    color: folderColor.text,
                    borderColor: isDarkMode ? "white" : "black",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => toggleFavorite(bookmark.id)}
              className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Star
                className={`w-4 h-4 pixelated ${
                  bookmark.favorite
                    ? "text-yellow-500 fill-current"
                    : isDarkMode
                    ? "text-white"
                    : "text-black"
                }`}
              />
            </button>
            <button
              onClick={() => {
                setRenameBookmarkId(bookmark.id)
                setRenameValue(bookmark.title || "")
              }}
              className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Edit3 className="w-4 h-4 pixelated" />
            </button>
            <button
              onClick={() => handleDeleteBookmark(bookmark.id)}
              className={`p-2 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Trash2 className="w-4 h-4 text-red-600 pixelated" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-out font-${font} ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <CursorEffect />
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold">
            {translations[language].bookmarkManager || "Bookmark Manager"}
          </h1>
          <p className="text-xl mt-2">
            {translations[language].bookmarkManagerSubtitle ||
              "Organize your digital life with style and efficiency"}
          </p>
        </div>
        <div
          className={`p-6 border-2 shadow-[8px_8px_0_0] mb-8 transition-all duration-200 steps-4 ${
            isDarkMode
              ? "bg-black border-white shadow-white"
              : "bg-white border-black shadow-black"
          }`}
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-80">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pixelated ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
              <input
                type="text"
                placeholder={
                  translations[language].searchBookmarks ||
                  "Search bookmarks..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black border-white"
                      : "bg-white border-black"
                  }`}
                >
                  <X className="w-4 h-4 pixelated" />
                </button>
              )}
            </div>
            <div
              className={`flex p-1 border-2 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 border-2 transition-all duration-200 steps-4 hover:scale-105 ${
                  viewMode === "grid"
                    ? isDarkMode
                      ? "bg-white text-black border-white"
                      : "bg-black text-white border-black"
                    : isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                <Grid className="w-5 h-5 pixelated" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 border-2 transition-all duration-200 steps-4 hover:scale-105 ${
                  viewMode === "list"
                    ? isDarkMode
                      ? "bg-white text-black border-white"
                      : "bg-black text-white border-black"
                    : isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                <List className="w-5 h-5 pixelated" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                isDarkMode
                  ? "bg-black text-white border-white"
                  : "bg-white text-black border-black"
              }`}
            >
              <Filter className="w-5 h-5 pixelated" />
              {translations[language].filters || "Filters"}
            </button>
            <button
              onClick={() => setShowCreateFolder(true)}
              className={`flex items-center gap-2 px-4 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                isDarkMode
                  ? "bg-black text-white border-white"
                  : "bg-white text-black border-black"
              }`}
            >
              <FolderPlus className="w-5 h-5 pixelated" />
              {translations[language].newFolder || "New Folder"}
            </button>
          </div>
          {showFilters && (
            <div
              className={`flex flex-wrap items-center gap-4 p-4 border-2 animate-in slide-in-from-top-2 duration-200 steps-4 ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className={`px-4 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                <option value="">
                  {translations[language].allFolders || "All Folders"}
                </option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                <option value="default">
                  {translations[language].defaultOrder || "Default Order"}
                </option>
                <option value="new">
                  {translations[language].newestFirst || "Newest First"}
                </option>
                <option value="old">
                  {translations[language].oldestFirst || "Oldest First"}
                </option>
                <option value="a-z">
                  {translations[language].aToZ || "A to Z"}
                </option>
                <option value="z-a">
                  {translations[language].zToA || "Z to A"}
                </option>
                <option value="favorites">
                  {translations[language].favoritesFirst || "Favorites First"}
                </option>
              </select>
              <button
                onClick={() => setShowCheckboxes(!showCheckboxes)}
                className={`flex items-center gap-2 px-4 py-2 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                {showCheckboxes ? (
                  <EyeOff className="w-5 h-5 pixelated" />
                ) : (
                  <Eye className="w-5 h-5 pixelated" />
                )}
                {showCheckboxes
                  ? translations[language].hideSelection || "Hide Selection"
                  : translations[language].showSelection || "Show Selection"}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div
              className={`px-6 py-3 border-2 shadow-[8px_8px_0_0] ${
                isDarkMode
                  ? "bg-black text-white border-white shadow-white"
                  : "bg-white text-black border-black shadow-black"
              }`}
            >
              <span className="text-2xl font-bold">
                {sortedBookmarks.length}
              </span>
              <span className="ml-2">
                {translations[language].bookmarks || "bookmarks"}
              </span>
            </div>
            {selectedBookmarks.length > 0 && (
              <div
                className={`px-6 py-3 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-left-5 duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white shadow-white"
                    : "bg-white text-black border-black shadow-black"
                }`}
              >
                <span className="font-medium">
                  {selectedBookmarks.length}{" "}
                  {translations[language].selected || "selected"}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-end mb-4">
            <BookmarkForm onAdd={() => router.refresh()} folders={folders} />
            <DeleteFolder
              onFolderDelete={() => router.refresh()}
              folders={folders}
            />
          </div>
          {showCheckboxes && (
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setSelectedBookmarks(
                    selectedBookmarks.length === sortedBookmarks.length
                      ? []
                      : sortedBookmarks.map((bm) => bm.id)
                  )
                }
                className={`px-4 py-2 border-2 hover:scale-105 transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                {selectedBookmarks.length === sortedBookmarks.length
                  ? translations[language].deselectAll || "Deselect All"
                  : translations[language].selectAll || "Select All"}
              </button>
              {selectedBookmarks.length > 0 && (
                <button
                  onClick={() => setAddToFolderBookmarkId(selectedBookmarks[0])}
                  className={`flex items-center gap-2 px-4 py-2 border-2 hover:scale-105 transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <Folder className="w-5 h-5 pixelated" />
                  {translations[language].moveToFolder || "Move to Folder"}
                </button>
              )}
            </div>
          )}
        </div>
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {sortedBookmarks.map((bookmark, index) => (
            <div
              key={bookmark.id}
              className="animate-in fade-in-50 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {viewMode === "grid" ? (
                <BookmarkCard bookmark={bookmark} />
              ) : (
                <BookmarkListItem bookmark={bookmark} />
              )}
            </div>
          ))}
        </div>
        {sortedBookmarks.length === 0 && (
          <div className="text-center py-16">
            <div
              className={`w-32 h-32 mx-auto mb-6 border-2 flex items-center justify-center ${
                isDarkMode ? "bg-black border-white" : "bg-white border-black"
              }`}
            >
              <Search className="w-16 h-16 pixelated" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {translations[language].noBookmarksFound || "No bookmarks found"}
            </h3>
            <p>
              {translations[language].adjustSearch ||
                "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>
      {renameBookmarkId && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200 steps-4 ${
            isDarkMode ? "bg-white/50" : "bg-black/50"
          }`}
        >
          <div
            className={`p-8 max-w-md w-full border-2 shadow-[8px_8px_0_0] animate-in zoom-in-95 duration-200 steps-4 ${
              isDarkMode
                ? "bg-black text-white border-white shadow-white"
                : "bg-white text-black border-black shadow-black"
            }`}
          >
            <h3 className="text-2xl font-bold mb-6">
              {translations[language].renameBookmark || "Rename Bookmark"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className={`w-full px-4 py-3 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
                placeholder={
                  translations[language].enterNewName || "Enter new name..."
                }
                maxLength={255}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRenameSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <Check className="w-5 h-5 pixelated" />
                  {translations[language].save || "Save"}
                </button>
                <button
                  onClick={() => setRenameBookmarkId(null)}
                  className={`flex-1 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  {translations[language].cancel || "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {addToFolderBookmarkId && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200 steps-4 ${
            isDarkMode ? "bg-white/50" : "bg-black/50"
          }`}
        >
          <div
            className={`p-8 max-w-md w-full border-2 shadow-[8px_8px_0_0] animate-in zoom-in-95 duration-200 steps-4 ${
              isDarkMode
                ? "bg-black text-white border-white shadow-white"
                : "bg-white text-black border-black shadow-black"
            }`}
          >
            <h3 className="text-2xl font-bold mb-6">
              {translations[language].moveToFolder || "Move to Folder"}
            </h3>
            <div className="space-y-4">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className={`w-full px-4 py-3 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                <option value="">
                  {translations[language].selectFolder || "Select Folder"}
                </option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                ))}
              </select>
              <div className="text-center">
                {translations[language].or || "or"}
              </div>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className={`w-full px-4 py-3 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
                placeholder={
                  translations[language].createNewFolder ||
                  "Create new folder..."
                }
              />
              <div className="flex flex-wrap gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewFolderColor(color)}
                    className={`w-8 h-8 border-2 transition-all duration-200 steps-4 ${
                      newFolderColor === color
                        ? isDarkMode
                          ? "border-white scale-110"
                          : "border-black scale-110"
                        : isDarkMode
                        ? "border-white"
                        : "border-black"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={newFolderColor}
                onChange={(e) => setNewFolderColor(e.target.value)}
                className="w-full h-12 border-2 focus:outline-none transition-all duration-200 steps-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddToFolderSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <Check className="w-5 h-5 pixelated" />
                  {translations[language].save || "Save"}
                </button>
                <button
                  onClick={() => {
                    setAddToFolderBookmarkId(null)
                    setNewFolderColor("#6B7280")
                  }}
                  className={`flex-1 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  {translations[language].cancel || "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateFolder && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200 steps-4 ${
            isDarkMode ? "bg-white/50" : "bg-black/50"
          }`}
        >
          <div
            className={`p-8 max-w-md w-full border-2 shadow-[8px_8px_0_0] animate-in zoom-in-95 duration-200 steps-4 ${
              isDarkMode
                ? "bg-black text-white border-white shadow-white"
                : "bg-white text-black border-black shadow-black"
            }`}
          >
            <h3 className="text-2xl font-bold mb-6">
              {translations[language].createNewFolder || "Create New Folder"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className={`w-full px-4 py-3 border-2 focus:outline-none transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
                placeholder={
                  translations[language].enterFolderName ||
                  "Enter folder name..."
                }
                maxLength={100}
              />
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  {translations[language].folderColor || "Folder Color"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-8 h-8 border-2 transition-all duration-200 steps-4 ${
                        newFolderColor === color
                          ? isDarkMode
                            ? "border-white scale-110"
                            : "border-black scale-110"
                          : isDarkMode
                          ? "border-white"
                          : "border-black"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="w-full h-12 border-2 focus:outline-none transition-all duration-200 steps-4"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                    newFolderName.trim()
                      ? isDarkMode
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-5 h-5 pixelated" />
                  {translations[language].create || "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateFolder(false)
                    setNewFolderName("")
                    setNewFolderColor("#6B7280")
                  }}
                  className={`flex-1 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  {translations[language].cancel || "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
