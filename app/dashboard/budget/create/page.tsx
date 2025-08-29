"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

const translations = {
  en: {
    createBudget: "Create Budget",
    step: "Step",
    of: "of",
    next: "Next",
    previous: "Previous",
    finish: "Create Budget",
    basicInfo: "Basic Information",
    budgetCategories: "Budget Categories",
    reviewConfirm: "Review & Confirm",
    budgetName: "Budget Name",
    budgetType: "Budget Type",
    monthly: "Monthly",
    yearly: "Yearly",
    totalIncome: "Total Income",
    currency: "Currency",
    description: "Description",
    categories: "Categories",
    addCategory: "Add Category",
    categoryName: "Category Name",
    budgetAmount: "Budget Amount",
    totalBudgeted: "Total Budgeted",
    remaining: "Remaining",
    budgetSummary: "Budget Summary",
    backToBudgets: "Back to Budgets",
  },
  ar: {
    createBudget: "إنشاء ميزانية",
    step: "خطوة",
    of: "من",
    next: "التالي",
    previous: "السابق",
    finish: "إنشاء الميزانية",
    basicInfo: "المعلومات الأساسية",
    budgetCategories: "فئات الميزانية",
    reviewConfirm: "مراجعة وتأكيد",
    budgetName: "اسم الميزانية",
    budgetType: "نوع الميزانية",
    monthly: "شهرية",
    yearly: "سنوية",
    totalIncome: "إجمالي الدخل",
    currency: "العملة",
    description: "الوصف",
    categories: "الفئات",
    addCategory: "إضافة فئة",
    categoryName: "اسم الفئة",
    budgetAmount: "مبلغ الميزانية",
    totalBudgeted: "إجمالي الميزانية",
    remaining: "المتبقي",
    budgetSummary: "ملخص الميزانية",
    backToBudgets: "العودة للميزانيات",
  },
}

const defaultCategories = [
  { name: "groceries", amount: "" },
  { name: "transportation", amount: "" },
  { name: "entertainment", amount: "" },
  { name: "utilities", amount: "" },
  { name: "healthcare", amount: "" },
  { name: "education", amount: "" },
]

export default function CreateBudgetPage() {
  const [currentLang, setCurrentLang] = useState<"en" | "ar">("en")
  const [currentStep, setCurrentStep] = useState(1)
  const [budgetData, setBudgetData] = useState({
    name: "",
    type: "monthly",
    totalIncome: "",
    currency: "EGP",
    description: "",
    categories: defaultCategories,
  })

  const t = translations[currentLang]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    console.log("[v0] Creating budget:", budgetData)
    alert("Budget created successfully! (Frontend-only demo)")
    // In a real app, this would save to backend and redirect
  }

  const addCategory = () => {
    setBudgetData({
      ...budgetData,
      categories: [...budgetData.categories, { name: "", amount: "" }],
    })
  }

  const removeCategory = (index: number) => {
    const updatedCategories = budgetData.categories.filter((_, i) => i !== index)
    setBudgetData({ ...budgetData, categories: updatedCategories })
  }

  const updateCategory = (index: number, field: string, value: string) => {
    const updatedCategories = [...budgetData.categories]
    updatedCategories[index] = { ...updatedCategories[index], [field]: value }
    setBudgetData({ ...budgetData, categories: updatedCategories })
  }

  const getTotalBudgeted = () => {
    return budgetData.categories.reduce((sum, cat) => sum + (Number.parseInt(cat.amount) || 0), 0)
  }

  const getRemaining = () => {
    const totalIncome = Number.parseInt(budgetData.totalIncome) || 0
    return totalIncome - getTotalBudgeted()
  }

  return (
    <div className={`min-h-screen bg-background ${currentLang === "ar" ? "rtl font-cairo" : "ltr"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/budget">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToBudgets}
              </Button>
            </Link>
            <h1 className={`text-xl font-bold ${currentLang === "ar" ? "font-cairo" : ""}`}>{t.createBudget}</h1>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setCurrentLang(currentLang === "en" ? "ar" : "en")}>
            {currentLang === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {t.step} {currentStep} {t.of} 3
          </span>
          <span className="text-sm text-muted-foreground">{Math.round((currentStep / 3) * 100)}%</span>
        </div>
        <Progress value={(currentStep / 3) * 100} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>{t.basicInfo}</CardTitle>
                <CardDescription>Set up the basic details for your budget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="budgetName">{t.budgetName}</Label>
                  <Input
                    id="budgetName"
                    value={budgetData.name}
                    onChange={(e) => setBudgetData({ ...budgetData, name: e.target.value })}
                    placeholder="e.g., January 2025 Budget"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetType">{t.budgetType}</Label>
                    <Select
                      value={budgetData.type}
                      onValueChange={(value) => setBudgetData({ ...budgetData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">{t.monthly}</SelectItem>
                        <SelectItem value="yearly">{t.yearly}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t.currency}</Label>
                    <Select
                      value={budgetData.currency}
                      onValueChange={(value) => setBudgetData({ ...budgetData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">EGP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalIncome">{t.totalIncome}</Label>
                  <Input
                    id="totalIncome"
                    type="number"
                    value={budgetData.totalIncome}
                    onChange={(e) => setBudgetData({ ...budgetData, totalIncome: e.target.value })}
                    placeholder="5000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={budgetData.description}
                    onChange={(e) => setBudgetData({ ...budgetData, description: e.target.value })}
                    placeholder="Optional description for your budget..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Budget Categories */}
          {currentStep === 2 && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>{t.budgetCategories}</CardTitle>
                <CardDescription>Allocate your budget across different categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {budgetData.categories.map((category, index) => (
                    <div key={index} className="flex items-end space-x-2">
                      <div className="flex-1 space-y-2">
                        <Label>{t.categoryName}</Label>
                        <Input
                          value={category.name}
                          onChange={(e) => updateCategory(index, "name", e.target.value)}
                          placeholder="Category name"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>{t.budgetAmount}</Label>
                        <Input
                          type="number"
                          value={category.amount}
                          onChange={(e) => updateCategory(index, "amount", e.target.value)}
                          placeholder="1000"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCategory(index)}
                        className="mb-0"
                        disabled={budgetData.categories.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addCategory} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addCategory}
                </Button>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{t.totalBudgeted}:</span>
                    <span className="font-bold">
                      {getTotalBudgeted().toLocaleString()} {budgetData.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{t.totalIncome}:</span>
                    <span className="font-bold">
                      {Number.parseInt(budgetData.totalIncome || "0").toLocaleString()} {budgetData.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.remaining}:</span>
                    <span className={`font-bold ${getRemaining() < 0 ? "text-red-600" : "text-green-600"}`}>
                      {getRemaining().toLocaleString()} {budgetData.currency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>{t.reviewConfirm}</CardTitle>
                <CardDescription>Review your budget details before creating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.budgetName}</Label>
                      <p className="font-medium">{budgetData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.budgetType}</Label>
                      <p className="font-medium capitalize">{budgetData.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.totalIncome}</Label>
                      <p className="font-medium">
                        {Number.parseInt(budgetData.totalIncome || "0").toLocaleString()} {budgetData.currency}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.currency}</Label>
                      <p className="font-medium">{budgetData.currency}</p>
                    </div>
                  </div>

                  {budgetData.description && (
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.description}</Label>
                      <p className="font-medium">{budgetData.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t.budgetSummary}</Label>
                  <div className="space-y-2">
                    {budgetData.categories
                      .filter((cat) => cat.name && cat.amount)
                      .map((category, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium capitalize">{category.name}</span>
                          <span className="font-bold">
                            {Number.parseInt(category.amount).toLocaleString()} {budgetData.currency}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>{t.totalBudgeted}</span>
                      <span>
                        {getTotalBudgeted().toLocaleString()} {budgetData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                      <span>{t.remaining}</span>
                      <span className={getRemaining() < 0 ? "text-red-600" : "text-green-600"}>
                        {getRemaining().toLocaleString()} {budgetData.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.previous}
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              {t.next}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinish}>
              <Check className="w-4 h-4 mr-2" />
              {t.finish}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
