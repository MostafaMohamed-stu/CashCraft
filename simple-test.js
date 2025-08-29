// Simple test to check if backend is working
const http = require('http');

console.log('🔍 Testing if backend is running...');

// Test 1: Basic health check
const req = http.request({
  hostname: 'localhost',
  port: 5005,
  path: '/health',
  method: 'GET'
}, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Response:', data);
  });
});

req.on('error', (e) => {
  console.log('❌ Error:', e.message);
  console.log('💡 The backend might not be running on port 5005');
});

req.end();
