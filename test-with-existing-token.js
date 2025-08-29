// Test plan creation with existing token
const API_BASE = "http://localhost:5005/api";

async function testWithExistingToken() {
  console.log("🧪 Testing plan creation with existing token...");
  
  // First, let's create a user and get a token
  console.log("\n1️⃣ Creating a test user...");
  
  try {
    const registerData = {
      email: "plantest@example.com",
      username: "plantest",
      password: "password123",
      displayName: "Plan Test User",
      phoneNumber: "+1234567890"
    };
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData)
    });
    
    if (!registerResponse.ok) {
      console.log("Registration failed, trying login...");
      
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "plantest@example.com",
          password: "password123"
        })
      });
      
      if (!loginResponse.ok) {
        console.log("❌ Both registration and login failed");
        return;
      }
      
      const loginResult = await loginResponse.json();
      var accessToken = loginResult.accessToken;
    } else {
      const registerResult = await registerResponse.json();
      var accessToken = registerResult.accessToken;
    }
    
    console.log("✅ Got access token");
    console.log("Token:", accessToken);
    
    // Now test plan creation
    console.log("\n2️⃣ Testing plan creation...");
    
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
    
    const responseText = await planResponse.text();
    console.log("Response body:", responseText);
    
    if (planResponse.ok) {
      try {
        const planResult = JSON.parse(responseText);
        console.log("✅ Plan created successfully!");
        console.log("Plan details:", planResult);
      } catch (e) {
        console.log("✅ Plan created but response is not JSON");
      }
    } else {
      console.log("❌ Plan creation failed");
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testWithExistingToken();
