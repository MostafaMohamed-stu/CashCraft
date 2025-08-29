// Debug JWT token issue
const API_BASE = "http://localhost:5005/api";

async function debugJWT() {
  console.log("🔍 Debugging JWT token issue...");
  
  try {
    // Register a user and examine the token
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
    
    console.log("Registration status:", registerResponse.status);
    
    if (registerResponse.ok) {
      const result = await registerResponse.json();
      console.log("✅ Registration successful");
      console.log("Access token:", result.accessToken);
      console.log("Token length:", result.accessToken.length);
      
      // Check if it's a valid JWT
      if (result.accessToken.includes('.')) {
        console.log("✅ Token appears to be JWT format");
        const parts = result.accessToken.split('.');
        console.log("JWT parts:", parts.length);
        
        if (parts.length === 3) {
          try {
            const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            console.log("JWT Header:", header);
            console.log("JWT Payload:", payload);
            
            // Test the token
            console.log("\n2️⃣ Testing token with plans endpoint...");
            const plansResponse = await fetch(`${API_BASE}/budgets/plans`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${result.accessToken}`
              }
            });
            
            console.log("Plans endpoint status:", plansResponse.status);
            if (plansResponse.ok) {
              const plans = await plansResponse.json();
              console.log("✅ Token works! Found", plans.length, "plans");
            } else {
              const errorText = await plansResponse.text();
              console.log("❌ Token failed:", errorText);
            }
            
          } catch (e) {
            console.log("❌ Failed to decode JWT:", e.message);
          }
        } else {
          console.log("❌ Token doesn't have 3 parts");
        }
      } else {
        console.log("❌ Token doesn't appear to be JWT format");
        console.log("This suggests JWT generation failed and fallback token was used");
      }
    } else {
      const errorText = await registerResponse.text();
      console.log("❌ Registration failed:", errorText);
    }
    
  } catch (error) {
    console.log("❌ Debug failed:", error.message);
  }
}

debugJWT();
