"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Trophy, Star, Lock, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"

export default function QuizPage() {
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const { language, isDark } = useApp()
  const t = translations[language]

  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]")
    setCompletedQuizzes(completed)
  }, [])

  const quizLevels = [
    {
      id: "1",
      title: language === "ar" ? "أساسيات المال" : "Money Basics",
      description:
        language === "ar" ? "تعلم المفاهيم الأساسية للمال والادخار" : "Learn basic concepts of money and saving",
      difficulty: language === "ar" ? "مبتدئ" : "Beginner",
      questions: 10,
      timeLimit: "15 min",
      points: 100,
      unlocked: true,
      completed: completedQuizzes.includes("1"),
    },
    {
      id: "2",
      title: language === "ar" ? "إدارة الميزانية" : "Budget Management",
      description:
        language === "ar"
          ? "اختبر معرفتك في إدارة الميزانية الشخصية"
          : "Test your knowledge of personal budget management",
      difficulty: language === "ar" ? "متوسط" : "Intermediate",
      questions: 15,
      timeLimit: "20 min",
      points: 150,
      unlocked: completedQuizzes.includes("1"),
      completed: completedQuizzes.includes("2"),
    },
    {
      id: "3",
      title: language === "ar" ? "الاستثمار للمبتدئين" : "Investment Basics",
      description:
        language === "ar"
          ? "اكتشف عالم الاستثمار والأسواق المالية"
          : "Discover the world of investment and financial markets",
      difficulty: language === "ar" ? "متوسط" : "Intermediate",
      questions: 12,
      timeLimit: "18 min",
      points: 120,
      unlocked: completedQuizzes.includes("2"),
      completed: completedQuizzes.includes("3"),
    },
    {
      id: "4",
      title: language === "ar" ? "التخطيط المالي المتقدم" : "Advanced Financial Planning",
      description:
        language === "ar"
          ? "استراتيجيات متقدمة للتخطيط المالي طويل المدى"
          : "Advanced strategies for long-term financial planning",
      difficulty: language === "ar" ? "متقدم" : "Advanced",
      questions: 20,
      timeLimit: "30 min",
      points: 200,
      unlocked: completedQuizzes.includes("3"),
      completed: completedQuizzes.includes("4"),
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "مبتدئ":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "intermediate":
      case "متوسط":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "advanced":
      case "متقدم":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full">
              <Brain className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#084f5a] dark:text-white mb-4">
            {t.financialQuizzes}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.financialQuizzesDesc}
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedQuizzes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t.completedQuizzes}
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8 text-teal-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedQuizzes.length * 125}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t.pointsEarned}
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((completedQuizzes.length / quizLevels.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t.completionRate}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quiz Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizLevels.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition-all ${
                quiz.completed
                  ? "border-green-200 dark:border-green-800"
                  : quiz.unlocked
                    ? "border-teal-200 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-700"
                    : "border-gray-200 dark:border-gray-700 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                    {quiz.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {!quiz.unlocked && <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{quiz.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{quiz.questions}</div>
                  <div className="text-gray-600 dark:text-gray-300">{t.questions}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    {quiz.timeLimit}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{t.time}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {quiz.points}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{t.points}</div>
                </div>
              </div>

              <div className="flex gap-3">
                {quiz.unlocked ? (
                  <Link href={`/quiz/${quiz.id}`} className="flex-1">
                    <Button className="w-full bg-[#6099a5] hover:bg-[#084f5a] text-white">
                      {quiz.completed ? t.retakeQuiz : t.startQuiz}
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="flex-1">
                    <Lock className="w-4 h-4 mr-2" />
                    {t.locked}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
