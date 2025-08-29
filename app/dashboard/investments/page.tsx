"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Plus,
  Eye,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Investment {
  id: string
  name: string
  type: string
  amount: number
  currentValue: number
  change: number
  changePercent: number
  risk: "Low" | "Medium" | "High"
  color: string
}

interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGain: number
  totalGainPercent: number
  monthlyReturn: number
}

export default function InvestmentsPage() {
  const [language, setLanguage] = useState("en")
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("1M")

  useEffect(() => {
    // Mock portfolio data
    const mockPortfolio: PortfolioSummary = {
      totalValue: 25750,
      totalInvested: 22000,
      totalGain: 3750,
      totalGainPercent: 17.05,
      monthlyReturn: 2.3,
    }

    const mockInvestments: Investment[] = [
      {
        id: "1",
        name: language === "ar" ? "صندوق الأسهم المتنوع" : "Diversified Stock Fund",
        type: language === "ar" ? "صندوق استثماري" : "Mutual Fund",
        amount: 10000,
        currentValue: 11500,
        change: 1500,
        changePercent: 15.0,
        risk: "Medium",
        color: "bg-blue-500",
      },
      {
        id: "2",
        name: language === "ar" ? "سندات حكومية" : "Government Bonds",
        type: language === "ar" ? "سندات" : "Bonds",
        amount: 8000,
        currentValue: 8320,
        change: 320,
        changePercent: 4.0,
        risk: "Low",
        color: "bg-green-500",
      },
      {
        id: "3",
        name: language === "ar" ? "أسهم التكنولوجيا" : "Tech Stocks",
        type: language === "ar" ? "أسهم" : "Stocks",
        amount: 4000,
        currentValue: 5930,
        change: 1930,
        changePercent: 48.25,
        risk: "High",
        color: "bg-purple-500",
      },
    ]

    setPortfolio(mockPortfolio)
    setInvestments(mockInvestments)
  }, [language])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "High":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "محفظة الاستثمارات" : "Investment Portfolio"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" ? "تتبع وإدارة استثماراتك" : "Track and manage your investments"}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              {language === "ar" ? "إضافة استثمار" : "Add Investment"}
            </button>
          </div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "القيمة الإجمالية" : "Total Value"}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${portfolio.totalValue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+{portfolio.monthlyReturn}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "هذا الشهر" : "this month"}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "إجمالي الأرباح" : "Total Gains"}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">+${portfolio.totalGain.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              +{portfolio.totalGainPercent}% {language === "ar" ? "من الاستثمار" : "from investment"}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "المبلغ المستثمر" : "Invested Amount"}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${portfolio.totalInvested.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {language === "ar" ? "في 3 استثمارات" : "across 3 investments"}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? "مستوى المخاطر" : "Risk Level"}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "متوسط" : "Medium"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {language === "ar" ? "محفظة متوازنة" : "Balanced portfolio"}
            </div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "أداء المحفظة" : "Portfolio Performance"}
            </h2>
            <div className="flex items-center gap-2">
              {["1W", "1M", "3M", "1Y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                {language === "ar" ? "مخطط الأداء سيظهر هنا" : "Performance chart will appear here"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Investments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "استثماراتي" : "My Investments"}
            </h2>
            <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
              <Eye className="w-4 h-4" />
              {language === "ar" ? "عرض الكل" : "View All"}
            </button>
          </div>

          <div className="space-y-4">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${investment.color} rounded-xl flex items-center justify-center`}>
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{investment.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{investment.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${investment.currentValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language === "ar" ? "من" : "from"} ${investment.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`flex items-center gap-1 ${
                        investment.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {investment.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {investment.change >= 0 ? "+" : ""}${investment.change.toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-sm ${investment.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {investment.changePercent >= 0 ? "+" : ""}
                      {investment.changePercent}%
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.risk)}`}>
                    {language === "ar"
                      ? investment.risk === "Low"
                        ? "منخفض"
                        : investment.risk === "Medium"
                          ? "متوسط"
                          : "عالي"
                      : investment.risk}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
