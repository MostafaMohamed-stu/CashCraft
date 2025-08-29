# CashCraft Data Flow Analysis

## Overview
This document analyzes the data sent to the backend during login and dashboard creation in the CashCraft application.

## 1. Login Process

### Frontend → Backend (Login Request)
**Endpoint:** `POST /api/auth/login`

**Data Sent:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Code Location:** `components/AuthScreen.tsx` (lines 47-48)
```typescript
const { accessToken, refreshToken } = await apiLogin(email, password)
```

### Backend → Frontend (Login Response)
**Response Data:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "base64_encoded_refresh_token"
}
```

**JWT Token Payload (decoded):**
```json
{
  "sub": "user-guid",
  "email": "user@example.com",
  "role": "user",
  "exp": 1703123456,
  "iss": "CashCraft"
}
```

## 2. Registration Process

### Frontend → Backend (Registration Request)
**Endpoint:** `POST /api/auth/register`

**Data Sent:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "password123",
  "displayName": "New User",
  "phoneNumber": "+1234567890"
}
```

**Code Location:** `components/AuthScreen.tsx` (lines 108-109)
```typescript
const response = await apiRegister(email, username, password, displayName, phoneNumber)
```

### Backend → Frontend (Registration Response)
**Response Data:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "base64_encoded_refresh_token"
}
```

## 3. Dashboard Creation (Budget Plan)

### Frontend → Backend (Create Budget Plan Request)
**Endpoint:** `POST /api/budgets/plans`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Data Sent:**
```json
{
  "name": "Monthly Budget 2025",
  "type": "monthly",
  "currency": "EGP",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "categories": [
    {
      "name": "Food",
      "budgetAmount": 1500,
      "color": "#ef4444"
    },
    {
      "name": "Transport", 
      "budgetAmount": 800,
      "color": "#3b82f6"
    },
    {
      "name": "Housing",
      "budgetAmount": 2000,
      "color": "#10b981"
    }
  ]
}
```

**Code Location:** `app/dashboard/page.tsx` (lines 280-295)
```typescript
const savedPlan = await apiCreatePlan(
  plan.name,
  plan.type,
  plan.currency,
  plan.categories.map(cat => ({
    name: cat.name,
    budgetAmount: cat.budgetAmount,
    color: cat.color
  })),
  accessToken
)
```

**Updated API Function:** `lib/api.ts` (lines 95-110)
```typescript
export async function apiCreatePlan(
  name: string, 
  type = "monthly", 
  currency = "EGP", 
  categories: Array<{ name: string; budgetAmount: number; color: string }> = [],
  token?: string
) {
  return request<{ id: string }>("api/budgets/plans", {
    method: "POST",
    body: { 
      name, 
      type, 
      currency,
      createdAt: new Date().toISOString(), // ✅ Now includes current date/time
      categories: categories.map(cat => ({
        name: cat.name,
        budgetedAmount: cat.budgetAmount,
        ColorHex: cat.color
      }))
    },
    token,
  });
}
```

### Backend → Frontend (Create Budget Plan Response)
**Response Data:**
```json
{
  "id": "plan-guid",
  "name": "Monthly Budget 2025",
  "type": "monthly",
  "currency": "EGP",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "categories": [
    {
      "id": "category-guid",
      "name": "Food",
      "colorHex": "#ef4444",
      "budgetedAmount": 1500
    }
  ]
}
```

## 4. Get Budget Plans

### Frontend → Backend (Get Plans Request)
**Endpoint:** `GET /api/budgets/plans`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Data Sent:** None (GET request)

**Code Location:** `app/dashboard/page.tsx` (lines 180-185)
```typescript
const apiPlans = await apiGetPlans(accessToken)
```

### Backend → Frontend (Get Plans Response)
**Response Data:**
```json
[
  {
    "id": "plan-guid",
    "name": "Monthly Budget 2025",
    "type": "monthly",
    "currency": "EGP",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "categories": [
      {
        "id": "category-guid",
        "name": "Food",
        "colorHex": "#ef4444",
        "budgetedAmount": 1500
      }
    ]
  }
]
```

## 5. Add Expense

### Frontend → Backend (Add Expense Request)
**Endpoint:** `POST /api/budgets/expenses`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Data Sent:**
```json
{
  "planId": "plan-guid",
  "categoryId": "category-guid",
  "amount": 50.00,
  "description": "Lunch at restaurant",
  "date": "2025-01-15T00:00:00.000Z"
}
```

## 6. Data Storage in Frontend

### Local Storage Items:
```javascript
// After successful login/registration
localStorage.setItem("cashcraft_accessToken", accessToken)
localStorage.setItem("cashcraft_refreshToken", refreshToken)
localStorage.setItem("cashcraft_user", JSON.stringify(userData))
```

### User Data Structure:
```json
{
  "id": "user-guid",
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "role": "user",
  "isPremium": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## 7. API Configuration

### Base URL:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005"
```

### Request Headers (Default):
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {accessToken}" // For authenticated requests
}
```

## 8. Error Handling

### Common Error Responses:
```json
{
  "message": "User not found"
}
```
```json
{
  "message": "Invalid password"
}
```
```json
{
  "message": "Email already in use"
}
```

## 9. Security Features

1. **JWT Tokens:** Access tokens with 1-hour expiration
2. **Refresh Tokens:** 7-day expiration for token renewal
3. **Password Hashing:** PBKDF2 with SHA256
4. **Authorization Headers:** Bearer token authentication
5. **Input Validation:** Server-side validation of all inputs

## 10. Database Schema

### Users Table:
- Id (Guid)
- Email (string)
- Username (string)
- DisplayName (string)
- PhoneNumber (string)
- PasswordHash (string)
- Role (string)

### BudgetPlans Table:
- Id (Guid)
- UserId (Guid)
- Name (string)
- Type (string)
- Currency (string)

### BudgetCategories Table:
- Id (Guid)
- BudgetPlanId (Guid)
- Name (string)
- ColorHex (string)
- BudgetedAmount (decimal)

### Expenses Table:
- Id (Guid)
- BudgetCategoryId (Guid)
- Amount (decimal)
- Description (string)
- Date (DateOnly)

## 11. DateTime Handling

### Issue Fixed:
The original implementation was missing date/time fields in the budget plan creation, which could cause database issues.

### Solution Implemented:
1. **Backend DTOs Updated:** Added `CreatedAt` field to `BudgetPlanDto` and `CreateBudgetPlanDto`
2. **Mapping Updated:** `BudgetMapping.cs` now includes `CreatedAt` field in responses
3. **Controller Updated:** `BudgetsController.cs` now handles `CreatedAt` with fallback to `DateTime.UtcNow`
4. **Frontend API Updated:** `apiCreatePlan` function now sends current date/time

### Code Changes:
```csharp
// Backend DTOs
public class BudgetPlanDto
{
    // ... existing fields
    public DateTime CreatedAt { get; set; } // ✅ Added
}

public class CreateBudgetPlanDto
{
    // ... existing fields
    public DateTime? CreatedAt { get; set; } // ✅ Added (optional)
}
```

```typescript
// Frontend API
export async function apiCreatePlan(...) {
  return request<{ id: string }>("api/budgets/plans", {
    method: "POST",
    body: { 
      // ... existing fields
      createdAt: new Date().toISOString(), // ✅ Added
    },
    token,
  });
}
```

## Summary

The application follows a standard REST API pattern with JWT authentication. The main data flows are:

1. **Authentication:** Email/password → JWT tokens
2. **Budget Management:** Plan creation with categories and amounts (now includes date/time)
3. **Expense Tracking:** Individual expenses linked to categories
4. **Data Persistence:** Local storage for tokens, database for user data

All sensitive data is properly encrypted and validated both on frontend and backend.
