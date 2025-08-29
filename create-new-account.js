// Create new account and budget plan
console.log("🔧 Creating new account and budget plan...");

// Step 1: Clear old tokens
console.log("🧹 Clearing old tokens...");
localStorage.removeItem('cashcraft_accessToken');
localStorage.removeItem('cashcraft_refreshToken');
localStorage.removeItem('cashcraft_user');
console.log("✅ Tokens cleared");

// Step 2: Register new user
console.log("📝 Registering new user...");
const newUser = {
  email: 'newuser@example.com',
  username: 'newuser',
  password: 'password123',
  displayName: 'New User',
  phoneNumber: '+1234567890'
};

fetch('http://localhost:5005/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newUser)
})
.then(response => {
  console.log("📊 Registration response status:", response.status);
  return response.json();
})
.then(data => {
  console.log("✅ Registration successful:", data);
  
  // Save tokens
  localStorage.setItem('cashcraft_accessToken', data.accessToken);
  localStorage.setItem('cashcraft_refreshToken', data.refreshToken);
  console.log("🔐 Tokens saved to localStorage");
  
  // Step 3: Create budget plan for new user
  console.log("📝 Creating budget plan for new user...");
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
        },
        {
          name: "Housing",
          budgetedAmount: 2000,
          ColorHex: "#10b981"
        },
        {
          name: "Entertainment",
          budgetedAmount: 300,
          ColorHex: "#f59e0b"
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
  alert("🎉 SUCCESS! New account created and plan added!\n\n" +
        "Email: newuser@example.com\n" +
        "Password: password123\n" +
        "Plan ID: " + data.id + "\n" +
        "Plan Name: " + data.name);
  
  // Step 4: Refresh the page to show the new plan
  console.log("🔄 Refreshing page to show new plan...");
  setTimeout(() => {
    window.location.reload();
  }, 2000);
})
.catch(error => {
  console.error("❌ Error:", error);
  
  // If registration fails (user might already exist), try login
  if (error.message.includes("409") || error.message.includes("already")) {
    console.log("🔄 User might already exist, trying login...");
    
    fetch('http://localhost:5005/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("✅ Login successful:", data);
      localStorage.setItem('cashcraft_accessToken', data.accessToken);
      localStorage.setItem('cashcraft_refreshToken', data.refreshToken);
      
      // Try creating plan again
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
    .then(response => response.json())
    .then(data => {
      console.log("✅ Plan created successfully:", data);
      alert("🎉 SUCCESS! Plan created for existing user!\n\nPlan ID: " + data.id);
      setTimeout(() => window.location.reload(), 2000);
    })
    .catch(loginError => {
      console.error("❌ Login also failed:", loginError);
      alert("❌ Error: " + loginError.message);
    });
  } else {
    alert("❌ Error: " + error.message);
  }
});

console.log("🚀 Script running... Check the console for progress!");
