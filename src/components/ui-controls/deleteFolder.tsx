"use client"

import { useState } from "react"
import { Trash2, Check, X, ChevronDown } from "lucide-react"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"

type Folder = {
  id: string
  title: string
  color?: string
}

export default function DeleteFolder({
  onDelete,
  folders,
}: {
  onDelete: () => void
  folders: Folder[]
}) {
  const { isDarkMode } = useTheme()
  const [selectedFolderId, setSelectedFolderId] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedFolderId) {
      setError("Vui lòng chọn một thư mục để xóa.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call (no Firestore, UI state only)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSelectedFolderId("")
      setError(null)
      setSuccess("Thư mục đã được xóa thành công! ✨")
      onDelete()

      setTimeout(() => {
        setSuccess(null)
        setShowModal(false)
      }, 2000)
    } catch (error) {
      console.error("Delete folder error:", error)
      setError("Không thể xóa thư mục. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setError(null)
    setSuccess(null)
    setSelectedFolderId("")
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      {!showModal && (
        <button
          onClick={() => setShowModal(true)}
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
              <Trash2
                className={`w-3 h-3 pixelated ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </div>
            <span className="text-base font-semibold">Xóa Thư Mục</span>
          </div>
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 transition-all duration-200 steps-4 ${
              isDarkMode ? "bg-black/50" : "bg-gray-500/50"
            }`}
            onClick={handleClose}
          ></div>

          {/* Modal Content */}
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-sm p-4 border-2 shadow-[8px_8px_0_0] animate-in zoom-in-50 duration-200 steps-4 ${
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

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center ${
                    isDarkMode
                      ? "bg-black border-white"
                      : "bg-white border-black"
                  }`}
                >
                  <Trash2 className="w-3 h-3 pixelated" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Xóa Thư Mục</h3>
                  <p className="text-base">Chọn thư mục để xóa</p>
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

            {/* Folder Dropdown */}
            <div className="group">
              <label
                htmlFor="folder"
                className="block text-base font-semibold mb-1"
              >
                Thư mục *
              </label>
              <div className="relative">
                <select
                  id="folder"
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2 border-2 focus:outline-none transition-all duration-200 steps-4 text-base appearance-none ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <option value="">Chọn thư mục</option>
                  {folders.map((folder) => (
                    <option
                      key={folder.id}
                      value={folder.id}
                      className="flex items-center"
                    >
                      <span
                        className="mr-1 w-3 h-3 inline-block"
                        style={{ backgroundColor: folder.color || "#6B7280" }}
                      ></span>
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
                type="button"
                disabled={!selectedFolderId || isLoading}
                onClick={handleDelete}
                className={`flex-1 py-2 px-4 border-2 hover:scale-105 transition-all duration-200 steps-4 font-semibold text-base flex items-center justify-center gap-2 ${
                  selectedFolderId && !isLoading
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
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 pixelated" />
                    Xóa Thư Mục
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
