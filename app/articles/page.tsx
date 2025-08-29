"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, Clock, User, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([])
  const { language, isDark } = useApp()
  const t = translations[language]

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]")
    setBookmarkedArticles(savedBookmarks)
  }, [])

  const categories = [
    { id: "all", name: language === "ar" ? "الكل" : "All" },
    { id: "budgeting", name: language === "ar" ? "الميزانية" : "Budgeting" },
    { id: "saving", name: language === "ar" ? "الادخار" : "Saving" },
    { id: "investing", name: language === "ar" ? "الاستثمار" : "Investing" },
    { id: "credit", name: language === "ar" ? "الائتمان" : "Credit" },
    { id: "taxes", name: language === "ar" ? "الضرائب" : "Taxes" },
  ]

  const articles = [
    {
      id: "1",
      title: language === "ar" ? "كيفية إنشاء صندوق الطوارئ" : "How to Build an Emergency Fund",
      excerpt:
        language === "ar"
          ? "تعلم كيفية إنشاء صندوق طوارئ قوي لحماية مستقبلك المالي"
          : "Learn how to build a strong emergency fund to protect your financial future",
      category: "saving",
      readTime: "5 min",
      author: language === "ar" ? "سارة أحمد" : "Sarah Ahmed",
      image: "/emergency-fund-article.png",
      date: "2024-01-15",
    },
    {
      id: "2",
      title: language === "ar" ? "استراتيجيات الميزانية للمبتدئين" : "Budgeting Strategies for Beginners",
      excerpt:
        language === "ar"
          ? "اكتشف أفضل استراتيجيات الميزانية للمبتدئين"
          : "Discover the best budgeting strategies for beginners",
      category: "budgeting",
      readTime: "7 min",
      author: language === "ar" ? "محمد علي" : "Mohamed Ali",
      image: "/budgeting-strategies.png",
      date: "2024-01-12",
    },
    {
      id: "3",
      title: language === "ar" ? "فهم درجة الائتمان الخاصة بك" : "Understanding Your Credit Score",
      excerpt:
        language === "ar"
          ? "دليل شامل لفهم وتحسين درجة الائتمان الخاصة بك"
          : "A comprehensive guide to understanding and improving your credit score",
      category: "credit",
      readTime: "6 min",
      author: language === "ar" ? "فاطمة حسن" : "Fatima Hassan",
      image: "/credit-score-guide.png",
      date: "2024-01-10",
    },
  ]

  const toggleBookmark = (articleId: string) => {
    const updatedBookmarks = bookmarkedArticles.includes(articleId)
      ? bookmarkedArticles.filter((id) => id !== articleId)
      : [...bookmarkedArticles, articleId]

    setBookmarkedArticles(updatedBookmarks)
    localStorage.setItem("bookmarkedArticles", JSON.stringify(updatedBookmarks))
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#084f5a] dark:text-white mb-4">
            {t.educationalArticles}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.educationalArticlesDesc}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t.searchArticles}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleBookmark(article.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  {bookmarkedArticles.includes(article.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs">
                    {categories.find((c) => c.id === article.category)?.name}
                  </span>
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>

                  <Link href={`/articles/${article.id}`}>
                    <Button size="sm" className="bg-[#6099a5] hover:bg-[#084f5a] text-white">
                      {t.readMore}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t.noArticlesFound}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t.tryChangingSearch}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
