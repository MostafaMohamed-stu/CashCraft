// Simple authentication test
const API_BASE = "http://localhost:5005/api";

async function testAuth() {
  console.log("🧪 Testing authentication...");
  
  try {
    // Step 1: Test health endpoint
    console.log("\n1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE}/budgets/health`);
    console.log("Health status:", healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("Health data:", healthData);
    }
    
    // Step 2: Try to register a new user
    console.log("\n2️⃣ Testing registration...");
    const registerData = {
      email: "auth@example.com",
      username: "authuser",
      password: "password123",
      displayName: "Auth Test User",
      phoneNumber: "+1234567890"
    };
    
    console.log("Registering with data:", registerData);
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData)
    });
    
    console.log("Register status:", registerResponse.status);
    console.log("Register headers:", Object.fromEntries(registerResponse.headers.entries()));
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log("✅ Registration successful");
      console.log("Response:", registerResult);
      console.log("Token length:", registerResult.accessToken?.length || 0);
      console.log("Token starts with:", registerResult.accessToken?.substring(0, 20) + "...");
      
      // Step 3: Test the token
      console.log("\n3️⃣ Testing token...");
      const testResponse = await fetch(`${API_BASE}/budgets/plans`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${registerResult.accessToken}`
        }
      });
      
      console.log("Test status:", testResponse.status);
      
      if (testResponse.ok) {
        console.log("✅ Token works!");
      } else {
        const errorText = await testResponse.text();
        console.log("❌ Token failed:", errorText);
      }
      
    } else {
      const errorText = await registerResponse.text();
      console.log("❌ Registration failed:", errorText);
      
      // Try login instead
      console.log("\n🔄 Trying login instead...");
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "auth@example.com",
          password: "password123"
        })
      });
      
      console.log("Login status:", loginResponse.status);
      
      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log("✅ Login successful");
        console.log("Response:", loginResult);
      } else {
        const loginErrorText = await loginResponse.text();
        console.log("❌ Login failed:", loginErrorText);
      }
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    console.log("Error details:", error);
  }
}

testAuth();
