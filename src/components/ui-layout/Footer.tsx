"use client"

import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useFont } from "@/lib/controls-setting-change/changeTextFont"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"
import { translations } from "@/lib/translations"

export default function Footer() {
  const { isDarkMode } = useTheme()
  const { font } = useFont()
  const { language } = useLanguage()

  return (
    <footer
      className={`w-full border-t-2 transition-all duration-200 steps-4 ${
        isDarkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      } ${font === "gohu" ? "font-gohu" : "font-normal"}`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Image
              src={"/assets/images/logo.png"}
              alt="Footer Logo"
              width={200}
              height={200}
              className="object-contain pixelated"
            />
            <div className="hidden md:block">
              <h3 className="text-lg font-bold">
                {translations[language].brandTitle}
              </h3>
              <p className="text-xs">{translations[language].brandSubtitle}</p>
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

          {/* Copyright + Privacy */}
          <div className="text-center md:text-right text-sm space-x-2">
            <span>
              © {new Date().getFullYear()}{" "}
              <Link href="https://github.com/ChickenSoup269">
                ChickenSoup269
              </Link>
              . All rights reserved.
            </span>
            <span>·</span>
            <Link
              href="https://chickensoup269.github.io/privacy_extension_bookmark_2.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
