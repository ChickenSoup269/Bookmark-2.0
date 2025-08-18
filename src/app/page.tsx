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

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const features = [
    {
      icon: <Bookmark className="w-8 h-8" />,
      title: "Smart Organization",
      description:
        "AI-powered categorization và smart folders giúp tổ chức bookmark hiệu quả",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Lightning Search",
      description: "Tìm kiếm instant với full-text search và smart suggestions",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Cross-Platform Sync",
      description: "Đồng bộ seamless trên mọi thiết bị với real-time updates",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption và privacy-first design",
      gradient: "from-orange-500 to-red-500",
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
    const handleMouseMove = (e) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Animated cursor follower */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
        }}
      />

      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
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
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium">
              Introducing Bookmark Manager 2.0
            </span>
            <Crown className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
              Bookmark
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Revolution
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm quản lý bookmark{" "}
            <span className="text-purple-400 font-semibold">hoàn toàn mới</span>{" "}
            với AI-powered organization, beautiful design và lightning-fast
            performance
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Bắt đầu miễn phí
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            <button className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <Play className="w-6 h-6 ml-1 group-hover:scale-110 transition-transform duration-300" />
              </div>
              Xem Demo
            </button>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={handleScroll}
            className="animate-bounce hover:animate-none transition-all duration-300 hover:text-purple-400 cursor-pointer"
          >
            <ArrowDown className="w-8 h-8 mx-auto" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-all duration-300 border border-white/10">
                  <div className="text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
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
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tính năng
              </span>
              <br />
              <span className="text-white">Đột phá</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
                  className={`p-6 rounded-3xl border border-white/10 backdrop-blur-xl transition-all duration-500 cursor-pointer hover:scale-105 ${
                    currentFeature === index
                      ? "bg-white/10 border-white/30 shadow-2xl"
                      : "bg-white/5 hover:bg-white/10"
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
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className={`w-24 h-24 bg-gradient-to-br ${features[currentFeature]?.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                    >
                      <div className="text-white text-3xl animate-pulse">
                        {features[currentFeature]?.icon}
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">
                      {features[currentFeature]?.title}
                    </h4>
                    <p className="text-gray-400 text-lg">
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
      <section className="relative z-10 py-32 px-6 bg-gradient-to-r from-black/20 to-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Người dùng{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                yêu thích
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Nghe từ cộng đồng 50K+ người dùng hài lòng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    width={64}
                    height={64}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                  />
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400">{testimonial.role}</p>
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

                <p className="text-gray-300 italic leading-relaxed">
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
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn người dùng đã tin tưởng Bookmark Manager
              để tổ chức cuộc sống số của họ
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 text-white">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Đăng nhập với Google
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              <div className="flex items-center gap-4 text-gray-400">
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
      `}</style>
    </div>
  )
}
