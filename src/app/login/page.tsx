"use client"

import { useState, useEffect } from "react"
import { LogIn, User, X, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { auth } from "@/lib/firebase"
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { translations } from "@/lib/translations"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/controls-setting-change/theme-provider"
import { useLanguage } from "@/lib/controls-setting-change/changeLanguage"

export default function LoginPage() {
  const { isDarkMode } = useTheme()
  const { language } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/bookmarks")
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError(
        translations[language].login?.errors?.googleSignInFailed ||
          "Failed to sign in with Google. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (!email || !password) {
      setError(
        translations[language].login?.errors?.emptyFields ||
          "Please fill in all required fields."
      )
      return false
    }

    if (isSignUp) {
      if (!name) {
        setError(
          translations[language].login?.errors?.nameRequired ||
            "Name is required for sign up."
        )
        return false
      }
      if (password !== confirmPassword) {
        setError(
          translations[language].login?.errors?.passwordMismatch ||
            "Passwords do not match."
        )
        return false
      }
      if (password.length < 6) {
        setError(
          translations[language].login?.errors?.weakPassword ||
            "Password must be at least 6 characters."
        )
        return false
      }
    }

    return true
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        if (name) {
          await updateProfile(userCredential.user, { displayName: name })
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      router.push("/bookmarks")
    } catch (error: any) {
      console.error("Email sign-in error:", error)
      const errorMessages: { [key: string]: string } = {
        "auth/invalid-email":
          translations[language].login?.errors?.invalidEmail ||
          "Invalid email format.",
        "auth/weak-password":
          translations[language].login?.errors?.weakPassword ||
          "Password must be at least 6 characters.",
        "auth/email-already-in-use":
          translations[language].login?.errors?.emailAlreadyInUse ||
          "This email is already in use.",
        "auth/user-not-found":
          translations[language].login?.errors?.invalidCredentials ||
          "Invalid email or password.",
        "auth/wrong-password":
          translations[language].login?.errors?.invalidCredentials ||
          "Invalid email or password.",
      }
      setError(
        errorMessages[error.code] ||
          translations[language].login?.errors?.generic ||
          "Failed to sign in. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSignUp = () => {
    setIsTransitioning(true)
    setError(null)

    // Clear form fields with a slight delay for better UX
    setTimeout(() => {
      setIsSignUp(!isSignUp)
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setName("")
      setShowPassword(false)
      setShowConfirmPassword(false)
      setIsTransitioning(false)
    }, 150)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/images/background_login.jpg')`,
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md border-2 shadow-[12px_12px_0_0] p-6 transition-all duration-200 steps-4 ${
            isTransitioning
              ? "translate-y-2 opacity-80"
              : "translate-y-0 opacity-100"
          } ${
            isDarkMode
              ? "bg-black/90 border-white shadow-white/80 backdrop-blur-sm"
              : "bg-white/90 border-black shadow-black/80 backdrop-blur-sm"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 border-2 flex items-center justify-center transition-all duration-300 ${
                  isDarkMode
                    ? "bg-white text-black border-white"
                    : "bg-black text-white border-black"
                } ${isTransitioning ? "rotate-180" : "rotate-0"}`}
              >
                <User className="w-6 h-6 pixelated" />
              </div>
              <div>
                <h1
                  className={`text-xl font-bold transition-all duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  } ${isTransitioning ? "translate-x-2" : "translate-x-0"}`}
                >
                  {isSignUp
                    ? translations[language].login?.signUpTitle || "Sign Up"
                    : translations[language].login?.signInTitle || "Sign In"}
                </h1>
                <p
                  className={`text-xs transition-all duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ${isTransitioning ? "opacity-50" : "opacity-100"}`}
                >
                  {isSignUp
                    ? translations[language].login?.signUpSubtitle ||
                      "Create a new account to manage your bookmarks"
                    : translations[language].login?.signInSubtitle ||
                      "Sign in to manage your bookmarks"}
                </p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className={`p-2 border-2 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0] transition-all duration-100 steps-4 ${
                isDarkMode
                  ? "bg-black/80 border-white text-white hover:shadow-white/80"
                  : "bg-white/80 border-black text-black hover:shadow-black/80"
              }`}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 pixelated" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className={`mb-4 p-3 border-2 shadow-[6px_6px_0_0] animate-in slide-in-from-top-2 duration-200 steps-4 ${
                isDarkMode
                  ? "bg-red-900/80 text-red-100 border-red-400 shadow-red-400/50"
                  : "bg-red-50 text-red-900 border-red-500 shadow-red-500/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 pixelated" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 p-3 border-2 rounded-none transition-all duration-100 steps-4 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0] mb-6 ${
              isLoading
                ? isDarkMode
                  ? "bg-gray-700/80 text-gray-400 border-gray-700 cursor-not-allowed"
                  : "bg-gray-300/80 text-gray-500 border-gray-300 cursor-not-allowed"
                : isDarkMode
                ? "bg-blue-900/80 text-blue-100 border-blue-400 shadow-blue-400/30 hover:shadow-blue-400/50"
                : "bg-blue-50 text-blue-900 border-blue-500 shadow-blue-500/30 hover:shadow-blue-500/50"
            }`}
            aria-label="Sign in with Google"
          >
            {isLoading ? (
              <div
                className={`w-5 h-5 border-2 border-t-transparent animate-spin ${
                  isDarkMode ? "border-blue-100" : "border-blue-900"
                }`}
              ></div>
            ) : (
              <>
                <LogIn className="w-5 h-5 pixelated" />
                <span className="font-medium">
                  {translations[language].login?.signInWithGoogle ||
                    "Sign in with Google"}
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className={`flex-1 h-0.5 border-t-2 ${
                isDarkMode ? "border-white/50" : "border-black/50"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-white/70" : "text-black/70"
              }`}
            >
              {translations[language].login?.or || "or"}
            </span>
            <div
              className={`flex-1 h-0.5 border-t-2 ${
                isDarkMode ? "border-white/50" : "border-black/50"
              }`}
            ></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            {/* Name field for sign up */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isSignUp ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="group pb-2">
                <label
                  htmlFor="name"
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {translations[language].login?.nameLabel || "Name"} *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    translations[language].login?.namePlaceholder ||
                    "Enter your full name..."
                  }
                  className={`w-full p-3 border-2 rounded-none focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0] transition-all duration-100 steps-4 text-sm ${
                    isDarkMode
                      ? "bg-black/80 text-white border-white placeholder-gray-400 focus:border-blue-400 focus:shadow-blue-400/50"
                      : "bg-white/80 text-black border-black placeholder-gray-500 focus:border-blue-500 focus:shadow-blue-500/50"
                  }`}
                  aria-label="Name"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="group">
              <label
                htmlFor="email"
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {translations[language].login?.emailLabel || "Email"} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  translations[language].login?.emailPlaceholder ||
                  "Enter your email..."
                }
                className={`w-full p-3 border-2 rounded-none focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0] transition-all duration-100 steps-4 text-sm ${
                  isDarkMode
                    ? "bg-black/80 text-white border-white placeholder-gray-400 focus:border-blue-400 focus:shadow-blue-400/50"
                    : "bg-white/80 text-black border-black placeholder-gray-500 focus:border-blue-500 focus:shadow-blue-500/50"
                }`}
                required
                aria-label="Email"
              />
            </div>

            {/* Password field */}
            <div className="group">
              <label
                htmlFor="password"
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {translations[language].login?.passwordLabel || "Password"} *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    translations[language].login?.passwordPlaceholder ||
                    "Enter your password..."
                  }
                  className={`w-full p-3 pr-12 border-2 rounded-none focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0] transition-all duration-100 steps-4 text-sm ${
                    isDarkMode
                      ? "bg-black/80 text-white border-white placeholder-gray-400 focus:border-blue-400 focus:shadow-blue-400/50"
                      : "bg-white/80 text-black border-black placeholder-gray-500 focus:border-blue-500 focus:shadow-blue-500/50"
                  }`}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:translate-x-1 hover:-translate-y-3 transition-all duration-100 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 pixelated" />
                  ) : (
                    <Eye className="w-4 h-4 pixelated" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password field for sign up */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isSignUp ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="group pb-2">
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {translations[language].login?.confirmPasswordLabel ||
                    "Confirm Password"}{" "}
                  *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={
                      translations[language].login
                        ?.confirmPasswordPlaceholder ||
                      "Confirm your password..."
                    }
                    className={`w-full p-3 pr-12 border-2 rounded-none focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0] transition-all duration-100 steps-4 text-sm ${
                      isDarkMode
                        ? "bg-black/80 text-white border-white placeholder-gray-400 focus:border-blue-400 focus:shadow-blue-400/50"
                        : "bg-white/80 text-black border-black placeholder-gray-500 focus:border-blue-500 focus:shadow-blue-500/50"
                    } ${
                      isSignUp &&
                      confirmPassword &&
                      password !== confirmPassword
                        ? isDarkMode
                          ? "border-red-400 focus:border-red-400"
                          : "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    aria-label="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all duration-200 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 pixelated" />
                    ) : (
                      <Eye className="w-4 h-4 pixelated" />
                    )}
                  </button>
                </div>
                {isSignUp &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-red-400" : "text-red-500"
                      }`}
                    >
                      {translations[language].login?.errors?.passwordMismatch ||
                        "Passwords do not match"}
                    </p>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isTransitioning}
              className={`w-full flex items-center justify-center gap-3 p-3 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 hover:shadow-[8px_8px_0_0] mt-6 ${
                isLoading || isTransitioning
                  ? isDarkMode
                    ? "bg-gray-700/80 text-gray-400 border-gray-700 cursor-not-allowed"
                    : "bg-gray-300/80 text-gray-500 border-gray-300 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-green-900/80 text-green-100 border-green-400 shadow-green-400/30"
                  : "bg-green-50 text-green-900 border-green-500 shadow-green-500/30"
              }`}
              aria-label={isSignUp ? "Sign Up" : "Sign In"}
            >
              {isLoading ? (
                <div
                  className={`w-5 h-5 border-2 border-t-transparent animate-spin ${
                    isDarkMode ? "border-green-100" : "border-green-900"
                  }`}
                ></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 pixelated" />
                  <span className="font-medium">
                    {isSignUp
                      ? translations[language].login?.signUpButton ||
                        "Create Account"
                      : translations[language].login?.signInButton || "Sign In"}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleSignUp}
              disabled={isTransitioning}
              className={`text-sm underline hover:scale-105 transition-all duration-200 ${
                isDarkMode
                  ? "text-blue-300 hover:text-blue-100"
                  : "text-blue-600 hover:text-blue-800"
              } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
            >
              {isSignUp
                ? translations[language].login?.switchToSignIn ||
                  "Already have an account? Sign in"
                : translations[language].login?.switchToSignUp ||
                  "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
