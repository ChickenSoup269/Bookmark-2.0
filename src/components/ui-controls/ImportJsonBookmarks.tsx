"use client"

import { useState } from "react"
import { db, auth } from "@/lib/firebase"
import { addDoc, collection } from "firebase/firestore"
import { Upload } from "lucide-react"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"
import { useFont } from "@/lib/controls-setting-change/changeTextFont"
import { translations } from "@/lib/translations"

type Folder = {
  id: string
  title: string
  color?: string
}

type Props = {
  onImport: () => void
  folders: Folder[]
  onClose: () => void
}

export default function ImportJsonBookmarks({
  onImport,
  folders,
  onClose,
}: Props) {
  const { isDarkMode } = useTheme()
  const { language } = useLanguage()
  const { font } = useFont()
  const [file, setFile] = useState<File | null>(null)
  const [selectedFolder, setSelectedFolder] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file || !auth.currentUser) return
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const json = JSON.parse(e.target?.result as string)
        const bookmarks = Array.isArray(json) ? json : [json]
        for (const bookmark of bookmarks) {
          await addDoc(
            collection(db, `users/${auth.currentUser!.uid}/bookmarks`),
            {
              ...bookmark,
              folderId: selectedFolder || "Other",
              createdAt: new Date(),
            }
          )
        }
        onImport()
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("Error importing bookmarks:", error)
    }
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-200 steps-4 ${
        isDarkMode ? "bg-white/50" : "bg-black/50"
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
          {translations[language].importJson || "Import from JSON"}
        </h3>
        <div className="space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className={`w-full px-4 py-3 border-2 focus:outline-none transition-all duration-200 steps-4 ${
              isDarkMode
                ? "bg-black text-white border-white"
                : "bg-white text-black border-black"
            }`}
          />
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
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={!file}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 hover:scale-105 transition-all duration-200 steps-4 font-medium ${
                file
                  ? isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
              }`}
            >
              <Upload className="w-5 h-5 pixelated" />
              {translations[language].import || "Import"}
            </button>
            <button
              onClick={onClose}
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
  )
}
