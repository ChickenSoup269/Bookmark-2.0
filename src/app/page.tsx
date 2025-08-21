"use client"

import { useState, useEffect } from "react"
import {
  Bookmark,
  Sparkles,
  Star,
  Zap,
  Shield,
  Smartphone,
  Globe,
  Users,
  TrendingUp,
  ChevronRight,
  Play,
  Check,
  ArrowDown,
  Heart,
  Folder,
  Search,
  Filter,
  Layout,
  Palette,
  Rocket,
  Crown,
  Download,
  Share2,
  Eye,
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useCursor } from "@/lib/CursorContext"

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0)
  // const [isVisible, setIsVisible] = useState({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isCursorEnabled } = useCursor()
  const { isDarkMode } = useTheme()

  const features = [
    {
      icon: <Bookmark className="w-8 h-8 pixelated" />,
      title: "Smart Organization",
      description:
        "AI-powered categorization và smart folders giúp tổ chức bookmark hiệu quả",
    },
    {
      icon: <Search className="w-8 h-8 pixelated" />,
      title: "Lightning Search",
      description: "Tìm kiếm instant với full-text search và smart suggestions",
    },
    {
      icon: <Smartphone className="w-8 h-8 pixelated" />,
      title: "Cross-Platform Sync",
      description: "Đồng bộ seamless trên mọi thiết bị với real-time updates",
    },
    {
      icon: <Shield className="w-8 h-8 pixelated" />,
      title: "Secure & Private",
      description: "End-to-end encryption và privacy-first design",
    },
  ]

  const testimonials = [
    {
      name: "Nguyen Van A",
      role: "Developer",
      avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXuVuP5evfLgVTOiHaPFCZlT0MtWZP73FftQ&s=${
        isDarkMode ? "FFFFFF" : "000000"
      }&color=${isDarkMode ? "000000" : "FFFFFF"}&size=64`,
      text: "Ứng dụng bookmark tốt nhất tôi từng dùng. Interface đẹp và tính năng đầy đủ!",
      rating: 5,
    },
    {
      name: "Tran Thi B",
      role: "Designer",
      avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXuVuP5evfLgVTOiHaPFCZlT0MtWZP73FftQ&s=${
        isDarkMode ? "FFFFFF" : "000000"
      }&color=${isDarkMode ? "000000" : "FFFFFF"}&size=64`,
      text: "Design cực kỳ modern và smooth. Làm việc với bookmark giờ trở nên thú vị!",
      rating: 5,
    },
    {
      name: "Le Van C",
      role: "Student",
      avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXuVuP5evfLgVTOiHaPFCZlT0MtWZP73FftQ&s=${
        isDarkMode ? "FFFFFF" : "000000"
      }&color=${isDarkMode ? "000000" : "FFFFFF"}&size=64`,
      text: "Perfect cho việc research. Tổ chức tài liệu học tập chưa bao giờ dễ dàng đến thế!",
      rating: 5,
    },
  ]

  const stats = [
    {
      number: "50K+",
      label: "Active Users",
      icon: <Users className="w-5 h-5 pixelated" />,
    },
    {
      number: "2M+",
      label: "Bookmarks Saved",
      icon: <Bookmark className="w-5 h-5 pixelated" />,
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: <TrendingUp className="w-5 h-5 pixelated" />,
    },
    {
      number: "24/7",
      label: "Support",
      icon: <Heart className="w-5 h-5 pixelated" />,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    if (isCursorEnabled) {
      window.addEventListener("mousemove", handleMouseMove)
    }
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isCursorEnabled])

  const handleScroll = () => {
    const element = document.getElementById("features")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className={`min-h-screen font-gohu transition-all duration-300 ease-out ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Animated pixel background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating pixels */}
        <div className={`pixel-grid ${isDarkMode ? "dark" : "light"}`}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="pixel-dot"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Moving pixel streams */}
        <div className={`pixel-streams ${isDarkMode ? "dark" : "light"}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`stream-${i}`}
              className="pixel-stream"
              style={{
                left: `${i * 8.33 + Math.random() * 5}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              {Array.from({ length: 8 }).map((_, j) => (
                <div
                  key={j}
                  className="stream-pixel"
                  style={{
                    animationDelay: `${j * 0.2}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Diagonal pixel runners */}
        <div className={`pixel-runners ${isDarkMode ? "dark" : "light"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`runner-${i}`}
              className="pixel-runner"
              style={{
                top: `${i * 16.66}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Pulsing pixel grid overlay */}
        <div className={`pixel-overlay ${isDarkMode ? "dark" : "light"}`}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`overlay-${i}`}
              className="overlay-pixel"
              style={{
                left: `${i * 5 + Math.random() * 3}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Cursor follower (conditionally rendered) */}
      {isCursorEnabled && (
        <>
          <div
            className={`fixed w-8 h-8 border-2 rounded-none pointer-events-none z-50 transition-all duration-300 ease-out ${
              isDarkMode ? "bg-white border-white" : "bg-black border-black"
            }`}
            style={{
              left: mousePosition.x - 16,
              top: mousePosition.y - 16,
              transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
              boxShadow: isDarkMode
                ? "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)"
                : "0 0 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 0, 0, 0.3)",
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
            }}
          />
          <div
            className={`fixed w-4 h-4 border rounded-none pointer-events-none z-49 transition-all duration-400 ease-out opacity-30 ${
              isDarkMode ? "bg-white border-white" : "bg-black border-black"
            }`}
            style={{
              left: mousePosition.x - 8,
              top: mousePosition.y - 8,
              transform: `scale(${mousePosition.x > 0 ? 0.7 : 0})`,
            }}
          />
        </>
      )}

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center relative">
          {/* Smoke-like pixel effect */}
          <div className={`pixel-smoke ${isDarkMode ? "dark" : "light"}`}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`smoke-${i}`}
                className="smoke-pixel"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                  transform: `scale(${0.5 + Math.random() * 0.5})`,
                }}
              />
            ))}
          </div>

          {/* Hero Badge */}
          <div
            className={`inline-flex items-center gap-2 border-2 px-4 py-2 mb-8 transition-all duration-200 steps-4 hover:scale-105 ${
              isDarkMode
                ? "bg-black border-white text-white"
                : "bg-white border-black text-black"
            }`}
          >
            <Sparkles className="w-5 h-5 pixelated animate-pulse" />
            <span className="text-sm font-medium">
              Introducing Bookmark Manager 2.0
            </span>
            <Crown className="w-4 h-4 pixelated animate-pulse" />
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Bookmark
            <br />
            Revolution
          </h1>

          {/* Hero Subtitle */}
          <p
            className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Trải nghiệm quản lý bookmark{" "}
            <span className="font-semibold">hoàn toàn mới</span> với AI-powered
            organization, beautiful design và lightning-fast performance
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              className={`group px-8 py-3 border-2 font-bold text-lg transition-all duration-200 steps-4 hover:scale-105 ${
                isDarkMode
                  ? "bg-white text-black border-white hover:bg-gray-300"
                  : "bg-black text-white border-black hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 pixelated group-hover:scale-110" />
                Tải extension ngay!
                <ChevronRight className="w-5 h-5 pixelated group-hover:translate-x-1" />
              </div>
            </button>

            <button
              className={`group flex items-center gap-3 px-8 py-3 border-2 font-semibold text-lg transition-all duration-200 steps-4 hover:scale-105 ${
                isDarkMode
                  ? "bg-black text-white border-white hover:bg-gray-900"
                  : "bg-white text-black border-black hover:bg-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 border-2 flex items-center justify-center group-hover:scale-110 ${
                  isDarkMode
                    ? "bg-white text-black border-white"
                    : "bg-black text-white border-black"
                }`}
              >
                <Play className="w-5 h-5 pixelated ml-1" />
              </div>
              Xem Demo
            </button>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={handleScroll}
            className={`animate-bounce hover:animate-none transition-all duration-200 steps-4 ${
              isDarkMode ? "hover:text-gray-400" : "hover:text-gray-600"
            }`}
          >
            <ArrowDown className="w-8 h-8 pixelated mx-auto" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`relative z-10 py-16 px-6 border-y transition-all duration-200 steps-4 ${
          isDarkMode ? "bg-black border-white" : "bg-white border-black"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-200 steps-4"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-14 h-14 border-2 flex items-center justify-center mx-auto mb-4 transition-all duration-200 steps-4 ${
                    isDarkMode
                      ? "bg-black border-white text-white"
                      : "bg-white border-black text-black"
                  }`}
                >
                  <div className="group-hover:scale-110">{stat.icon}</div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Tính năng
              <br />
              Đột phá
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Mỗi tính năng được thiết kế để mang lại trải nghiệm tối ưu nhất
              cho người dùng
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature showcase */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 transition-all duration-200 steps-4 cursor-pointer hover:scale-105 ${
                    currentFeature === index
                      ? isDarkMode
                        ? "bg-white text-black border-white shadow-[8px_8px_0_0_#fff]"
                        : "bg-black text-white border-black shadow-[8px_8px_0_0_#000]"
                      : isDarkMode
                      ? "bg-black text-white border-white hover:bg-gray-900"
                      : "bg-white text-black border-black hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 border-2 flex items-center justify-center ${
                        isDarkMode
                          ? "bg-white text-black border-white"
                          : "bg-black text-white border-black"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature preview */}
            <div className="relative">
              <div
                className={`p-6 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 ${
                  isDarkMode
                    ? "bg-black border-white shadow-white"
                    : "bg-white border-black shadow-black"
                }`}
              >
                <div
                  className={`p-6 h-80 flex items-center justify-center transition-all duration-200 steps-4 ${
                    isDarkMode ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 border-2 rounded-none flex items-center justify-center mx-auto mb-6 animate-pulse ${
                        isDarkMode
                          ? "bg-white text-black border-white"
                          : "bg-black text-white border-black"
                      }`}
                    >
                      <div className="text-3xl">
                        {features[currentFeature]?.icon}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-4">
                      {features[currentFeature]?.title}
                    </h4>
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Interactive preview coming soon...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Người dùng <span className="font-bold">yêu thích</span>
            </h2>
            <p
              className={`text-xl ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Nghe từ cộng đồng 50K+ người dùng hài lòng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 border-2 transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-black border-white hover:bg-gray-900"
                    : "bg-white border-black hover:bg-gray-200"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    width={64}
                    height={64}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 pixelated object-cover border-2 border-current"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 pixelated text-white bg-black border border-current"
                    />
                  ))}
                </div>

                <p
                  className={`italic leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`p-8 border-2 shadow-[8px_8px_0_0] transition-all duration-200 steps-4 ${
              isDarkMode
                ? "bg-black border-white shadow-white"
                : "bg-white border-black shadow-black"
            }`}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Tham gia cùng hàng ngàn người dùng đã tin tưởng Bookmark Manager
              để tổ chức cuộc sống số của họ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className={`group px-8 py-4 border-2 font-bold text-lg transition-all duration-200 steps-4 hover:scale-105 ${
                  isDarkMode
                    ? "bg-white text-black border-white hover:bg-gray-300"
                    : "bg-black text-white border-black hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 pixelated group-hover:scale-110" />
                  Đăng nhập với Google
                  <ChevronRight className="w-5 h-5 pixelated group-hover:translate-x-1" />
                </div>
              </button>

              <div
                className={`flex items-center gap-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Check className="w-5 h-5 pixelated" />
                <span>Miễn phí mãi mãi</span>
                <Check className="w-5 h-5 pixelated" />
                <span>Không cần thẻ tín dụng</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
