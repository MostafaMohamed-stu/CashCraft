// Test script to debug plan creation
const API_BASE = "http://localhost:5005/api";

async function testPlanCreation() {
  console.log("🧪 Testing plan creation...");
  
  // First, let's try to login to get a token
  const loginData = {
    email: "test@example.com",
    password: "password123"
  };
  
  console.log("🔐 Attempting login...");
  console.log("Login data:", loginData);
  
  try {
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData)
    });
    
    console.log("Login response status:", loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log("❌ Login failed:", errorText);
      return;
    }
    
    const loginResult = await loginResponse.json();
    console.log("✅ Login successful:", loginResult);
    
    const accessToken = loginResult.accessToken;
    
    // Now test plan creation
    const planData = {
      name: "Test Budget Plan",
      type: "monthly",
      currency: "EGP",
      createdAt: new Date().toISOString(),
      categories: [
        {
          name: "Food",
          budgetedAmount: 500,
          colorHex: "#3b82f6"
        },
        {
          name: "Transport",
          budgetedAmount: 200,
          colorHex: "#10b981"
        }
      ]
    };
    
    console.log("📝 Testing plan creation with data:");
    console.log(JSON.stringify(planData, null, 2));
    
    const planResponse = await fetch(`${API_BASE}/budgets/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(planData)
    });
    
    console.log("Plan creation response status:", planResponse.status);
    console.log("Plan creation response headers:", Object.fromEntries(planResponse.headers.entries()));
    
    if (!planResponse.ok) {
      const errorText = await planResponse.text();
      console.log("❌ Plan creation failed:", errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log("❌ Error details:", errorJson);
      } catch (e) {
        console.log("❌ Raw error text:", errorText);
      }
    } else {
      const planResult = await planResponse.json();
      console.log("✅ Plan created successfully:", planResult);
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error);
  }
}

// Run the test
testPlanCreation();
