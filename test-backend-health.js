d// Test backend health and basic functionality
const API_BASE = "http://localhost:5005";

async function testBackendHealth() {
  console.log("🏥 Testing backend health...");
  
  try {
    // Test 1: Health endpoint
    console.log("\n1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE}/health`);
    console.log("Health status:", healthResponse.status);
    const healthText = await healthResponse.text();
    console.log("Health response:", healthText);
    
    // Test 2: Swagger endpoint
    console.log("\n2️⃣ Testing Swagger endpoint...");
    const swaggerResponse = await fetch(`${API_BASE}/swagger`);
    console.log("Swagger status:", swaggerResponse.status);
    
    // Test 3: Register a user
    console.log("\n3️⃣ Testing user registration...");
    const registerData = {
      email: "health@example.com",
      username: "healthuser",
      password: "password123",
      displayName: "Health User",
      phoneNumber: "+1234567890"
    };
    
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData)
    });
    
    console.log("Registration status:", registerResponse.status);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log("✅ Registration successful");
      console.log("Access token length:", registerResult.accessToken?.length || 0);
      
      // Test 4: Decode the JWT token
      console.log("\n4️⃣ Decoding JWT token...");
      const tokenParts = registerResult.accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log("JWT payload:", payload);
        
        // Test 5: Try to use the token
        console.log("\n5️⃣ Testing token usage...");
        const testResponse = await fetch(`${API_BASE}/api/budgets/plans`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${registerResult.accessToken}`
          }
        });
        
        console.log("Plans endpoint status:", testResponse.status);
        if (testResponse.ok) {
          const plans = await testResponse.json();
          console.log("✅ Token works! Found", plans.length, "plans");
        } else {
          const errorText = await testResponse.text();
          console.log("❌ Token failed:", errorText);
        }
      }
    } else {
      const errorText = await registerResponse.text();
      console.log("❌ Registration failed:", errorText);
    }
    
  } catch (error) {
    console.log("❌ Health test failed:", error.message);
  }
}

testBackendHealth();
