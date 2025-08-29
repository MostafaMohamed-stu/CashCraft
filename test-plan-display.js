// Test plan creation and display
const API_BASE = "http://localhost:5005/api";

async function testPlanDisplay() {
  console.log("🧪 Testing plan creation and display...");
  
  try {
    // Step 1: Login
    console.log("\n1️⃣ Logging in...");
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
    
    if (!loginResponse.ok) {
      console.log("❌ Login failed");
      return;
    }
    
    const loginResult = await loginResponse.json();
    const accessToken = loginResult.accessToken;
    console.log("✅ Login successful");
    
    // Step 2: Create a plan
    console.log("\n2️⃣ Creating plan...");
    const planData = {
      name: "Display Test Plan",
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
    
    if (!planResponse.ok) {
      console.log("❌ Plan creation failed");
      return;
    }
    
    const planResult = await planResponse.json();
    const planId = planResult.id;
    console.log("✅ Plan created:", planResult);
    
    // Step 3: Add categories
    console.log("\n3️⃣ Adding categories...");
    const categories = [
      { name: "Food", budgetedAmount: 500, colorHex: "#ef4444" },
      { name: "Transport", budgetedAmount: 200, colorHex: "#3b82f6" },
      { name: "Entertainment", budgetedAmount: 100, colorHex: "#f59e0b" }
    ];
    
    for (const category of categories) {
      const categoryResponse = await fetch(`${API_BASE}/budgets/plans/${planId}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(category)
      });
      
      if (categoryResponse.ok) {
        console.log(`✅ Category "${category.name}" added`);
      } else {
        console.log(`❌ Failed to add category "${category.name}"`);
      }
    }
    
    // Step 4: Get the complete plan
    console.log("\n4️⃣ Getting complete plan...");
    const getPlanResponse = await fetch(`${API_BASE}/budgets/plans/${planId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (getPlanResponse.ok) {
      const completePlan = await getPlanResponse.json();
      console.log("✅ Complete plan retrieved:");
      console.log("  - Name:", completePlan.name);
      console.log("  - Type:", completePlan.type);
      console.log("  - Currency:", completePlan.currency);
      console.log("  - Categories:", completePlan.categories.length);
      console.log("  - Total Budget:", completePlan.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0));
      
      console.log("\n📋 Categories:");
      completePlan.categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name}: ${cat.budgetedAmount} (${cat.colorHex})`);
      });
      
      console.log("\n🎉 PLAN DISPLAY TEST SUCCESSFUL!");
    } else {
      console.log("❌ Failed to get complete plan");
    }
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testPlanDisplay();
