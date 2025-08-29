// Test the fixed API
console.log("🧪 Testing the fixed API...");

// Get current token
const token = localStorage.getItem('cashcraft_accessToken');
console.log("🔑 Token exists:", !!token);

if (!token) {
  console.log("❌ No token found. Please log in first.");
  alert("Please log in first, then run this test again.");
} else {
  // Test plan creation
  fetch('http://localhost:5005/api/budgets/plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Test Plan - Fixed",
      type: "monthly",
      currency: "EGP",
      createdAt: new Date().toISOString(),
      categories: [
        {
          name: "Food",
          budgetedAmount: 1000,
          ColorHex: "#ef4444"
        }
      ]
    })
  })
  .then(response => {
    console.log("📊 Response status:", response.status);
    
    if (response.ok) {
      return response.json();
    } else {
      // This should now work without the "body stream already read" error
      return response.json().then(errorData => {
        throw new Error(errorData.message || `HTTP ${response.status}`);
      });
    }
  })
  .then(data => {
    console.log("✅ Plan created successfully:", data);
    alert("✅ Plan created successfully! The fix worked!");
  })
  .catch(error => {
    console.log("❌ Error:", error.message);
    alert(`❌ Error: ${error.message}\n\nThis should show a proper error message now.`);
  });
}
