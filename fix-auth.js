// Fix authentication and test plan creation
console.log("🔧 Fixing authentication and testing plan creation...");

// Step 1: Clear old tokens
console.log("🧹 Clearing old tokens...");
localStorage.removeItem('cashcraft_accessToken');
localStorage.removeItem('cashcraft_refreshToken');
localStorage.removeItem('cashcraft_user');
console.log("✅ Tokens cleared");

// Step 2: Login with test account
console.log("🔐 Logging in with test account...");
fetch('http://localhost:5005/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'testbudget@test.com',
    password: 'password123'
  })
})
.then(response => {
  console.log("📊 Login response status:", response.status);
  return response.json();
})
.then(data => {
  console.log("✅ Login successful:", data);
  
  // Save tokens
  localStorage.setItem('cashcraft_accessToken', data.accessToken);
  localStorage.setItem('cashcraft_refreshToken', data.refreshToken);
  console.log("🔐 Tokens saved to localStorage");
  
  // Step 3: Test plan creation
  console.log("📝 Testing plan creation...");
  return fetch('http://localhost:5005/api/budgets/plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.accessToken}`
    },
    body: JSON.stringify({
      name: "My First Budget Plan",
      type: "monthly",
      currency: "EGP",
      createdAt: new Date().toISOString(),
      categories: [
        {
          name: "Food",
          budgetedAmount: 1000,
          ColorHex: "#ef4444"
        },
        {
          name: "Transport",
          budgetedAmount: 500,
          ColorHex: "#3b82f6"
        }
      ]
    })
  });
})
.then(response => {
  console.log("📊 Plan creation response status:", response.status);
  return response.json();
})
.then(data => {
  console.log("✅ Plan created successfully:", data);
  alert("🎉 SUCCESS! Plan created successfully!\n\nPlan ID: " + data.id + "\nName: " + data.name);
  
  // Step 4: Refresh the page to show the new plan
  console.log("🔄 Refreshing page to show new plan...");
  setTimeout(() => {
    window.location.reload();
  }, 2000);
})
.catch(error => {
  console.error("❌ Error:", error);
  alert("❌ Error: " + error.message + "\n\nCheck the console for details.");
});

console.log("🚀 Script running... Check the console for progress!");
