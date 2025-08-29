// Test script to verify plan creation fix
const API_BASE = "http://localhost:5005/api";

async function testPlanCreationFix() {
  console.log("🧪 Testing plan creation fix...");
  
  try {
    // First, let's try to login to get a token
    console.log("🔐 Attempting login...");
    
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test2@example.com",
        password: "password123"
      })
    });
    
    if (!loginResponse.ok) {
      console.log("❌ Login failed, trying registration...");
      
      const registerResponse = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test2@example.com",
          username: "testuser2",
          password: "password123",
          displayName: "Test User 2",
          phoneNumber: "+1234567890"
        })
      });
      
      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        console.log("❌ Registration failed:", errorText);
        return;
      }
      
      const registerResult = await registerResponse.json();
      console.log("✅ Registration successful");
      var accessToken = registerResult.accessToken;
    } else {
      const loginResult = await loginResponse.json();
      console.log("✅ Login successful");
      var accessToken = loginResult.accessToken;
    }
    
    // Now test plan creation with the fixed data structure
    const planData = {
      name: "Test Budget Plan - Fixed",
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
    
    console.log("📝 Testing plan creation with fixed data:");
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
      console.log("🎉 FIX VERIFIED! Plan creation is working!");
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error);
  }
}

// Run the test
testPlanCreationFix();
