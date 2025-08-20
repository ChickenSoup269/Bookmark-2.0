"use client"

import { useTheme } from "@/lib/theme-provider"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

const Footer = () => {
  const { isDarkMode } = useTheme()

  return (
    <footer
      className={`w-full border-t-2 transition-all duration-200 steps-4 ${
        isDarkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Image
              src={"/assets/images/logo.png"} // Thay bằng đường dẫn ảnh của bạn
              alt="Footer Logo"
              width={200}
              height={200}
              className="object-contain pixelated"
            />
            <div className="hidden md:block">
              <h3 className="text-lg font-bold">Bookmarks manager</h3>
              <p className="text-xs">Powered by Creativity</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                } pixelated`}
              />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                } pixelated`}
              />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                } pixelated`}
              />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                } pixelated`}
              />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-sm">
            © {new Date().getFullYear()} Your Brand. All rights reserved.
          </div>
        </div>
      </div>
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
        }
        @keyframes pixel-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse {
          animation: pixel-pulse 1s steps(4) infinite;
        }
      `}</style>
    </footer>
  )
}

export default Footer
