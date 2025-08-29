// Detailed debug script for plan creation
const API_BASE = "http://localhost:5005/api";

async function debugPlanCreation() {
  console.log("🔍 Detailed debugging of plan creation...");
  
  try {
    // Step 1: Register a new user
    console.log("\n1️⃣ Registering new user...");
    const registerData = {
      email: "debug@example.com",
      username: "debuguser",
      password: "password123",
      displayName: "Debug User",
      phoneNumber: "+1234567890"
    };
    
    console.log("Registration data:", JSON.stringify(registerData, null, 2));
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData)
    });
    
    console.log("Registration status:", registerResponse.status);
    console.log("Registration headers:", Object.fromEntries(registerResponse.headers.entries()));
    
    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      console.log("❌ Registration failed:", errorText);
      return;
    }
    
    const registerResult = await registerResponse.json();
    console.log("✅ Registration successful:", registerResult);
    
    const accessToken = registerResult.accessToken;
    console.log("Access token (first 50 chars):", accessToken.substring(0, 50) + "...");
    
    // Step 2: Test plan creation with detailed logging
    console.log("\n2️⃣ Testing plan creation...");
    
    const planData = {
      name: "Debug Budget Plan",
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
    
    console.log("Plan data being sent:");
    console.log(JSON.stringify(planData, null, 2));
    
    const planResponse = await fetch(`${API_BASE}/budgets/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(planData)
    });
    
    console.log("\nPlan creation response:");
    console.log("Status:", planResponse.status);
    console.log("Status text:", planResponse.statusText);
    console.log("Headers:", Object.fromEntries(planResponse.headers.entries()));
    
    const responseText = await planResponse.text();
    console.log("Response body:", responseText);
    
    if (planResponse.ok) {
      try {
        const planResult = JSON.parse(responseText);
        console.log("✅ Plan created successfully:", planResult);
      } catch (e) {
        console.log("✅ Plan created but response is not JSON:", responseText);
      }
    } else {
      console.log("❌ Plan creation failed");
      try {
        const errorJson = JSON.parse(responseText);
        console.log("Error details:", errorJson);
      } catch (e) {
        console.log("Raw error:", responseText);
      }
    }
    
  } catch (error) {
    console.log("❌ Debug failed:", error);
    console.log("Error stack:", error.stack);
  }
}

// Run the debug
debugPlanCreation();
