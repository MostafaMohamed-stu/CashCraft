// Simple test to debug the issue
const API_BASE = "http://localhost:5005/api";

async function testSimple() {
  console.log("🧪 Simple test...");
  
  try {
    // Test 1: Health check
    console.log("\n1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE}/budgets/health`);
    console.log("Health status:", healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("Health data:", healthData);
    }
    
    // Test 2: Try to register
    console.log("\n2️⃣ Testing registration...");
    const registerData = {
      email: "simple@example.com",
      username: "simple",
      password: "password123",
      displayName: "Simple User",
      phoneNumber: "+1234567890"
    };
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData)
    });
    
    console.log("Register status:", registerResponse.status);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log("✅ Registration successful:", registerResult);
      
      // Test 3: Create plan
      console.log("\n3️⃣ Testing plan creation...");
      const planData = {
        name: "Simple Test Plan",
        type: "monthly",
        currency: "EGP"
      };
      
      const planResponse = await fetch(`${API_BASE}/budgets/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${registerResult.accessToken}`
        },
        body: JSON.stringify(planData)
      });
      
      console.log("Plan creation status:", planResponse.status);
      
      if (planResponse.ok) {
        const planResult = await planResponse.json();
        console.log("✅ Plan created successfully:", planResult);
      } else {
        const errorText = await planResponse.text();
        console.log("❌ Plan creation failed:", errorText);
      }
    } else {
      const errorText = await registerResponse.text();
      console.log("❌ Registration failed:", errorText);
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testSimple();
