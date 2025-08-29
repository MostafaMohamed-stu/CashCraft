// Test API directly with Node.js
const https = require('https');
const http = require('http');

console.log('🧪 Testing API directly...');

// Test 1: Health check
console.log('1️⃣ Testing health endpoint...');
const healthReq = http.request('http://localhost:5005/health', (res) => {
  console.log(`📊 Health status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Health response:', data);
    
    // Test 2: Register new user
    console.log('2️⃣ Registering new user...');
    const registerData = JSON.stringify({
      email: 'terminaluser@test.com',
      username: 'terminaluser',
      password: 'password123',
      displayName: 'Terminal User',
      phoneNumber: '+1234567890'
    });
    
    const registerReq = http.request({
      hostname: 'localhost',
      port: 5005,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(registerData)
      }
    }, (res) => {
      console.log(`📊 Registration status: ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Registration response:', response);
          
          if (response.accessToken) {
            // Test 3: Create plan
            console.log('3️⃣ Creating budget plan...');
            const planData = JSON.stringify({
              name: "Terminal Test Plan",
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
            });
            
            const planReq = http.request({
              hostname: 'localhost',
              port: 5005,
              path: '/api/budgets/plans',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${response.accessToken}`,
                'Content-Length': Buffer.byteLength(planData)
              }
            }, (res) => {
              console.log(`📊 Plan creation status: ${res.statusCode}`);
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => {
                try {
                  const planResponse = JSON.parse(data);
                  console.log('✅ Plan created successfully:', planResponse);
                  console.log('🎉 SUCCESS! Everything worked!');
                } catch (e) {
                  console.log('❌ Plan creation failed:', data);
                }
              });
            });
            
            planReq.on('error', (e) => {
              console.log('❌ Plan creation error:', e.message);
            });
            
            planReq.write(planData);
            planReq.end();
          }
        } catch (e) {
          console.log('❌ Registration failed:', data);
        }
      });
    });
    
    registerReq.on('error', (e) => {
      console.log('❌ Registration error:', e.message);
    });
    
    registerReq.write(registerData);
    registerReq.end();
  });
});

healthReq.on('error', (e) => {
  console.log('❌ Health check error:', e.message);
});

healthReq.end();
