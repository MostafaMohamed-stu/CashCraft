"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Globe, Menu, X, User, LogOut } from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { useRouter } from "next/navigation"


export function Navbar() {
  const { language, setLanguage, isDark, setIsDark, currentUser, setCurrentUser, refreshUser } = useApp()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const t = translations[language]

  // Debug: Log current user state
  useEffect(() => {
    console.log("Navbar - currentUser:", currentUser)
  }, [currentUser])

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50)
    })
    return unsubscribe
  }, [scrollY])



  const navItems = [
    { key: "home", href: "/" },
    { key: "articles", href: "/articles" },
    { key: "videos", href: "/videos" },
    { key: "quizes", href: "/quiz" },
    { key: "dashboard", href: "/dashboard" },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-4 border-b border-gray-200 dark:border-gray-800 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className={`text-2xl font-bold text-[#084f5a] dark:text-white ${language === "ar" ? "font-cairo" : ""}`}
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/")}
          >
            CashCraft
          </motion.div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center ${language === "ar" ? "space-x-12" : "space-x-8"}`}>
            {navItems.map((item) => (
              <motion.div
                key={item.key}
                onClick={() => router.push(item.href)}
                className={`transition-colors relative cursor-pointer text-gray-700 hover:text-[#084f5a] dark:text-gray-200 dark:hover:text-white ${language === "ar" ? "font-cairo" : ""}`}
                whileHover={{ y: -2 }}
              >
                {t[item.key as keyof typeof t]}
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#084f5a] dark:bg-white`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className={`flex items-center ${language === "ar" ? "space-x-12" : "space-x-4"}`}>
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className={`bg-[#084f5a] text-white border-[#084f5a] hover:bg-[#6099a5] ${language === "ar" ? "font-cairo" : ""}`}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === "en" ? "العربية" : "English"}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className={`bg-[#084f5a] text-white border-[#084f5a] hover:bg-[#6099a5]`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User/Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className={`bg-[#084f5a] hover:bg-[#6099a5] text-white ${language === "ar" ? "font-cairo" : ""}`}
                >
                  <User className="w-4 h-4 mr-2" />
                  {currentUser.displayName}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    localStorage.removeItem("cashcraft_accessToken")
                    localStorage.removeItem("cashcraft_refreshToken")
                    await refreshUser()
                    router.push("/")
                  }}
                  className="border-[#084f5a] text-[#084f5a] hover:bg-[#084f5a] hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className={`bg-[#084f5a] hover:bg-[#6099a5] text-white ${language === "ar" ? "font-cairo" : ""}`}
              >
                {t.login}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden mt-4 ${isMobileMenuOpen ? "block" : "hidden"}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-200 dark:border-gray-800">
            {navItems.map((item) => (
              <motion.div
                key={item.key}
                onClick={() => {
                  router.push(item.href)
                  setIsMobileMenuOpen(false)
                }}
                className={`text-center py-2 transition-colors cursor-pointer text-gray-700 hover:text-[#084f5a] dark:text-gray-200 dark:hover:text-white ${language === "ar" ? "font-cairo" : ""}`}
                whileHover={{ scale: 1.05 }}
              >
                {t[item.key as keyof typeof t]}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
