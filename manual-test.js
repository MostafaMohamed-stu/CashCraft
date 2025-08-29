// Manual test to debug the exact issue
console.log("🔍 Manual debugging test...");

// Test 1: Check if backend is running
console.log("1️⃣ Testing backend connection...");
fetch('http://localhost:5005/health')
.then(r => r.text())
.then(data => {
  console.log("✅ Backend is running:", data);
  
  // Test 2: Try to register a completely new user
  console.log("2️⃣ Registering new user...");
  return fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'debuguser@test.com',
      username: 'debuguser',
      password: 'password123',
      displayName: 'Debug User',
      phoneNumber: '+1234567890'
    })
  });
})
.then(r => {
  console.log("📊 Registration response:", r.status, r.statusText);
  return r.json();
})
.then(data => {
  console.log("✅ Registration data:", data);
  
  // Test 3: Try to create a plan with the new token
  console.log("3️⃣ Creating plan with new token...");
  return fetch('http://localhost:5005/api/budgets/plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.accessToken}`
    },
    body: JSON.stringify({
      name: "Debug Plan",
      type: "monthly",
      currency: "EGP",
      createdAt: new Date().toISOString(),
      categories: [
        {
          name: "Debug Category",
          budgetedAmount: 100,
          ColorHex: "#ff0000"
        }
      ]
    })
  });
})
.then(r => {
  console.log("📊 Plan creation response:", r.status, r.statusText);
  return r.json();
})
.then(data => {
  console.log("✅ Plan created successfully:", data);
  alert("🎉 SUCCESS! Plan created!\n\nPlan ID: " + data.id);
})
.catch(error => {
  console.error("❌ Error occurred:", error);
  alert("❌ Error: " + error.message);
});

console.log("🚀 Manual test started...");
