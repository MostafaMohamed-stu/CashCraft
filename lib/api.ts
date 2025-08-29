// API client for CashCraft backend
const API_BASE = "http://localhost:5005/api"

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Generic request function with better error handling
async function request<T>(
  endpoint: string,
  options: {
    method?: string
    body?: any
    token?: string
  } = {}
): Promise<T> {
  const { method = "GET", body, token } = options
  
  const url = `${API_BASE}/${endpoint}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  console.log(`🌐 API Request: ${method} ${url}`)
  if (body) {
    console.log(`📦 Request body:`, body)
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    console.log(`📊 Response status: ${response.status}`)
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      // Clone the response to avoid "body stream already read" error
      const responseClone = response.clone()
      
      try {
        const errorData = await responseClone.json()
        errorMessage = errorData.message || errorData.error || errorMessage
        console.log(`❌ Error response:`, errorData)
      } catch (parseError) {
        // If JSON parsing fails, try to get text
        try {
          const errorText = await responseClone.text()
          errorMessage = errorText || errorMessage
          console.log(`❌ Error text:`, errorText)
        } catch (textError) {
          console.log(`❌ Could not read response body:`, textError)
          // Use the default error message
        }
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log(`✅ Response data:`, data)
    return data
  } catch (error) {
    console.error(`❌ API request failed:`, error)
    throw error
  }
}

// ===== AUTHENTICATION =====

export async function apiGetCurrentUser(token?: string) {
  console.log("👤 Fetching current user...")
  
  const response = await request<{
    id: string
    email: string
    username: string
    displayName: string
    role: string
    isPremium: boolean
    createdAt: string
  }>("users/me", {
    method: "GET",
    token
  })
  
  console.log("✅ Current user fetched successfully")
  return response
}

export async function apiLogin(email: string, password: string) {
  console.log("🔐 Attempting login for:", email)
  
  const response = await request<{
    accessToken: string
    refreshToken: string
  }>("auth/login", {
    method: "POST",
    body: { email, password }
  })
  
  console.log("✅ Login successful")
  return response
}

export async function apiRegister(
  email: string,
  username: string,
  password: string,
  displayName: string,
  phoneNumber: string
) {
  console.log("📝 Attempting registration for:", email)
  
  const response = await request<{
    accessToken: string
    refreshToken: string
  }>("auth/register", {
    method: "POST",
    body: {
      email,
      username,
      password,
      displayName,
      phoneNumber
    }
  })
  
  console.log("✅ Registration successful")
  return response
}

export async function apiRefreshToken(refreshToken: string) {
  console.log("🔄 Refreshing token...")
  
  const response = await request<{
    accessToken: string
    refreshToken: string
  }>("auth/refresh", {
    method: "POST",
    body: { refreshToken }
  })
  
  console.log("✅ Token refreshed")
  return response
}

// ===== BUDGET PLANS =====

export async function apiGetPlans(token?: string) {
  console.log("📋 Fetching budget plans...")
  
  const response = await request<Array<{
    id: string
    name: string
    type: string
    currency: string
    createdAt: string
    categories: Array<{
      id: string
      name: string
      budgetedAmount: number
      colorHex: string
    }>
  }>>("budgets/plans", {
    method: "GET",
    token
  })
  
  console.log(`✅ Found ${response.length} plans`)
  return response
}

export async function apiCreatePlan(
  name: string,
  type = "monthly",
  currency = "EGP",
  token?: string
) {
  console.log("📝 Creating budget plan:", name)
  const response = await request<{ id: string; name: string; type: string; currency: string; createdAt: string }>("budgets/plans", {
    method: "POST",
    body: {
      name,
      type,
      currency,
      createdAt: new Date().toISOString()
    },
    token,
  })
  console.log("✅ Plan created successfully:", response.id)
  return response
}

export async function apiGetPlan(planId: string, token?: string) {
  console.log("📋 Fetching plan:", planId)
  
  const response = await request<{
    id: string
    name: string
    type: string
    currency: string
    createdAt: string
    categories: Array<{
      id: string
      name: string
      budgetedAmount: number
      colorHex: string
    }>
  }>(`budgets/plans/${planId}`, {
    method: "GET",
    token
  })
  
  console.log("✅ Plan fetched successfully")
  return response
}

// ===== CATEGORIES =====

export async function apiGetCategories(planId: string, token?: string) {
  console.log("📂 Fetching categories for plan:", planId)
  
  const response = await request<Array<{
    id: string
    name: string
    budgetedAmount: number
    colorHex: string
  }>>(`budgets/plans/${planId}/categories`, {
    method: "GET",
    token
  })
  
  console.log(`✅ Found ${response.length} categories`)
  return response
}

export async function apiCreateCategory(
  planId: string,
  name: string,
  budgetAmount: number,
  colorHex: string,
  token?: string
) {
  console.log(`📂 Adding category "${name}" to plan ${planId}`)
  const response = await request<{ id: string; name: string; colorHex: string; budgetedAmount: number; createdAt: string }>(`budgets/plans/${planId}/categories`, {
    method: "POST",
    body: {
      name,
      budgetedAmount: budgetAmount,
      colorHex: colorHex
    },
    token
  })
  console.log(`✅ Category "${name}" added successfully:`, response.id)
  return response
}

// ===== EXPENSES =====

export async function apiGetExpenses(categoryId: string, token?: string) {
  console.log("💰 Fetching expenses for category:", categoryId)
  
  const response = await request<Array<{
    id: string
    amount: number
    description: string
    date: string
  }>>(`budgets/categories/${categoryId}/expenses`, {
    method: "GET",
    token
  })
  
  console.log(`✅ Found ${response.length} expenses`)
  return response
}

export async function apiCreateExpense(
  categoryId: string,
  amount: number,
  description: string,
  date: string,
  token?: string
) {
  console.log("💰 Creating expense:", description, "for category:", categoryId)
  
  const response = await request<{ id: string }>(`budgets/categories/${categoryId}/expenses`, {
    method: "POST",
    body: {
      amount,
      description,
      date
    },
    token
  })
  
  console.log("✅ Expense created successfully:", response.id)
  return response
}

// ===== TEST DATA =====

export async function apiAddTestData() {
  console.log("🧪 Adding test data...")
  
  const response = await request<{ message: string }>("budgets/add-test-data", {
    method: "POST"
  })
  
  console.log("✅ Test data added successfully")
  return response
}

// ===== HEALTH CHECK =====

export async function apiHealthCheck() {
  console.log("🏥 Checking API health...")
  
  const response = await request<{
    message: string
    timestamp: string
    endpoints: string[]
  }>("budgets/health", {
    method: "GET"
  })
  
  console.log("✅ API is healthy")
  return response
}

// ===== UTILITY FUNCTIONS =====

export function getAuthToken(): string | null {
  return localStorage.getItem('cashcraft_accessToken')
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('cashcraft_accessToken', accessToken)
  localStorage.setItem('cashcraft_refreshToken', refreshToken)
  console.log("🔐 Tokens saved to localStorage")
}

export function clearAuthTokens() {
  localStorage.removeItem('cashcraft_accessToken')
  localStorage.removeItem('cashcraft_refreshToken')
  localStorage.removeItem('cashcraft_user')
  console.log("🧹 Tokens cleared from localStorage")
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  return !!token
}


