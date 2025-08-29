// Test two-step plan creation process
const API_BASE = "http://localhost:5005/api";

async function testTwoStepPlanCreation() {
  console.log("🧪 Testing two-step plan creation...");
  
  try {
    // Step 1: Register a user
    console.log("\n1️⃣ Registering user...");
    const registerData = {
      email: "twostep@example.com",
      username: "twostep",
      password: "password123",
      displayName: "Two Step User",
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
          email: "twostep@example.com",
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
    
    // Step 2: Create the plan (without categories)
    console.log("\n2️⃣ Creating plan...");
    const planData = {
      name: "Two-Step Test Plan",
      type: "monthly",
      currency: "EGP",
      createdAt: new Date().toISOString()
    };
    
    console.log("Plan data:", JSON.stringify(planData, null, 2));
    
    const planResponse = await fetch(`${API_BASE}/budgets/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(planData)
    });
    
    console.log("Plan creation status:", planResponse.status);
    
    if (!planResponse.ok) {
      const errorText = await planResponse.text();
      console.log("❌ Plan creation failed:", errorText);
      return;
    }
    
    const planResult = await planResponse.json();
    console.log("✅ Plan created successfully:", planResult);
    
    const planId = planResult.id;
    
    // Step 3: Add categories to the plan
    console.log("\n3️⃣ Adding categories to plan...");
    const categories = [
      {
        name: "Food",
        budgetedAmount: 500,
        colorHex: "#3b82f6"
      },
      {
        name: "Transport",
        budgetedAmount: 200,
        colorHex: "#10b981"
      },
      {
        name: "Entertainment",
        budgetedAmount: 100,
        colorHex: "#f59e0b"
      }
    ];
    
    for (const category of categories) {
      console.log(`Adding category: ${category.name}`);
      
      const categoryResponse = await fetch(`${API_BASE}/budgets/plans/${planId}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(category)
      });
      
      console.log(`Category "${category.name}" status:`, categoryResponse.status);
      
      if (categoryResponse.ok) {
        const categoryResult = await categoryResponse.json();
        console.log(`✅ Category "${category.name}" added successfully:`, categoryResult);
      } else {
        const errorText = await categoryResponse.text();
        console.log(`❌ Failed to add category "${category.name}":`, errorText);
      }
    }
    
    // Step 4: Verify the complete plan
    console.log("\n4️⃣ Verifying complete plan...");
    const verifyResponse = await fetch(`${API_BASE}/budgets/plans/${planId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (verifyResponse.ok) {
      const completePlan = await verifyResponse.json();
      console.log("✅ Complete plan retrieved:", completePlan);
      console.log("🎉 TWO-STEP PLAN CREATION SUCCESSFUL!");
    } else {
      const errorText = await verifyResponse.text();
      console.log("❌ Failed to verify plan:", errorText);
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testTwoStepPlanCreation();
