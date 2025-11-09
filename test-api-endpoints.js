// Test script to verify the API endpoints work correctly
const http = require('http');
const fs = require('fs');

// Test function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testEndpoints() {
  const baseUrl = 'http://localhost:3001';

  console.log('🧪 Testing API Endpoints...\n');

  const tests = [
    {
      name: 'Dashboard Page (should redirect to login for unauthenticated)',
      url: `${baseUrl}/dashboard`,
      expectedStatus: 307, // Temporary redirect
    },
    {
      name: 'Dashboard with Success Params',
      url: `${baseUrl}/dashboard?success=true&session_id=test_123`,
      expectedStatus: 307,
    },
    {
      name: 'Payment Success Page',
      url: `${baseUrl}/payment/success?session_id=cs_test_123`,
      expectedStatus: 200,
    },
    {
      name: 'Home Page',
      url: `${baseUrl}/`,
      expectedStatus: 200,
    },
  ];

  for (const test of tests) {
    try {
      console.log(`📍 Testing: ${test.name}`);
      const response = await makeRequest(test.url);

      const statusMatch = response.statusCode === test.expectedStatus;
      const icon = statusMatch ? '✅' : '❌';

      console.log(`   ${icon} Status: ${response.statusCode} (expected: ${test.expectedStatus})`);

      if (!statusMatch) {
        console.log(`   📄 Response body: ${response.body.substring(0, 200)}...`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Testing complete!');
  console.log('\n📋 Manual Testing Checklist:');
  console.log('1. Open test-checkout-flow.html in your browser');
  console.log('2. Test each scenario listed in the HTML file');
  console.log('3. Check browser console for errors');
  console.log('4. Verify sessionStorage behavior');
  console.log('5. Test complete checkout flow in the actual app');
}

// Run the tests
testEndpoints().catch(console.error);