"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Lightbulb,
  Car,
  Home,
  ShoppingCart,
  Gamepad2,
  GraduationCap,
  Heart,
  Shirt,
  MoreHorizontal,
  AlertCircle,
  Clock,
  BookOpen,
  ShoppingBag,
  Zap,
  Shield,
  PiggyBank,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { translations } from "@/lib/translations"
import { Navbar } from "@/components/Navbar"
import { apiGetPlans, apiCreatePlan, apiCreateCategory, apiHealthCheck, getAuthToken } from "@/lib/api"
import { AddCategoriesModal } from "@/components/AddCategoriesModal"

// Types
interface BudgetPlan {
  id: string
  name: string
  type: "monthly" | "yearly"
  currency: "USD" | "EUR" | "EGP"
  categories: BudgetCategory[]
  totalBudget: number
  totalSpent: number
  createdAt: Date
  isActive: boolean
}

interface BudgetCategory {
  id: string
  name: string
  icon: any
  budgetAmount: number
  spentAmount: number
  color: string
  isCustom?: boolean
}

interface DailyExpense {
  id: string
  categoryId: string
  amount: number
  description: string
  date: Date
  planId: string
}

// Mock data
const defaultCategories = [
  { name: "Food", icon: ShoppingCart, color: "#ef4444" },
  { name: "Transport", icon: Car, color: "#3b82f6" },
  { name: "Housing", icon: Home, color: "#10b981" },
  { name: "Entertainment", icon: Gamepad2, color: "#f59e0b" },
  { name: "Education", icon: GraduationCap, color: "#8b5cf6" },
  { name: "Healthcare", icon: Heart, color: "#ec4899" },
  { name: "Clothing", icon: Shirt, color: "#06b6d4" },
  { name: "Other", icon: MoreHorizontal, color: "#6b7280" },
]

const currencySymbols = {
  USD: "$",
  EUR: "€",
  EGP: "ج.م",
}

// Helper function to get icon component from name
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    ShoppingCart,
    Car,
    Home,
    Gamepad2,
    GraduationCap,
    Heart,
    Shirt,
    MoreHorizontal,
    Target,
    TrendingDown,
    DollarSign,
    PieChart,
    BarChart3,
    Lightbulb,
    AlertCircle,
    Clock,
  }
  return iconMap[iconName] || MoreHorizontal
}

const savingTips = {
  Food: [
    "Cook at home more often to save 40-60% on food costs",
    "Plan your meals weekly and make a shopping list",
    "Buy generic brands instead of name brands",
  ],
  Transport: [
    "Use public transportation or carpool to reduce fuel costs",
    "Walk or bike for short distances",
    "Combine multiple errands into one trip",
  ],
  Housing: [
    "Reduce energy consumption by using LED bulbs",
    "Set thermostat 2-3 degrees lower in winter",
    "Fix leaks promptly to avoid water waste",
  ],
  Entertainment: [
    "Look for free community events and activities",
    "Use streaming services instead of cable TV",
    "Take advantage of happy hour and discount days",
  ],
  Education: [
    "Use free online resources and libraries",
    "Buy used textbooks or rent them",
    "Apply for scholarships and grants",
  ],
  Healthcare: [
    "Use preventive care to avoid costly treatments",
    "Compare prices for medications and procedures",
    "Consider generic medications when appropriate",
  ],
  Clothing: [
    "Shop during sales and clearance events",
    "Buy quality items that last longer",
    "Consider thrift stores and consignment shops",
  ],
  Other: [
    "Track all expenses to identify spending patterns",
    "Set up automatic savings transfers",
    "Review and cancel unused subscriptions",
  ],
}

export default function Dashboard() {
  const [plans, setPlans] = useState<BudgetPlan[]>([])
  const [activePlan, setActivePlan] = useState<BudgetPlan | null>(null)
  const [expenses, setExpenses] = useState<DailyExpense[]>([])
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const router = useRouter()
  const { language, isDark, refreshUser, currentUser } = useApp()
  const t = translations[language]

  // Create Plan Form State
  const [newPlan, setNewPlan] = useState({
    name: "",
    type: "monthly" as "monthly" | "yearly",
    currency: "EGP" as "USD" | "EUR" | "EGP",
    planType: "normal" as "ai" | "normal",
    categories: [] as any[],
  })

  // Add Expense Form State
  const [newExpense, setNewExpense] = useState({
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Load user data and plans from localStorage
  useEffect(() => {
    console.log("Dashboard - Loading user data and plans from localStorage")
    const userData = localStorage.getItem("cashcraft_user")
    
    if (userData) {
      console.log("Dashboard - User data found, loading plans from localStorage")
      
      // Load plans from database first, then localStorage as fallback
      const loadPlans = async () => {
        try {
          console.log("📡 Attempting to load plans from database...")
          
          const accessToken = localStorage.getItem('cashcraft_accessToken')
          if (accessToken) {
            try {
              const apiPlans = await apiGetPlans(accessToken)
              console.log("✅ Plans loaded from database:", apiPlans)
              
              if (apiPlans && apiPlans.length > 0) {
                // Transform the data to match frontend expectations
                const transformedPlans = transformApiPlans(apiPlans)
                
                setPlans(transformedPlans)
                setActivePlan(transformedPlans[0])
                console.log("✅ Active plan set from database:", transformedPlans[0])
                return
              } else {
                console.log("📭 No plans found in database")
                setPlans([])
                setActivePlan(null)
                return
              }
            } catch (apiError) {
              console.log("❌ Database load failed:", apiError)
              // Don't fall back to localStorage for new accounts
              console.log("📭 No plans found - database unavailable")
              setPlans([])
              setActivePlan(null)
              return
            }
          } else {
            console.log("🔑 No access token found")
            setPlans([])
            setActivePlan(null)
            return
          }
        } catch (error) {
          console.error("❌ Error loading plans:", error)
          console.error("❌ Error details:", {
            message: error.message,
            stack: error.stack
          })
          
          // Final fallback: Show test data only for testbudget@test.com account
          console.log("🔄 Falling back to test data...")
          
          const userData = JSON.parse(localStorage.getItem("cashcraft_user") || "{}")
          const isTestAccount = userData.email === "testbudget@test.com"
          
          if (isTestAccount) {
            console.log("✅ Loading test data for testbudget@test.com")
            const testPlan = {
              id: "test-plan-1",
              name: "Monthly Budget Plan",
              type: "monthly",
              currency: "EGP",
              totalBudget: 5000,
              totalSpent: 1850,
              createdAt: new Date(),
              isActive: true,
              categories: [
                {
                  id: "cat-1",
                  name: "Food",
                  icon: ShoppingCart,
                  budgetAmount: 1500,
                  spentAmount: 250,
                  color: "#ef4444"
                },
                {
                  id: "cat-2",
                  name: "Transport",
                  icon: Car,
                  budgetAmount: 800,
                  spentAmount: 100,
                  color: "#3b82f6"
                },
                {
                  id: "cat-3",
                  name: "Housing",
                  icon: Home,
                  budgetAmount: 2000,
                  spentAmount: 1500,
                  color: "#10b981"
                },
                {
                  id: "cat-4",
                  name: "Entertainment",
                  icon: Gamepad2,
                  budgetAmount: 500,
                  spentAmount: 0,
                  color: "#f59e0b"
                },
                {
                  id: "cat-5",
                  name: "Other",
                  icon: MoreHorizontal,
                  budgetAmount: 200,
                  spentAmount: 0,
                  color: "#6b7280"
                }
              ]
            }
            
            setPlans([testPlan])
            setActivePlan(testPlan)
            console.log("✅ Test data loaded for test account")
          } else {
            console.log("📭 No plans found - new user account")
            setPlans([])
            setActivePlan(null)
          }
        }
      }
      
      loadPlans()
    } else {
      console.log("Dashboard - No user data found, redirecting to login")
      localStorage.removeItem('cashcraft_accessToken')
      localStorage.removeItem('cashcraft_refreshToken')
      localStorage.removeItem('cashcraft_user')
      window.location.href = '/'
    }
  }, [])

  // State for the new flow
  const [isAddDetailsOpen, setIsAddDetailsOpen] = useState(false)
  const [createdPlanId, setCreatedPlanId] = useState<string | null>(null)
  const [isCreatingPlan, setIsCreatingPlan] = useState(false)
  const [showAllTabs, setShowAllTabs] = useState(false) // Control which tabs to show

  // Always show all tabs - user can always access categories and budget amounts
  const shouldShowAllTabs = true

  // Helper function to transform API data to frontend format
  const transformApiPlans = (apiPlans: any[]) => {
    return apiPlans.map(plan => ({
      ...plan,
      totalBudget: plan.categories.reduce((sum: number, cat: any) => sum + cat.budgetedAmount, 0),
      totalSpent: 0, // We'll add this later when we implement expenses
      isActive: true,
      categories: plan.categories.map((category: any) => {
        // Assign appropriate icons based on category name
        let icon = ShoppingCart; // Default
        const name = category.name.toLowerCase();
        
        if (name.includes('food') || name.includes('dining') || name.includes('restaurant')) {
          icon = ShoppingCart;
        } else if (name.includes('transport') || name.includes('car') || name.includes('bus')) {
          icon = Car;
        } else if (name.includes('home') || name.includes('house') || name.includes('rent')) {
          icon = Home;
        } else if (name.includes('entertainment') || name.includes('movie') || name.includes('game')) {
          icon = Gamepad2;
        } else if (name.includes('health') || name.includes('medical')) {
          icon = Heart;
        } else if (name.includes('education') || name.includes('school') || name.includes('book')) {
          icon = BookOpen;
        } else if (name.includes('shopping') || name.includes('clothes')) {
          icon = ShoppingBag;
        } else if (name.includes('utility') || name.includes('electric') || name.includes('water')) {
          icon = Zap;
        } else if (name.includes('insurance')) {
          icon = Shield;
        } else if (name.includes('saving')) {
          icon = PiggyBank;
        }
        
        return {
          ...category,
          budgetAmount: category.budgetedAmount,
          color: category.colorHex,
          spentAmount: 0, // We'll add this later when we implement expenses
          icon: icon,
          isCustom: true
        }
      })
    }))
  }

  const handleCreatePlan = async () => {
    console.log("=== handleCreatePlan called ===")
    console.log("newPlan:", newPlan)
    
    if (!newPlan.name) {
      console.log("❌ Validation failed: plan name missing")
      alert("Please fill in a plan name!")
      return
    }

    console.log("✅ Validation passed")

    // Get access token
    const accessToken = getAuthToken()
    
    if (!accessToken) {
      console.log("🔑 No access token found")
      alert("You need to be logged in to save plans. Please log in and try again.")
      return
    }

    setIsCreatingPlan(true)

    try {
      console.log("📡 Creating plan in database...")
      
      // Step 1: Create the plan first (without categories)
      const savedPlan = await apiCreatePlan(
        newPlan.name,
        newPlan.type,
        newPlan.currency,
        accessToken
      )
      
      console.log("✅ Plan created successfully:", savedPlan)
      setCreatedPlanId(savedPlan.id)
      
      // Show success message and open add details modal
      alert("Plan created successfully! Now add your budget categories.")
      setIsAddDetailsOpen(true)
      
      // Reset the form
      setNewPlan({
        name: "",
        type: "monthly",
        currency: "EGP",
        planType: "normal",
        categories: []
      })
      
    } catch (error) {
      console.error("❌ Plan creation failed:", error)
      
      let errorMessage = "Failed to create plan. "
      
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        errorMessage += "Authentication failed. Please log out and log back in."
        localStorage.removeItem('cashcraft_accessToken')
        localStorage.removeItem('cashcraft_refreshToken')
        localStorage.removeItem('cashcraft_user')
      } else if (error.message.includes("500")) {
        errorMessage += "Server error. Please try again later."
      } else if (error.message.includes("fetch")) {
        errorMessage += "Cannot connect to server. Please check if backend is running."
      } else {
        errorMessage += `Error: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsCreatingPlan(false)
    }
  }

  const handleAddCategories = async (categories: Array<{ name: string; budgetAmount: number; color: string }>) => {
    if (!createdPlanId) {
      alert("No plan selected for adding categories!")
      return
    }

    const accessToken = getAuthToken()
    if (!accessToken) {
      alert("Authentication required!")
      return
    }

    try {
      console.log("📡 Adding categories to plan:", createdPlanId)
      
      // Add each category to the plan
      for (const category of categories) {
        if (category.name && category.budgetAmount) {
          await apiCreateCategory(
            createdPlanId,
            category.name,
            category.budgetAmount,
            category.color,
            accessToken
          )
          console.log(`✅ Category "${category.name}" added to plan`)
        }
      }
      
      console.log("✅ All categories added successfully!")
      alert("Categories added successfully!")
      
      // Close modal and reload plans
      setIsAddDetailsOpen(false)
      setCreatedPlanId(null)
      
      // Reload plans from database
      try {
        const apiPlans = await apiGetPlans(accessToken)
        if (apiPlans && apiPlans.length > 0) {
          // Transform the data to match frontend expectations
          const transformedPlans = transformApiPlans(apiPlans)
          
          setPlans(transformedPlans)
          setActivePlan(transformedPlans[transformedPlans.length - 1])
          console.log("✅ Plans reloaded from database")
        }
      } catch (reloadError) {
        console.error("❌ Failed to reload plans:", reloadError)
      }
      
    } catch (error) {
      console.error("❌ Failed to add categories:", error)
      alert(`Failed to add categories: ${error.message}`)
    }
  }

  const handleAddExpense = async () => {
    if (!newExpense.categoryId || !newExpense.amount || !activePlan) return

    const expense: DailyExpense = {
      id: Date.now().toString(),
      categoryId: newExpense.categoryId,
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date(newExpense.date),
      planId: activePlan.id,
    }

    try {
      // Save expense to database via API
      const response = await fetch('/api/budgets/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cashcraft_accessToken')}`
        },
        body: JSON.stringify({
          planId: activePlan.id,
          categoryId: newExpense.categoryId,
          amount: expense.amount,
          description: expense.description,
          date: expense.date.toISOString()
        })
      })

      if (response.ok) {
        const savedExpense = await response.json()
        expense.id = savedExpense.id // Use the ID from the database

    setExpenses([...expenses, expense])

    // Update category spent amount
    const updatedPlan = { ...activePlan }
    const categoryIndex = updatedPlan.categories.findIndex((cat) => cat.id === newExpense.categoryId)
    if (categoryIndex !== -1) {
      updatedPlan.categories[categoryIndex].spentAmount += expense.amount
      updatedPlan.totalSpent += expense.amount
      setActivePlan(updatedPlan)

      // Update plans array
      const updatedPlans = plans.map((p) => (p.id === activePlan.id ? updatedPlan : p))
      setPlans(updatedPlans)
    }

    setIsAddExpenseOpen(false)
    setNewExpense({
      categoryId: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
      } else {
        console.error('Failed to save expense to database')
        // Still add the expense locally for now
        setExpenses([...expenses, expense])
        
        // Update category spent amount
        const updatedPlan = { ...activePlan }
        const categoryIndex = updatedPlan.categories.findIndex((cat) => cat.id === newExpense.categoryId)
        if (categoryIndex !== -1) {
          updatedPlan.categories[categoryIndex].spentAmount += expense.amount
          updatedPlan.totalSpent += expense.amount
          setActivePlan(updatedPlan)

          // Update plans array
          const updatedPlans = plans.map((p) => (p.id === activePlan.id ? updatedPlan : p))
          setPlans(updatedPlans)
        }

        setIsAddExpenseOpen(false)
        setNewExpense({
          categoryId: "",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        })
      }
    } catch (error) {
      console.error('Error saving expense:', error)
      // Still add the expense locally for now
      setExpenses([...expenses, expense])
      
      // Update category spent amount
      const updatedPlan = { ...activePlan }
      const categoryIndex = updatedPlan.categories.findIndex((cat) => cat.id === newExpense.categoryId)
      if (categoryIndex !== -1) {
        updatedPlan.categories[categoryIndex].spentAmount += expense.amount
        updatedPlan.totalSpent += expense.amount
        setActivePlan(updatedPlan)

        // Update plans array
        const updatedPlans = plans.map((p) => (p.id === activePlan.id ? updatedPlan : p))
        setPlans(updatedPlans)
      }

      setIsAddExpenseOpen(false)
      setNewExpense({
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }

  const addCategoryToPlan = (category: any) => {
    if (newPlan.categories.find((cat) => cat.name === category.name)) return

    setNewPlan((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...category, budgetAmount: 0 }],
    }))
  }

  const removeCategoryFromPlan = (categoryName: string) => {
    setNewPlan((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.name !== categoryName),
    }))
  }

  const updateCategoryBudget = (categoryName: string, amount: number) => {
    setNewPlan((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => (cat.name === categoryName ? { ...cat, budgetAmount: amount } : cat)),
    }))
  }

  const getRandomTip = (categoryName: string) => {
    const tips = savingTips[categoryName as keyof typeof savingTips] || savingTips.Other
    return tips[Math.floor(Math.random() * tips.length)]
  }



  // Check if user is logged in
  if (!currentUser || !localStorage.getItem('cashcraft_accessToken')) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 pt-32">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Please Log In
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You need to be logged in to create budget plans
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-[#6099a5] hover:bg-[#084f5a] text-white px-8 py-3 text-lg"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // Completely disable token validation - just check if user exists in localStorage
  useEffect(() => {
    const user = localStorage.getItem('cashcraft_user')
    if (!user) {
      console.log("No user data, redirecting to login")
      localStorage.removeItem('cashcraft_accessToken')
      localStorage.removeItem('cashcraft_refreshToken')
      localStorage.removeItem('cashcraft_user')
      window.location.href = '/'
    }
  }, [router])

  // If no active plan, show a simple message
  if (!activePlan) {
    return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 pt-32">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              No Budget Plan Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first budget plan to start managing your finances
            </p>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
              <div className="text-sm text-yellow-800">
                <div className="font-bold">Debug Info:</div>
                <div>Current User: {currentUser ? currentUser.displayName : 'None'}</div>
                <div>Token: {localStorage.getItem('cashcraft_accessToken') ? 'Exists' : 'Missing'}</div>
                <div>Plans Count: {plans.length}</div>
                <div>Active Plan: {activePlan ? 'Yes' : 'No'}</div>
                <div>Backend URL: http://localhost:5005</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log("Create Plan button clicked")
                setIsCreatePlanOpen(true)
              }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Budget Plan
            </motion.button>
            

            
            {/* Full Budget Plan Creation Dialog */}
            <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800">
                <DialogHeader>
                  <DialogTitle>Create New Budget Plan</DialogTitle>
                  <DialogDescription>Set up your budget plan with categories and spending limits</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="amounts">Budget Amounts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="planName">Plan Name</Label>
                        <Input
                          id="planName"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Monthly Budget 2025"
                        />
        </div>
                      <div>
                        <Label htmlFor="planType">Plan Duration</Label>
                        <Select
                          value={newPlan.type}
                          onValueChange={(value: "monthly" | "yearly") => setNewPlan((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={newPlan.currency}
                          onValueChange={(value: "USD" | "EUR" | "EGP") =>
                            setNewPlan((prev) => ({ ...prev, currency: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EGP">Egyptian Pound (ج.م)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="planType">Plan Type</Label>
                        <Select
                          value={newPlan.planType}
                          onValueChange={(value: "ai" | "normal") => setNewPlan((prev) => ({ ...prev, planType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal Plan</SelectItem>
                            <SelectItem value="ai" disabled>
                              AI Plan (Coming Soon)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-4">
                    <div>
                      <Label>Available Categories</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {defaultCategories.map((category) => (
                          <Button
                            key={category.name}
                            variant={newPlan.categories.find((cat) => cat.name === category.name) ? "default" : "outline"}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => {
                              if (newPlan.categories.find((cat) => cat.name === category.name)) {
                                removeCategoryFromPlan(category.name)
                              } else {
                                addCategoryToPlan(category)
                              }
                            }}
                          >
                            <category.icon className="w-6 h-6" />
                            <span className="text-sm">{category.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Selected Categories ({newPlan.categories.length})</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPlan.categories.map((category) => (
                          <Badge key={category.name} variant="secondary" className="flex items-center gap-2 p-2">
                            <category.icon className="w-4 h-4" />
                            {category.name}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removeCategoryFromPlan(category.name)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amounts" className="space-y-4">
                    <div>
                      <Label>Set Budget Amounts</Label>
                      <div className="space-y-4 mt-4">
                        {newPlan.categories.map((category) => (
                          <div key={category.name} className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 flex-1">
                              <category.icon className="w-6 h-6" style={{ color: category.color }} />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{currencySymbols[newPlan.currency]}</span>
                              <Input
                                type="number"
                                placeholder="0"
                                value={category.budgetAmount || ""}
                                onChange={(e) =>
                                  updateCategoryBudget(category.name, Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-24"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlan} className="bg-[#6099a5] hover:bg-[#084f5a] text-white">
                    Create Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      
    )
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-gray-950 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#084f5a]">{t.dashboard}</h1>
            <p className="text-gray-600">{t.smartMoneyDesc}</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreatePlanOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Budget Plan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.addExpense}
            </motion.button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: t.totalBalance,
              value: `${currencySymbols[activePlan.currency]}${activePlan.totalBudget.toLocaleString()}`,
              icon: Target,
              color: "bg-blue-500",
              change: "+12%",
            },
            {
              title: t.monthlyExpenses,
              value: `${currencySymbols[activePlan.currency]}${activePlan.totalSpent.toLocaleString()}`,
              icon: TrendingDown,
              color: "bg-red-500",
              change: "+8%",
            },
            {
              title: t.remaining,
              value: `${currencySymbols[activePlan.currency]}${(activePlan.totalBudget - activePlan.totalSpent).toLocaleString()}`,
              icon: DollarSign,
              color: "bg-green-500",
              change: "-4%",
            },
            {
              title: t.budgetUsed,
              value: `${Math.round((activePlan.totalSpent / activePlan.totalBudget) * 100)}%`,
              icon: PieChart,
              color: "bg-purple-500",
              change: "+15%",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/50 transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#084f5a]">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <Badge variant="secondary" className="text-xs">
                      {stat.change} {t.fromLastMonth}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t.budget}
                </CardTitle>
                <CardDescription>{t.trackExpensesDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activePlan.categories.map((category, index) => {
                    const percentage = (category.spentAmount / category.budgetAmount) * 100
                    const isOverBudget = percentage > 100

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                              <category.icon className="w-5 h-5" style={{ color: category.color }} />
                            </div>
                            <div>
                              <h4 className="font-medium">{category.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {currencySymbols[activePlan.currency]}
                                {category.spentAmount} of {currencySymbols[activePlan.currency]}
                                {category.budgetAmount}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${isOverBudget ? "text-red-500" : "text-green-500"}`}>
                              {percentage.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {currencySymbols[activePlan.currency]}
                              {category.budgetAmount - category.spentAmount} left
                            </p>
                          </div>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className="h-2"
                          style={{
                            backgroundColor: `${category.color}20`,
                          }}
                        />
                        {isOverBudget && (
                          <div className="flex items-center gap-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Over budget by {currencySymbols[activePlan.currency]}
                            {(category.spentAmount - category.budgetAmount).toFixed(2)}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Money Saving Tips */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {t.boostKnowledge}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePlan.categories.slice(0, 3).map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg border-l-4 border-teal-400 dark:border-teal-500"
                    >
                      <h5 className="font-medium text-teal-800 dark:text-teal-200 mb-1">{category.name}</h5>
                      <p className="text-sm text-teal-700 dark:text-teal-300">{getRandomTip(category.name)}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t.recentTransactions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(0, 5).map((expense, index) => {
                    const category = activePlan.categories.find((cat) => cat.id === expense.categoryId)
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {category && (
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                              <category.icon className="w-4 h-4" style={{ color: category.color }} />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{expense.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{category?.name}</p>
                          </div>
                        </div>
                        <p className="font-medium text-red-500">
                          -{currencySymbols[activePlan.currency]}
                          {expense.amount}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Plan Dialog */}
      <Dialog 
        open={isCreatePlanOpen} 
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange called with:", open)
          setIsCreatePlanOpen(open)
          // No need to reset showAllTabs since we always show all tabs
        }}
      >
        {console.log("Dialog render - isCreatePlanOpen:", isCreatePlanOpen)}
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle>Create New Budget Plan</DialogTitle>
              <DialogDescription>Set up your budget plan with categories and spending limits</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className={`grid w-full ${shouldShowAllTabs ? 'grid-cols-3' : 'grid-cols-1'}`}>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                {shouldShowAllTabs && (
                  <>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="amounts">Budget Amounts</TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Monthly Budget 2025"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planType">Plan Duration</Label>
                    <Select
                      value={newPlan.type}
                      onValueChange={(value: "monthly" | "yearly") => setNewPlan((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={newPlan.currency}
                      onValueChange={(value: "USD" | "EUR" | "EGP") =>
                        setNewPlan((prev) => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">Egyptian Pound (ج.م)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="planType">Plan Type</Label>
                    <Select
                      value={newPlan.planType}
                      onValueChange={(value: "ai" | "normal") => setNewPlan((prev) => ({ ...prev, planType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal Plan</SelectItem>
                        <SelectItem value="ai" disabled>
                          AI Plan (Coming Soon)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {shouldShowAllTabs && (
                <>
                  <TabsContent value="categories" className="space-y-4">
                    <div>
                      <Label>Available Categories</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {defaultCategories.map((category) => (
                          <Button
                            key={category.name}
                            variant={newPlan.categories.find((cat) => cat.name === category.name) ? "default" : "outline"}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => {
                              if (newPlan.categories.find((cat) => cat.name === category.name)) {
                                removeCategoryFromPlan(category.name)
                              } else {
                                addCategoryToPlan(category)
                              }
                            }}
                          >
                            <category.icon className="w-6 h-6" />
                            <span className="text-sm">{category.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Selected Categories ({newPlan.categories.length})</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPlan.categories.map((category) => (
                          <Badge key={category.name} variant="secondary" className="flex items-center gap-2 p-2">
                            <category.icon className="w-4 h-4" />
                            {category.name}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removeCategoryFromPlan(category.name)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amounts" className="space-y-4">
                    <div>
                      <Label>Set Budget Amounts</Label>
                      <div className="space-y-4 mt-4">
                        {newPlan.categories.map((category) => (
                          <div key={category.name} className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 flex-1">
                              <category.icon className="w-6 h-6" style={{ color: category.color }} />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{currencySymbols[newPlan.currency]}</span>
                              <Input
                                type="number"
                                placeholder="0"
                                value={category.budgetAmount || ""}
                                onChange={(e) =>
                                  updateCategoryBudget(category.name, Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {newPlan.categories.length > 0 && (
                        <div className="p-4 rounded-lg bg-blue-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-blue-100 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Budget:</span>
                            <span className="text-xl font-bold text-[#0ea5a5] dark:text-[#7dd3fc]">
                              {currencySymbols[newPlan.currency]}
                              {newPlan.categories.reduce((sum, cat) => sum + (cat.budgetAmount || 0), 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreatePlanOpen(false)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePlan}
                disabled={!newPlan.name || isCreatingPlan}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-3 shadow-lg ${
                  !newPlan.name || isCreatingPlan
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl'
                }`}
              >
                {isCreatingPlan ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Plan
                  </>
                )}
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogContent className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle>Add Daily Expense</DialogTitle>
              <DialogDescription>Track your daily spending to stay within budget</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.categoryId}
                  onValueChange={(value) => setNewExpense((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activePlan.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount ({currencySymbols[activePlan.currency]})</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What did you spend on?"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddExpenseOpen(false)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddExpense}
                disabled={!newExpense.categoryId || !newExpense.amount}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-3 shadow-lg ${
                  !newExpense.categoryId || !newExpense.amount
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Expense
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Categories Modal */}
        <AddCategoriesModal
          isOpen={isAddDetailsOpen}
          onClose={() => setIsAddDetailsOpen(false)}
          onSave={handleAddCategories}
          planName={newPlan.name || "Your Plan"}
        />
      </div>
    </div>
  )
}
