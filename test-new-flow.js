// Test the new two-step plan creation flow
const API_BASE = "http://localhost:5005/api";

async function testNewFlow() {
  console.log("🧪 Testing new two-step plan creation flow...");
  
  try {
    // Step 1: Register a user
    console.log("\n1️⃣ Registering user...");
    const registerData = {
      email: "newflow@example.com",
      username: "newflow",
      password: "password123",
      displayName: "New Flow User",
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
          email: "newflow@example.com",
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
    
    // Step 2: Create the plan (basic info only)
    console.log("\n2️⃣ Creating plan with basic info...");
    const planData = {
      name: "New Flow Test Plan",
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
    
    // Step 3: Add categories to the plan (simulating the "Add Details" modal)
    console.log("\n3️⃣ Adding categories to plan...");
    const categories = [
      {
        name: "Food & Dining",
        budgetedAmount: 800,
        colorHex: "#ef4444"
      },
      {
        name: "Transportation",
        budgetedAmount: 300,
        colorHex: "#3b82f6"
      },
      {
        name: "Entertainment",
        budgetedAmount: 200,
        colorHex: "#f59e0b"
      },
      {
        name: "Utilities",
        budgetedAmount: 150,
        colorHex: "#10b981"
      }
    ];
    
    console.log("Adding categories:", categories);
    
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
      console.log("🎉 NEW FLOW SUCCESSFUL!");
      console.log("📊 Plan Summary:");
      console.log(`   - Name: ${completePlan.name}`);
      console.log(`   - Type: ${completePlan.type}`);
      console.log(`   - Currency: ${completePlan.currency}`);
      console.log(`   - Categories: ${completePlan.categories.length}`);
      console.log(`   - Total Budget: ${completePlan.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)}`);
    } else {
      const errorText = await verifyResponse.text();
      console.log("❌ Failed to verify plan:", errorText);
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testNewFlow();
