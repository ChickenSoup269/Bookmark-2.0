"use client"

import { useState } from "react"
import { LogIn, User, X, ArrowLeft } from "lucide-react"
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
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
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
    setIsSignUp(!isSignUp)
    setError(null)
    setEmail("")
    setPassword("")
    setName("")
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`w-full max-w-md border-2 shadow-[8px_8px_0_0] p-6 animate-in zoom-in-50 duration-200 steps-4 ${
          isDarkMode
            ? "bg-black border-white shadow-white"
            : "bg-white border-black shadow-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 border-2 flex items-center justify-center ${
                isDarkMode
                  ? "bg-white text-black border-white"
                  : "bg-black text-white border-black"
              }`}
            >
              <User className="w-5 h-5 pixelated" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {isSignUp
                  ? translations[language].login?.signUpTitle || "Sign Up"
                  : translations[language].login?.signInTitle || "Sign In"}
              </h1>
              <p className="text-xs">
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
            className={`p-1 border-2 hover:scale-110 transition-all duration-200 steps-4 ${
              isDarkMode ? "bg-black border-white" : "bg-white border-black"
            }`}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 pixelated" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`mb-4 p-2 border-2 shadow-[8px_8px_0_0] animate-in slide-in-from-top-2 duration-200 steps-4 ${
              isDarkMode
                ? "bg-black text-white border-white shadow-white"
                : "bg-white text-black border-black shadow-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <X className="w-3 h-3 pixelated" />
              <p className="font-medium text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 mb-4 ${
            isLoading
              ? isDarkMode
                ? "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed"
                : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
              : isDarkMode
              ? "bg-black text-white border-white"
              : "bg-white text-black border-black"
          }`}
          aria-label="Sign in with Google"
        >
          {isLoading ? (
            <div
              className={`w-4 h-4 border-2 border-t-transparent animate-spin ${
                isDarkMode ? "border-white" : "border-black"
              }`}
            ></div>
          ) : (
            <>
              <LogIn className="w-4 h-4 pixelated" />
              {translations[language].login?.signInWithGoogle ||
                "Sign in with Google"}
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div
            className={`flex-1 h-0.5 border-t-2 ${
              isDarkMode ? "border-white" : "border-black"
            }`}
          ></div>
          <span className="text-xs">
            {translations[language].login?.or || "or"}
          </span>
          <div
            className={`flex-1 h-0.5 border-t-2 ${
              isDarkMode ? "border-white" : "border-black"
            }`}
          ></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          {isSignUp && (
            <div className="group">
              <label
                htmlFor="name"
                className="block text-base font-semibold mb-1"
              >
                {translations[language].login?.nameLabel || "Name"}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  translations[language].login?.namePlaceholder ||
                  "Enter your name..."
                }
                className={`w-full p-2 border-2 rounded-none focus:outline-none transition-all duration-200 steps-4 text-base ${
                  isDarkMode
                    ? "bg-black text-white border-white placeholder-gray-400"
                    : "bg-white text-black border-black placeholder-gray-500"
                }`}
                aria-label="Name"
              />
            </div>
          )}
          <div className="group">
            <label
              htmlFor="email"
              className="block text-base font-semibold mb-1"
            >
              {translations[language].login?.emailLabel || "Email"}
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
              className={`w-full p-2 border-2 rounded-none focus:outline-none transition-all duration-200 steps-4 text-base ${
                isDarkMode
                  ? "bg-black text-white border-white placeholder-gray-400"
                  : "bg-white text-black border-black placeholder-gray-500"
              }`}
              required
              aria-label="Email"
            />
          </div>
          <div className="group">
            <label
              htmlFor="password"
              className="block text-base font-semibold mb-1"
            >
              {translations[language].login?.passwordLabel || "Password"}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                translations[language].login?.passwordPlaceholder ||
                "Enter your password..."
              }
              className={`w-full p-2 border-2 rounded-none focus:outline-none transition-all duration-200 steps-4 text-base ${
                isDarkMode
                  ? "bg-black text-white border-white placeholder-gray-400"
                  : "bg-white text-black border-black placeholder-gray-500"
              }`}
              required
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 p-2 border-2 rounded-none transition-all duration-200 steps-4 hover:scale-105 ${
              isLoading
                ? isDarkMode
                  ? "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                : isDarkMode
                ? "bg-black text-white border-white"
                : "bg-white text-black border-black"
            }`}
            aria-label={isSignUp ? "Sign Up" : "Sign In"}
          >
            {isLoading ? (
              <div
                className={`w-4 h-4 border-2 border-t-transparent animate-spin ${
                  isDarkMode ? "border-white" : "border-black"
                }`}
              ></div>
            ) : (
              <>
                <LogIn className="w-4 h-4 pixelated" />
                {isSignUp
                  ? translations[language].login?.signUpButton || "Sign Up"
                  : translations[language].login?.signInButton || "Sign In"}
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign Up/Sign In */}
        <div className="mt-4 text-center">
          <button
            onClick={toggleSignUp}
            className={`text-xs underline hover:text-purple-500 transition-colors duration-200 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
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
  )
}
