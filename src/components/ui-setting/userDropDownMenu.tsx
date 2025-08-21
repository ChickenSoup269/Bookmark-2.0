import { useState } from "react"
import { User, Eye, Palette, Volume2, Bell, Shield } from "lucide-react"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"

interface UserDropdownMenuProps {
  isCursorEnabled: boolean
  toggleCursor: () => void
}

// Modern CSS Toggle Switch Component
const ModernToggle = ({
  isOn,
  onToggle,
  label,
  icon: Icon,
  isDarkMode,
  variant = "primary",
}: {
  isOn: boolean
  onToggle: () => void
  label: string
  icon: any
  isDarkMode: boolean
  variant?: "primary" | "success" | "warning" | "danger" | "info"
}) => {
  const variants = {
    primary: {
      on: "from-blue-500 to-blue-600",
      off: "from-gray-400 to-gray-500",
      glow: "shadow-blue-400/50",
    },
    success: {
      on: "from-green-500 to-green-600",
      off: "from-gray-400 to-gray-500",
      glow: "shadow-green-400/50",
    },
    warning: {
      on: "from-yellow-500 to-yellow-600",
      off: "from-gray-400 to-gray-500",
      glow: "shadow-yellow-400/50",
    },
    danger: {
      on: "from-red-500 to-red-600",
      off: "from-gray-400 to-gray-500",
      glow: "shadow-red-400/50",
    },
    info: {
      on: "from-purple-500 to-purple-600",
      off: "from-gray-400 to-gray-500",
      glow: "shadow-purple-400/50",
    },
  }

  const currentVariant = variants[variant]

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
          : "bg-white/80 border-gray-200 hover:bg-white/90"
      } backdrop-blur-sm hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } transition-colors duration-300`}
        >
          <Icon
            className={`w-5 h-5 transition-colors duration-300 ${
              isOn
                ? isDarkMode
                  ? "text-white"
                  : "text-gray-800"
                : isDarkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          />
        </div>
        <div>
          <h4
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </h4>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isOn ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>

      {/* Modern Toggle Switch */}
      <button
        onClick={onToggle}
        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDarkMode ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"
        } ${
          isOn
            ? `bg-gradient-to-r ${currentVariant.on} ${currentVariant.glow} shadow-lg`
            : `bg-gradient-to-r ${currentVariant.off}`
        } hover:scale-110 active:scale-95`}
      >
        {/* Switch Handle */}
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-md ${
            isOn ? "translate-x-9" : "translate-x-1"
          } ${isOn ? "shadow-lg" : "shadow-sm"}`}
        >
          {/* Inner dot indicator */}
          <span
            className={`absolute inset-1 rounded-full transition-all duration-300 ${
              isOn ? `bg-gradient-to-r ${currentVariant.on}` : "bg-gray-300"
            }`}
          />
        </span>

        {/* Glow effect when on */}
        {isOn && (
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentVariant.on} opacity-30 blur-sm animate-pulse`}
          />
        )}
      </button>
    </div>
  )
}

// Sliding Toggle with Labels
const SlidingToggle = ({
  isOn,
  onToggle,
  label,
  icon: Icon,
  isDarkMode,
  onLabel = "ON",
  offLabel = "OFF",
}: {
  isOn: boolean
  onToggle: () => void
  label: string
  icon: any
  isDarkMode: boolean
  onLabel?: string
  offLabel?: string
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
          : "bg-white/80 border-gray-200 hover:bg-white/90"
      } backdrop-blur-sm hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-6 h-6 transition-colors duration-300 ${
            isOn
              ? "text-emerald-500"
              : isDarkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        />
        <span
          className={`font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Sliding Toggle with Labels */}
      <div
        className={`relative h-10 w-24 rounded-full border-2 transition-all duration-300 ${
          isOn
            ? "bg-gradient-to-r from-emerald-400 to-emerald-500 border-emerald-400"
            : isDarkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-gray-200 border-gray-300"
        }`}
      >
        {/* Background Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold">
          <span
            className={`transition-opacity duration-300 ${
              !isOn ? "opacity-100" : "opacity-0"
            } ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {offLabel}
          </span>
          <span
            className={`transition-opacity duration-300 ${
              isOn ? "opacity-100" : "opacity-0"
            } text-white`}
          >
            {onLabel}
          </span>
        </div>

        {/* Sliding Handle */}
        <button
          onClick={onToggle}
          className={`absolute top-1 h-8 w-10 rounded-full transition-all duration-300 shadow-lg transform ${
            isOn ? "translate-x-12 bg-white" : "translate-x-1"
          } ${
            isOn
              ? "bg-white shadow-emerald-200"
              : isDarkMode
              ? "bg-gray-300 shadow-gray-500"
              : "bg-white shadow-gray-300"
          } hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
        >
          <div
            className={`w-full h-full rounded-full transition-all duration-300 ${
              isOn
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : "bg-gradient-to-r from-gray-400 to-gray-500"
            } opacity-20`}
          />
        </button>
      </div>
    </div>
  )
}

export default function UserDropdownMenu({
  isCursorEnabled,
  toggleCursor,
}: UserDropdownMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [darkModeLocal, setDarkModeLocal] = useState(false)
  const [securityMode, setSecurityMode] = useState(true)

  const { isDarkMode } = useTheme()

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={toggleDropdown}
        className={`p-3 rounded-full border-2 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isDarkMode
            ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
        } shadow-lg hover:shadow-xl`}
      >
        <User className="w-6 h-6" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className={`absolute right-0 mt-4 w-80 rounded-2xl border shadow-2xl transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-700 text-white"
              : "bg-white/95 border-gray-200 text-gray-900"
          } backdrop-blur-lg z-50 animate-in slide-in-from-top-2`}
        >
          {/* Header */}
          <div className="p-6 border-b border-opacity-20">
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              User Settings
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Customize your experience
            </p>
          </div>

          {/* Settings */}
          <div className="p-4 space-y-3">
            {/* Cursor Effect - Modern Toggle */}
            <ModernToggle
              isOn={isCursorEnabled}
              onToggle={toggleCursor}
              label="Cursor Effects"
              icon={Eye}
              isDarkMode={isDarkMode}
              variant="primary"
            />

            {/* Sound - Sliding Toggle */}
            <SlidingToggle
              isOn={soundEnabled}
              onToggle={() => setSoundEnabled(!soundEnabled)}
              label="Sound Effects"
              icon={Volume2}
              isDarkMode={isDarkMode}
            />

            {/* Theme Toggle */}
            <ModernToggle
              isOn={darkModeLocal}
              onToggle={() => setDarkModeLocal(!darkModeLocal)}
              label="Dark Theme"
              icon={Palette}
              isDarkMode={isDarkMode}
              variant="warning"
            />

            {/* Notifications */}
            <ModernToggle
              isOn={notificationEnabled}
              onToggle={() => setNotificationEnabled(!notificationEnabled)}
              label="Notifications"
              icon={Bell}
              isDarkMode={isDarkMode}
              variant="info"
            />

            {/* Security Mode */}
            <ModernToggle
              isOn={securityMode}
              onToggle={() => setSecurityMode(!securityMode)}
              label="Security Mode"
              icon={Shield}
              isDarkMode={isDarkMode}
              variant="success"
            />
          </div>

          {/* Footer */}
          <div
            className={`p-4 border-t border-opacity-20 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              className={`w-full p-3 rounded-xl font-medium transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              } hover:scale-[1.02]`}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
