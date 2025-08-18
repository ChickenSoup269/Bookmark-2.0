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
import { useTheme } from "@/lib/theme-provider"

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isDarkMode } = useTheme()

  const features = [
    {
      icon: <Bookmark className="w-8 h-8" />,
      title: "Smart Organization",
      description:
        "AI-powered categorization và smart folders giúp tổ chức bookmark hiệu quả",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Lightning Search",
      description: "Tìm kiếm instant với full-text search và smart suggestions",
      gradient: "from-sky-500 to-blue-500",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Cross-Platform Sync",
      description: "Đồng bộ seamless trên mọi thiết bị với real-time updates",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption và privacy-first design",
      gradient: "from-indigo-500 to-blue-500",
    },
  ]

  const testimonials = [
    {
      name: "Nguyen Van A",
      role: "Developer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      text: "Ứng dụng bookmark tốt nhất tôi từng dùng. Interface đẹp và tính năng đầy đủ!",
      rating: 5,
    },
    {
      name: "Tran Thi B",
      role: "Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      text: "Design cực kỳ modern và smooth. Làm việc với bookmark giờ trở nên thú vị!",
      rating: 5,
    },
    {
      name: "Le Van C",
      role: "Student",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      text: "Perfect cho việc research. Tổ chức tài liệu học tập chưa bao giờ dễ dàng đến thế!",
      rating: 5,
    },
  ]

  const stats = [
    {
      number: "50K+",
      label: "Active Users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      number: "2M+",
      label: "Bookmarks Saved",
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    { number: "24/7", label: "Support", icon: <Heart className="w-5 h-5" /> },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleScroll = () => {
    const element = document.getElementById("features")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className={`min-h-screen transition-all duration-700 overflow-x-hidden relative ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 text-gray-900"
      }`}
    >
      {/* Animated cursor follower */}
      <div
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-700 ease-out ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-400 to-cyan-400"
            : "bg-gradient-to-r from-blue-500 to-sky-500"
        }`}
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
        }}
      />

      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {isDarkMode ? (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
          </>
        )}

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-ping ${
              isDarkMode ? "bg-white opacity-30" : "bg-gray-600 opacity-20"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Badge */}
          <div
            className={`inline-flex items-center gap-2 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border transition-all duration-300 group cursor-pointer hover:scale-105 ${
              isDarkMode
                ? "bg-white/10 border-white/20 hover:bg-white/20"
                : "bg-white/70 border-white/40 hover:bg-white/90 shadow-lg"
            }`}
          >
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Introducing Bookmark Manager 2.0
            </span>
            <Crown className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent animate-pulse ${
                isDarkMode
                  ? "from-white via-blue-200 to-cyan-200"
                  : "from-gray-800 via-blue-600 to-sky-600"
              }`}
            >
              Bookmark
            </span>
            <br />
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode
                  ? "from-blue-400 via-cyan-400 to-sky-400"
                  : "from-blue-500 via-sky-500 to-cyan-500"
              }`}
            >
              Revolution
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p
            className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Trải nghiệm quản lý bookmark{" "}
            <span
              className={`font-semibold ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              hoàn toàn mới
            </span>{" "}
            với AI-powered organization, beautiful design và lightning-fast
            performance
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Bắt đầu miễn phí
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            <button
              className={`group flex items-center gap-3 px-8 py-4 backdrop-blur-xl rounded-2xl font-semibold text-lg border transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  : "bg-white/60 border-white/40 hover:bg-white/80 text-gray-800 shadow-lg"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-white/20 group-hover:bg-white/30"
                    : "bg-white/40 group-hover:bg-white/60"
                }`}
              >
                <Play className="w-6 h-6 ml-1" />
              </div>
              Xem Demo
            </button>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={handleScroll}
            className={`animate-bounce hover:animate-none transition-all duration-300 cursor-pointer ${
              isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"
            }`}
          >
            <ArrowDown className="w-8 h-8 mx-auto" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`relative z-10 py-20 px-6 border-y transition-colors duration-700 ${
          isDarkMode
            ? "border-white/10 bg-black/20"
            : "border-gray-200/50 bg-white/30"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-16 h-16 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/40 group-hover:to-cyan-500/40 border-white/10"
                      : "bg-gradient-to-br from-blue-100/60 to-cyan-100/60 group-hover:from-blue-200/80 group-hover:to-cyan-200/80 border-gray-200/30 shadow-lg"
                  }`}
                >
                  <div
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div
                  className={`text-3xl lg:text-4xl font-black mb-2 transition-colors duration-300 ${
                    isDarkMode
                      ? "text-white group-hover:text-blue-400"
                      : "text-gray-800 group-hover:text-blue-600"
                  }`}
                >
                  {stat.number}
                </div>
                <div
                  className={`font-medium ${
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
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode
                    ? "from-blue-400 to-cyan-400"
                    : "from-blue-600 to-cyan-600"
                }`}
              >
                Tính năng
              </span>
              <br />
              <span className={isDarkMode ? "text-white" : "text-gray-800"}>
                Đột phá
              </span>
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Mỗi tính năng được thiết kế để mang lại trải nghiệm tối ưu nhất
              cho người dùng
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature showcase */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-500 cursor-pointer hover:scale-105 ${
                    currentFeature === index
                      ? isDarkMode
                        ? "bg-white/10 border-white/30 shadow-2xl"
                        : "bg-white/60 border-white/50 shadow-2xl"
                      : isDarkMode
                      ? "bg-white/5 hover:bg-white/10 border-white/10"
                      : "bg-white/30 hover:bg-white/50 border-white/20 shadow-lg"
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3
                        className={`text-2xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
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
                className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl transition-all duration-700 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
                    : "bg-gradient-to-br from-white/70 to-white/40 border-white/30"
                }`}
              >
                <div
                  className={`rounded-2xl p-6 h-96 flex items-center justify-center transition-all duration-700 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-900 to-gray-800"
                      : "bg-gradient-to-br from-gray-50 to-gray-100"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-24 h-24 bg-gradient-to-br ${features[currentFeature]?.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse`}
                    >
                      <div className="text-white text-3xl">
                        {features[currentFeature]?.icon}
                      </div>
                    </div>
                    <h4
                      className={`text-2xl font-bold mb-4 ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {features[currentFeature]?.title}
                    </h4>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
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
      <section
        className={`relative z-10 py-32 px-6 backdrop-blur-xl transition-all duration-700 ${
          isDarkMode
            ? "bg-gradient-to-r from-black/20 to-black/40"
            : "bg-gradient-to-r from-white/40 to-gray-50/60"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-black mb-6 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Người dùng{" "}
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode
                    ? "from-blue-400 to-cyan-400"
                    : "from-blue-600 to-cyan-600"
                }`}
              >
                yêu thích
              </span>
            </h2>
            <p
              className={`text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Nghe từ cộng đồng 50K+ người dùng hài lòng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 border backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
                  isDarkMode
                    ? "bg-white/10 border-white/20 hover:bg-white/15"
                    : "bg-white/60 border-white/30 hover:bg-white/80 shadow-lg"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    width={64}
                    height={64}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className={`w-16 h-16 rounded-2xl object-cover ring-4 transition-all duration-300 ${
                      isDarkMode
                        ? "ring-white/20 group-hover:ring-white/40"
                        : "ring-gray-200/50 group-hover:ring-blue-300/50"
                    }`}
                  />
                  <div>
                    <h4
                      className={`font-bold text-lg ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {testimonial.name}
                    </h4>
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
                      className="w-5 h-5 text-yellow-400 fill-current"
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
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`backdrop-blur-xl rounded-3xl p-12 border shadow-2xl transition-all duration-700 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-white/20"
                : "bg-gradient-to-r from-blue-100/80 to-cyan-100/80 border-white/40"
            }`}
          >
            <h2
              className={`text-4xl lg:text-6xl font-black mb-6 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Sẵn sàng bắt đầu?
            </h2>
            <p
              className={`text-xl mb-12 max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Tham gia cùng hàng ngàn người dùng đã tin tưởng Bookmark Manager
              để tổ chức cuộc sống số của họ
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-white">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Đăng nhập với Google
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              <div
                className={`flex items-center gap-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Check className="w-5 h-5 text-green-400" />
                <span>Miễn phí mãi mãi</span>
                <Check className="w-5 h-5 text-green-400" />
                <span>Không cần thẻ tín dụng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Smooth transitions for theme switching */
        * {
          transition-property: background-color, border-color, color, fill,
            stroke, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
    </div>
  )
}
