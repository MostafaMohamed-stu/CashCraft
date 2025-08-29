// Test to verify JWT token fix
const API_BASE = "http://localhost:5005/api";

async function testJwtFix() {
  console.log("🧪 Testing JWT token fix...");
  
  try {
    // Step 1: Register a user
    console.log("\n1️⃣ Registering user...");
    const registerData = {
      email: "jwttest@example.com",
      username: "jwttest",
      password: "password123",
      displayName: "JWT Test User",
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
    
    let accessToken;
    
    if (!registerResponse.ok) {
      console.log("Registration failed, trying login...");
      
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "jwttest@example.com",
          password: "password123"
        })
      });
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.log("❌ Login failed:", errorText);
        return;
      }
      
      const loginResult = await loginResponse.json();
      accessToken = loginResult.accessToken;
      console.log("✅ Login successful");
    } else {
      const registerResult = await registerResponse.json();
      accessToken = registerResult.accessToken;
      console.log("✅ Registration successful");
    }
    
    console.log("Token length:", accessToken?.length || 0);
    console.log("Token starts with:", accessToken?.substring(0, 20) + "...");
    
    // Step 2: Test the token by creating a plan
    console.log("\n2️⃣ Testing token with plan creation...");
    const planData = {
      name: "JWT Test Plan",
      type: "monthly",
      currency: "EGP"
    };
    
    const planResponse = await fetch(`${API_BASE}/budgets/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(planData)
    });
    
    console.log("Plan creation status:", planResponse.status);
    
    if (planResponse.ok) {
      const planResult = await planResponse.json();
      console.log("✅ Plan created successfully:", planResult);
      console.log("🎉 JWT FIX SUCCESSFUL!");
    } else {
      const errorText = await planResponse.text();
      console.log("❌ Plan creation failed:", errorText);
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testJwtFix();
