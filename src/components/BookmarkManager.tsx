"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  FolderPlus,
  Grid,
  List,
  Filter,
  ChevronUp,
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

type Bookmark = {
  id: string
  title?: string
  url?: string
  description?: string
  folderId?: string
  createdAt?: { toMillis: () => number }
  favorite?: boolean
  [key: string]: unknown
}

type Folder = {
  id: string
  title: string
  color?: string
}

// Bảng màu preset
const colorPalette = [
  "#EF4444", // Đỏ
  "#F97316", // Cam
  "#FACC15", // Vàng
  "#22C55E", // Xanh lá
  "#3B82F6", // Xanh dương
  "#8B5CF6", // Tím
  "#EC4899", // Hồng
  "#6B7280", // Xám (mặc định)
]

export default function BookmarkManager() {
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
        (b.title || "").localeCompare(a.title || "")
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
      !confirm("Are you sure you want to delete this bookmark?")
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
    return folder?.color
      ? `from-[${folder.color}] to-[${folder.color}]`
      : "from-gray-500 to-gray-600"
  }

  const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => (
    <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getFolderColor(
            bookmark.folderId || "Other"
          )} opacity-5`}
        ></div>
      </div>
      <div className="relative z-10">
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
              className="w-5 h-5 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm checked:bg-blue-500 transition-all duration-300"
            />
          </div>
        )}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {bookmark.favorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
              )}
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getFolderColor(
                  bookmark.folderId || "Other"
                )} text-white shadow-lg`}
              >
                {folders.find((f) => f.id === bookmark.folderId)?.title ||
                  "Other"}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
              {bookmark.title}
            </h3>
          </div>
          <button
            onClick={() => toggleFavorite(bookmark.id)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 ml-2"
          >
            <Star
              className={`w-5 h-5 transition-colors duration-300 ${
                bookmark.favorite
                  ? "text-yellow-500 fill-current"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {bookmark.description}
        </p>
        <div className="flex items-center justify-between">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 group/link"
          >
            <span className="text-sm font-medium">Visit</span>
            <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
          </a>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => {
                setRenameBookmarkId(bookmark.id)
                setRenameValue(bookmark.title || "")
              }}
              className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300 hover:scale-110"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setAddToFolderBookmarkId(bookmark.id)}
              className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300 hover:scale-110"
            >
              <Folder className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleDeleteBookmark(bookmark.id)}
              className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300 hover:scale-110"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const BookmarkListItem = ({ bookmark }: { bookmark: Bookmark }) => (
    <div className="group relative bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-white/40">
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
            className="w-4 h-4 rounded border-2 border-gray-300 checked:bg-blue-500 transition-all duration-300"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {bookmark.favorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
            <h3 className="font-medium text-gray-800 truncate">
              {bookmark.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getFolderColor(
                bookmark.folderId || "Other"
              )} text-white`}
            >
              {folders.find((f) => f.id === bookmark.folderId)?.title ||
                "Other"}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {bookmark.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>
          <button
            onClick={() => toggleFavorite(bookmark.id)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
          >
            <Star
              className={`w-4 h-4 ${
                bookmark.favorite
                  ? "text-yellow-500 fill-current"
                  : "text-gray-400"
              }`}
            />
          </button>
          <button
            onClick={() => {
              setRenameBookmarkId(bookmark.id)
              setRenameValue(bookmark.title || "")
            }}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDeleteBookmark(bookmark.id)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Bookmark Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organize your digital life with style and efficiency
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex bg-white/50 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white shadow-lg text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white shadow-lg text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white/70 rounded-2xl hover:bg-white/90 transition-all duration-300 text-gray-700 font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
            >
              <FolderPlus className="w-5 h-5" />
              New Folder
            </button>
          </div>
          {showFilters && (
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white/40 rounded-2xl border border-white/30 animate-in slide-in-from-top-2 duration-300">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-4 py-2 bg-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700"
              >
                <option value="">All Folders</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700"
              >
                <option value="default">Default Order</option>
                <option value="new">Newest First</option>
                <option value="old">Oldest First</option>
                <option value="a-z">A to Z</option>
                <option value="z-a">Z to A</option>
                <option value="favorites">Favorites First</option>
              </select>
              <button
                onClick={() => setShowCheckboxes(!showCheckboxes)}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-300 text-gray-700 font-medium"
              >
                {showCheckboxes ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                {showCheckboxes ? "Hide Selection" : "Show Selection"}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-white/20">
              <span className="text-2xl font-bold text-purple-600">
                {sortedBookmarks.length}
              </span>
              <span className="text-gray-600 ml-2">bookmarks</span>
            </div>
            {selectedBookmarks.length > 0 && (
              <div className="bg-blue-500 text-white rounded-2xl px-6 py-3 shadow-lg animate-in slide-in-from-left-5 duration-300">
                <span className="font-medium">
                  {selectedBookmarks.length} selected
                </span>
              </div>
            )}
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
                className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-300 text-gray-700"
              >
                {selectedBookmarks.length === sortedBookmarks.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              {selectedBookmarks.length > 0 && (
                <button
                  onClick={() => setAddToFolderBookmarkId(selectedBookmarks[0])}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  <Folder className="w-5 h-5" />
                  Move to Folder
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
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No bookmarks found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
      {renameBookmarkId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Rename Bookmark
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700"
                placeholder="Enter new name..."
                maxLength={255}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRenameSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
                >
                  <Check className="w-5 h-5" />
                  Save
                </button>
                <button
                  onClick={() => setRenameBookmarkId(null)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {addToFolderBookmarkId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Move to Folder
            </h3>
            <div className="space-y-4">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700"
              >
                <option value="">Select Folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                ))}
              </select>
              <div className="text-center text-gray-500">or</div>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700"
                placeholder="Create new folder..."
              />
              <div className="flex flex-wrap gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewFolderColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      newFolderColor === color
                        ? "border-purple-500 scale-110"
                        : "border-white/30"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={newFolderColor}
                onChange={(e) => setNewFolderColor(e.target.value)}
                className="w-full h-12 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddToFolderSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium"
                >
                  <Check className="w-5 h-5" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setAddToFolderBookmarkId(null)
                    setNewFolderColor("#6B7280")
                  }}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Folder
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700"
                placeholder="Enter folder name..."
                maxLength={100}
              />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Folder Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        newFolderColor === color
                          ? "border-purple-500 scale-110"
                          : "border-white/30"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-300 font-medium ${
                    newFolderName.trim()
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-5 h-5" />
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateFolder(false)
                    setNewFolderName("")
                    setNewFolderColor("#6B7280")
                  }}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 z-40"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
