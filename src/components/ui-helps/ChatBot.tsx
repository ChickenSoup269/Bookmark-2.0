"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Maximize2, Minimize2, Download } from "lucide-react"
import { translations } from "@/lib/translations"
import { sendMessageToGemini } from "@/lib/gemini"
import { addBookmark, deleteBookmark } from "@/lib/bookmark"
import { auth } from "@/lib/firebase"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: string
}

export default function Chatbot({
  isDarkMode,
  isChatOpen,
  setIsChatOpen,
  isChatbotVisible,
  language,
  font,
}: {
  isDarkMode: boolean
  isChatOpen: boolean
  setIsChatOpen: (value: boolean) => void
  isChatbotVisible: boolean
  language: keyof typeof translations
  font: string
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: isDarkMode
        ? translations[language].chatWelcomeDark
        : translations[language].chatWelcomeLight,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [user, setUser] = useState<import("firebase/auth").User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => setIsChatOpen(!isChatOpen)
  const toggleExpanded = () => setIsExpanded(!isExpanded)

  const exportChatHistory = () => {
    const chatHistory = messages
      .map((message) => {
        const sender = message.sender === "user" ? "Người dùng" : "Bot"
        return `[${message.timestamp}] ${sender}: ${message.text}`
      })
      .join("\n")

    const blob = new Blob([chatHistory], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `chat-history-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([...messages, newUserMessage])
    setInputText("")

    try {
      const historyText = messages
        .map((m) => `${m.sender}: ${m.text}`)
        .join("\n")
      const botReply = await sendMessageToGemini(historyText, inputText)

      // Thử bắt JSON trong reply
      let actionData = null
      const jsonMatch = botReply.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          actionData = JSON.parse(jsonMatch[0])
        } catch (err) {
          console.error("Parse JSON lỗi:", err)
        }
      }

      // Nếu có action add bookmark
      if (actionData?.action === "add") {
        if (!user) throw new Error("User chưa đăng nhập")
        await addBookmark(user.uid, {
          title: actionData.title,
          url: actionData.url,
          description: actionData.description || "",
          folderId: actionData.folderId || null,
          tags: actionData.tags || [],
        })

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "✅ Đã thêm bookmark thành công",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      }

      if (actionData?.action === "delete") {
        if (!user) throw new Error("User chưa đăng nhập")
        await deleteBookmark(user.uid, actionData.url)
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "✅ Đã thêm bookmark thành công",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botReply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage()
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u))
    return () => unsub()
  }, [])

  if (!isChatbotVisible) return null

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 p-3 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-110 z-50 ${
          isDarkMode
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        }`}
        aria-label="Toggle chatbot"
      >
        <MessageCircle className="w-6 h-6 pixelated" />
      </button>

      {isChatOpen && (
        <div
          className={`fixed ${
            isExpanded
              ? "bottom-4 right-4 w-120 h-146"
              : "bottom-16 right-4 w-80 h-96"
          } border-2 shadow-[8px_8px_0_0] rounded-none transition-all duration-300 steps-4 z-50 ${
            isDarkMode
              ? "bg-black border-white shadow-white text-white"
              : "bg-white border-black shadow-black text-black"
          } animate-in slide-in-from-bottom-5 ${
            font === "gohu" ? "font-gohu" : "font-normal"
          }`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Chatbot</h3>
              <div className="flex gap-2">
                <button
                  onClick={exportChatHistory}
                  className={`p-2 border-2 rounded-none ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <Download className="w-4 h-4 pixelated" />
                </button>
                <button
                  onClick={toggleExpanded}
                  className={`p-2 border-2 rounded-none ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 pixelated" />
                  ) : (
                    <Maximize2 className="w-4 h-4 pixelated" />
                  )}
                </button>
                <button
                  onClick={toggleChat}
                  className={`p-2 border-2 rounded-none ${
                    isDarkMode
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                >
                  <X className="w-4 h-4 pixelated" />
                </button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 border-2 p-2 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      isExpanded ? "max-w-[50%]" : "max-w-[70%]"
                    } p-2 border-2 rounded-none ${
                      message.sender === "user"
                        ? isDarkMode
                          ? "bg-white text-black border-white"
                          : "bg-black text-white border-black"
                        : isDarkMode
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    <p className={isExpanded ? "text-base" : "text-sm"}>
                      {message.text}
                    </p>
                    <p
                      className={
                        isExpanded ? "text-sm opacity-50" : "text-xs opacity-50"
                      }
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 p-2 border-2 rounded-none ${
                  isExpanded ? "text-base" : "text-sm"
                } ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
              />
              <button
                onClick={handleSendMessage}
                className={`p-2 border-2 rounded-none ${
                  isDarkMode
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
