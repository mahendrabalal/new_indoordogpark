
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testNewsletter() {
    console.log('🚀 Starting Newsletter API Verification...');

    const timestamp = Date.now();
    const consumerEmail = `test-consumer-${timestamp}@example.com`;
    const ownerEmail = `test-owner-${timestamp}@example.com`;

    // Test 1: Subscribe as Consumer
    console.log('\n1️⃣  Testing Consumer Subscription...');
    try {
        const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: consumerEmail,
                type: 'consumer',
                source: 'verification-script'
            })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            console.log('✅ Consumer subscription successful');
        } else {
            console.error('❌ Consumer subscription failed:', data);
        }
    } catch (e) {
        console.error('❌ Consumer request error:', e);
    }

    // Test 2: Subscribe as Owner
    console.log('\n2️⃣  Testing Owner Subscription...');
    try {
        const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: ownerEmail,
                type: 'owner',
                source: 'verification-script',
                parkName: 'Test Park',
                location: 'Test City, CA'
            })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            console.log('✅ Owner subscription successful');
        } else {
            console.error('❌ Owner subscription failed:', data);
        }
    } catch (e) {
        console.error('❌ Owner request error:', e);
    }

    // Test 3: Invalid Email
    console.log('\n3️⃣  Testing Invalid Email...');
    try {
        const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'invalid-email',
                type: 'consumer'
            })
        });
        const data = await res.json();
        if (!res.ok && data.error === 'Invalid email format') {
            console.log('✅ Invalid email correctly rejected');
        } else {
            console.error('❌ Invalid email check failed:', data);
        }
    } catch (e) {
        console.error('❌ Invalid email request error:', e);
    }

    // Test 4: Duplicate Check
    console.log('\n4️⃣  Testing Duplicate Subscription...');
    try {
        const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: consumerEmail,
                type: 'consumer',
                source: 'verification-script'
            })
        });
        const data = await res.json();
        if (res.ok && data.message.includes('Already subscribed')) {
            console.log('✅ Duplicate subscription correctly handled');
        } else {
            console.error('❌ Duplicate check failed or unexpected message:', data);
        }
    } catch (e) {
        console.error('❌ Duplicate request error:', e);
    }
}

testNewsletter();
