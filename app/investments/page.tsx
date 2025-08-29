"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, DollarSign, PieChart, BarChart3, Target, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InvestmentsPage() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
  }, [])

  const investmentTypes = [
    {
      id: "stocks",
      title: language === "ar" ? "الأسهم" : "Stocks",
      description:
        language === "ar" ? "استثمر في أسهم الشركات المتداولة علناً" : "Invest in publicly traded company shares",
      riskLevel: language === "ar" ? "متوسط إلى عالي" : "Medium to High",
      expectedReturn: "8-12%",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      id: "bonds",
      title: language === "ar" ? "السندات" : "Bonds",
      description: language === "ar" ? "استثمارات آمنة بعوائد ثابتة" : "Safe investments with fixed returns",
      riskLevel: language === "ar" ? "منخفض" : "Low",
      expectedReturn: "3-6%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "mutual-funds",
      title: language === "ar" ? "صناديق الاستثمار" : "Mutual Funds",
      description:
        language === "ar" ? "استثمار متنوع يديره محترفون" : "Diversified investment managed by professionals",
      riskLevel: language === "ar" ? "متوسط" : "Medium",
      expectedReturn: "6-10%",
      icon: PieChart,
      color: "text-purple-600",
    },
    {
      id: "etfs",
      title: language === "ar" ? "صناديق المؤشرات المتداولة" : "ETFs",
      description: language === "ar" ? "صناديق متداولة تتبع مؤشرات السوق" : "Traded funds that track market indices",
      riskLevel: language === "ar" ? "متوسط" : "Medium",
      expectedReturn: "7-11%",
      icon: BarChart3,
      color: "text-orange-600",
    },
  ]

  const investmentGoals = [
    {
      title: language === "ar" ? "التقاعد" : "Retirement",
      description: language === "ar" ? "بناء ثروة للتقاعد المريح" : "Build wealth for comfortable retirement",
      timeframe: language === "ar" ? "20+ سنة" : "20+ years",
      icon: Target,
    },
    {
      title: language === "ar" ? "شراء منزل" : "Home Purchase",
      description: language === "ar" ? "ادخار لدفعة أولى لشراء منزل" : "Save for a down payment on a home",
      timeframe: language === "ar" ? "5-10 سنوات" : "5-10 years",
      icon: Target,
    },
    {
      title: language === "ar" ? "التعليم" : "Education",
      description: language === "ar" ? "تمويل التعليم العالي" : "Fund higher education",
      timeframe: language === "ar" ? "10-18 سنة" : "10-18 years",
      icon: BookOpen,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full">
              <TrendingUp className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "دليل الاستثمار" : "Investment Guide"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {language === "ar"
              ? "تعلم أساسيات الاستثمار وابدأ رحلتك نحو بناء الثروة"
              : "Learn investment basics and start your journey to building wealth"}
          </p>
        </motion.div>

        {/* Investment Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {language === "ar" ? "أنواع الاستثمار" : "Investment Types"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Icon className={`w-8 h-8 ${type.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">{type.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">{type.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "المخاطر:" : "Risk:"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{type.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "العائد المتوقع:" : "Expected Return:"}
                      </span>
                      <span className="font-medium text-teal-600 dark:text-teal-400">{type.expectedReturn}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Investment Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {language === "ar" ? "أهداف الاستثمار" : "Investment Goals"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investmentGoals.map((goal, index) => {
              const Icon = goal.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{goal.description}</p>
                  <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                    {language === "ar" ? "الإطار الزمني: " : "Timeframe: "}
                    {goal.timeframe}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            {language === "ar" ? "ابدأ رحلة الاستثمار اليوم" : "Start Your Investment Journey Today"}
          </h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            {language === "ar"
              ? "انضم إلى ملايين المستثمرين الذين يبنون ثروتهم من خلال الاستثمار الذكي"
              : "Join millions of investors who are building wealth through smart investing"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                {language === "ar" ? "عرض لوحة التحكم" : "View Dashboard"}
              </Button>
            </Link>
            <Link href="/articles">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent"
              >
                {language === "ar" ? "تعلم المزيد" : "Learn More"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
